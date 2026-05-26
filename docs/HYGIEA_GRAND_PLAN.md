# HYGIEA — Grand Development Plan
### *From A to Z: architecture, content, build phases, launch*

This document is the engineering and product roadmap. The philosophical and conceptual
foundation lives in `HYGIEA_CONCEPT.md`. This plan assumes that document is settled
and translates it into concrete, sequenced, deliverable work.

---

## 0. Governing Principles (Non-Negotiable)

These constraints govern every technical and product decision. If a proposed feature
violates one, the feature changes — the constraint does not.

1. **Heart-thinking rule.** The Rückschau, the verse work, the six exercises, all
   interpretations, and all moral guidance are human-authored, forever. The AI synthesis
   layer may only produce the daily/weekly orientation envelope.
2. **Local-first sovereignty.** User data lives on-device first. Cloud sync is opt-in and
   additive. The app works fully offline.
3. **No infinite scroll, no streaks, no hooks.** Every session has a natural end. The app
   invites closure.
4. **Rhythm over notification.** Notifications fire at diurnal / seasonal thresholds only.
5. **The Threshold.** A deliberate entry experience precedes all content — one slow fade,
   one breath, before anything else appears.
6. **Authored spine.** The Calendar of the Soul, Foundation Stone, six exercises, and
   library content are Hadi's voice. The LLM is a loom, not a weaver.

---

## 1. Tech Stack (Inherited + Extensions)

### Inherited from Sukoon (keep as-is)
| Layer | Choice |
|---|---|
| Framework | Next.js 16.2.6 (App Router), React 19, TypeScript 5 |
| Styling | Tailwind CSS 4, design tokens in `src/theme/tokens.ts` |
| Database & auth | Supabase (PostgreSQL + RLS) |
| Astronomy | `astronomy-engine` v2.1.19 |
| Storage | localStorage-first + optional Supabase sync |
| PWA | Custom service worker + scheduled reminders |
| Testing | Vitest 4 |
| Geocoding | OpenCage / Open-Meteo (via Supabase edge function) |

### New dependencies
| Package | Purpose |
|---|---|
| `@anthropic-ai/sdk` | AI orientation envelope (hybrid layer) |
| `next-intl` or custom i18n | English + future multilingual support |
| `framer-motion` | Breath-paced transitions (or CSS-only if bundle matters) |

### Design tokens (new / changed)
```typescript
// src/theme/tokens.ts additions
colors: {
  cream:     '#F5F2EA',   // base (inherited)
  ink:       '#1C1917',   // primary text
  cosmicBlue:'#1E3A5F',   // accent
  ironRed:   '#8B2E2E',   // Michaelmas season only
  goldSoft:  '#C9A84C',   // Sun / gold warmth
  silver:    '#A8B4C0',   // Moon
}
typography: {
  prose: 'EB Garamond, Georgia, serif',
  ui:    'Inter, system-ui, sans-serif',
}
```

---

## 2. New Supabase Schema

The following tables are *additive* to Sukoon's existing schema. Nothing is deleted.

```sql
-- Soul Barometer daily reading
CREATE TABLE soul_barometer (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL,
  reading text CHECK (reading IN (
    'hardened_ahrimanic',
    'tilting_ahrimanic',
    'centered',
    'tilting_luciferic',
    'dispersed_luciferic'
  )),
  signals jsonb DEFAULT '{}',  -- contributing factors
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Evening Rückschau (backward review)
CREATE TABLE ruckschau (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL,
  reverse_entries jsonb DEFAULT '[]',  -- [{time, event, quality}]
  witness_note text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Six exercises progress (6-day cycle)
CREATE TABLE exercise_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  week_start date NOT NULL,
  day_index integer CHECK (day_index BETWEEN 0 AND 5),
  exercise_id integer CHECK (exercise_id BETWEEN 1 AND 6),
  completed boolean DEFAULT false,
  reflection text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, week_start, day_index)
);

-- Calendar of the Soul (52 weekly verses)
CREATE TABLE calendar_soul_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  year integer NOT NULL,
  week_number integer CHECK (week_number BETWEEN 1 AND 52),
  read_at timestamptz,
  verse_reflection text,
  UNIQUE(user_id, year, week_number)
);

-- Ninefold constitution cache
CREATE TABLE constitution (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  biographical_phase integer,           -- 1-indexed seven-year phase
  dominant_temperament text,
  ninefold_json jsonb DEFAULT '{}',     -- all nine members annotated
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Goethean observation journal
CREATE TABLE goethean_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL,
  kingdom text CHECK (kingdom IN ('mineral','plant','animal','human')),
  observation text NOT NULL,
  interpretation text,
  created_at timestamptz DEFAULT now()
);

-- Foundation Stone quarterly arc
CREATE TABLE foundation_arc (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  arc_number integer CHECK (arc_number BETWEEN 1 AND 4),
  arc_start date NOT NULL,
  movement_id integer CHECK (movement_id BETWEEN 1 AND 4),
  reflection text,
  completed_at timestamptz,
  UNIQUE(user_id, arc_number)
);

-- AI synthesis log (audit trail, ephemeral by design)
CREATE TABLE ai_synthesis_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL,
  input_context jsonb DEFAULT '{}',    -- what was fed in (no journal text)
  deleted_at timestamptz,              -- user exercised one-tap deletion
  created_at timestamptz DEFAULT now()
);
```

