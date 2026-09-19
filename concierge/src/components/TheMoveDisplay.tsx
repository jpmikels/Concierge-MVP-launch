"use client";

import { InsiderMove } from "@/lib/answers";

interface TheMoveDisplayProps {
  answer: InsiderMove;
  confidence: "high" | "medium" | "low";
  clarifyingQuestion?: string;
  personalizedMove?: string | null;
  onSave: () => void;
  onAskAnother: () => void;
  isSaved: boolean;
}

export function TheMoveDisplay({
  answer,
  confidence,
  clarifyingQuestion,
  personalizedMove,
  onSave,
  onAskAnother,
  isSaved,
}: TheMoveDisplayProps) {
  return (
    <div className="w-full max-w-2xl space-y-6">
      {confidence === "low" && clarifyingQuestion && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 text-sm">{clarifyingQuestion}</p>
          <p className="text-amber-700 text-sm mt-2">
            Here&apos;s my best guess at what you need:
          </p>
        </div>
      )}

      <div className="space-y-6">
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
            The Move
          </h2>
          <div className="text-gray-900 text-lg leading-relaxed whitespace-pre-line">
            {personalizedMove || answer.theMove}
          </div>
        </section>

        {answer.whatToSay && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
              What to Say
            </h2>
            <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700">
              {answer.whatToSay}
            </blockquote>
          </section>
        )}

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
            Who to Talk To
          </h2>
          <p className="text-gray-900">{answer.whomToSayItTo}</p>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
            Timing & Deadline
          </h2>
          <p className="text-gray-900">{answer.orderAndDeadline}</p>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
            Why This Works
          </h2>
          <p className="text-gray-600">{answer.whyItWorks}</p>
        </section>

        <div className="pt-4 border-t border-gray-200 space-y-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                answer.reviewStatus === "verified"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {answer.reviewStatus === "verified"
                ? "✓ Verified"
                : "⚠ Needs human review"}
            </span>
          </div>
          <p className="text-xs text-gray-500">{answer.attribution}</p>

          {answer.resourcePointer && (
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">Resource:</span>{" "}
              {answer.resourcePointer}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
        <button
          onClick={onSave}
          disabled={isSaved}
          className={`flex-1 px-4 py-3 border-2 rounded-lg font-medium transition-colors ${
            isSaved
              ? "border-green-500 bg-green-50 text-green-700 cursor-default"
              : "border-gray-300 hover:border-gray-400 text-gray-700"
          }`}
        >
          {isSaved ? "✓ Saved to Mom's file" : "Save this to Mom's file"}
        </button>
        <button
          onClick={onAskAnother}
          className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg font-medium
                     hover:bg-gray-800 transition-colors"
        >
          Ask another question
        </button>
      </div>
    </div>
  );
}
