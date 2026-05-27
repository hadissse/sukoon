# Sukoon (سُكون) — Freelance Dev Handoff Brief
### Upwork Job Post · Production Readiness & Feature Completion

---

## Overview

**Sukoon** (Arabic: سُكون, meaning "stillness") is an Arabic-first mobile web app for personal astrology guidance. It is a Progressive Web App (PWA) targeting Arabic-speaking users. Think: a calm daily companion that uses your birth chart to surface personal cosmic insight, reflections, and journaling.

The app is ~80% built. I am the product owner and designer — I need an experienced Next.js/React developer to take over from a clean, well-structured codebase and get it across the finish line to production launch.

**Live preview:** Deployed on Vercel (URL shared privately)
**Codebase:** Private GitHub repo (access granted on hire)
**Stack:** Next.js 16.2.6 · React 19.2.4 · TypeScript (strict) · Tailwind CSS 4 · Supabase · astronomy-engine

---

## What the App Does

Three-tab mobile app (max-width 430px, full RTL Arabic layout):

| Tab | Arabic | Purpose |
|-----|--------|---------|
| Today | اليوم | Daily sky snapshot, reflection prompt, journaling, evening check-in |
| Explore | استكشاف | Planetary transits, astrological calendar, courses, real-time sky chart |
| You | أنت | Personal natal chart wheel, planet/house placements, traits, journey reflections |

Users enter their birth data (date, time, location) during onboarding. The app calculates their natal chart locally using `astronomy-engine` (no external API), syncs it to Supabase, and uses it to personalize all content.

---

## Tech Stack (Full Details)

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.6 |
| UI | React | 19.2.4 |
| Language | TypeScript strict | 5.x |
| Styling | Tailwind CSS 4 | 4.x |
| Database / Auth | Supabase | 2.106.2 |
| Astronomy | astronomy-engine | 2.1.19 |
| Geocoding | OpenCage API | — |
| Hosting | Vercel | — |
| Testing | Vitest | 4.1.7 |
| PWA | Custom service worker | — |

**No Redux, no GraphQL, no heavy state management.** Data lives in `localStorage` (primary) with Supabase cloud sync. Authentication is Supabase (email + Google OAuth + Apple OAuth).

---

## Current State — What Is Built

### Routes & Screens (75 pages)

**Onboarding & Auth**
- `/welcome` — Landing screen with email + Google + Apple sign-in
- `/onboarding` — 3-step birth data entry (date → time → location with geocoding)
- `/auth/callback` — OAuth callback, loads remote chart + events after login

**Today Tab**
- `/today` — Daily sky banner, rotating daily question, transit hero card, journaling entry points
- `/log` — Cosmic event logger (quick log a moment)
- `/reflect` — Free-form journaling
- `/evening` — 3-step evening reflection flow (saves as LoggedEvent)
- `/quiz` — Quiz/reflection prompts
- `/quotes` — Rotating Arabic wisdom quotes

**Explore Tab**
- `/explore` — Real-time sky chart (60s cached), transit cards, courses grid, knowledge library link
- `/explore/depth` — Deep-dive content
- `/explore/transits/[slug]` — Individual transit essay pages
- `/explore/great-transits` — Major planetary events
- `/explore/calendar` — Astrological calendar
- `/explore/calendar/day` — Day detail
- `/explore/biography` — Biographical astrology

**You Tab**
- `/self` — Natal chart wheel (zoomable/touch), planet list with SVG glyphs, zodiac tab, chart intro guide (shown once)
- `/self/[type]/[key]` — Planet/house/sign placement detail with interpretations
- `/self/positions` — Full planetary positions table
- `/self/planetary-speed` — Planet speed tracker
- `/self/wheel` — Full-screen chart wheel
- `/self/fixed-stars` — Fixed stars list + `/self/fixed-stars/[star]` detail pages
- `/traits` — Personality trait breakdown from chart
- `/journey-1` and `/journey-2` — Guided self-discovery journeys
- `/play/[id]` — Playable learning content

