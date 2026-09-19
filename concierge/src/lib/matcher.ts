import { seedAnswers, InsiderMove } from "./answers";

export interface MatchResult {
  answer: InsiderMove | null;
  confidence: "high" | "medium" | "low" | "none";
  clarifyingQuestion?: string;
}

const SYNONYMS: Record<string, string[]> = {
  mom: ["mother", "mama", "ma", "mum"],
  mother: ["mom", "mama", "ma", "mum"],
  dad: ["father", "papa", "pa", "pop"],
  father: ["dad", "papa", "pa", "pop"],
  parent: ["mom", "dad", "mother", "father"],
  sibling: ["brother", "sister", "siblings"],
  brother: ["sibling", "bro"],
  sister: ["sibling", "sis"],
  confused: ["confusion", "confuse", "disoriented", "delirium", "delirious"],
  confusion: ["confused", "confuse", "disoriented", "delirium", "delirious"],
  dementia: ["alzheimer", "alzheimers", "memory loss", "cognitive"],
  hospital: ["er", "emergency room", "medical center", "clinic"],
  discharge: ["discharged", "discharging", "released", "releasing", "release", "sent home", "sending home"],
  discharged: ["discharge", "released", "sent home"],
  released: ["discharge", "discharged", "sent home"],
  bill: ["invoice", "statement", "charge", "debt", "owe", "owed", "owing"],
  medical: ["hospital", "doctor", "healthcare"],
  help: ["helping", "helps", "helped", "assist", "support"],
  helping: ["help", "helps", "helped", "assist"],
  ask: ["asking", "asks", "asked", "question", "questions"],
  asking: ["ask", "asks", "asked", "question"],
  question: ["ask", "asking", "questions"],
  repeat: ["repeating", "repeats", "repeated", "repetitive", "again"],
  repeating: ["repeat", "repeats", "repeated", "repetitive"],
  same: ["identical", "exact"],
  move: ["moved", "moving", "moves"],
  moved: ["move", "moving", "moves"],
  moving: ["move", "moved", "moves"],
  live: ["living", "lives", "lived", "stay", "staying"],
  living: ["live", "lives", "lived", "stay", "staying"],
  stay: ["staying", "stayed", "live", "living"],
  staying: ["stay", "stayed", "live", "living"],
  work: ["working", "works", "job", "employed"],
  working: ["work", "works", "job"],
  away: ["gone", "not here", "absent"],
  watch: ["watching", "monitor", "monitoring", "check"],
  monitor: ["monitoring", "watch", "watching", "check"],
  fall: ["falls", "fell", "falling", "fallen"],
  falls: ["fall", "fell", "falling", "fallen"],
  okay: ["ok", "alright", "fine", "safe"],
  hospice: ["end of life", "palliative", "comfort care", "dying"],
  poa: ["power of attorney"],
  attorney: ["lawyer", "legal"],
  legal: ["attorney", "lawyer", "law"],
  paperwork: ["documents", "papers", "forms"],
  documents: ["paperwork", "papers", "forms"],
  break: ["rest", "time off", "vacation", "respite"],
  tired: ["exhausted", "worn out", "burnout", "burnt out"],
  exhausted: ["tired", "worn out", "burnout"],
  paid: ["pay", "payment", "money", "compensated", "compensation"],
  pay: ["paid", "payment", "money"],
  medicaid: ["medicare", "insurance", "benefits", "government"],
  waitlist: ["waiting list", "wait list", "queue"],
  huge: ["big", "large", "massive", "enormous"],
  big: ["huge", "large", "massive"],
  never: ["not", "wont", "doesnt", "dont"],
  wont: ["will not", "wont", "refuses"],
  doesnt: ["does not", "doesnt", "wont"],
  dont: ["do not", "dont"],
  home: ["house", "residence", "place"],
};

const STEM_RULES: Array<[RegExp, string]> = [
  [/ing$/, ""],
  [/ed$/, ""],
  [/s$/, ""],
  [/ly$/, ""],
  [/tion$/, "t"],
  [/ness$/, ""],
  [/ment$/, ""],
  [/able$/, ""],
  [/ible$/, ""],
];

function stem(word: string): string {
  let result = word.toLowerCase();
  for (const [pattern, replacement] of STEM_RULES) {
    if (pattern.test(result) && result.length > 4) {
      const stemmed = result.replace(pattern, replacement);
      if (stemmed.length >= 3) {
        result = stemmed;
        break;
      }
    }
  }
  return result;
}

