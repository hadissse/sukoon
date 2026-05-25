# Sukoon — Full App Audit & Developer Handoff

**Date:** 2026-05-25
**Version:** 0.1.0
**Status:** Pre-production (local-only, no backend)

---

## 1. Product Overview

Sukoon (سُكون) is an Arabic-first mobile web app for daily astrology guidance. It turns the natal chart into an interactive instrument — every planet, sign, house, aspect, and transit becomes a detail screen with a 4-part contemplative voice arc (observation → meaning → shadow → soul question).

**Target users:** Arabic-speaking seekers aged 18–55, tropical Western astrology
**Primary language:** Arabic (RTL), no other locale implemented yet
**Viewport:** Mobile-first, locked to 430px max-width, no user zoom

---

## 2. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js | 16.2.6 |
| UI Library | React | 19.2.4 |
| Language | TypeScript | 5.x (strict mode) |
| Styling | Tailwind CSS | 4.x (via @tailwindcss/postcss) |
| Astro Engine | astronomy-engine | 2.1.19 |
| State (installed, unused) | Zustand | 5.0.13 |
| Linting | ESLint | 9.x + eslint-config-next |

### Fonts
- **IBM Plex Sans Arabic** (400, 500, 600, 700) — loaded via Google Fonts
- Fallback: `Noto Sans Arabic`, serif
- CSS variable: `--font-sukoon`

### Color Palette (defined in globals.css @theme)

| Token | Hex | Usage |
|-------|-----|-------|
| cream | #FFFFFF | Page background |
| cream-soft | #F8F8F8 | Card backgrounds |
| sand | #F0F0F0 | Borders, dividers |
| ink | #171B3A | Primary text |
| ink-soft | #2A2F66 | Secondary text |
| ink-muted | #5C5C7A | Muted/caption text |
| coral | #E9785E | Accent, CTAs, Mars |
| coral-soft | #F3B8A6 | Soft accent |
| amber | #D4A04C | Feeling stream |
| midnight | #0F1228 | Dark backgrounds |
| midnight-2 | #1B1F47 | Dark surface |
| rule-soft | #E5E1D8 | Divider lines |

### Design Tokens (additional from Figma spec not yet in CSS)

| Token | Hex | Usage |
|-------|-----|-------|
| sage | #8FA084 | Nature mood, trine aspects |
| sageSoft | #C9D2BE | Soft nature |
| lake | #7E97B8 | Water mood, square aspects |
| creamSoft (Figma) | #F5F2EA | Paper background (Figma uses this, app uses #F8F8F8) |
| coralSoft (Figma) | #F3B8A6 | Matches app |

### Radius Tokens

| Token | Value | Usage |
|-------|-------|-------|
| chip | 14px | Tags, badges |
| card | 18px | Content cards |
| modal | 22px | Overlays, modals |
| button | 26px | Primary buttons (Figma spec) |

---

## 3. Project Structure

