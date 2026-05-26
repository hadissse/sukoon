# HYGIEA
### *Spiritual hygiene for the digital age*

> An English reincarnation of **Sukoon** — keeping the same architecture, but moving
> the center of gravity from *astrology* to *spiritual science*, with astrology as one
> lens among several.

This document is the conception and ideation reference for the build. It captures the
name, the philosophy, the feature set, the design laws, and the mapping from Sukoon's
existing architecture.

---

## I. Essence

**Sukoon** (سُكون, "stillness") is an Arabic-first astrological journaling app.
**Hygiea** keeps its bones but changes its soul: spiritual science becomes the
foundation, and astrology becomes *one lens among several*.

Hygiea — Greek goddess of *maintenance* (daughter of Asclepius the *healer*) — names
the whole intent: you don't consult Hygiea in crisis, you practice her daily.

> **Soul hygiene, not soul cure.** The app is a daily cleansing ritual that keeps the
> inner life clear.

This single reframe drives everything downstream:
- **Tone** — sober and grounded, not mystical-salesy.
- **Cadence** — rhythmic and finite, not addictive.
- **Relationship** — a practice you *keep*, not an oracle you *binge*.

---

## II. The Philosophical Spine

Steiner's two adversary forces define the problem the app addresses.

| Force | Pulls toward | In the digital age | Soul symptom |
|---|---|---|---|
| **Ahriman** | hardening, materializing, control | algorithmic capture, data-obsession, doom-scroll, cold cynicism | anxiety, contraction, numbness |
| **Lucifer** | inflating, dissolving, escaping | spiritual bypass, fantasy, dopamine highs, ungrounded idealism | mania, vanity, dissociation |

**The goal is not to defeat either, but to hold the upright middle between them** — the
free human "I" standing erect, making discernments.

This middle is the **Christic equilibrium** — present as *meaning*, never as *name*.
No creed, no religious vocabulary. Every esoteric tradition names the same center:

- the Kabbalistic **middle pillar**
- the Buddhist **middle way**
- the Taoist **mean**
- the Hermetic **equilibrium**

Hygiea presents the balancing principle as the *convergence point of all of them*, so a
skeptic, a Muslim, a Buddhist, or an agnostic seeker all meet the same truth without a
doctrinal gate.

> **The app itself is the first act of balance.** Technology used *rightly* — with
> discernment — is the thesis embodied in the product, not merely preached in its content.

---

## III. The Signature Original — The Soul Barometer

Hygiea's one genuinely new mechanic, carrying the whole philosophy.

A daily reading that places you on the **Ahriman ←→ Lucifer axis**, derived from your
journal entries, mood/energy logs, rhythm of use, and cosmic currents. **Not a score to
optimize — a mirror for discernment.**

- **Tilting Ahrimanic?** Today's hygiene leans toward *loosening* — wonder, art, warmth,
  the senses, gratitude.
- **Tilting Luciferic?** Today's hygiene leans toward *grounding* — the body, attention
  to detail, a single completed task, cold facts.
- **Centered?** A practice that *strengthens the center itself.*

It is the Rückschau (see §V) made visible: a soul-hygiene barometer instead of a
productivity streak.

---

## IV. The Esoteric Sciences Stack

"Spiritual science" is Steiner's own term for Anthroposophy (*Geisteswissenschaft*).
Hygiea is anthroposophically grounded but draws on the wider Western esoteric stream.
**Personalized info** is generated from the intersection of these lenses:

1. **The Four Temperaments** (choleric / sanguine / phlegmatic / melancholic) — maps
   cleanly onto Sukoon's existing *elemental balance* engine.
2. **Planetary metals & organs** (Sun–Gold–Heart, Moon–Silver–Brain,
   Mercury–Quicksilver–Lungs, Venus–Copper–Kidneys, Mars–Iron–Gallbladder,
   Jupiter–Tin–Liver, Saturn–Lead–Spleen) — *already present* in Sukoon's
   `traitEngine.ts` as "minerals/organs." It IS anthroposophical/alchemical medicine,
   simply unhidden.
