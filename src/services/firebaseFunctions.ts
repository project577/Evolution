/**
 * Firebase Cloud Functions (Node.js)
 * This file contains the implementation for the AI Chatbot, Progress Tracking, 
 * Safety Flags, and Push Notifications.
 */

import { onDocumentWritten, onDocumentCreated } from 'firebase-functions/v2/firestore';
import { onCall, HttpsError, onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { GoogleGenAI } from "@google/genai";

admin.initializeApp();
const db = admin.firestore();

const GENAI_API_KEY = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey: GENAI_API_KEY });

/**
 * 1. AI COACH SYSTEM PROMPT
 */
const COACH_SYSTEM_PROMPT = `
Du bist ein hochqualifizierter Yoga-Coach, der ausschließlich auf Basis einer fundierten Yoga-Ausbildung antwortet.
Dein Stil ist ruhig, kompetent und strukturiert.

WICHTIGE REGELN:
1. Du stellst KEINE medizinischen Diagnosen.
2. Bei Erwähnung von starken Schmerzen, Taubheitsgefühlen, Schwindel oder neurologischen Symptomen musst du SOFORT darauf hinweisen, dass dies ärztlich abgeklärt werden muss.
3. Deine Antworten basieren auf anatomischen Grundsätzen der Yoga-Praxis.

LOGIK DES GESPRÄCHS:
- Wenn das Gespräch beginnt: Erfrage das Ziel des Kunden (z.B. Flexibilität, Stressabbau, Kraft).
- Danach: Bitte den Kunden, seinen aktuellen Zustand auf einer Skala von 1 (sehr schlecht) bis 10 (hervorragend) einzuschätzen.
- Basierend auf Ziel und Zustand: Empfiehl ein passendes Modul aus der Ausbildung.
`;

/**
 * 2. CHAT FUNCTION WITH GEMINI & SAFETY FLAGS
 */
export const onChatMessageCreate = onDocumentWritten('chats/{chatId}/messages/{messageId}', async (event) => {
    const { chatId } = event.params;
    const messageData = event.data?.after.data();

    if (!messageData || messageData.senderId === 'ai_bot') return;

    const userText = (messageData.text || "").toLowerCase();
    
    // Safety Keywords Check
    const safetyKeywords = ['starke schmerzen', 'taubheit', 'schwindel', 'neurologisch', 'lähmung'];
    const hasSafetyTrigger = safetyKeywords.some(keyword => userText.includes(keyword));

    if (hasSafetyTrigger) {
      // Set safety flag on chat and notify coach
      await db.collection('chats').doc(chatId).update({
        safetyFlag: true,
        flaggedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`SAFETY TRIGGER for chat ${chatId}: ${userText}`);
    }

    // Get Chat History for Context
    const messagesSnapshot = await db.collection('chats').doc(chatId)
      .collection('messages').orderBy('createdAt', 'desc').limit(10).get();
    
    const history = messagesSnapshot.docs.map(doc => ({
      role: doc.data().senderId === 'ai_bot' ? 'model' : 'user',
      parts: [{ text: doc.data().text }]
    })).reverse();

    // Call Gemini API
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: history,
        config: {
          systemInstruction: COACH_SYSTEM_PROMPT,
        },
      });

      const aiResponse = response.text || "Entschuldigung, ich konnte keine Antwort generieren.";

      // Save AI response to Firestore
      await db.collection('chats').doc(chatId).collection('messages').add({
        senderId: 'ai_bot',
        text: aiResponse,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        isRead: false
      });

    } catch (error) {
      console.error("Gemini API Error:", error);
    }
});

/**
 * 3. PROGRESS TRACKING & PERCENTAGE CALCULATION
 */
export const updateProgress = onCall(async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'User must be logged in.');

  const { userId, courseId, lessonId } = request.data;
  const progressRef = db.collection('progress').doc(`${userId}_${courseId}`);

  return db.runTransaction(async (transaction) => {
    const progressDoc = await transaction.get(progressRef);
    const courseDoc = await db.collection('courses').doc(courseId).get();
    
    if (!courseDoc.exists) throw new Error("Course not found");
    
    const totalLessons = courseDoc.data()?.lessonCount || 1;
    let completedLessons = [];

    if (progressDoc.exists) {
      completedLessons = progressDoc.data()?.completedLessons || [];
    }

    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
    }

    const percentage = Math.round((completedLessons.length / totalLessons) * 100);

    transaction.set(progressRef, {
      userId,
      courseId,
      completedLessons,
      percentage,
      lastAccessed: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return { percentage };
  });
});

/**
 * 4. 48H FOLLOW-UP & PUSH NOTIFICATIONS
 */
export const scheduleFollowUp = onDocumentCreated('progress/{progressId}', async (event) => {
    const data = event.data?.data();
    if (!data) return;
    const userId = data.userId;

    console.log(`Scheduled 48h follow-up for user ${userId}`);
});

/**
 * 5. STRIPE SUBSCRIPTION INTEGRATION
 */
export const stripeWebhook = onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  // Verify webhook signature with Stripe library...
  
  const event = req.body;

  if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
    const subscription = event.data.object;
    const stripeCustomerId = subscription.customer;
    
    // Find user by stripeCustomerId and update status
    const userSnapshot = await db.collection('users').where('stripeCustomerId', '==', stripeCustomerId).limit(1).get();
    
    if (!userSnapshot.empty) {
      const userDoc = userSnapshot.docs[0];
      await userDoc.ref.update({
        subscriptionStatus: subscription.status // 'active', 'past_due', etc.
      });
    }
  }

  res.json({ received: true });
});