```
src/
├── app/                    # Next.js App Router pages (45 routes)
│   ├── layout.tsx          # Root: <html lang="ar" dir="rtl">, fonts, metadata
│   ├── page.tsx            # Redirect: /welcome (no chart) or /today (has chart)
│   ├── globals.css         # Tailwind 4 theme, base resets, utilities
│   ├── (app)/              # Route group: authenticated shell (Header + TabBar)
│   │   ├── layout.tsx      # App shell: Header, max-w-[430px], TabBar
│   │   ├── today/          # اليوم — daily dashboard
│   │   ├── explore/        # استكشاف — night sky, life arc, transits
│   │   │   └── depth/      # Explore depth catalogue
│   │   ├── self/           # ذاتك — natal chart, placements
│   │   │   └── [type]/[key]/ # Placement detail (planet/sign/house/aspect)
│   │   ├── learn/          # Courses catalogue
│   │   │   ├── [id]/       # Course detail
│   │   │   ├── new/        # New this week
│   │   │   └── teacher/[name]/ # Teacher bio
│   │   ├── library/        # Saved, downloads, history, notes
│   │   ├── search/         # Global search with filters
│   │   ├── settings/       # Settings hub
│   │   │   ├── profile/    # User profile
│   │   │   ├── calibration/ # Calibration log
│   │   │   ├── practice/   # Practice & consultations
│   │   │   ├── language/   # Language selector
│   │   │   ├── data/       # Export/clear data
│   │   │   ├── about/      # About Sukoon
│   │   │   └── privacy/    # Privacy policy
│   │   └── play/[id]/      # Media player (12 screen variants via ?screen=)
│   ├── welcome/            # Splash, breathing orb, intro carousel
│   ├── onboarding/         # Birth data form (date, time, location)
│   ├── quiz/               # 10-question personality quiz
│   ├── bridge/             # Bridge/transition screen
│   ├── paywall/            # Trial/subscription (8 variants via ?v=)
│   ├── log/                # 5-stage event logger
│   ├── event/[id]/         # Logged event detail
│   ├── reflect/            # Reflection flow (feeling→mood→note→done)
│   ├── quotes/             # Daily quote cards
│   ├── evening/            # Nightly review (3-moment dark flow)
│   ├── about/              # Friendly about page
│   ├── design-system/      # Component showcase
│   ├── self/               # (outside app group)
│   │   ├── wheel/          # Immersive natal wheel (dark full-screen)
│   │   ├── positions/      # Wheel + positions sidebar
│   │   ├── fixed-stars/    # Fixed star list + [star] detail
│   │   ├── planetary-speed/ # Planetary speed metrics
│   │   ├── charts/add/     # Add relationship chart
│   │   └── synastry/       # Synastry comparison
│   └── explore/            # (outside app group)
│       ├── biography/      # Panoramic life biography
│       ├── great-transits/ # Great cosmic transits
│       ├── calendar/       # Monthly calendar + day/ detail
│       └── transits/[slug]/ # Long-form transit essays
├── components/             # 32 component files
│   ├── Body.tsx            # Paragraph text wrapper
│   ├── Card.tsx            # Content card (18px radius)
│   ├── Chip.tsx            # Tag/badge (14px radius)
│   ├── CTA.tsx             # Call-to-action button
│   ├── EventDetailClient.tsx # Event detail view
│   ├── Field.tsx           # Form input wrapper
│   ├── GradientOrb.tsx     # CSS radial-gradient decorative blob
│   ├── Header.tsx          # Sticky top bar
│   ├── Headline.tsx        # h1/h2/h3
│   ├── HeroCard.tsx        # Large hero card
│   ├── HScroll.tsx         # Horizontal scroll container
│   ├── Meta.tsx            # Metadata/caption text
│   ├── MiniCard.tsx        # Small card variant
│   ├── Paper.tsx           # Panel container
│   ├── PlacementDetailClient.tsx # Planet-in-sign detail view
│   ├── Rule.tsx            # Divider line
│   ├── Section.tsx         # Section container
│   ├── SettingsSubHeader.tsx # Settings sub-heading
│   ├── StreakBadge.tsx      # Practice streak
│   ├── TabBar.tsx          # Bottom 3-tab navigation
│   ├── TodayHeader.tsx     # Today header with cosmic stamp
│   ├── TransitHeroCard.tsx # Live transit card
│   ├── ZoomableWheel.tsx   # Interactive natal chart SVG
│   ├── learn/
│   │   ├── player.tsx      # Media player shell
│   │   └── primitives.tsx  # Learn module UI primitives
│   ├── onboarding/
│   │   ├── BirthDateStep.tsx
│   │   ├── BirthTimeStep.tsx
│   │   ├── LocationStep.tsx
│   │   └── PreAppUI.tsx
│   └── v2/
│       ├── FooterTabBar.tsx # Alternative tab bar (dark mode)
│       ├── SukoonWheel.tsx  # V2 wheel variant
│       └── V2Header.tsx     # V2 header variant
├── content/                # Static content data
│   ├── placements.ts       # 124 VoiceContent entries (120 planet×sign + 4 misc)
│   ├── courses.ts          # Course/lesson definitions
│   └── exploreDepth.ts     # Explore depth catalogue cards
├── lib/                    # Core utilities
│   ├── chartCalculator.ts  # Birth chart calculation (astronomy-engine)
│   ├── cosmicStamp.ts      # Daily cosmic info (day ruler, moon phase, sun pos)
│   ├── events.ts           # Event logging CRUD (localStorage)
│   ├── geocoding.ts        # Location search (stub, no API wired)
│   └── transits.ts         # Transit calculation + aspect detection
├── i18n/                   # Internationalization
│   ├── index.ts            # t() function + setLocale()
│   └── ar.ts               # ~100 Arabic translation keys
└── theme/
    └── tokens.ts           # TypeScript color/spacing token objects
```

