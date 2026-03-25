# THRESHOLD - Product Requirements Document

## Overview
**App Name:** THRESHOLD  
**Tagline:** For men who are done pretending  
**Type:** Full Stack Progressive Web App (PWA)  
**Purpose:** A private self-assessment and 30-day accountability app for high-achieving men aged 30-55 who drink too much and want to stop.

## User Personas
- **Primary:** High-achieving men (30-55) who drink regularly and want to stop
- **Secondary:** Partners who want to support their spouse's journey

## Core Requirements
- 15-question self-assessment
- Personalized risk profiles (warning/middle/moment)
- 30-day structured plan (4 weeks)
- Daily check-in system with streak tracking
- Private journaling with prompts
- Tiered access (Free/Pro/Complete)
- PWA for mobile-first experience

## What's Been Implemented (Jan 2026)

### Completed Features
- [x] Welcome/Landing page with dark brutalist design
- [x] Framing pages (3-step intro flow)
- [x] Full 15-question assessment flow
- [x] Results page with risk profiles and cost calculator
- [x] Registration and Login (mock Supabase auth)
- [x] Commitment flow (statement + "fighting for")
- [x] Dashboard with streak, check-in CTA, plan progress
- [x] Daily check-in (drink question, 4 score sliders, intention)
- [x] 30-Day Plan overview with 4 weeks
- [x] Week content pages with sections and actions
- [x] Progress page with streak stats (charts for Pro)
- [x] Journal page (Pro feature)
- [x] Upgrade page with tier selection
- [x] Coaching page (Complete feature)
- [x] Settings page with sign out
- [x] Bottom navigation
- [x] PWA manifest and icons
- [x] Supabase schema (schema.sql)
- [x] Vercel deployment config

### Tech Stack
- React 18 (Create React App)
- React Router v6
- Tailwind CSS
- Mock Supabase (localStorage-based)
- Mock Stripe payments
- Recharts for progress visualization
- Lucide React icons

### Design System
- Background: #1C1C1E
- Text: #F5F5F5 (primary), #8E8E93 (secondary)
- Accent: White (buttons, highlights)
- Sharp corners (no border-radius)
- Inter font
- No emojis, gradients, or shadows

## Prioritized Backlog

### P0 - Critical (Before Production)
- [ ] Connect real Supabase credentials
- [ ] Connect real Stripe for payments
- [ ] Email verification flow
- [ ] Password reset functionality

### P1 - High Priority
- [ ] Offline support (service worker caching)
- [ ] Push notifications for check-in reminders
- [ ] Partner access feature
- [ ] SMS reminders (Twilio)

### P2 - Medium Priority
- [ ] Social login (Google OAuth)
- [ ] Export data functionality
- [ ] 90-day extended programme
- [ ] WhatsApp integration for coaching
- [ ] Calendar integration for coaching sessions

## Next Tasks
1. Add real Supabase credentials and test auth
2. Set up Stripe products and price IDs
3. Deploy to Vercel
4. Test PWA installation on iOS/Android
5. Implement service worker for offline capability

## Files Structure
```
/app/frontend/
├── public/
│   ├── manifest.json
│   └── icons/
├── supabase/
│   └── schema.sql
├── src/
│   ├── lib/
│   │   ├── supabase.js (mock)
│   │   └── stripe.js (mock)
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   ├── useStreak.js
│   │   ├── useCheckin.js
│   │   └── usePlan.js
│   ├── data/
│   │   ├── questions.js
│   │   ├── planContent.js
│   │   └── journalPrompts.js
│   ├── utils/
│   │   ├── scoring.js
│   │   └── dates.js
│   ├── components/
│   │   ├── Layout.jsx
│   │   ├── BottomNav.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── ScoreSlider.jsx
│   │   ├── TierGate.jsx
│   │   ├── MilestoneCard.jsx
│   │   ├── InstallPrompt.jsx
│   │   └── LoadingScreen.jsx
│   └── pages/
│       ├── Welcome.jsx
│       ├── Framing.jsx
│       ├── Assessment.jsx
│       ├── Results.jsx
│       ├── Commitment.jsx
│       ├── Dashboard.jsx
│       ├── Checkin.jsx
│       ├── Plan.jsx
│       ├── Week.jsx
│       ├── Progress.jsx
│       ├── Journal.jsx
│       ├── Upgrade.jsx
│       ├── Coaching.jsx
│       ├── Login.jsx
│       ├── Register.jsx
│       └── Settings.jsx
├── vercel.json
└── .env.example
```

---
## Update: Push Notifications Added (Jan 2026)

### Feature: Daily Check-in Reminders
- **Service:** OneSignal (with mock mode fallback)
- **Trigger:** Shows prompt after first check-in or first streak day
- **Default Time:** 9:00 AM daily

### New Files
- `/app/frontend/src/lib/notifications.js` - OneSignal service wrapper
- `/app/frontend/src/context/NotificationContext.jsx` - React context for notifications
- `/app/frontend/src/components/NotificationPrompt.jsx` - UI component for notification settings

### Features
- [x] OneSignal integration (mock mode without credentials)
- [x] Browser native Notification API fallback
- [x] Permission request flow on Dashboard
- [x] Notification settings in Settings page
- [x] Test notification button
- [x] Enable/Disable toggle
- [x] "Blocked" state handling with instructions

### Environment Variable
```
REACT_APP_ONESIGNAL_APP_ID=your_onesignal_app_id
```

### Setup Instructions
1. Create account at https://onesignal.com/
2. Create new App (Web Push)
3. Copy App ID to `.env`
4. Done - notifications will work automatically
