"use client";

import { recoveryExamples } from "@/lib/examples";

interface NoMatchProps {
  clarifyingQuestion: string;
  onTryAgain: () => void;
  onExampleClick: (example: string) => void;
}

export function NoMatch({ clarifyingQuestion, onTryAgain, onExampleClick }: NoMatchProps) {
  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="p-6 bg-card border border-line rounded-lg">
        <h2 className="text-lg font-medium text-ink mb-3">
          I need a bit more to go on
        </h2>
        <p className="text-ink-muted mb-4">{clarifyingQuestion}</p>
        <div className="space-y-2 text-sm text-ink-muted">
          <p>Try describing:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>What just happened or what&apos;s about to happen</li>
            <li>What you&apos;re trying to figure out</li>
            <li>What&apos;s frustrating you right now</li>
          </ul>
        </div>
      </div>

      <div>
        <p className="text-sm text-ink-muted mb-3">Or try one of these situations:</p>
        <div className="flex flex-wrap gap-2">
          {recoveryExamples.map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onExampleClick(example)}
              className="px-3 py-2 text-sm text-ink bg-accent-soft rounded-lg
                         hover:bg-accent-soft/70 transition-colors text-left"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onTryAgain}
        className="w-full px-4 py-3 bg-ink text-card rounded-lg font-medium
                   hover:bg-ink/90 transition-colors"
      >
        Type a different question
      </button>
    </div>
  );
}