---

## 4. Complete Route Map (45 pages)

### Pre-Authentication Flow

| # | Route | File | Description | Navigation To |
|---|-------|------|-------------|---------------|
| 1 | `/` | page.tsx | Redirect based on localStorage chart | → /welcome or /today |
| 2 | `/welcome` | welcome/page.tsx | 9-phase flow: splash → breathe → welcome → auth → intro carousel | → /quiz, /onboarding |
| 3 | `/onboarding` | onboarding/page.tsx | 4-step birth data: date → time → location → calculate | → /today |
| 4 | `/quiz` | quiz/page.tsx | 10-question personality quiz, plan-ready, trial | → /paywall, /today |
| 5 | `/bridge` | bridge/page.tsx | Transition/onboarding bridge screen | → /today |
| 6 | `/paywall` | paywall/page.tsx | 8 variants via `?v=`: intro, plans, payment, started, summary, gift, student, trial-timeline | → /today |

### Main App Tabs (inside `(app)` layout with Header + TabBar)

| # | Route | Tab | Description |
|---|-------|-----|-------------|
| 7 | `/(app)/today` | اليوم | Daily dashboard: transit hero, practices, quote, reflection, body, two winds, learning |
| 8 | `/(app)/explore` | استكشاف | 3 views: night sky, life arc (7yr phases), grand transits |
| 9 | `/(app)/explore/depth` | — | Explore depth: chip filters, 2-col grid of topic cards |
| 10 | `/(app)/self` | ذاتك | 3 tabs (chart/body/saved), chart sub-tabs (planets/signs/houses/aspects/active) |
| 11 | `/(app)/self/[type]/[key]` | — | Placement detail: VoiceArc (obs/mean/shadow/q), calibration |
| 12 | `/(app)/learn` | — | Course catalogue: 3 tabs (foundations/series/teachers) |
| 13 | `/(app)/learn/[id]` | — | Course detail: about/learn/lessons tabs |
| 14 | `/(app)/learn/new` | — | New this week list |
| 15 | `/(app)/learn/teacher/[name]` | — | Teacher bio + courses |
| 16 | `/(app)/library` | — | 4 tabs: saved, downloads, history, notes + collections |
| 17 | `/(app)/search` | — | Search: recent, popular, suggestions, results, filters, feelings |
| 18 | `/(app)/play/[id]` | — | Media player, 12 variants via `?screen=`: play, duration, settings, sounds, chooser, complete, breath, chapters, quote, paused, waveform, animation |

### Settings (inside `(app)` layout)

| # | Route | Description |
|---|-------|-------------|
| 19 | `/(app)/settings` | Settings hub (7 menu items) |
| 20 | `/(app)/settings/profile` | Profile: avatar, name, stats |
| 21 | `/(app)/settings/calibration` | Calibration log |
| 22 | `/(app)/settings/practice` | Practice & consultations (marked قريبًا) |
| 23 | `/(app)/settings/language` | Language selector (marked قريبًا) |
| 24 | `/(app)/settings/data` | Export/clear data |
| 25 | `/(app)/settings/about` | About Sukoon |
| 26 | `/(app)/settings/privacy` | Privacy policy |

### Standalone Flows (outside `(app)` layout — no Header/TabBar)

| # | Route | Description |
|---|-------|-------------|
| 27 | `/log` | 5-stage event logger |
| 28 | `/event/[id]` | Logged event detail |
| 29 | `/reflect` | Reflection flow: feeling → mood → note → done + variants (list/days/week/quick) |
| 30 | `/quotes` | Quote cards carousel |
| 31 | `/evening` | Nightly review (3-moment dark flow) |
| 32 | `/about` | Friendly about page |
| 33 | `/design-system` | Component showcase |

### Self Screens (outside `(app)` layout)

| # | Route | Description |
|---|-------|-------------|
| 34 | `/self/wheel` | Immersive full-screen natal wheel (dark) |
| 35 | `/self/positions` | Wheel + positions sidebar |
| 36 | `/self/fixed-stars` | Fixed stars list |
| 37 | `/self/fixed-stars/[star]` | Fixed star detail |
| 38 | `/self/planetary-speed` | Planetary speed metrics |
| 39 | `/self/charts/add` | Add relationship chart |
| 40 | `/self/synastry` | Synastry comparison |

### Explore Screens (outside `(app)` layout)

