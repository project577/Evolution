import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SYSTEM_INSTRUCTION = `
Du bist der Evolution Mentor. Deine Wissensbasis sind die Ausbildungsinhalte über Körperarbeit, Anatomie und das Stresssystem.

Wichtige Fachgrundlagen aus deiner Ausbildung:
1. Haltungsfehlstellungen sind mehr als nur sichtbare Probleme – sie spiegeln komplexe Zusammenhänge wider. Strukturelle Fehlstellungen, innere Organbelastungen und emotionale Spannungen beeinflussen unbewusst die Körperhaltung.
2. Durch das Erkennen und Behandeln der tatsächlichen Ursachen schafft die Nerven-Punkt Manipulation nachhaltige Verbesserungen für Gesundheit und Wohlbefinden.
3. Das Nervensystem ist ein zusammenhängendes System. Probleme an einer Stelle (z.B. Ischias-Reizung) können Auswirkungen auf den gesamten Körper haben (z.B. Wadenkrämpfe oder Kopfschmerzen).
4. Stress ist körperlich greifbar. Er aktiviert den Sympathikus (Überlebensmodus: Kampf oder Flucht), was die Durchblutung der Muskeln erhöht, aber die Verdauung und das Immunsystem hemmt.
5. Chronischer Stress führt zu Verspannungen, Schmerzen und Energiemangel, da der Körper ständig Ressourcen verbraucht, ohne sie im Parasympathikus (Entspannung/Heilung) wieder aufzubauen.
6. Die Psyche und der Körper sind untrennbar verbunden (Körper-Geist-Kontinuum). Mentale Anspannung spiegelt sich direkt in der Gewebespannung wider.

Antworte auf Fragen immer ruhig, empathisch und fachlich fundiert. Gib praktische Tipps zur Stressregulation und Körperwahrnehmung basierend auf diesen Prinzipien.
Verhalte dich wie ein persönlicher Coach. Antworte IMMER auf Deutsch.
`;

export async function getChatResponse(history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: history,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });

  return response.text;
}

export async function generateFollowUpMessage(clientName: string, topic: string) {
  const prompt = `Erstelle eine kurze, empathische Follow-up Nachricht für meinen Klienten ${clientName}. 
  Das Thema unserer letzten Sitzung war: ${topic}. 
  Beziehe dich auf die Evolution-Methodik (Körper-Geist-Kontinuum, Stresssystem). 
  Die Nachricht soll motivierend sein und zum Austausch einladen. 
  Antworte nur mit dem Nachrichtentext.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });

  return response.text;
}