Row-Level Security on all tables: users read/write only their own rows.

---

## 3. Route Architecture

```
src/app/
├── (app)/                         # Authenticated shell (TabBar)
│   ├── today/                     # Today's Hygiene (Morning / Through-day)
│   ├── constitution/              # Ninefold + chart + temperament + biographical phase
│   ├── inner-anatomy/             # Threefold organism, metals/organs, twelve senses
│   ├── rhythms/                   # Cosmic year + biographical seven-year arc + transits
│   ├── calendar/                  # 52 Calendar of the Soul verses
│   ├── library/                   # Esoteric Science authored content
│   ├── goethean/                  # Goethean observation journal
│   ├── foundation/                # Foundation Stone quarterly arc
│   └── settings/                  # Profile, sovereignty, notifications, export
├── threshold/                     # Entry portal (one slow fade)
├── onboarding/                    # Birth data → ninefold constitution wizard
├── evening/                       # The Rückschau
├── michael/                       # Michaelmas seasonal surface (Aug 15 – Nov 11)
├── auth/callback/                 # OAuth redirect
└── page.tsx                       # Root → /threshold or /today
```

### Navigation (TabBar — 5 items)
| Tab | Route | Icon |
|---|---|---|
| Today | `/today` | ○ (circle, a day) |
| Self | `/constitution` | ◈ (ninefold) |
| Practice | `/calendar` | ♦ (verse) |
| Study | `/library` | ≡ (text) |
| Rhythms | `/rhythms` | ⌒ (arc) |

---

## 4. Content Requirements (the biggest lift)

All authored content is Hadi's voice. The AI layer synthesizes — it does not compose these.

| Content | Volume estimate | Format | Status |
|---|---|---|---|
| 52 Calendar of the Soul verses (English) | 52 verses + 52 paired counter-verses | TS constant | To author/translate |
| Six exercise guidance | 6 × ~400 words | TS constant | To author |
| Esoteric Science library | 20–40 articles, ~800 words each | MDX or TS | To author |
| Goethean prompts (4 kingdoms × 12 months) | 48 prompts | TS constant | To author |
| Foundation Stone movements (4 × guidance) | 4 × ~300 words | TS constant | To author |
| English placement interpretations | 144 planet×sign (replaces Arabic placements.ts) | TS constant | To rewrite |
| Ninefold member descriptions (9 × brief) | 9 × ~200 words | TS constant | To author |
| Biographical phase guidance (12+ phases) | 12 × ~300 words | TS constant | To author |
| Soul Barometer micro-copy (5 states × 2) | 10 × ~80 words | TS constant | To author |
| Seasonal copy (4 quadrants × 3 surfaces) | 12 × ~60 words | TS constant | To author |

---

## 5. Phase-by-Phase Roadmap

Weeks are two-week sprints. Total: ~60 weeks (approximately 14 months) for the full build,
~12 weeks for a usable and distinctive MVP.

---

### Phase 0 — Foundation (Weeks 1–4)

*Goal: a running English fork with design system and auth in place.*