| # | Route | Description |
|---|-------|-------------|
| 41 | `/explore/biography` | Panoramic life biography |
| 42 | `/explore/great-transits` | Great cosmic transits overview |
| 43 | `/explore/calendar` | Monthly ephemeris calendar |
| 44 | `/explore/calendar/day` | Day detail view |
| 45 | `/explore/transits/[slug]` | Long-form transit essays (saturn-return, pluto-square, neptune-sun) |

---

## 5. Data Flow & Persistence

### localStorage Keys

| Key | Type | Written By | Read By |
|-----|------|-----------|---------|
| `sukoon.primary-chart.v1` | AstralChart JSON | /onboarding | /, /(app)/self, ZoomableWheel, TransitHeroCard, all chart-dependent pages |
| `sukoon.birth-data` | BirthData JSON | /onboarding | /settings/profile |
| `sukoon.events` | LoggedEvent[] JSON | /log | /(app)/self (saved tab), /event/[id], /settings/profile |
| `sukoon.calibration.*` | various | PlacementDetailClient | /settings/profile, /settings/calibration |
| `sukoon.geocache.*` | Location JSON | geocoding.ts | LocationStep (7-day TTL cache) |

### Chart Calculation Pipeline

```
User enters birth data (onboarding)
  → calculateChart(birthData) [astronomy-engine]
  → AstralChart object (sun, moon, mercury...pluto, chiron, lilith, asc, mc, houses[])
  → localStorage.setItem('sukoon.primary-chart.v1', JSON)
  → All chart-dependent components read from localStorage on mount
```

### AstralChart Shape

```typescript
interface PlanetPosition {
  name: string;        // Arabic name
  glyph: string;       // Unicode glyph
  longitude: number;   // Ecliptic degrees (0-360)
  sign: string;        // Arabic sign name
  signNumber: number;  // 0-11
  degree: number;      // Degree within sign (0-29)
  minute: number;      // Arc minutes
  retrograde: boolean;
}

interface HousePosition {
  num: number;         // 1-12
  cusp: number;        // Ecliptic longitude of cusp
  sign: string;        // Arabic sign name
}

interface AstralChart {
  sun, moon, mercury, venus, mars: PlanetPosition;
  jupiter, saturn, uranus, neptune, pluto: PlanetPosition;
  chiron, lilith: PlanetPosition;
  asc: number;         // Ascendant longitude
  mc: number;          // Midheaven longitude
  houses: HousePosition[];
}
```

### Content System

```typescript
// VoiceContent — the 4-part contemplative voice arc
interface VoiceContent {
  obs: string;         // الملاحظة — observation
  mean: string;        // المعنى — meaning
  shadow: string;      // الظل — shadow
  q: string;           // سؤال الروح — soul question
  practice?: string;   // Optional practice prompt
  cycles?: [string, string][]; // Optional cycle associations
}

// Content lookup: getPlacementContent('planet', 'sun:gemini')
// Keys: 'planet:sun:aries' through 'planet:pluto:pisces' (120 entries)
// Also: 'sign:capricorn', 'house:6', 'aspect:saturn-sun', 'element:fire'
```

---

## 6. Component Library

### Core Components (exported from index.ts)

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| Headline | h1/h2/h3 | level, children |
| Body | Paragraph | children |
| Meta | Caption/metadata | children |
| CTA | Button/link | href, children, variant |
| Paper | Card container | children |
| Rule | Divider | — |
| Chip | Tag/badge | label, active |
| Card | Content card | children |
| Field | Form input | label, value, onChange |

### Feature Components

| Component | Purpose | Notes |
|-----------|---------|-------|
| ZoomableWheel | Natal chart SVG | 377px default, paper/white tone |
| GradientOrb | Decorative blob | 7 variants: dawn, sage, lake, dusk, night, ember, dust |
| TransitHeroCard | Live transit display | Reads chart + astronomy-engine |
| PlacementDetailClient | Planet-in-sign detail | VoiceArc rendering |
| EventDetailClient | Event detail | Reads from localStorage events |
| TabBar | Bottom navigation | 3 tabs: Today, Explore, Self |
| Header | Top bar | Settings, logo area, log icon |
| TodayHeader | Today greeting | Cosmic stamp display |

### GradientOrb Variants (CSS radial-gradient)