**Settings**
- `/settings` — Main settings hub
- `/settings/profile` — Edit display name + link to re-do onboarding
- `/settings/notifications` — Toggle daily reminder, set time (fully wired UI)
- `/settings/calibration` — Chart calibration settings
- `/settings/practice` — Practice/habit settings
- `/settings/data` — Data management (export, delete)
- `/settings/privacy` — Privacy page
- `/settings/about` — About / help

**Other**
- `/event/[id]` — Individual logged event detail
- `/learn`, `/learn/[id]`, `/learn/new`, `/learn/teacher/[name]` — Knowledge/learning hub
- `/library` — Content library
- `/search` — Search
- `/about` — Public about page

### Core Libraries Built

| File | What it does |
|------|-------------|
| `chartCalculator.ts` | Full Placidus house system, 12 planets + Chiron + Mean Lilith |
| `sync.ts` | Bi-directional Supabase sync (charts, events, quizzes, journeys, traits, prefs) |
| `events.ts` | localStorage event CRUD |
| `transits.ts` | Transit calculations and solar return |
| `traitEngine.ts` | Personality trait mapping from chart |
| `currentSky.ts` | Real-time sky positions (60s cache) |
| `cosmicStamp.ts` | Daily cosmic snapshot (moon phase, day ruler, sun position) |
| `geocoding.ts` | OpenCage geocoding for birth location search |
| `notifications.ts` | Browser notification permission + service worker registration |
| `auth.ts` | Supabase email + Google + Apple OAuth |

### UI Component Library (36 components)
Card, Header, Body, Headline, Chip, CTA, TabBar, ZoomableWheel, Glyph, GradientOrb, StreakBadge, TodayHeader, PlacementDetailClient, EventDetailClient, AuthBootstrap, and more — all in `/src/components/`.

### Data & Content
- Astrological placement interpretations in `content/placements.ts`
- Course content in `content/courses.ts`
- Explore depth essays in `content/exploreDepth.ts`
- 31 SVG assets in `public/svg/` (all 12 zodiac signs + 12 planets + asteroids)
- Arabic i18n strings in `src/i18n/ar.ts`

