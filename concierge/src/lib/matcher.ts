import { seedAnswers, InsiderMove } from "./answers";

export interface MatchResult {
  answer: InsiderMove | null;
  confidence: "high" | "medium" | "low" | "none";
  clarifyingQuestion?: string;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string): string[] {
  return normalizeText(text).split(" ").filter(Boolean);
}

function calculateKeywordScore(
  queryTokens: string[],
  keywords: string[]
): number {
  let score = 0;
  const normalizedKeywords = keywords.map((k) => normalizeText(k));

  for (const keyword of normalizedKeywords) {
    const keywordTokens = keyword.split(" ");

    if (keywordTokens.length === 1) {
      if (queryTokens.includes(keyword)) {
        score += 1;
      }
    } else {
      const queryText = queryTokens.join(" ");
      if (queryText.includes(keyword)) {
        score += keywordTokens.length * 1.5;
      }
    }
  }

  return score;
}

function calculateIntentScore(
  queryText: string,
  intentPatterns: string[]
): number {
  let score = 0;
  const normalizedQuery = normalizeText(queryText);

  for (const pattern of intentPatterns) {
    const normalizedPattern = normalizeText(pattern);
    const patternTokens = normalizedPattern.split(" ");
    let matchCount = 0;

    for (const token of patternTokens) {
      if (normalizedQuery.includes(token)) {
        matchCount++;
      }
    }

    const matchRatio = matchCount / patternTokens.length;

    if (matchRatio >= 0.7) {
      score += matchRatio * 3;
    } else if (matchRatio >= 0.5) {
      score += matchRatio * 1.5;
    }
  }

  return score;
}

export function matchQuery(query: string): MatchResult {
  if (!query || query.trim().length < 3) {
    return {
      answer: null,
      confidence: "none",
      clarifyingQuestion:
        "Can you tell me more about what's going on? Type it like you'd tell a friend.",
    };
  }

  const queryTokens = tokenize(query);
  const queryText = query;

  const scoredAnswers = seedAnswers.map((answer) => {
    const keywordScore = calculateKeywordScore(queryTokens, answer.keywords);
    const intentScore = calculateIntentScore(queryText, answer.intentPatterns);
    const totalScore = keywordScore + intentScore;

    return {
      answer,
      keywordScore,
      intentScore,
      totalScore,
    };
  });

  scoredAnswers.sort((a, b) => b.totalScore - a.totalScore);

  const topMatch = scoredAnswers[0];
  const secondMatch = scoredAnswers[1];

  if (topMatch.totalScore < 1) {
    return {
      answer: null,
      confidence: "none",
      clarifyingQuestion:
        "I'm not sure I understand the situation yet. Can you describe what's happening right now with your parent? For example: 'Mom keeps asking the same question' or 'Dad is coming home from the hospital Friday.'",
    };
  }

  if (topMatch.totalScore < 2) {
    const possibleTopics = scoredAnswers
      .filter((s) => s.totalScore > 0.5)
      .slice(0, 3)
      .map((s) => {
        if (s.answer.id === "rental-agreement")
          return "a parent moving in with you";
        if (s.answer.id === "hospital-discharge") return "hospital discharge";
        if (s.answer.id === "uti-confusion") return "sudden confusion";
        if (s.answer.id === "repeated-questions") return "repetitive questions";
        if (s.answer.id === "big-hospital-bill") return "a medical bill";
        if (s.answer.id === "sibling-not-helping") return "siblings not helping";
        if (s.answer.id === "remote-monitoring") return "monitoring from afar";
        if (s.answer.id === "poa-capacity") return "legal paperwork";
        if (s.answer.id === "hospice-at-home") return "hospice care";
        if (s.answer.id === "handoff-two-days") return "taking a break";
        if (s.answer.id === "medicaid-waiver-waitlist") return "Medicaid waitlists";
        if (s.answer.id === "caregiver-paid") return "getting paid as caregiver";
        return s.answer.id;
      });

    if (possibleTopics.length > 0) {
      return {
        answer: topMatch.answer,
        confidence: "low",
        clarifyingQuestion: `Are you asking about ${possibleTopics[0]}? If not, can you give me a bit more detail?`,
      };
    }

    return {
      answer: topMatch.answer,
      confidence: "low",
      clarifyingQuestion:
        "I want to make sure I give you the right move. Can you tell me a bit more about the situation?",
    };
  }

  if (topMatch.totalScore >= 4) {
    return {
      answer: topMatch.answer,
      confidence: "high",
    };
  }

  if (
    secondMatch &&
    secondMatch.totalScore > 0 &&
    topMatch.totalScore / secondMatch.totalScore < 1.5
  ) {
    return {
      answer: topMatch.answer,
      confidence: "medium",
    };
  }

  return {
    answer: topMatch.answer,
    confidence: "medium",
  };
}

export function getAllAnswerIds(): string[] {
  return seedAnswers.map((a) => a.id);
}

export function getAnswerById(id: string): InsiderMove | undefined {
  return seedAnswers.find((a) => a.id === id);
}