| Task | File(s) touched | Notes |
|---|---|---|
| Create new repo `hygiea` (or fork sukoon) | — | Keep full git history |
| Flip `lang="ar" dir="rtl"` → `lang="en" dir="ltr"` | `src/app/layout.tsx` | |
| Replace IBM Plex Arabic with EB Garamond + Inter | `layout.tsx`, `tokens.ts` | Google Fonts |
| Update design tokens (color, typography) | `src/theme/tokens.ts` | See §1 |
| Add `i18n/en.ts` (English strings) | `src/i18n/en.ts` | Translate from `ar.ts` |
| Wire English as default locale | `src/i18n/index.ts` | |
| Apply new schema migrations | `src/lib/schema.sql` | See §2 |
| Update `README.md` | — | |

**Deliverable:** App runs in English with Sukoon's existing features, correct fonts and
colors, all Supabase tables in place.

---

### Phase 1 — The Daily Loop (Weeks 5–12)

*Goal: the three-moment day is alive and distinctive. This is the MVP.*

#### Morning — Orientation (Weeks 5–6)
- `/today` redesigned as threefold surface (morning / through-day / evening strip)
- Morning card: orientation verse (placeholder), one quality of soul
- Verse system stub: `src/content/calendar.ts` (52 slots, initially 'coming soon')
- Soul quality picker: 9 qualities mapped to ninefold members (initially 4 active)

#### The Threshold (Week 7)
- `/threshold` route: one-second breath animation, single phrase, then entry
- Root page redirects to `/threshold` → `/today` on first visit; `/today` on return
- Motion: CSS `opacity` + `scale` transition, 1.2 s, no JS animation library required

#### Soul Barometer (Weeks 8–9)
- 5-state model implemented in `src/lib/barometer.ts`
- Inputs: last Rückschau entry, today's mood/energy log, current transit quality
- Output: one of 5 states + hygiene direction
- Guardian micro-copy wired for outer two states
- `soul_barometer` Supabase table + localStorage cache + sync

#### The Six Exercises Engine (Weeks 10–11)
- `src/content/exercises.ts`: 6 exercise definitions (authored text, placeholder drafts)
- `src/lib/exerciseCycle.ts`: 6-day cycle logic (week_start + day → exercise_id)
- Through-day card on `/today`: today's exercise, guidance text, completion toggle
- `exercise_progress` Supabase table + sync

#### The Rückschau (Week 12)
- `/evening` redesigned as The Rückschau
- Step-through UI: prompt to recall day in reverse (5 steps, ~4 minutes)
- Witness mode: neutral tone prompts, no judgment language
- On completion: Barometer recalculates, feeds tomorrow morning
- `ruckschau` Supabase table + sync

**Deliverable (MVP):** A user can enter Hygiea, cross the Threshold, orient in the
morning, practice one exercise through the day, and close with the Rückschau. The Soul
Barometer reflects the day. Nothing is addictive. The app invites closure.

---

### Phase 2 — The Calendar (Weeks 13–18)

*Goal: the cosmic year breathes through the app.*

#### 52 Verses (Weeks 13–15)
- `src/content/calendar.ts`: 52 verse objects
  ```typescript
  type CalendarVerse = {
    week: number;        // 1–52, Easter-relative
    title: string;
    verse_en: string;
    verse_de: string;    // original German, for reference
    compensating_week: number;  // paired verse (week n ↔ week n+26)
    orientation: string; // one-line guidance
    season: 'spring' | 'summer' | 'autumn' | 'winter';
    pole: 'outbreath' | 'inbreath';
  }
  ```
- `/calendar` route: current week's verse, paired counter-verse, reflection input
- `calendar_soul_log` sync
- Easter calculation added to `cosmicStamp.ts`

#### Cosmic Year Visual Shifts (Weeks 16–17)
- `src/lib/cosmicYear.ts`: given today's date → season quadrant + pole
- Design tokens swap seasonally via CSS variables:
  - Spring/Easter: fresh cream, light gold
  - St John's: open sky blue, maximum light
  - Michaelmas: iron-red accent activates, weight increases
  - Christmas / Holy Nights: deepest cream, coal blue, warmth
- `/year` route: visual arc of the year, where today sits, upcoming threshold dates

