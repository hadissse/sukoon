# Sukoon · سُكون

## Overview

Sukoon is a daily-use Arabic-first mobile application that returns its user
to their own authority through the living sky, the natal chart, and a
phenomenological spiritual guidance voice. It is built
for Arabic-speaking seekers aged 18–55 who want to learn, track tropical Western astrology delivered as a discipline of spiritual science. The app turns the natal chart into an instrument —
every sign, house, aspect, transit, and fixed star becomes a launchable
detail screen where the user reads the meaning, calibrates against their
felt sense, and logs life events that get tracked across the planetary
cycles.

## Goals

1. Ship an Arabic-primary, end-to-end functional app to TestFlight and
   Google Play Internal Testing within Phase 1 — approximately six
   Claude Code sessions of 30–50k tokens each.
2. Reach a daily-card open rate of 40% among first-month users with no
   third-party analytics — measured through opt-in resonance votes on
   each card.
3. Deliver every UI string and every content piece in the four-part voice
   arc (observation · meaning · shadow · soul question), verified by the
   Arabic content linter with zero denylist hits in CI.

## Core User Flow

1. User opens the app for the first time — Arabic UI loads by default
   regardless of device locale.
2. User completes a 60-second onboarding: name → birth date → birth time
   (with a "don't know" branch) → birth place (geocoded). An anonymous
   Supabase session is created in the background; the natal chart is
   calculated locally via astronomy-engine.
3. User lands on **Today (اليوم)** and reads the day's strongest transit
   against their chart in the first card, followed by 2–4 more cards
   (Body · Two Winds · Today's Question · Learning).
4. User taps the ✦ Log event icon in the header and records a single
   moment — what happened, which stream carried it (feeling · thinking ·
   willing), which placement it ties to. Total time ~30 seconds.
5. User taps into **Self (ذاتك) → الخريطة** to explore the chart — every
   planet, sign, house, aspect, fixed star, and active transit is a
   tappable detail screen with the four-part voice arc, a daily practice
   prompt, and an event-logger affordance.
6. Over weeks, the user returns daily for one short reading. Logged events
   thread back through Self/ما حفظت as a personal timeline and through
   **Explore (استكشاف) → القوس الحياتي** as coloured dots on the
   seven-year biography arc.

## Features

### Today — اليوم

- Inline single-line daily reflection prompt above the card stack
- 5-card daily stack (3 on Open tier, 5 on Deep): Transit · Body ·
  Two Winds · Today's Question · Learning
- Strongest-transit hero card with aspect glyph, exact orb, inline
  write box
- Header utilities: ⚙ Settings · 🔍 Search · ✦ Log event · 📚 Saved-quick
- Per-card resonance vote (warm · quiet · stirring · flat)

### Explore — استكشاف

- السماء الليلة — live impersonal sky, contemplative view of tonight's
  planetary motion
- القوس الحياتي — septennial biography arc with phase-detail screens
  and logged-event dots
- العبورات الكونية الكبرى — lifelong landmark transits (Jupiter return,
  Saturn opposition, Saturn returns I & II, Uranus opposition) with
  prose and soul questions

### Self — ذاتك · the heart of the app

- الخريطة with six sub-tabs: الكواكب · الأبراج · البيوت · الجوانب ·
  النجوم الثابتة · التأثيرات النشطة
- Per-placement detail screens with the four-part voice arc · ✦ practice
  prompt · ينطبق calibration toggle · cycles view · event-logger
  affordance
- النجوم الثابتة — Arabic-named fixed stars (الدبران · فم الحوت · الجنب
  · العقرب · رأس الغول · النسر الواقع) with etymology, current zodiacal
  position, and lineage notes from al-Sufi's 964 CE catalogue
- التأثيرات النشطة — active transits with planetary speed sub-panel
- الجسد — three view modes: organs-and-planets · elements ·
  hierarchies-and-12-senses (Deep tier)
- ما حفظت — saved readings plus the user's full life-event timeline

### Event Logger — accessible globally via the ✦ header icon

- Five-stage flow: what happened · which stream (feeling · thinking ·
  willing) · rhythm polarity · tagged placements · save
- Auto-stamps each event with the day's planetary ruler, moon phase,
  moon sign, and sun degree
- Surfaces in Self/ما حفظت timeline, placement-detail screens, and
  Explore/القوس الحياتي as coloured arc dots
- Optional nightly backward-review prompt for an end-of-day practice

### Settings

- Profile (edit birth details · re-calculate chart)
- Calibration summary (X of Y placements apply · re-calibrate)
- الاستشارات والممارسة — links to the off-tab Practice route
- Language toggle (Arabic default · English deferred to post-launch)
- Data (local cache export · clear · account deletion via Supabase
  edge function)
- About (privacy policy · terms · friendly version string)

## Scope

### In Scope

- Arabic-primary UI on first launch; English Settings toggle deferred
  to post-launch
- Local-first AsyncStorage with `resonance.*` namespace; anonymous
  Supabase auth; sync on reconnect
- Tropical Western chart math via astronomy-engine (Sun, Moon, Mercury
  through Pluto, Chiron, Lilith, ASC, MC)
- Fixed stars with Arabic-tradition naming and precession-aware
  positioning
- Three tabs (Today · Explore · Self) with the locked sub-structure
- Onboarding reduced to four screens (~60 seconds total)
- Tier-gating (Open vs Deep) on natal-wheel outer planets, transit
  calendar, lifetime arc top-3
- Event logger with feeling / thinking / willing stream tagging
- Content corpus in Arabic for the bound surfaces (signs · planets ·
  houses · aspects · biography phases · outer passages · body organs
  · centers · two-winds · ascendant-in-signs · sun-in-signs ·
  moon-in-signs · fixed stars)
- TestFlight and Play Internal Testing builds via EAS Build + EAS Submit

### Out of Scope

- Multi-chart UI ("add another person's chart" affordance dropped)
- Synastry / chart comparison
- Human Design content (hd-channels, hd-gates deferred to post-launch)
- English content authoring (post-launch)
- Third-party analytics, ad SDKs, or remote logging
- In-app payment / IAP — consultations are external, Hadi-routed via
  the Practice route's email edge function
- Daily push notifications — copy-only fix at S24 in Phase 1
- Sidereal / Vedic / Hellenistic chart calculation
- Predictive language ("you will" · "تنبؤ" · "ستحصل على")

## Success Criteria

1. A first-time English-device user lands on an Arabic UI within
   1.6 seconds of cold-launch and completes onboarding in under
   90 seconds.
2. The user's natal chart calculates in under 800 ms on a 2020-era
   iPhone with no network connection.
3. Every shipped text string in the app passes the Arabic content
   linter with zero denylist hits and respects the LANGUAGE_GUIDE
   four-part voice arc.
4. The user can log a life event tagged to at least one placement in
   under 30 seconds, with offline persistence and reconnect sync.
5. The Today tab opens in under 1 second on subsequent launches with
   the previous day's saved cards visible immediately.
6. The app passes Apple App Store review and Google Play review on
   first or second submission with no rejections for missing privacy
   policy, broken account-deletion flow, or guideline violations
   around astrology/divination content.