function expandWithSynonyms(tokens: string[]): Set<string> {
  const expanded = new Set<string>();
  for (const token of tokens) {
    expanded.add(token);
    expanded.add(stem(token));
    const synonyms = SYNONYMS[token] || SYNONYMS[stem(token)];
    if (synonyms) {
      for (const syn of synonyms) {
        expanded.add(syn);
        expanded.add(stem(syn));
      }
    }
  }
  return expanded;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, "'")
    .replace(/[^\w\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string): string[] {
  return normalizeText(text).split(" ").filter(Boolean);
}

function hasContentWords(tokens: string[]): boolean {
  const stopWords = new Set([
    "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "must", "shall", "can", "to", "of", "in",
    "for", "on", "with", "at", "by", "from", "as", "into", "through",
    "during", "before", "after", "above", "below", "between", "under",
    "again", "further", "then", "once", "here", "there", "when", "where",
    "why", "how", "all", "each", "every", "both", "few", "more", "most",
    "other", "some", "such", "no", "nor", "not", "only", "own", "same",
    "so", "than", "too", "very", "just", "also", "now", "i", "me", "my",
    "we", "our", "you", "your", "he", "him", "his", "she", "her", "it",
    "its", "they", "them", "their", "what", "which", "who", "this", "that",
    "these", "those", "am", "and", "but", "or", "if", "because", "about",
  ]);
  return tokens.some(t => !stopWords.has(t) && t.length > 2);
}

function calculateKeywordScore(
  queryTokens: string[],
  queryExpanded: Set<string>,
  keywords: string[]
): number {
  let score = 0;
  const queryText = queryTokens.join(" ");

  for (const keyword of keywords) {
    const normalizedKeyword = normalizeText(keyword);
    const keywordTokens = normalizedKeyword.split(" ");

    if (keywordTokens.length === 1) {
      const kw = keywordTokens[0];
      const kwStem = stem(kw);
      
      if (queryTokens.includes(kw)) {
        score += 1.5;
      } else if (queryExpanded.has(kw) || queryExpanded.has(kwStem)) {
        score += 1.0;
      } else {
        for (const qt of queryTokens) {
          if (stem(qt) === kwStem) {
            score += 0.8;
            break;
          }
        }
      }
    } else {
      if (queryText.includes(normalizedKeyword)) {
        score += keywordTokens.length * 2;
      } else {
        let partialMatches = 0;
        for (const kt of keywordTokens) {
          const ktStem = stem(kt);
          if (queryExpanded.has(kt) || queryExpanded.has(ktStem)) {
            partialMatches++;
          } else {
            for (const qt of queryTokens) {
              if (stem(qt) === ktStem) {
                partialMatches += 0.7;
                break;
              }
            }
          }
        }
        if (partialMatches >= keywordTokens.length * 0.6) {
          score += partialMatches * 0.8;
        }
      }
    }
  }

  return score;
}

function calculateIntentScore(
  queryText: string,
  queryExpanded: Set<string>,
  intentPatterns: string[]
): number {
  let score = 0;
  const normalizedQuery = normalizeText(queryText);
  const queryTokens = tokenize(queryText);

  for (const pattern of intentPatterns) {
    const normalizedPattern = normalizeText(pattern);
    const patternTokens = normalizedPattern.split(" ");
    let matchCount = 0;

    for (const pt of patternTokens) {
      const ptStem = stem(pt);
      if (normalizedQuery.includes(pt)) {
        matchCount += 1;
      } else if (queryExpanded.has(pt) || queryExpanded.has(ptStem)) {
        matchCount += 0.8;
      } else {
        for (const qt of queryTokens) {
          if (stem(qt) === ptStem) {
            matchCount += 0.6;
            break;
          }
        }
      }
    }

    const matchRatio = matchCount / patternTokens.length;

    if (matchRatio >= 0.7) {
      score += matchRatio * 3;
    } else if (matchRatio >= 0.5) {
      score += matchRatio * 2;
    } else if (matchRatio >= 0.3) {
      score += matchRatio * 1;
    }
  }

  return score;
}

function getTopicDescription(answerId: string): string {
  const descriptions: Record<string, string> = {
    "rental-agreement": "a parent moving in with you",
    "hospital-discharge": "hospital discharge",
    "uti-confusion": "sudden confusion",
    "repeated-questions": "repetitive questions",
    "big-hospital-bill": "a medical bill",
    "sibling-not-helping": "siblings not helping",
    "remote-monitoring": "monitoring from afar",
    "poa-capacity": "legal paperwork",
    "hospice-at-home": "hospice care",
    "handoff-two-days": "taking a break",
    "medicaid-waiver-waitlist": "Medicaid waitlists",
    "caregiver-paid": "getting paid as caregiver",
  };
  return descriptions[answerId] || answerId;
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
  
  if (!hasContentWords(queryTokens)) {
    return {
      answer: null,
      confidence: "none",
      clarifyingQuestion:
        "Can you describe what's happening with your parent right now?",
    };
  }

  const queryExpanded = expandWithSynonyms(queryTokens);

  const scoredAnswers = seedAnswers.map((answer) => {
    const keywordScore = calculateKeywordScore(queryTokens, queryExpanded, answer.keywords);
    const intentScore = calculateIntentScore(query, queryExpanded, answer.intentPatterns);
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

  if (topMatch.totalScore <= 0) {
    return {
      answer: null,
      confidence: "none",
      clarifyingQuestion:
        "I'm not sure I understand the situation yet. Can you describe what's happening right now with your parent?",
    };
  }

  if (topMatch.totalScore < 1.5) {
    return {
      answer: topMatch.answer,
      confidence: "low",
      clarifyingQuestion: `Are you asking about ${getTopicDescription(topMatch.answer.id)}? If not, can you give me a bit more detail?`,
    };
  }

  if (topMatch.totalScore < 3) {
    return {
      answer: topMatch.answer,
      confidence: "low",
      clarifyingQuestion:
        "I want to make sure I give you the right move. Does this look right?",
    };
  }

  if (topMatch.totalScore >= 5) {
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

export { seedAnswers };
