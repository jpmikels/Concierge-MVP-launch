# The Concierge — Starter Brand Kit (v1)

Working product name: **The Concierge**  
Story frame (not product UI name): The Ones Who Stay  
Audience: Default Daughter — employed adult child coordinating care for an aging parent  
Updated: 19 September 2026

---

## Positioning

**One-liner:** The insider move, then a vetted person who can finish the job.

**Category:** Eldercare decision tool + trusted handoff (not a directory, not a wellness app).

**Enemy:** Scraped agency lists, warm platitudes, “we see you” copy that wastes her ten seconds.

**Promise:** Tell her what to say, to whom, before when — then who to call next that we’ve vetted.

---

## Voice

| Do | Don’t |
|---|---|
| Plain, specific, fast | Soft, therapeutic, spiritual |
| “Write the rental agreement tonight.” | “We’re here on this journey with you.” |
| Funeral-stranger test: if anyone could say it, cut it | Empathy theater |
| Utah when it matters | Generic national fluff |
| She is a daughter / she is coordinating | Lead with “caregiver” identity |

**Tagline (primary):** The insider move, not the list of agencies.  
**Tagline (alt):** What to say. Who to call. Before when.

---

## Name notes

- **The Concierge** = working product name in UI.
- **The Ones Who Stay** = narrative / workshop / book-energy — do not use as app chrome title.
- Future rename should still sound like a tool a daughter would open at 11pm, not a support group.

---

## Color

Calm contrast. Feels like a legal pad on a kitchen table, not a meditation app.

| Token | Hex | Use |
|---|---|---|
| `ink` | `#0F172A` | Primary text, primary buttons |
| `ink-muted` | `#475569` | Secondary text |
| `paper` | `#FAFAF9` | Page background |
| `card` | `#FFFFFF` | Cards / inputs |
| `line` | `#E2E8F0` | Borders, dividers |
| `accent` | `#1D4E4A` | Deep spruce — trust, not “healing green” |
| `accent-soft` | `#E8F0EF` | Soft accent surfaces |
| `warn` | `#92400E` / `#FEF3C7` | Low-confidence / needs-review banners |
| `ok` | `#14532D` / `#DCFCE7` | Verified badges |

Accent is spruce/teal-dark — steady, adult, Utah-outdoors adjacent without outdoor-brand cliché.

---

## Typography

- **UI / body:** System stack first for speed — `ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif`
- **Optional display (headings):** Source Serif 4 or similar for the product title only — one serif moment, then back to sans. If web font is heavy, skip serif and use semibold sans.
- Sizes: title ~28–32 / section labels 11–12 uppercase tracking / body 16–18 / fine print 12

---

## Logo / mark

**Concept:** A simple doorway / keyhole-adjacent mark — “the door she walks through” — geometric, single-color, works at 24px.

Rules:
- One color (ink or accent) on paper
- No hearts, hands, ribbons, soft gradients, script fonts
- Wordmark: “The Concierge” in semibold sans; optional small serif “The”

Files: `mark.svg` / `mark.png` (app icon + header)

---

## UI application principles

1. One column, lots of air, high contrast.
2. Primary CTA = dark ink button, not bright teal candy.
3. “Who to call next” cards use accent-soft left border, not rainbow category colors.
4. Badges: small, typographic — `verified` / `needs review`.
5. Footer disclaimers stay blunt and small — never styled as testimonials.

---

## Sample microcopy

- Empty ask: “What’s going on?”
- Helper: “Type it like you’d tell a friend who happens to know.”
- Submit: “What’s the move?”
- Handoff header: “Who to call next”
- No match: “I need a bit more to go on” (keep — already on-brand)

---

## Out of brand

- Soft lavender / blush “self-care” palettes  
- Stock photos of holding hands  
- “Empowering caregivers everywhere”  
- Chat bubbles as the primary brand metaphor  

---

## Deliverables in this kit

1. This doc (`BRAND-KIT.md`)
2. Color tokens for Tailwind / CSS variables
3. App mark (SVG/PNG)
4. Applied UI on the Concierge Next.js app (separate PR)
