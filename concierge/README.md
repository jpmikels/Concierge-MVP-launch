# The Concierge

The insider move for adult children caring for aging parents. Not a directory—the actual move, then a vetted handoff to the right resource.

## What This Is

A plain-language tool that answers the question you'd ask a friend who happens to know eldercare. You describe what's happening; it tells you what to do, what to say, who to say it to—then hands you off to a vetted Utah resource.

This is **not**:
- A directory of agencies
- A medical/legal/financial advisor
- A chatbot that makes things up
- A wellness brand with warm platitudes

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Type a question like you'd tell a friend:
- "Mom just moved in with us. What do I do first?"
- "The hospital is sending Dad home Friday. Is that it?"
- "She keeps asking the same question every ten minutes."

Get the move—the insider advice first, then vetted resources to call.

## How It Works

### The Seed Library

The app includes 12 curated insider answers covering common situations:

1. **Parent moving in** — The rental agreement move (Utah-specific)
2. **Hospital discharge** — What to ask before leaving
3. **Sudden confusion** — Check for UTI first
4. **Repetitive questions** — The whiteboard solution
5. **Large medical bill** — What you actually owe
6. **Sibling not helping** — The family meeting rule
7. **Remote monitoring** — The Alexa dot setup
8. **Power of Attorney** — Before capacity is gone
9. **Hospice at home** — Medicare pays for this
10. **Needing a break** — The handoff packet
11. **Medicaid waiver waitlist** — Get on it now
12. **Getting paid as caregiver** — Programs that exist

Each answer includes structured fields:
- **The Move** — What to do (1-3 paragraphs)
- **What to Say** — Exact words when applicable
- **Who to Talk To** — Specific person/role
- **Timing & Deadline** — What happens if you wait
- **Why This Works** — One plain sentence
- **Who to Call Next** — Vetted referrals (see below)
- **Attribution** — Source and review status

### Vetted Referrals

Each move links to 1-3 curated referrals—real Utah institutions and verified paths to help:

- **Utah State Bar Lawyer Referral Service** — For POA, estate planning
- **Utah Division of Aging and Adult Services (DAAS)** — Central aging services
- **Utah Area Agency on Aging** — Local navigation help
- **Medicare Hospice Compare** — Official hospice quality tool
- **Dollar For / RIP Medical Debt** — Medical debt nonprofits
- **VA Aid & Attendance** — Veterans caregiver benefits
- **Utah Caregiver Support Program** — Respite and support
- And more...

Referrals include: why they're trusted, how to reach them, Utah-specific notes, and review status.

### The Matcher

The v1 matcher uses keyword and intent matching with stemming and synonym expansion:
- Extracts and stems keywords from your question
- Expands queries with synonyms (mom/mother, confused/confusion, etc.)
- Compares against each answer's keyword list and intent patterns
- Scores matches and returns the best fit with a confidence level

For low-confidence matches, it shows the best guess with a clarifying question. Only truly empty/nonsense queries show the "no match" screen with example chips to recover.

**Run matcher tests:**
```bash
npm run test:matcher
```

### Optional LLM Enhancement

If you set an OpenAI API key, the matcher upgrades:
- Better intent classification
- Personalized rephrasing of the curated answer to your situation
- Never invents facts—only personalizes existing content

```bash
# In your environment or .env.local
NEXT_PUBLIC_OPENAI_API_KEY=sk-...
NEXT_PUBLIC_OPENAI_MODEL=gpt-4o-mini  # optional, defaults to gpt-4o-mini
```

The app works fine without an API key—the keyword matcher handles the core use cases.

### Mom's File (Local Storage)

When you get advice that helps, save it. The app builds a family care reference in your browser's localStorage:
- Click "Save this to Mom's file" after viewing a move
- Access saved records from the header link
- Copy all records as text to share with siblings
- Data stays on your device—nothing sent to servers

## Adding New Answers

Answers live in `src/lib/answers.ts`. Each answer is a TypeScript object:

