# Firestore Data Model

## Collections

### 1. `users`
Stores profile information and roles.
```json
{
  "uid": "user_123",
  "email": "jane@example.com",
  "displayName": "Jane Doe",
  "role": "customer", // customer | coach | admin
  "assignedCoachId": "coach_456",
  "subscriptionStatus": "active", // active | trialing | past_due | canceled
  "stripeCustomerId": "cus_abc123",
  "createdAt": "2024-03-01T10:00:00Z"
}
```

### 2. `courses`
Stores course metadata.
```json
{
  "id": "course_yoga_basics",
  "title": "Yoga Grundlagen",
  "description": "Lerne die Basics deiner Yoga-Praxis.",
  "thumbnailUrl": "https://...",
  "isPremium": true,
  "lessonCount": 12
}
```

### 3. `lessons`
Sub-collection of `courses` or standalone collection.
```json
{
  "id": "lesson_1",
  "courseId": "course_yoga_basics",
  "title": "Die Atmung",
  "videoUrl": "https://...",
  "duration": 600,
  "order": 1
}
```

### 4. `progress`
Tracks user completion.
```json
{
  "id": "user_123_course_yoga_basics",
  "userId": "user_123",
  "courseId": "course_yoga_basics",
  "completedLessons": ["lesson_1", "lesson_2"],
  "percentage": 16.6,
  "lastAccessed": "2024-03-01T12:00:00Z"
}
```

### 5. `chats`
Groups messages between users or with AI.
```json
{
  "id": "chat_user_123_ai",
  "participants": ["user_123", "ai_bot"],
  "type": "ai", // ai | 1-on-1
  "lastMessage": "Wie fühlst du dich heute?",
  "updatedAt": "2024-03-01T12:05:00Z",
  "safetyFlag": false
}
```

### 6. `messages`
Sub-collection of `chats`.
```json
{
  "id": "msg_789",
  "senderId": "user_123",
  "text": "Ich habe starke Schmerzen im unteren Rücken.",
  "createdAt": "2024-03-01T12:05:00Z",
  "isRead": true,
  "metadata": {
    "sentiment": "negative",
    "safetyTrigger": true
  }
}
```
