import { seedAnswers, InsiderMove } from "./answers";
import { matchQuery } from "./matcher";

export interface LLMConfig {
  apiKey: string;
  model?: string;
}

export interface LLMMatchResult {
  answer: InsiderMove | null;
  confidence: "high" | "medium" | "low" | "none";
  personalizedMove?: string;
  clarifyingQuestion?: string;
}

const SYSTEM_PROMPT = `You are an eldercare concierge helping adult children care for aging parents. Your job is to:
1. Understand the user's situation
2. Match it to the most relevant insider advice from the knowledge base
3. Personalize that advice to their specific situation WITHOUT inventing facts

RULES:
- Be direct and specific. No warm platitudes. No "we understand how hard this is."
- Never invent medical, legal, or financial facts. Only rephrase and personalize existing advice.
- If you're not confident about a match, say so clearly.
- The user is likely a daughter coordinating care—she doesn't call herself a "caregiver."
- Focus on what to DO, not what to feel.

The knowledge base covers these situations:
${seedAnswers.map((a) => `- ${a.id}: ${a.keywords.slice(0, 5).join(", ")}`).join("\n")}

When you identify a matching situation, respond with JSON:
{
  "matchedId": "the-answer-id-or-null",
  "confidence": "high|medium|low|none",
  "personalizedMove": "the original move rephrased for their specific situation (only if matchedId is not null)",
  "clarifyingQuestion": "a specific question to ask if confidence is low or none"
}

Only personalize. Never invent new advice, entitlements, or medical/legal information.`;

export async function matchWithLLM(
  question: string,
  config: LLMConfig
): Promise<LLMMatchResult> {
  const fallbackResult = matchQuery(question);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model || "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `User's situation: "${question}"\n\nMatch this to the knowledge base and provide personalized guidance.`,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      console.error("LLM API error:", response.status);
      return {
        answer: fallbackResult.answer,
        confidence: fallbackResult.confidence,
        clarifyingQuestion: fallbackResult.clarifyingQuestion,
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return {
        answer: fallbackResult.answer,
        confidence: fallbackResult.confidence,
        clarifyingQuestion: fallbackResult.clarifyingQuestion,
      };
    }

    const parsed = JSON.parse(content);

    if (
      parsed.matchedId &&
      (parsed.confidence === "high" || parsed.confidence === "medium")
    ) {
      const matchedAnswer = seedAnswers.find((a) => a.id === parsed.matchedId);
      if (matchedAnswer) {
        return {
          answer: matchedAnswer,
          confidence: parsed.confidence,
          personalizedMove: parsed.personalizedMove || undefined,
          clarifyingQuestion: parsed.clarifyingQuestion,
        };
      }
    }

    if (parsed.confidence === "low" || parsed.confidence === "none") {
      return {
        answer: parsed.matchedId
          ? seedAnswers.find((a) => a.id === parsed.matchedId) || null
          : fallbackResult.answer,
        confidence: parsed.confidence,
        clarifyingQuestion:
          parsed.clarifyingQuestion || fallbackResult.clarifyingQuestion,
      };
    }

    return {
      answer: fallbackResult.answer,
      confidence: fallbackResult.confidence,
      clarifyingQuestion: fallbackResult.clarifyingQuestion,
    };
  } catch (error) {
    console.error("LLM matching error:", error);
    return {
      answer: fallbackResult.answer,
      confidence: fallbackResult.confidence,
      clarifyingQuestion: fallbackResult.clarifyingQuestion,
    };
  }
}

export function isLLMConfigured(): boolean {
  return !!(
    typeof process !== "undefined" &&
    process.env?.NEXT_PUBLIC_OPENAI_API_KEY
  );
}

export function getLLMConfig(): LLMConfig | null {
  if (typeof process === "undefined") return null;
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) return null;

  return {
    apiKey,
    model: process.env.NEXT_PUBLIC_OPENAI_MODEL || "gpt-4o-mini",
  };
}
