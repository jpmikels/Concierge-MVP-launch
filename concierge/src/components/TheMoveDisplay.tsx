"use client";

import { InsiderMove } from "@/lib/answers";
import { getReferralsByIds, categoryLabels, Referral } from "@/lib/referrals";

interface TheMoveDisplayProps {
  answer: InsiderMove;
  confidence: "high" | "medium" | "low";
  clarifyingQuestion?: string;
  personalizedMove?: string | null;
  onSave: () => void;
  onAskAnother: () => void;
  isSaved: boolean;
}

function ReferralCard({ referral }: { referral: Referral }) {
  return (
    <div className="border-l-4 border-accent bg-accent-soft/50 rounded-r-lg p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-ink">{referral.name}</p>
          <p className="text-xs text-ink-muted">
            {categoryLabels[referral.category]}
          </p>
        </div>
        <span
          className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
            referral.reviewStatus === "verified"
              ? "bg-ok-bg text-ok-fg"
              : "bg-warn-bg text-warn-fg"
          }`}
        >
          {referral.reviewStatus === "verified" ? "✓ Verified" : "⚠ Review"}
        </span>
      </div>
      <p className="text-sm text-ink-muted">{referral.whyTrusted}</p>
      <p className="text-sm text-ink">
        <span className="font-medium">How to reach:</span> {referral.howToReach}
      </p>
      {referral.utahNotes && (
        <p className="text-xs text-ink-muted italic">
          Utah: {referral.utahNotes}
        </p>
      )}
    </div>
  );
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
  const referrals = getReferralsByIds(answer.referralIds);

  return (
    <div className="w-full max-w-2xl space-y-6">
      {confidence === "low" && clarifyingQuestion && (
        <div className="p-4 bg-warn-bg border border-warn-fg/20 rounded-lg">
          <p className="text-warn-fg text-sm">{clarifyingQuestion}</p>
          <p className="text-warn-fg/80 text-sm mt-2">
            Here&apos;s my best guess at what you need:
          </p>
        </div>
      )}

      <div className="space-y-6">
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-muted mb-2">
            The Move
          </h2>
          <div className="text-ink text-lg leading-relaxed whitespace-pre-line">
            {personalizedMove || answer.theMove}
          </div>
        </section>

        {answer.whatToSay && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-muted mb-2">
              What to Say
            </h2>
            <blockquote className="border-l-4 border-accent pl-4 italic text-ink-muted">
              {answer.whatToSay}
            </blockquote>
          </section>
        )}

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-muted mb-2">
            Who to Talk To
          </h2>
          <p className="text-ink">{answer.whomToSayItTo}</p>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-muted mb-2">
            Timing & Deadline
          </h2>
          <p className="text-ink">{answer.orderAndDeadline}</p>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-muted mb-2">
            Why This Works
          </h2>
          <p className="text-ink-muted">{answer.whyItWorks}</p>
        </section>

        {referrals.length > 0 && (
          <section className="pt-4 border-t border-line">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-accent mb-3">
              Who to Call Next
            </h2>
            <div className="space-y-3">
              {referrals.map((referral) => (
                <ReferralCard key={referral.id} referral={referral} />
              ))}
            </div>
          </section>
        )}

        <div className="pt-4 border-t border-line space-y-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                answer.reviewStatus === "verified"
                  ? "bg-ok-bg text-ok-fg"
                  : "bg-warn-bg text-warn-fg"
              }`}
            >
              {answer.reviewStatus === "verified"
                ? "✓ Verified"
                : "⚠ Needs human review"}
            </span>
          </div>
          <p className="text-xs text-ink-muted">{answer.attribution}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-line">
        <button
          onClick={onSave}
          disabled={isSaved}
          className={`flex-1 px-4 py-3 border-2 rounded-lg font-medium transition-colors ${
            isSaved
              ? "border-ok-fg/50 bg-ok-bg text-ok-fg cursor-default"
              : "border-line hover:border-ink-muted text-ink"
          }`}
        >
          {isSaved ? "✓ Saved to Mom's file" : "Save this to Mom's file"}
        </button>
        <button
          onClick={onAskAnother}
          className="flex-1 px-4 py-3 bg-ink text-card rounded-lg font-medium
                     hover:bg-ink/90 transition-colors"
        >
          Ask another question
        </button>
      </div>
    </div>
  );
}
