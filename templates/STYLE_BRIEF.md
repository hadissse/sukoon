# Style Brief — Sukoon Astrology Content (Arabic)

This brief governs *every* placement entry filled into `placements_master.csv` (and its chunks). Read it carefully before writing a single row.

---

## What you are writing

For each row in your assigned chunk, fill three Arabic-language columns:

1. **`traditional_meaning_ar`** — the established, tradition-anchored reading of this placement, drawn from the reference library (see below). ~70–100 words.
2. **`evolutionary_meaning_ar`** — the soul / karmic / developmental layer of this placement, the depth that goes underneath the surface description. ~80–120 words.
3. **`developmental_task_ar`** — the concrete, lived-experience task the placement asks of the person: what is being called to develop, what danger to avoid. ~70–100 words.

**Total Arabic content per row: 220–320 words.** Do not exceed 350. Do not go below 200.

Leave `key_references` with 1–3 short bibliographic citations from the list below (just author names and book titles, no quotes). Mark `status` as `"filled"`.

---

## Tone of voice — the most important constraint

The reading sits on a serious philosophical-spiritual framework, but **the surface vocabulary stays accessible to an educated, non-initiated Arabic reader.**

### Forbidden vocabulary

- **Never use the word "Anthroposophy"** (الأنثروبوصوفيا / علم الإنسان الروحي) or any cognate.
- **Never name Rudolf Steiner** or reference him directly. He is the *underlying* framework, never named.
- **No Christological terminology.** Do not write "المسيح" (Christ), "the Christ Impulse," "Christ-event," "the second coming," etc. Even template 44 ("Christ Impulse in the chart") must be rewritten as "قوس الفداء" or "الجرح بوصفه قوس تحول" — the *redemption arc / wound-as-transformation* — without naming Christ.
- **No naming of esoteric ranks** like Archai, Archangeloi, Exusiai, Kyriotetes, Dynamis, etc. If hierarchical forces are implied, use neutral phrases like "القوى الكونية التي تعمل من خلال هذا الكوكب" or "المرتبة الروحية المرتبطة بهذا المجال."
- **No Steinerian technical jargon** untranslated. Phrases like "Consciousness Soul age," "Luciferic / Ahrimanic," "etheric body," "astral body" need *accessible* Arabic equivalents:
  - "الجسم الإيثيري" → "الجسم الحيوي" or "طبقة الحياة"
  - "الجسم النجمي" → "طبقة النفس" or "الجسم الشعوري"
  - "اللوسيفيري / الأهرمانيكي" → "خطر التضخم الوهمي / خطر التصلب المادي" (the two distortions: inflation-illusion vs. rigidification-materialism)
  - "Consciousness Soul" → "الأنا الواعية الحرة"

### Required register

- **Rigorous, philosophically grounded, not therapeutic.** No "you will be happy when…" or "this means good luck in…"
- **Three layers always present**: (1) tradition-rooted reading, (2) soul/evolutionary depth, (3) free moral task. The reading should not collapse into one of these alone.
- **The triple experience** — when describing the developmental task, name the two distortions and the living balance:
  - *الخطر المتصلب* (the rigid distortion — materialization, denial, habit)
  - *الخطر الوهمي* (the inflated distortion — illusion, escape, megalomania)
  - *التوازن الحي* (the living balance — the free I acting through this force)
- **Free will is the only verifier.** Each entry should respect that the reader's own intuition is the final judge — never deterministic.
- **No em-dashes (—) in client-facing prose.** Use regular punctuation.
- **No "this is not X, but rather Y" formulations.** State directly what something is.
- **Do not name authors in the content itself** — the references live in the `key_references` column only.

### Sentence style

- Direct, declarative Arabic. Modern Standard Arabic, not classical.
- Avoid filler ("من المعروف أن…", "كما يُقال…").
- Do not use bullet lists inside the three content fields — write flowing prose.
- Each paragraph: 3–6 sentences.