### Design System
Tailwind CSS 4 with custom tokens: `coral` (#E9785E), `ink` (#171B3A), `sage` (#8FA084), `lake` (#7E97B8), `cream` (#F5F2EA), `midnight` (#0F1228). All UI is RTL, serif Arabic typography.

---

## What Remains — The Go-Live Checklist

This is the complete list of what needs to be done before launch. Items marked **P0** are blockers; **P1** are important; **P2** are quality-of-life.

---

### P0 — Launch Blockers

#### 1. Push Notification Delivery (Scheduled Daily Reminder)
**Status:** UI is 100% built. Settings page lets user toggle + set time. Service worker (`public/sw.js`) handles push events and `notificationclick`. **What's missing:** actual push delivery.

The current implementation only does in-browser/foreground notifications via `postMessage`. There is no server-side scheduler that actually fires a push at the user's chosen time.

**What needs building:**
- VAPID key pair generation (can use `web-push` npm package)
- A Supabase Edge Function (or Next.js API route) that receives the user's push subscription + preferred time and stores it
- A scheduled job (Vercel Cron or Supabase Edge Function on cron) that queries users whose local time matches their saved reminder time and sends a `web-push` notification
- Wire the client: after the user grants permission and registers the service worker, POST the `PushSubscription` object to the server endpoint

The service worker already has the `push` event listener and will show the notification — you just need the server end that triggers it.

**References:**
- `src/lib/notifications.ts` — client-side helper (needs `subscribeToPush()` function added)
- `src/app/(app)/settings/notifications/page.tsx` — settings UI (needs to call subscribe endpoint)
- `public/sw.js` — push listener already done

---

#### 2. PWA Icons Missing
**Status:** `public/manifest.json` and `public/sw.js` reference `/icons/icon-192.png` and `/icons/icon-512.png` for the PWA install icon and notification badge. **These files do not exist.**

**What needs building:**
- Create `/public/icons/icon-192.png` and `/public/icons/icon-512.png` from the existing `sukoon-logo.png`
- Verify `manifest.json` icons array points to correct paths
- Test "Add to Home Screen" on iOS Safari and Android Chrome

---

#### 3. Google & Apple OAuth — Supabase Dashboard Configuration
**Status:** Code is fully wired (`signInWithGoogle()`, `signInWithApple()` in `auth.ts`, buttons on welcome page, callback at `/auth/callback`). **What's missing:** the OAuth apps need to be configured in the Supabase dashboard and in Google Cloud Console / Apple Developer.

**What needs doing:**
- Google: Create OAuth 2.0 credentials in Google Cloud Console, add redirect URI, paste client ID + secret into Supabase Auth providers
- Apple: Create Sign in with Apple service ID in Apple Developer, configure return URL, paste into Supabase
- Verify end-to-end OAuth flow works on mobile Safari (Apple) and Chrome (Google)
- Handle edge case: new user OAuth → no chart → redirect to onboarding

---

#### 4. Supabase Row Level Security (RLS) Audit
**Status:** Schema exists (`src/lib/schema.sql`). RLS may or may not be fully configured.

**What needs doing:**
- Review all tables (charts, events, quiz responses, journeys, traits, preferences, profiles, votes, push subscriptions)
- Ensure every table has RLS enabled with policies: users can only read/write their own rows
- Verify anon key cannot access other users' data
- Test with two separate accounts

---

#### 5. Environment Variables — Production Setup
**Status:** The app needs 4 environment variables. These need to be confirmed in Vercel production settings.

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_OPENCAGE_KEY
NEXT_PUBLIC_CONSULTATION_URL
```

**What needs doing:**
- Confirm all 4 are set in Vercel dashboard for the production deployment
- Verify OpenCage API key has sufficient quota for launch
- Add `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` once push notifications are set up

---

#### 6. Auth Email Templates (Arabic)
**Status:** Supabase sends email verification and password reset emails. Default templates are in English.

**What needs doing:**
- Update Supabase Auth email templates (in dashboard) to Arabic:
  - Confirm signup email
  - Password reset email
  - Magic link email
- Test full email → link → app flow

---

### P1 — Important Before Launch

#### 7. Onboarding → Home Routing Edge Cases
Audit the full auth routing:
- New user, no chart → must land on `/onboarding`
- Returning user, has chart → must land on `/today`
- OAuth user, first login, no chart → must land on `/onboarding`
- User clears localStorage but still has Supabase session → `loadRemoteChart()` must restore chart, then go to `/today`
- Deep link to protected route while logged out → redirect to `/welcome`, then return to original URL after login

#### 8. Error States & Loading Skeletons
Most pages show nothing while data loads from localStorage. On slower devices or first load, this causes blank flashes.
- Add loading skeleton states to `today/page.tsx`, `self/page.tsx`, `explore/page.tsx`
- Handle the case where chart data is missing (user skipped onboarding) with a graceful prompt

#### 9. Settings → Data Delete
`/settings/data` needs a working "delete my account" flow:
- Delete all user data from Supabase (charts, events, everything)
- Sign out and clear localStorage
- Redirect to `/welcome`

#### 10. Search (`/search`)
Audit the current search page. Ensure it works against the local content (placements, courses, transits) or implement a basic client-side search with Fuse.js or similar.

#### 11. Fix Notification Badge Icon Path
`sw.js` uses `/icons/icon-192.png` for the badge. Until PWA icons are created (task #2 above), notifications will show with a broken icon. These two tasks should be done together.

#### 12. Production Build Verification
Run `npm run build` and fix any TypeScript or lint errors that only surface in production mode. Verify Vercel deployment succeeds cleanly with zero build warnings becoming errors.

---

### P2 — Quality / Polish

#### 13. Meta Tags & Social Sharing
Add `<meta og:title>`, `<meta og:description>`, `<meta og:image>` to the root layout for proper link previews when shared on WhatsApp, Twitter, etc. Arabic description.

#### 14. Analytics
Add a lightweight analytics integration — Vercel Analytics (already available, just needs `@vercel/analytics` package and one line in root layout) or Plausible. No heavy scripts.

#### 15. Error Monitoring
Add Sentry (free tier) for runtime error reporting. The app currently logs errors only in `NODE_ENV === 'development'`. Production errors will be silent.

#### 16. Supabase Auth Email Confirmation Flow
Currently it's unclear whether email confirmation is required or not. Decide and implement consistently:
- Option A: Require email confirmation (user gets email → clicks link → lands in app with session)
- Option B: Skip confirmation, sign in immediately (simpler, less friction)

#### 17. Content Review
Review all Arabic text in `content/placements.ts`, `content/courses.ts`, and the daily question array in `today/page.tsx` for accuracy and tone. The current content is written but may need editorial review by the product owner.

---

## Out of Scope (Do NOT build)

The following routes exist in the codebase as shells but are intentionally excluded from v1:

- `/paywall` — No monetization in v1
- `/self/charts/add` — No multi-chart support in v1
- `/self/synastry` — No compatibility charts in v1
- `/settings/language` — App is Arabic-only in v1
- `/design-system` — Dev-only, returns 404 in production

Do not add features, refactor working code, or introduce new dependencies beyond what the tasks above require.

---

## Design Rules (Must Follow)

1. **No emojis anywhere** — Not in UI, not in content, not in notifications. Use SVG icons from `/public/svg/` or plain Arabic text.
2. **No purple backgrounds on planet glyphs** — Unicode astrology symbols (☉☽♂) render as colored emoji on iOS. Always use CSS `mask-image` with `/public/svg/{planet}.svg`.
3. **RTL layout** — The entire app is RTL. Do not add any LTR containers except where explicitly needed (e.g., number inputs).
4. **Mobile-only** — Max-width 430px. Do not design for desktop.
5. **Color tokens only** — Use existing Tailwind tokens (`coral`, `ink`, `sage`, `lake`, `cream`, `midnight`). Do not introduce new colors.

---

## Deliverables

| # | Deliverable | Priority |
|---|------------|----------|
| 1 | Push notification server + VAPID + scheduled delivery working on real device | P0 |
| 2 | PWA icons created + "Add to Home Screen" working on iOS and Android | P0 |
| 3 | Google OAuth end-to-end working on mobile | P0 |
| 4 | Apple OAuth end-to-end working on iOS Safari | P0 |
| 5 | Supabase RLS audit report + fixes applied | P0 |
| 6 | All 4 env vars confirmed in Vercel production | P0 |
| 7 | Arabic email templates live in Supabase | P0 |
| 8 | Auth routing edge cases all handled correctly | P1 |
| 9 | Loading skeletons on Today, Self, Explore pages | P1 |
| 10 | Delete account flow working end-to-end | P1 |
| 11 | `npm run build` passes cleanly with zero errors | P1 |
| 12 | OG meta tags added to root layout | P2 |
| 13 | Vercel Analytics or Plausible installed and recording | P2 |
| 14 | Sentry error monitoring configured | P2 |

---

## Skills Required

**Must have:**
- Next.js 14+ App Router (ideally 15/16)
- React 18/19
- TypeScript strict mode
- Supabase (Auth, RLS policies, Edge Functions)
- Progressive Web App / Service Workers / Web Push API
- VAPID push notifications (`web-push` library)
- Arabic / RTL web development experience (or willingness to work carefully in RTL)

**Good to have:**
- Vercel deployment and Vercel Cron
- Tailwind CSS 4
- OAuth configuration (Google Cloud Console, Apple Developer Portal)

---

## What I Will Provide

- Full access to private GitHub repository
- Vercel project access
- Supabase project access (admin)
- OpenCage API key
- Design reference (screenshots + memory doc of all design decisions)
- Fast async communication — I review PRs quickly
- Clear PR-by-PR review so work stays on track

---

## Engagement Style

- Work in small, focused PRs (one deliverable per PR where possible)
- Each PR should be tested on a real mobile device (iOS Safari + Android Chrome) before requesting review
- No drastic refactors — the codebase is clean, just extend it
- Communication via Upwork messages; I'll respond within 24 hours

---

## Budget & Timeline

- Fixed-price or hourly — open to proposals
- Target launch: within 4–6 weeks of start
- P0 items should be done in the first 2 weeks

---

*This document was prepared by the product owner. All technical references are accurate as of 2026-05-26.*
