"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { AskBox } from "@/components/AskBox";
import { TheMoveDisplay } from "@/components/TheMoveDisplay";
import { NoMatch } from "@/components/NoMatch";
import { FamilyRecordView } from "@/components/FamilyRecordView";
import { matchQuery, MatchResult } from "@/lib/matcher";
import { saveToFamilyRecord, getFamilyRecord } from "@/lib/storage";
import { matchWithLLM, getLLMConfig } from "@/lib/llm";

type AppState = "ask" | "loading" | "result" | "no-match";

function useRecordCount(trigger: number) {
  return useMemo(() => {
    if (typeof window === "undefined") return 0;
    const record = getFamilyRecord();
    return record?.records.length || 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>("ask");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [personalizedMove, setPersonalizedMove] = useState<string | null>(null);
  const [savedRecordId, setSavedRecordId] = useState<string | null>(null);
  const [showFamilyRecord, setShowFamilyRecord] = useState(false);
  const [recordTrigger, setRecordTrigger] = useState(0);

  const recordCount = useRecordCount(recordTrigger);

  const handleAsk = useCallback(async (question: string) => {
    setCurrentQuestion(question);
    setAppState("loading");
    setSavedRecordId(null);
    setPersonalizedMove(null);

    const keywordResult = matchQuery(question);
    
    const llmConfig = getLLMConfig();

    if (llmConfig) {
      try {
        const llmResult = await matchWithLLM(question, llmConfig);
        
        if (llmResult.answer && llmResult.confidence !== "none") {
          setMatchResult({
            answer: llmResult.answer,
            confidence: llmResult.confidence,
            clarifyingQuestion: llmResult.clarifyingQuestion,
          });
          if (llmResult.personalizedMove) {
            setPersonalizedMove(llmResult.personalizedMove);
          }
          setAppState("result");
          return;
        }
        
        if (keywordResult.answer) {
          setMatchResult(keywordResult);
          setAppState("result");
          return;
        }
        
        setMatchResult({
          answer: null,
          confidence: "none",
          clarifyingQuestion: llmResult.clarifyingQuestion || keywordResult.clarifyingQuestion,
        });
        setAppState("no-match");
        return;
      } catch (error) {
        console.error("LLM matching failed, falling back to keyword match:", error);
      }
    }

    setTimeout(() => {
      setMatchResult(keywordResult);

      if (keywordResult.answer) {
        setAppState("result");
      } else {
        setAppState("no-match");
      }
    }, 300);
  }, []);

  const handleSave = useCallback(() => {
    if (matchResult?.answer) {
      const saved = saveToFamilyRecord(currentQuestion, matchResult.answer);
      setSavedRecordId(saved.id);
      setRecordTrigger((t) => t + 1);
    }
  }, [matchResult, currentQuestion]);

  const handleAskAnother = useCallback(() => {
    setAppState("ask");
    setCurrentQuestion("");
    setMatchResult(null);
    setPersonalizedMove(null);
    setSavedRecordId(null);
  }, []);

  const handleExampleClick = useCallback((example: string) => {
    handleAsk(example);
  }, [handleAsk]);

  const handleCloseRecord = useCallback(() => {
    setShowFamilyRecord(false);
    setRecordTrigger((t) => t + 1);
  }, []);

  return (
    <main className="min-h-screen bg-paper">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <header className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/brand/concierge-mark.png"
                alt=""
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-ink">
                  The Concierge
                </h1>
                <p className="text-ink-muted text-sm mt-0.5">
                  The insider move, not the list of agencies.
                </p>
              </div>
            </div>
            {recordCount > 0 && (
              <button
                onClick={() => setShowFamilyRecord(true)}
                className="text-sm text-ink-muted hover:text-ink underline"
              >
                Mom&apos;s file ({recordCount})
              </button>
            )}
          </div>
        </header>

        {appState === "ask" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-ink mb-2">
                What&apos;s going on?
              </h2>
              <p className="text-ink-muted text-sm mb-4">
                Type it like you&apos;d tell a friend who happens to know.
              </p>
            </div>
            <AskBox onSubmit={handleAsk} />
          </div>
        )}

        {appState === "loading" && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-8 h-8 border-2 border-line border-t-ink rounded-full animate-spin" />
            <p className="text-ink-muted">Finding the move...</p>
          </div>
        )}

        {appState === "result" && matchResult?.answer && (
          <TheMoveDisplay
            answer={matchResult.answer}
            confidence={matchResult.confidence as "high" | "medium" | "low"}
            clarifyingQuestion={matchResult.clarifyingQuestion}
            personalizedMove={personalizedMove}
            onSave={handleSave}
            onAskAnother={handleAskAnother}
            isSaved={savedRecordId !== null}
          />
        )}

        {appState === "no-match" && (
          <NoMatch
            clarifyingQuestion={
              matchResult?.clarifyingQuestion ||
              "Can you tell me more about what's happening?"
            }
            onTryAgain={handleAskAnother}
            onExampleClick={handleExampleClick}
          />
        )}
      </div>

      <footer className="border-t border-line mt-12">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="text-xs text-ink-muted space-y-2">
            <p>
              <strong className="text-ink">Not medical, legal, or financial advice.</strong> This
              tool provides general information based on common eldercare
              situations. For decisions about health, law, or money, consult a
              licensed professional.
            </p>
            <p>
              Sample content reflects Utah programs and practices. Your state
              may differ.
            </p>
            <p>
              Answers marked &quot;needs review&quot; have not been verified by
              a professional in that domain.
            </p>
          </div>
        </div>
      </footer>

      {showFamilyRecord && (
        <FamilyRecordView onClose={handleCloseRecord} />
      )}
    </main>
  );
}