#### Seasonal Copy System (Week 18)
- `src/content/seasons.ts`: 4 quadrants × 3 surfaces (morning, through-day, evening)
- Morning orientation verse pulls seasonal flavor
- `/michael` route activates Aug 15 – Nov 11 with Michaelic copy and iron-red palette

**Deliverable:** The app looks and feels different in September than in June. The Calendar
of the Soul is usable. The cosmic year breathing is visible.

---

### Phase 3 — Constitution (Weeks 19–26)

*Goal: the ninefold human being is the onboarding model. Users know their constitution.*

#### Ninefold Trait Engine (Weeks 19–21)
- `src/lib/traitEngine.ts` extended:
  - `calculateTemperament(chart)` → dominant temperament (maps elements → temperament)
  - `calculateBiographicalPhase(birthDate)` → current seven-year phase (1-indexed)
  - `calculateNinefoldAnnotations(chart, temperament, phase)` → ninefold JSON
- `src/content/constitution.ts`: authored descriptions for each member × activation level
- `src/content/biography.ts`: authored guidance for 12+ seven-year phases

#### Onboarding Revision (Weeks 22–23)
- After birth data entry, onboarding now produces:
  1. Chart (existing)
  2. Temperament (new)
  3. Biographical phase (new)
  4. Ninefold brief (new — shows first 4 members actively, 5–9 latent)
- `constitution` Supabase table seeded on onboarding completion

#### Constitution Route (Weeks 24–25)
- `/constitution` replaces `/self`:
  - Tab 1: Natal wheel (ZoomableWheel, unchanged from Sukoon)
  - Tab 2: Ninefold members (animated expand/collapse per member)
  - Tab 3: Temperament (elemental balance + temperament reading)
  - Tab 4: Biographical phase (arc visualization, current phase highlighted)
- `/inner-anatomy` replaces `/traits`:
  - Threefold organism diagram (head / heart / limb)
  - Planetary metals and organs (deepened from Sukoon)
  - Twelve senses (replacing HD centres)

#### Personalization Integration (Week 26)
- Soul Barometer now reads constitution as a standing input
- Morning orientation pulls temperament flavor
- Goethean kingdom rotation aligns with current biographical phase

**Deliverable:** Every user has a ninefold constitutional reading. Onboarding is richer.
The app's personalization is visibly deeper than any competitor.

---

### Phase 4 — Content Library (Weeks 27–38)

*Goal: the authored body of knowledge is in place. This is the longest phase.*

#### English Placements (Weeks 27–31)
- Rewrite `src/content/placements.ts`: 144 planet×sign combinations in English
- Tone: sober, warm, phenomenological — not predictive, not fluffy
- Each placement: observation, quality of soul, shadow, practice (same 4-part structure
  as Arabic Sukoon)
- This is the single largest content task: ~4000 lines, Hadi's voice throughout

#### Six Exercise Full Guidance (Weeks 32–33)
- Flesh out `src/content/exercises.ts` with complete authored text per exercise:
  - The inner experience to cultivate
  - Common obstacles (the Ahrimanic and Luciferic failure modes per exercise)
  - A 5-minute practice prompt
  - A one-sentence compass for the day

#### Esoteric Science Library (Weeks 34–36)
- `/library` route: 20–40 authored articles
- Topics: the ninefold human being; the threefold organism; the temperaments; the
  planetary metals; the Calendar of the Soul; the Guardian of the Threshold; Goethean
  science; the Michael Age; the Foundation Stone; the twelve senses; biographical
  biography; Kabbalah and the middle pillar; Hermetic equilibrium; alchemy and the soul
- Format: MDX (rich text + embedded components) or long-form TS constants
- No AI, no generation — editorial quality throughout

#### Goethean Observation Mode (Weeks 37–38)
- `/goethean` route: weekly kingdom + monthly prompt rotation
- `src/content/goethean.ts`: 48 prompts (4 kingdoms × 12 months)
- Two-step UI: (1) exact sensory description — what do you *see*, hear, smell, touch?
  (2) only then: what arises? (never: what does this mean?)
- `goethean_entries` Supabase table + sync

**Deliverable:** The library is the deepest free esoteric resource in English on the web
for these topics. The Goethean mode is the unique counter-feed mechanic.

---

### Phase 5 — Advanced Practices (Weeks 39–46)