| Variant | Colors (light → dark) |
|---------|----------------------|
| dawn | #F8D6BE → #E9785E → #9A3F30 |
| dusk | #E9785E → #5A3E7A → #171B3A |
| night | #3A4490 → #1B1F47 → #0A0C20 |
| sage | #D8DFC8 → #8FA084 → #475A3F |
| lake | #C2D3E2 → #7E97B8 → #33485F |
| ember | #FFC78A → #D4651E → #5A2710 |
| dust | (similar to sand tones) |

---

## 7. Known Issues & Gaps

### CRITICAL

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| 1 | **Zustand installed but unused** | package.json | Unnecessary 15KB+ in bundle |
| 2 | **localStorage access without try-catch** in root redirect | src/app/page.tsx:10 | Crashes in private browsing |
| 3 | **Broken route references** | learn/teacher/[name] links to `/learn/quiet-path` and `/learn/gentle-anchors` | 404 errors when clicking |

### FIGMA ALIGNMENT GAPS

| # | Issue | Current State | Figma Spec |
|---|-------|--------------|------------|
| 4 | **Glyphs use Unicode characters** | ☉ ♂ ♃ etc. as plain text | SVG files with CSS mask-image tinting |
| 5 | **Chart wheel is simplified** | 377px viewBox, basic circles, no zoom | 1000px viewBox, concentric rings (470/440/380/320/270/235/70 radii), tap-to-zoom 1x→1.6x→2.4x |
| 6 | **No logo component** | Text "سُكون" in welcome page | sukoon-logo.png with CSS mask tinting, 4.2x height aspect |
| 7 | **Chart colors wrong** | Strokes #E8DCC8, planets as colored circles with white Unicode text | Strokes #7A7A7A/#C7C0AE, AC in coral #E9785E, proper ring shading |
| 8 | **Aspect line rendering** | All at 0.5 opacity, basic colors | Opposition coral@35%, Trine sage@30%, Square lake@28%, Sextile sage@18%, Conjunction hidden |
| 9 | **Missing sage/lake colors** in CSS theme | Not defined in globals.css | sage #8FA084, lake #7E97B8 used extensively in Figma |
| 10 | **Tab bar icons** | Simple SVG stroke icons | Filled variants for active state, 10.5px label, 52px height |

### DATA / CONTENT

| # | Issue | Details |
|---|-------|---------|
| 11 | **Content corpus partial** | 124 entries exist (120 planet×sign + 4 misc). Need ~1,200+ for sign-in-house, aspects, elements, fixed stars |
| 12 | **ASC/MC/Houses simplified** | Uses `asc = sun + 90`, equal houses. Real Placidus needs RAMC from birth sidereal time + latitude |
| 13 | **Chiron placeholder** | Calculated as midpoint of Saturn + Uranus |
| 14 | **Lilith placeholder** | Calculated as Moon + 180° (not true Black Moon Lilith) |
| 15 | **Geocoding stub** | Structure exists but no API wired (OpenCage/Google Maps needed) |
| 16 | **Transit essay slugs limited** | Only 3: saturn-return, pluto-square, neptune-sun |

### BACKEND / INFRASTRUCTURE (Not Implemented)

| # | Gap | Notes |
|---|-----|-------|
| 17 | **No database** | All data in localStorage only |
| 18 | **No authentication** | No user accounts, no Supabase auth |
| 19 | **No API routes** | Zero /api/ endpoints |
| 20 | **No server actions** | No 'use server' functions |
| 21 | **No media storage** | Player UI complete but needs Supabase Storage for audio/video |
| 22 | **No cloud sync** | No mechanism to sync data across devices |
| 23 | **No push notifications** | No service worker, no notification API |
| 24 | **No analytics** | No tracking, no event logging to server |

### CODE QUALITY

| # | Issue | Location |
|---|-------|----------|
| 25 | **No tests** | Zero test files in project |
| 26 | **Console.log in production code** | geocoding.ts (5), LocationStep.tsx (4) |
| 27 | **Silent error catching** | PlacementDetailClient.tsx:186 — empty catch {} |
| 28 | **Incomplete component barrel** | index.ts exports 9 of 32 components |
| 29 | **"Coming soon" placeholders** | settings/language, settings/practice marked قريبًا |
| 30 | **Hardcoded default location** | Onboarding defaults to Riyadh (24.7136, 46.6753) |

---

## 8. Figma Design Assets (Available for Implementation)

### SVG Glyph Library (29 files in `Sukoon - 1/Design Files/svg/`)