---

## Research resources (use these for depth, but don't cite verbatim)

A markdown research library is available at:
`/Users/hadi/Downloads/sukoon-tmp/templates/RESOURCES/notebooklm-sources-2026-05-27/`

It contains ~63 .md files covering: classical astrology, Reinhart on Chiron, Greene on Saturn and outer planets, midpoint and aspect work, asteroid astrology, the 12 senses, planetary spheres, biographical 7-year cycles, medical astrology constitutional mapping, and the underlying framework sources. **Grep this folder for keywords matching your row's topic (e.g., `grep -l "Chiron" RESOURCES/notebooklm-sources-2026-05-27/*.md` or search for sign/planet names) to absorb depth and tone before writing.** Use them as background research, not as direct quotation sources — the cited references in `key_references` must still come from the published astrology book library below.

When the resource is a Steiner-archive file or anthroposophical secondary source, **read it for framework only**. Strip all of: the name Steiner, the word Anthroposophy, named hierarchies, Christological terminology. The depth survives; the vocabulary becomes accessible Arabic.

---

## Reference library (cite 1–3 per row)

Hellenistic / Traditional:
- Chris Brennan — *Hellenistic Astrology: The Study of Fate and Fortune*
- William Lilly — *Christian Astrology*
- J. Lee Lehman — *The Book of Rulerships*, *Classical Astrology for Modern Living*
- Benjamin N. Dykes — *Traditional Astrology for Today*
- James H. Holden — *History of Horoscopic Astrology*
- Nicholas Campion — *A History of Western Astrology Vol. I*

Modern psychological / depth:
- Dane Rudhyar — *Astrology of Personality*
- Liz Greene — *Saturn: A New Look at an Old Devil*
- Stephen Arroyo — *Astrology, Karma & Transformation*, *Interpretation Handbook*
- Robert Hand — *Horoscope Symbols*
- Sue Tompkins — *Aspects in Astrology*, *The Contemporary Astrologer's Handbook*
- Noel Tyl — *Synthesis & Counseling in Astrology*, *Solar Arcs*, *Guide to Astrological Consultations*
- Margaret Hone — *Textbook of Astrology*
- Isabel Hickey — *Astrology: A Cosmic Science*

Evolutionary / Soul:
- Steven Forrest — *The Inner Sky*
- Demetra George — *Astrology for Yourself*
- Jeff Green / Pluto-school references where relevant
- Melanie Reinhart — *Chiron and the Healing Journey* (essential for Chiron rows)
- Dane Rudhyar (also evolutionary)

Specialty:
- Bil Tierney — *All Around the Zodiac*, *Dynamics of Aspect Analysis* (for aspects and patterns)
- Alan Oken — *Complete Astrology*
- Glenn Perry — *An Introduction to AstroPsychology*
- John Addey — *Harmonics in Astrology*
- Reinhold Ebertin — *Combination of Stellar Influences* (for synastry, midpoints)
- Dennis Elwell — *The Cosmic Loom*
- Madeline Gerwick-Brodeur — *Complete Idiot's Guide to Astrology*
- Rae Orion — *Astrology for Dummies*
- David Railey — *The Soul Purpose*
- Rafael Nasser — *Under One Sky*
- Basil Fearrington & Noel Tyl — *The New Way to Learn Astrology*

Select references that genuinely apply to the row's topic. Don't paste the same three across every row.

---

## Format of your output

You will write back the same chunk CSV file with the three content columns and references filled. Keep all other columns unchanged. UTF-8 with proper Arabic. Use the same column order as the input.

Final check before submitting:
- [ ] No mention of Anthroposophy, Steiner, Christ
- [ ] Each row 220–320 words across the three content fields
- [ ] Triple-experience framing present in developmental_task_ar
- [ ] References vary appropriately by topic
- [ ] Modern, accessible Arabic — not florid, not stilted