```typescript
{
  id: "unique-id",
  keywords: ["keyword1", "keyword2", "phrase with spaces"],
  intentPatterns: [
    "my mom just...",
    "what do I do when...",
  ],
  theMove: "The actual advice. Be specific.\n\nSecond paragraph if needed.",
  whatToSay: '"Exact words in quotes" or null if not applicable',
  whomToSayItTo: "The specific person or role",
  orderAndDeadline: "When to do this and what happens if you wait",
  whyItWorks: "One sentence explaining the mechanism",
  attribution: "Source note—not medical/legal/financial advice where relevant",
  reviewStatus: "verified" | "needs_review",
  referralIds: ["utah-state-bar-elder-law", "utah-aaa"],  // Link to referrals
}
```

### Guidelines for New Answers

1. **Be specific.** "Call the patient advocate" beats "reach out to the hospital."
2. **No platitudes.** If a stranger at a funeral could say it, cut it.
3. **Utah-first** for state-specific content (this can be expanded later).
4. **Mark review status** honestly—anything legal/financial/medical defaults to `needs_review`.
5. **Keywords matter.** Include both formal terms and how people actually talk ("POA" and "power of attorney").
6. **Link referrals.** Every answer should have at least one referralId.

## Adding New Referrals

Referrals live in `src/lib/referrals.ts`. Each referral is a TypeScript object:

```typescript
{
  id: "unique-id",
  category: "elder_law" | "hospice" | "benefits" | "hospital_advocate" | 
            "home_health" | "respite" | "medical_debt" | "aging_services" | 
            "veterans" | "medical_alert" | "other",
  name: "Organization or Service Name",
  whyTrusted: "One blunt sentence—why this is vetted, how we know.",
  howToReach: "Phone, URL, or specific instruction (e.g. 'ask discharge planner for X')",
  utahNotes: "Optional state-specific details",
  reviewStatus: "verified" | "needs_review",
  networkReady: true | false,  // true = candidate for future partner network
}
```

### Guidelines for New Referrals

1. **Use real public institutions.** Utah State Bar, DAAS, Medicare.gov, etc.
2. **No fake private practices.** If you don't have a verified attorney, use "Utah State Bar Find a Lawyer" path.
3. **Explain why trusted.** "State agency," "federally funded," "nonprofit that has eliminated $X in debt."
4. **Be specific on how to reach.** Phone number, URL, or clear instruction.
5. **Mark review status.** If you haven't verified the contact info recently, use `needs_review`.

## Project Structure

```
src/
├── app/
│   ├── page.tsx        # Main UI
│   ├── layout.tsx      # App shell
│   └── globals.css     # Tailwind + brand tokens
├── components/
│   ├── AskBox.tsx      # Question input with example chips
│   ├── TheMoveDisplay.tsx  # Answer + referrals display
│   ├── NoMatch.tsx     # Low/no confidence UI with recovery
│   └── FamilyRecordView.tsx  # Saved records modal
└── lib/
    ├── answers.ts      # Seed answer library
    ├── referrals.ts    # Vetted referral library
    ├── examples.ts     # Example questions for UI chips
    ├── matcher.ts      # Keyword/intent matching with stemming
    ├── matcher.test.ts # Automated matcher tests
    ├── llm.ts          # Optional OpenAI integration
    └── storage.ts      # localStorage utilities
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_OPENAI_API_KEY` | No | OpenAI API key for enhanced matching |
| `NEXT_PUBLIC_OPENAI_MODEL` | No | Model to use (default: `gpt-4o-mini`) |

## Disclaimers

- **Not medical, legal, or financial advice.** This tool provides general information. For decisions about health, law, or money, consult a licensed professional.
- **Utah-oriented sample content.** State programs and rules vary.
- **Answers marked "needs review"** have not been verified by a professional in that domain.
- **Referrals are informational.** Verify contact info before calling.

## License

MIT

## Brand

See [brand/BRAND-KIT.md](brand/BRAND-KIT.md) for color tokens, voice guidelines, and UI principles.

The brand assets are:
- `brand/BRAND-KIT.md` — Source of truth for voice, color, type, UI rules
- `brand/tokens.css` — CSS custom properties
- `public/brand/concierge-mark.png` — Doorway mark (deep spruce on paper)