*Goal: the deeper practices are available for those ready for them.*

#### Foundation Stone Arc (Weeks 39–41)
- `/foundation` route: optional entry, clearly marked as an advanced invitation
- Four 90-day cycles, one per Foundation Stone movement
- Each cycle: the movement text (authored English), a daily contemplation prompt, a
  quarterly reflection at close
- `foundation_arc` Supabase table + sync
- User can be in at most one arc at a time; completion of one unlocks the next

#### Twelve Senses Integration (Weeks 42–43)
- Extend `/inner-anatomy` with the twelve senses (replacing HD centres entirely)
- `src/content/senses.ts`: authored descriptions of all 12 senses
- Each sense mapped to a biographical phase and a temperament emphasis
- Simple quiz to identify the user's most developed and least developed sense

#### Rhythms Route (Weeks 44–45)
- `/rhythms` replaces `/explore`:
  - Cosmic rhythms: current transits (from Sukoon's engine), lunar phase, day ruler
  - Biographical arc: the user's seven-year phases on a life timeline
  - Seasonal arc: the cosmic year breathing (from Phase 2)
  - Great transits: major slow-planet transits with spiritual-science framing

#### Notification System (Week 46)
- Rebuild `src/lib/notifications.ts` as rhythm-aware:
  - Dawn notification: "Your morning threshold is open" (sunrise-relative, not 7:00am)
  - Midday: only if exercise not yet logged — one prompt, never repeated
  - Dusk: "The Rückschau opens in an hour" (sunset-relative)
  - Special: seasonal threshold dates (Easter, St John's, Michaelmas, Holy Nights)
- All notifications opt-in, individually toggleable
- No notification for streaks, achievements, or re-engagement

**Deliverable:** The Foundation Stone is available for committed practitioners. The twelve
senses replace HD centres. The notification system honors cosmic rhythm.

---

### Phase 6 — AI Integration (Weeks 47–52)

*Goal: the hybrid synthesis envelope is live, clearly marked, sovereignty-preserving.*

#### Heart-Thinking Rule Implementation
The rule is the architecture. Before writing code:
1. Audit every screen for authored vs. synthesizable content
2. Lock authored surfaces with a `NEVER_AI` comment at the component boundary
3. The AI synthesis layer is a single isolated service

#### AI Synthesis Service (Weeks 47–49)
```typescript
// src/lib/synthesis.ts
type SynthesisInput = {
  constitution: {
    temperament: string;
    dominantPlanet: string;
    biographical_phase: number;
    nine_fold_active: string[];
  };
  barometer: BarometerReading;
  transits: ActiveTransit[];
  calendar_week: number;
  season_quadrant: 'spring' | 'summer' | 'autumn' | 'winter';
  // NOTE: no journal text, no ruckschau text — never sent to AI
};

type SynthesisOutput = {
  orientation_paragraph: string;  // the envelope
  ai_marker: '◇';                // always present
  deletable: true;               // always true
};
```

- Single Claude API call per day (rate-limited)
- No journal text, no Rückschau text, no personal reflections ever sent
- Response stored only in localStorage; Supabase log stores only the input context hash
- `◇` glyph marks every AI-generated paragraph, always, without exception
- One-tap deletion wipes local storage key and logs `deleted_at` in `ai_synthesis_log`

#### Opt-In Flow (Weeks 50–51)
- AI synthesis is **off by default**
- After 7 days of use, a single clear offer: "A brief daily orientation paragraph can be
  woven from your constitution and today's currents. It reads what is given; it does not
  read your journal. You can delete it at any time."
- Acceptance → `user_preferences.ai_synthesis_enabled = true`
- Can be withdrawn at any time in settings with one tap

#### AI Audit (Week 52)
- Walk every surface: confirm no AI touches Rückschau, exercises, verses, interpretations
- Confirm `◇` appears on every synthesized paragraph
- Confirm deletion actually wipes the content
- Confirm no journal or reflection text is included in any API call

**Deliverable:** The orientation envelope is live for opt-in users. The heart-thinking
rule is enforced architecturally, not just by convention.

---

### Phase 7 — Polish & Anti-Design (Weeks 53–58)

*Goal: the product practices what it preaches at every pixel.*

#### Anti-Addiction Audit (Weeks 53–54)
- Walk every screen and answer: does this element create a hook?
- Remove or redesign anything that does:
  - No streak counters (replace with "practice rhythm" — a neutral visualization)
  - No badges, no points, no leaderboards
  - No "you haven't opened the app in X days" notifications
  - No empty state screens that create anxiety
- Replace with: "The practice is here when you are."

#### Motion & Sound (Weeks 55–56)
- All transitions: breath-paced (400–800 ms, ease-in-out)
- Threshold fade: 1.2 s
- Rückschau step progression: 600 ms
- Calendar verse reveal: 500 ms
- Sound (off by default): single bowl tone at threshold, evening, week-change
- Sound system: `src/lib/audio.ts` — Web Audio API, no external library, < 10 kb

#### Typography Refinement (Week 57)
- EB Garamond for all prose (verses, library, exercises, placements)
- Inter for all UI chrome (navigation, buttons, labels)
- No mixing within a surface
- Line height: 1.7 for prose, 1.3 for UI
- Measure (line length): 60–70 characters for all prose surfaces

#### Sovereignty & Export (Week 58)
- Settings: "Your data belongs to you"
- Export: full JSON dump of all local data (no cloud call required)
- Delete: wipe all cloud data, keep local if user wants
- Onboarding copy updated: "Everything you write is inscribed here, and only here, until
  you choose to sync. Think of it as a technical mirror of the day you have already lived."

**Deliverable:** The app is anti-addictive by design. Motion, sound, and typography are
coherent. Sovereignty is operational.

---

### Phase 8 — Arabic Back-Port (Sukoon v2) (Weeks 59+)

*Goal: Sukoon receives the spiritual-science depth Hygiea developed in English.*

| Task | Notes |
|---|---|
| Translate Calendar of the Soul into Arabic (52 verses) | Hadi's voice, literary Arabic |
| Translate Foundation Stone into Arabic | The most demanding translation task |
| Translate six exercise guidance into Arabic | |
| Translate Goethean prompts into Arabic | |
| Port ninefold model into Sukoon's `traitEngine.ts` | |
| Port biographical phase engine into Sukoon | |
| Port Soul Barometer (5-state) into Sukoon | |
| Add `/calendar` route to Sukoon (RTL) | |
| Add `/foundation` route to Sukoon (RTL) | |
| Back-port Guardian micro-copy into Arabic | |

This is the institutional work: the only path through which these practices enter the
Arabic-language esoteric literature with rigor.

---

## 6. AI Integration — Full Specification

### What the AI does (only this)
Given a `SynthesisInput` (constitution, barometer state, active transits, calendar week,
season), Claude produces a single paragraph (80–120 words) that orients the user for the
day. This paragraph:
- Is written in the second person, warm and sober
- References only the given inputs, not the user's journal
- Never predicts, never prescribes, never morally counsels
- Ends with an open question or a simple gesture, not an instruction

### What the AI never does
- Composes verses, exercises, or library content
- Reads or references the user's journal, Rückschau, or reflections
- Produces anything that appears without the `◇` marker
- Produces anything that cannot be deleted in one tap

### Prompt architecture
```
System: You are the orientation voice of Hygiea, a spiritual-hygiene app. You write one
paragraph per day based on the user's esoteric constitution, their soul barometer reading,
active planetary transits, the current Calendar of the Soul verse, and the season. You do
not have access to the user's journal or reflections, and you do not reference them. Your
tone is warm, sober, and unhurried — never mystical-salesy, never therapeutic, never
prescriptive. You write as a thoughtful friend who knows the cosmic landscape, not as an
oracle. End with an open gesture, not an instruction.

User: [SynthesisInput serialized as natural language]
```

### Privacy constraints
- No journal text, no reflection text, no Rückschau text ever leaves the device
- The API call contains only: temperament, biographical phase, barometer state, transit
  names and qualities, calendar week number, season
- The synthesis is stored in localStorage only
- Supabase logs only the input context hash (not the content) and the `deleted_at`
  timestamp if the user deletes

### Rate limiting
- One synthesis per day per user
- If the user deletes the day's synthesis, no regeneration until the following day
- This is a design choice, not a cost choice: it enforces the rhythm

---

## 7. Testing Strategy

### Unit tests (Vitest)
- `chartCalculator.ts` — all planet positions against known ephemeris data (inherited)
- `barometer.ts` — all 5 states from known inputs, edge cases (new)
- `exerciseCycle.ts` — correct exercise for any date (new)
- `cosmicYear.ts` — correct season quadrant and pole for any date (new)
- `traitEngine.ts` extensions — temperament, biographical phase, ninefold (extended)
- Calendar of the Soul week calculation — Easter-relative, cross-year (new)

### Integration tests
- Onboarding flow: birth data → constitution → all tables populated
- Rückschau → Barometer recalculation
- Exercise cycle: 6 days completes a round, 7th day is rest
- AI synthesis: mock Claude response, confirm `◇` glyph present, confirm deletion

### Manual / design tests (no automated equivalent)
- **Threshold:** does it feel like crossing? Time it at 1.2 s. Does the breath happen?
- **Closure:** does the app feel finished after the Rückschau? Or does it pull you back?
- **Anti-addiction audit:** open the app 10 times in one day — does it resist this?
- **Seasonal shift:** set system date to Sep 29 — does the Michaelmas palette activate?
- **Sound:** is the bowl tone at the right weight? Not intrusive, not inaudible?
- **Typography:** print a verse — is it readable? Is it beautiful?

---

## 8. Launch Strategy

### Soft launch (end of Phase 1 — Week 12)
Target: 50–100 practitioners. Direct invite only.
Purpose: validate the daily loop. Is the Rückschau actually practiced? Does the Barometer
feel true, or gaming? Is the Threshold a genuine pause?

### Beta (end of Phase 3 — Week 26)
Target: 500 users. Open waitlist.
Minimum content in place: calendar stubs, six exercises drafted, constitution working.
Feedback focus: is the ninefold model comprehensible to non-Anthroposophists?

### Public launch (end of Phase 5 — Week 46)
Full practice loop, full calendar, library seeded with 10+ articles, Goethean mode live.
Press angle: "The first app designed to resist addiction at the architectural level."

### Sustaining the work
- **Free tier:** daily loop (Threshold, today, Rückschau, barometer), 52 calendar verses
- **Practitioner tier (~$9/month):** Foundation Stone arc, full library, Goethean mode,
  biographical phase depth, AI synthesis envelope (opt-in)
- **Consultation:** link to one-on-one sessions (Sukoon's existing consultation URL model)
- **Arabic Sukoon v2:** separate subscription, cross-markets between the two

---

## 9. The One Remaining Decision

The heart-thinking rule settles the AI question. The one decision remaining before
scaffolding Phase 1 begins:

> **Does Hygiea launch as a standalone new repository, or as a branch of the Sukoon
> monorepo?**

- **Standalone:** cleaner separation, independent deployment, independent branding.
  Downside: shared improvements (astronomy math, auth, sync) must be cherry-picked or
  duplicated.
- **Monorepo branch:** shared improvements propagate naturally. Downside: deployment
  complexity, brand separation harder.

Recommendation: **standalone repository**, with a shared `@hygiea/core` package extracted
for the astronomy engine and Supabase client once both apps are mature. For now, fork and
maintain separately — the codebases will diverge significantly in content.

---

## Summary Timeline

| Phase | Weeks | Deliverable |
|---|---|---|
| 0 — Foundation | 1–4 | English fork, design system, schema in place |
| 1 — Daily Loop | 5–12 | **MVP**: Threshold, morning/practice/Rückschau, Barometer |
| 2 — Calendar | 13–18 | 52 verses, cosmic year breathing, seasonal palette |
| 3 — Constitution | 19–26 | Ninefold model, biographical phase, deep personalization |
| 4 — Library | 27–38 | Placements, exercises, library, Goethean mode |
| 5 — Advanced | 39–46 | Foundation Stone, twelve senses, rhythm notifications |
| 6 — AI | 47–52 | Hybrid synthesis envelope, heart-thinking rule enforced |
| 7 — Polish | 53–58 | Anti-addiction audit, motion, sound, sovereignty |
| 8 — Arabic | 59+ | Sukoon v2 with full spiritual-science depth |

**MVP in 12 weeks. Full build in ~14 months. The Arabic institutional work begins at week 59.**
