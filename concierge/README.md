# The Concierge

The insider move for adult children caring for aging parents. Not a directory—the actual move.

## What This Is

A plain-language tool that answers the question you'd ask a friend who happens to know eldercare. You describe what's happening; it tells you what to do, what to say, and who to say it to.

This is **not**:
- A list of agencies
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

Get the move—the insider advice, not a directory listing.

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
- **Attribution** — Source and review status
- **Resource** — Optional supporting link

### The Matcher

The v1 matcher uses keyword and intent matching:
- Extracts keywords from your question
- Compares against each answer's keyword list and intent patterns
- Scores matches and returns the best fit with a confidence level

For low-confidence matches, it asks a clarifying question rather than guessing.

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
  resourcePointer: "Optional URL or resource name, or null",
}
```

### Guidelines for New Answers

1. **Be specific.** "Call the patient advocate" beats "reach out to the hospital."
2. **No platitudes.** If a stranger at a funeral could say it, cut it.
3. **Utah-first** for state-specific content (this can be expanded later).
4. **Mark review status** honestly—anything legal/financial/medical defaults to `needs_review`.
5. **Keywords matter.** Include both formal terms and how people actually talk ("POA" and "power of attorney").

## Project Structure

```
src/
├── app/
│   ├── page.tsx        # Main UI
│   ├── layout.tsx      # App shell
│   └── globals.css     # Tailwind config
├── components/
│   ├── AskBox.tsx      # Question input
│   ├── TheMoveDisplay.tsx  # Answer display
│   ├── NoMatch.tsx     # Low/no confidence UI
│   └── FamilyRecordView.tsx  # Saved records modal
└── lib/
    ├── answers.ts      # Seed answer library (edit this!)
    ├── matcher.ts      # Keyword/intent matching
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

## License

MIT