**Planets (12):** sun, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto, chiron, ceres

**Zodiac (12):** aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sag, cap, aqua, pisces

**Minor (5):** juno, pallas, lilith, earth, southnode

All SVGs are black-on-transparent, 64×64px viewBox, optimized for CSS mask-image tinting at any size (14–56px typical use).

### Logo Asset
- `sukoon-logo.png` — black on transparent
- Aspect ratio: 4.2× height (width auto-scales)
- Rendering: CSS mask for color tinting

### Figma Chart Wheel Spec (chart-wheel.jsx)

```
ViewBox: 1000×1000
Center: 500, 500

Ring Radii:
  Outer edge:     r=470
  Zodiac outer:   r=440
  Zodiac inner:   r=380
  House outer:    r=380
  Planet ring:    r=320
  Planet inner:   r=270 (aspect line endpoints)
  House numbers:  r=235
  Center circle:  r=70

Colors (Paper mode):
  Stroke:    #7A7A7A
  Light:     #C7C0AE
  Ticks:     #2A2A2A
  Text:      #3A3A3A
  Muted:     #9A9A9A
  Accent:    #E9785E (coral)
  Background: #FFFFFF

Typography:
  Zodiac glyphs: 38px, Cambria/"Times New Roman"/"Noto Sans Symbols 2"
  House numbers:  14px, sans-serif
  AC/MC labels:   15px, weight 600
  Tooltips:       20px, "IBM Plex Sans Arabic"

Planet Glyphs: 28px (base) to 56px (Sun), hover +4px

Aspect Lines:
  Opposition: #E9785E @ 0.35 opacity
  Trine:      #8FA084 @ 0.30 opacity
  Square:     #7E97B8 @ 0.28 opacity
  Sextile:    #8FA084 @ 0.18 opacity
  Conjunction: hidden (alpha 0)
  Stroke width: 0.8px

Zoom: Tap-to-zoom 1x → 1.6x → 2.4x with pan
```

---

## 9. Developer Quick Start

```bash
# Clone and install
npm install

# Start dev server
npm run dev          # → http://localhost:3000

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Build
npm run build
```

### Key Path Aliases
- `@/*` → `./src/*` (e.g., `import { Header } from '@/components/Header'`)

### Important Files to Read First
1. `src/lib/chartCalculator.ts` — understand AstralChart data shape
2. `src/content/placements.ts` — understand VoiceContent pattern
3. `src/app/(app)/layout.tsx` — understand app shell structure
4. `src/app/globals.css` — understand theme tokens
5. `src/i18n/ar.ts` — all UI strings

### RTL Notes
- `<html lang="ar" dir="rtl">` set at root
- Use `flex` layout (auto-mirrors in RTL)
- Use `insetInlineStart` / `insetInlineEnd` instead of `left` / `right`
- Chevron icons: back = points right (→), forward = points left (←)

---

## 10. Pending Work Items

### Immediate (Figma alignment)
- [ ] Copy 29 SVG glyphs to `public/svg/`, create `<Glyph>` component with CSS mask-image
- [ ] Rebuild chart wheel to match Figma spec (1000px viewBox, correct radii/colors/zoom)
- [ ] Add `<Logo>` component with sukoon-logo.png + CSS mask tinting
- [ ] Add sage (#8FA084) and lake (#7E97B8) to globals.css theme
- [ ] Update TabBar icons to match Figma (filled active state, 10.5px labels)

### Content Expansion
- [ ] Remaining ~1,200 VoiceContent entries (signs-in-houses, aspects, elements, fixed stars)
- [ ] Additional transit essay slugs beyond the current 3

### Backend (Phase 6 of build plan)
- [ ] Supabase project setup + database schema
- [ ] Anonymous auth → account upgrade flow
- [ ] Cloud sync for events, calibrations, chart data
- [ ] Media storage (Supabase Storage) for course audio/video
- [ ] Geocoding API integration (OpenCage or Google Maps)

### Production Readiness
- [ ] Remove Zustand from dependencies (or implement global state)
- [ ] Add try-catch to root page localStorage access
- [ ] Fix broken /learn/quiet-path and /learn/gentle-anchors references
- [ ] Remove console.log statements from production code
- [ ] Add error boundaries and loading states
- [ ] Implement real Placidus house calculation
- [ ] Add test suite (chart calculations, event persistence)
- [ ] Accessibility audit (aria-labels, keyboard navigation)
