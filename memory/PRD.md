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
- [x] Push notifications for check-in reminders (OneSignal - mocked)
- [x] Partner access feature (completed)
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

---
## Update: Reminder Time Customization (Jan 2026)

### Feature: Custom Reminder Time
Users can now choose when they receive their daily check-in reminder.

### Available Times
- 6:00 AM, 7:00 AM, 8:00 AM, 9:00 AM (default), 10:00 AM
- 12:00 PM
- 5:00 PM, 6:00 PM, 7:00 PM, 8:00 PM, 9:00 PM

### Where to Access
1. **Dashboard** - Click on "Daily Reminders" card when notifications are enabled
2. **Settings** - Notifications section shows time picker when enabled

### UI Components
- Time picker dropdown with clear time labels (AM/PM format)
- Current selection highlighted
- Smooth animation on dropdown open/close

### Storage
- `reminderTime` stored in `threshold_notification_prefs` localStorage
- Format: 24-hour string (e.g., "09:00", "20:00")

---
## Update: Drug Question, Dual Reminders & Logo (Jan 2026)

### New Features

**1. Drug Use Question Added**
- Question 16 of 16 (new section: "The Full Picture")
- Text: "Do you use any other substances alongside alcohol?"
- Options:
  - No, just alcohol
  - Cannabis occasionally
  - Cannabis regularly
  - Cocaine socially or occasionally
  - Cocaine more than occasionally
  - Prescription medications (not as prescribed)
  - Multiple substances
  - Prefer not to say
- Scoring: Adds risk points based on substance use

**2. Dual Reminder System**
- Morning Motivation: Default 7:00 AM
  - Message: "Today is another day to be the man you want to be. You've got this."
- Evening Check-in: Default 8:00 PM
  - Message: "How was your day? Take a moment to check in and reflect."
- Both can be independently toggled on/off
- Custom time selection for each

**3. Marcus Jones Coaching Logo**
- Added to Welcome page (header)
- Added to Settings page (footer)
- File: `/public/logo.png`

### Updated Files
- `/app/frontend/src/data/questions.js` - Added drug question
- `/app/frontend/src/utils/scoring.js` - Added drug use scoring
- `/app/frontend/src/lib/notifications.js` - Dual reminder support
- `/app/frontend/src/context/NotificationContext.jsx` - Updated settings
- `/app/frontend/src/components/NotificationPrompt.jsx` - Dual time pickers
- `/app/frontend/src/pages/Settings.jsx` - Dual reminder settings + logo
- `/app/frontend/src/pages/Welcome.jsx` - Logo added
- `/app/frontend/public/logo.png` - Marcus Jones Coaching logo

---
## Update: Partner Access Feature (Dec 2025)

### Feature: Accountability Partner View
Allows users to share their progress with a trusted partner without exposing private data.

### What Partners Can See
- Current streak and longest streak
- Whether user has checked in today
- Last 7 days check-in status (alcohol-free / drank)
- Plan progress (week 1-4)

### What Partners Cannot See
- Journal entries (completely private)
- Assessment results
- Commitment statement
- Daily check-in details or scores

### New Files
- `/app/frontend/src/hooks/usePartnerAccess.js` - Partner code generation and management
- `/app/frontend/src/pages/PartnerAccess.jsx` - User UI to create/manage partner links
- `/app/frontend/src/pages/PartnerView.jsx` - Partner view of user's progress

### Routes Added
- `/partner-access` - Protected route for users to manage partner access
- `/partner/:code` - Public route for partners to view progress

### How It Works
1. User goes to Settings > Partner Access
2. Clicks "Create Partner Link" to generate 8-character code
3. Shares link with trusted partner (via copy or native share)
4. Partner opens link to see streak, check-in status, and plan progress
5. User can revoke access anytime from Partner Access page

### Data Storage
- Partner code stored in localStorage: `threshold_partner_code_{userId}`
- Partner data stored in localStorage: `threshold_partner_data_{code}`
