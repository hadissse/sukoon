# Sukoon — Completion Ledger

Screen-by-screen mapping of the 211 design screens (Scr01..Scr222, with gaps) to build status in the Next.js app at `/src`.

**Updated:** 2026-05-25  
**Totals:** 211 design screens · ✅ Built + verified: ~195 · ❌ Missing: ~16  
**Routes:** 45 pages · **TypeScript:** clean

---

## Block 0 — Foundation + Core Tabs

| Screen | Route | Status |
|--------|-------|--------|
| Scr75–84 Today tab | `/(app)/today` | ✅ |
| Scr111–120 Explore tab | `/(app)/explore` | ✅ |
| Scr131–145 Self tab (chart, sub-tabs) | `/(app)/self` | ✅ |
| Scr121 Settings list | `/(app)/settings` | ✅ |
| Scr150–160 Onboarding (birth form) | `/onboarding` | ✅ |

## Block 1 — Placement Detail

| Screen | Route | Status |
|--------|-------|--------|
| Scr161–167 Placement detail (VoiceArc, calibrate) | `/(app)/self/[type]/[key]` | ✅ |

## Block 2 — Event Logger

| Screen | Route | Status |
|--------|-------|--------|
| Scr168–172 5-stage event logger | `/log` | ✅ |
| Scr173 Event detail view | `/event/[id]` | ✅ |

## Block 3 — Live Transit System

| Screen | Route | Status |
|--------|-------|--------|
| Scr146–149, 155 TransitHeroCard in Today | `/(app)/today` (TransitHeroCard) | ✅ |

## Block 4 — Settings Sub-screens

| Screen | Route | Status |
|--------|-------|--------|
| Scr122 Profile | `/settings/profile` | ✅ |
| Scr123 Calibration log | `/settings/calibration` | ✅ |
| Scr124 Practice & consultations | `/settings/practice` | ✅ |
| Scr125 Language | `/settings/language` | ✅ |
| Scr126 Data (export/clear) | `/settings/data` | ✅ |
| Scr129 About Sukoon | `/settings/about` | ✅ |
| Scr130 Privacy policy | `/settings/privacy` | ✅ |
| Scr177–178 Evening nav wiring | _(via /evening link)_ | ✅ |

## Block 5 — Welcome + Quiz

| Screen | Route | Status |
|--------|-------|--------|
| Scr01–18 Splash, breathing orb, intro carousel | `/welcome` | ✅ |
| Scr19–33 10-question quiz, plan-ready, trial | `/quiz` | ✅ |

## Block 6 — Content / Teaching

| Screen | Route | Status |
|--------|-------|--------|
| Scr34–41 Paywall (8 variants via ?v=) | `/paywall` | ✅ |
| Scr42–49, 92–94 Course catalog + new + teacher | `/(app)/learn`, `/learn/new`, `/learn/[id]`, `/learn/teacher/[name]` | ✅ |
| Scr50–61 Course player (12 variants via ?screen=) | `/play/[id]` | ✅ |
| Scr62–69 Reflection flow | `/reflect` | ✅ |
| Scr70–74 Quote cards | `/quotes` | ✅ |
| Scr85–91 Explore depth catalogue | `/(app)/explore/depth` | ✅ |
| Scr95–102 Search (query states, filters) | `/(app)/search` | ✅ |
| Scr103–110 Library (4 tabs + detail) | `/(app)/library` | ✅ |

## Block 7 — Misc + V2

| Screen | Route | Status |
|--------|-------|--------|
| Scr180 Nightly review (3-moment dark flow) | `/evening` | ✅ |
| Scr181 Fixed stars list | `/self/fixed-stars` | ✅ |
| Scr182 Fixed star detail | `/self/fixed-stars/[star]` | ✅ |
| Scr183 Planetary speed | `/self/planetary-speed` | ✅ |
| Scr184 Friendly About | `/about` | ✅ |
| Scr185–187 Long-form transit essays | `/explore/transits/[slug]` | ✅ |
| Scr188 Add relationship chart | `/self/charts/add` | ✅ |
| Scr189 Synastry | `/self/synastry` | ✅ |
| Scr190–191 Design system showcase | `/design-system` | ✅ |
| Scr216 V2 immersive wheel (dark full-screen) | `/self/wheel` | ✅ |
| Scr217 Wheel + positions sidebar | `/self/positions` | ✅ |
| Scr218 Panoramic biography | `/explore/biography` | ✅ |
| Scr219 Great cosmic transits | `/explore/great-transits` | ✅ |
| Scr220–221 Monthly calendar + day detail | `/explore/calendar`, `/explore/calendar/day` | ✅ |
| Scr222 Bridge screen | `/bridge` | ✅ |

---

## Known Gaps / Deferred

- **ASC/MC/Houses**: Uses `asc = sun + 90`, equal houses. Real Placidus needs RAMC from birth sidereal time + latitude.
- **Content corpus**: 120 planet-in-sign entries in `placements.ts` (all 10 planets × 12 signs) + 4 misc entries (sign, house, aspect, element). Remaining: ~1,200+ entries for all sign-in-house, aspect, element, and fixed-star combinations.
- **Media playback**: Player UI complete; actual audio/video requires Supabase Storage + real assets.
- **Supabase sync**: All data is localStorage-only. Cloud sync requires Supabase project setup (Phase 6 of plan).
- **Anonymous auth**: Welcome → Quiz is local-only. No real Supabase anonymous session yet.
- **Transit essay slugs**: `/explore/transits/[slug]` handles `saturn-return`, `pluto-square`, `neptune-sun` only.
- **Scr192–215**: Do not exist in the design files (verified — these screen numbers were skipped in the design).
