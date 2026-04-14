# Evoluated Learning App Architecture

## Overview
This document outlines the scalable architecture for the Evoluated Yoga & Bodywork Learning App, utilizing Firebase for backend services and Stripe for monetization.

## Tech Stack
- **Frontend**: React (Vite) + Tailwind CSS + Framer Motion
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Storage**: Firebase Storage (for videos and assets)
- **Backend Logic**: Firebase Cloud Functions (Node.js)
- **AI**: Google Gemini API
- **Payments**: Stripe

## Folder Structure
```text
/
├── src/                # Frontend Application
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components (Home, Academy, Chat, Profile)
│   ├── services/       # Firebase, Stripe, Gemini client-side logic
│   ├── hooks/          # Custom React hooks
│   ├── store/          # State management (Zustand/Context)
│   └── types/          # TypeScript interfaces
├── functions/          # Firebase Cloud Functions (Backend)
│   ├── src/
│   │   ├── chat/       # AI Chatbot & Keyword flagging
│   │   ├── progress/   # Progress tracking & stats
│   │   ├── stripe/     # Stripe Webhooks & Subscription logic
│   │   └── notifications/ # Scheduled push notifications
│   └── index.ts        # Main functions entry point
├── firestore.rules     # Database security rules
├── storage.rules       # File storage security rules
└── docs/               # Documentation
```

## Data Model (Firestore)
See `docs/DATA_MODEL.md` for detailed schema.

## Security Concept
- **Authentication**: Mandatory for all features except landing pages.
- **Firestore Rules**: Granular access control based on user roles (`customer`, `coach`, `admin`).
- **Stripe**: Server-side verification of subscription status before granting access to premium content.