3. **Biographical seven-year rhythms** — Steiner's septennial life phases. A powerful new
   personalization axis ("you are in your 5th seven-year period / your Saturn-return
   reckoning").
4. **Astrology** — natal chart + transits, computed exactly as Sukoon does
   (`chartCalculator.ts`, `transits.ts`), reframed as *cosmic rhythm and quality of time*,
   not prediction.
5. **The Twelve Senses & Seven Life Processes** (Steiner) — a richer reframe of Sukoon's
   "Human Design centres."
6. **Kabbalah / Hermeticism / Alchemy** — the shared map of the *middle pillar* and the
   stages of inner transformation.

**Core personalization fusion:**
> *natal constitution × temperament × biographical phase × today's cosmic current →
> today's hygiene practice.*

---

## V. The Daily Practice Loop (the heart)

Sukoon already has morning (`/today`) and evening (`/evening`) anchors. Hygiea fills them
with the most authentic soul-hygiene practices in the Western esoteric tradition.

- **Morning — Orientation.** A brief setting of the inner compass. One intention, one
  quality to carry.
- **Through the day — The Six Basic Exercises.** Steiner's *six subsidiary exercises*,
  which he explicitly called **the hygiene of the soul**:
  1. control of thinking
  2. control of will
  3. equanimity of feeling
  4. positivity
  5. open-mindedness
  6. harmony of all five

  One emphasized per day — a six-day rhythm plus a day of rest.
- **Evening — The Rückschau (Backward Review).** Steiner's central practice: review the
  day *in reverse order*, as a witness, without self-judgment. The literal "logout from
  the day" — and the feed that powers the Soul Barometer. This becomes Hygiea's signature
  evening ritual.

---

## VI. "Technology Used Rightly" — Design Laws

The product must *practice what it preaches*, or the thesis collapses into hypocrisy.
These are non-negotiable.

1. **No infinite scroll, no hooks.** Finite sessions with a clear end. The app *invites
   you to close it.*
2. **A Threshold, not a feed.** You cross into Hygiea deliberately; it never ambushes your
   attention.
3. **Anti-streak.** No guilt mechanics, no manipulative gamification. Missing a day is not
   a failure — hygiene resumes, it doesn't punish.
4. **Rhythm over notification.** Reminders honor diurnal/cosmic rhythm, never dopamine
   timing. (Sukoon's `notifications.ts` becomes rhythm-aware.)
5. **Local-first sovereignty.** Sukoon's localStorage-first architecture is *already* an
   Ahrimanic-resistance feature — your inner life is yours, cloud sync optional. Keep and
   foreground it.
6. **Silence as a feature.** The app may recommend *not* using it — "go outside, look at a
   tree."

---

## VII. Architecture Mapping (Sukoon → Hygiea)

Same stack, same bones. **Keep the architecture.** Next.js 16 / React 19 / TypeScript /
Tailwind 4 / Supabase / `astronomy-engine` / localStorage-first all stay. The work is
**reframing + translation + new content**, not re-architecting.

| Sukoon | Hygiea | Change type |
|---|---|---|
| `lang="ar" dir="rtl"`, IBM Plex Arabic | `lang="en" dir="ltr"`, English serif/humanist font | i18n flip |
| `i18n/ar.ts` | `i18n/en.ts` | translate |
| `/today` (cosmic dashboard) | **Today's Hygiene** (Soul Barometer + day's practice) | reframe + Barometer (new) |
| `/self` (natal wheel) | **Constitution** (chart + temperament + biographical phase) | extend |
| `/traits` (elements/minerals/organs/HD) | **Inner Anatomy** (temperaments, planetary metals/organs, twelve senses) | rename + deepen |
| `/evening` (wind-down) | **The Rückschau** (backward review → feeds Barometer) | reframe, becomes signature |
| `/journey-1`, `/journey-2` | **The Six Exercises** (soul-hygiene curriculum) | re-content |
| `/learn` (meditation courses) | **Esoteric Science** (Steiner, Kabbalah, Hermetics, alchemy) | re-content |
| `/explore` (sky/biography) | **Rhythms** (cosmic + biographical seven-year cycles) | extend |
| `content/placements.ts` (~4000 lines Arabic voice) | English esoteric interpretations | rewrite — biggest content lift |
| `chartCalculator`, `transits`, `cosmicStamp` | unchanged (math is universal) | keep as-is |
| `traitEngine.ts` | extend with temperament + biographical-phase logic | extend |
| Supabase schema | + `soul_barometer`, `ruckschau`, `exercise_progress` tables | additive |

### Personalization engine — the open decision

Sukoon uses **no LLM** today. For Hygiea's personalized info there is a fork:

- **Deterministic** (Sukoon's current ethos): hand-authored interpretation tables, fully
  private, no AI. Most faithful to "technology used rightly," but content-heavy to author.
- **AI-assisted (Claude)**: weaves constitution + barometer + currents into fresh daily
  guidance. Dynamic and personal, but needs guardrails against the Ahrimanic failure mode
  (surveillance, dependency) and the Luciferic one (hallucinated mysticism).
- **Hybrid**: deterministic core tables for the esoteric "facts"; optional, opt-in AI
  layer for the daily synthesis and voice. Privacy-preserving default.

*This is the one decision to settle before scaffolding.*

---

## VIII. Suggested MVP (phased)

- **Phase 1 — The Spine.** Fork repo → English i18n, rename routes, onboarding (birth data
  → constitution), `/today` with the **Soul Barometer**, the **Rückschau** evening review.
  Reuse all astro math untouched.
- **Phase 2 — The Practice.** The Six Basic Exercises curriculum + biographical
  seven-year phase engine + temperament layer in `traitEngine`.
- **Phase 3 — The Library.** English esoteric interpretation content; the Esoteric Science
  learning track.
- **Phase 4 — Refinement.** Rhythm-aware notifications, anti-streak polish, the "Threshold"
  entry, sovereignty/export.

---

## IX. Tech Stack (inherited from Sukoon)

- **Framework:** Next.js 16 (App Router) + React 19, TypeScript 5
- **Styling:** Tailwind CSS 4, design tokens in `src/theme/tokens.ts`
- **Backend:** Supabase (PostgreSQL + Row-Level Security)
- **Auth:** Anonymous default, Google OAuth, email/password upgrade
- **Astronomy:** `astronomy-engine` v2.1.19 (Placidus houses, Chiron, Lilith, aspects)
- **Storage:** localStorage-first with optional cloud sync
- **PWA:** custom service worker + scheduled reminders
- **Testing:** Vitest 4

---

## Appendix — Naming Notes

- **Name:** *Hygiea*. The Christic balancing principle is present as **meaning**, never as
  name or scripture.
- **Tagline candidates:** "Spiritual hygiene." / "Keep the inner life clear." / "The daily
  practice of the upright middle."
