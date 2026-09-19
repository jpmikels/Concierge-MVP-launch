"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  Participant,
  Thread,
  WozMetrics,
  Answer,
  FollowUp,
} from "@/lib/woz/types";
import { referrals, categoryLabels, Referral } from "@/lib/referrals";

type Tab = "dashboard" | "participants" | "inbox" | "follow-ups";

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/woz/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });

    if (res.ok) {
      onLogin();
    } else {
      setError("Invalid access key");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <div className="bg-card border border-line rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-ink mb-2">WoZ Console</h1>
        <p className="text-ink-muted text-sm mb-6">
          Operator console for The Concierge fieldwork test.
        </p>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-ink mb-2">
            Access Key
          </label>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full p-3 border border-line rounded-lg bg-card text-ink 
                       focus:border-ink focus:outline-none"
            placeholder="Enter WOZ_ACCESS_KEY"
            autoFocus
          />
          {error && <p className="text-warn-fg text-sm mt-2">{error}</p>}
          <button
            type="submit"
            disabled={loading || !key}
            className="w-full mt-4 px-4 py-3 bg-ink text-card font-medium rounded-lg
                       hover:bg-ink/90 disabled:bg-line disabled:text-ink-muted
                       transition-colors"
          >
            {loading ? "Checking..." : "Enter Console"}
          </button>
        </form>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  variant,
}: {
  label: string;
  value: number;
  variant?: "default" | "warn" | "ok";
}) {
  const bgClass =
    variant === "warn"
      ? "bg-warn-bg"
      : variant === "ok"
        ? "bg-ok-bg"
        : "bg-card";
  const textClass =
    variant === "warn"
      ? "text-warn-fg"
      : variant === "ok"
        ? "text-ok-fg"
        : "text-ink";

  return (
    <div className={`${bgClass} border border-line rounded-lg p-4`}>
      <p className="text-xs font-medium uppercase tracking-wide text-ink-muted mb-1">
        {label}
      </p>
      <p className={`text-3xl font-semibold ${textClass}`}>{value}</p>
    </div>
  );
}

function Dashboard({ metrics }: { metrics: WozMetrics | null }) {
  if (!metrics) {
    return <p className="text-ink-muted">Loading metrics...</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-ink">Metrics Dashboard</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <MetricCard label="Participants" value={metrics.participantCount} />
        <MetricCard label="Total Questions" value={metrics.questionCount} />
        <MetricCard
          label="Second Asks"
          value={metrics.secondAskCount}
          variant={metrics.secondAskCount > 0 ? "warn" : "default"}
        />
        <MetricCard label="Sent" value={metrics.sentCount} variant="ok" />
        <MetricCard
          label="Unresolved"
          value={metrics.unresolvedCount}
          variant={metrics.unresolvedCount > 0 ? "warn" : "default"}
        />
        <MetricCard
          label="Drafting"
          value={metrics.draftingCount}
          variant={metrics.draftingCount > 0 ? "warn" : "default"}
        />
        <MetricCard
          label="Open Follow-ups"
          value={metrics.openFollowUpCount}
          variant={metrics.openFollowUpCount > 0 ? "warn" : "default"}
        />
      </div>
    </div>
  );
}

function ParticipantForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: {
    name: string;
    alias?: string;
    phone?: string;
    intakeSource?: string;
    startDate: string;
    notes?: string;
  }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [alias, setAlias] = useState("");
  const [phone, setPhone] = useState("");
  const [intakeSource, setIntakeSource] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      alias: alias || undefined,
      phone: phone || undefined,
      intakeSource: intakeSource || undefined,
      startDate,
      notes: notes || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-line rounded-lg bg-card text-ink 
                     focus:border-ink focus:outline-none"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          Alias (optional)
        </label>
        <input
          type="text"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          className="w-full p-2 border border-line rounded-lg bg-card text-ink 
                     focus:border-ink focus:outline-none"
          placeholder="e.g., P1, Daughter A"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          Phone (optional)
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border border-line rounded-lg bg-card text-ink 
                     focus:border-ink focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          Who told them before us? (Intake)
        </label>
        <input
          type="text"
          value={intakeSource}
          onChange={(e) => setIntakeSource(e.target.value)}
          className="w-full p-2 border border-line rounded-lg bg-card text-ink 
                     focus:border-ink focus:outline-none"
          placeholder="e.g., 'Sister who's a nurse', 'Google', 'No one'"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          Start Date *
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 border border-line rounded-lg bg-card text-ink 
                     focus:border-ink focus:outline-none"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2 border border-line rounded-lg bg-card text-ink 
                     focus:border-ink focus:outline-none resize-none"
          rows={2}
        />
      </div>
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-line rounded-lg text-ink
                     hover:border-ink-muted transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!name}
          className="flex-1 px-4 py-2 bg-ink text-card rounded-lg font-medium
                     hover:bg-ink/90 disabled:bg-line disabled:text-ink-muted
                     transition-colors"
        >
          Add Participant
        </button>
      </div>
    </form>
  );
}

function ParticipantsList({
  participants,
  onRefresh,
}: {
  participants: Participant[];
  onRefresh: () => void;
}) {
  const [showForm, setShowForm] = useState(false);

  const handleCreate = async (data: {
    name: string;
    alias?: string;
    phone?: string;
    intakeSource?: string;
    startDate: string;
    notes?: string;
  }) => {
    await fetch("/woz/api/participants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setShowForm(false);
    onRefresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-ink">Participants</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-ink text-card rounded-lg font-medium
                     hover:bg-ink/90 transition-colors text-sm"
        >
          + Add Participant
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-line rounded-lg p-4">
          <h3 className="text-lg font-medium text-ink mb-4">New Participant</h3>
          <ParticipantForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {participants.length === 0 ? (
        <p className="text-ink-muted py-8 text-center">
          No participants yet. Add someone to start the test.
        </p>
      ) : (
        <div className="space-y-3">
          {participants.map((p) => (
            <div
              key={p.id}
              className="bg-card border border-line rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-ink">
                    {p.name}
                    {p.alias && (
                      <span className="text-ink-muted ml-2">({p.alias})</span>
                    )}
                  </p>
                  {p.phone && (
                    <p className="text-sm text-ink-muted">{p.phone}</p>
                  )}
                </div>
                <span className="text-xs text-ink-muted">
                  Started {new Date(p.startDate).toLocaleDateString()}
                </span>
              </div>
              {p.intakeSource && (
                <p className="text-sm text-ink-muted mt-2">
                  <span className="font-medium">Prior source:</span>{" "}
                  {p.intakeSource}
                </p>
              )}
              {p.notes && (
                <p className="text-sm text-ink-muted mt-1 italic">{p.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ThreadForm({
  participants,
  onSubmit,
  onCancel,
}: {
  participants: Participant[];
  onSubmit: (data: {
    participantId: string;
    inboundText: string;
    isSecondAsk?: boolean;
  }) => void;
  onCancel: () => void;
}) {
  const [participantId, setParticipantId] = useState("");
  const [inboundText, setInboundText] = useState("");
  const [isSecondAsk, setIsSecondAsk] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ participantId, inboundText, isSecondAsk });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          Participant *
        </label>
        <select
          value={participantId}
          onChange={(e) => setParticipantId(e.target.value)}
          className="w-full p-2 border border-line rounded-lg bg-card text-ink 
                     focus:border-ink focus:outline-none"
          required
        >
          <option value="">Select participant...</option>
          {participants.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} {p.alias ? `(${p.alias})` : ""}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          Their Question (paste from SMS) *
        </label>
        <textarea
          value={inboundText}
          onChange={(e) => setInboundText(e.target.value)}
          className="w-full p-2 border border-line rounded-lg bg-card text-ink 
                     focus:border-ink focus:outline-none resize-none"
          rows={4}
          placeholder="Paste exactly what they sent..."
          required
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isSecondAsk"
          checked={isSecondAsk}
          onChange={(e) => setIsSecondAsk(e.target.checked)}
          className="rounded border-line"
        />
        <label htmlFor="isSecondAsk" className="text-sm text-ink">
          This is a follow-up/second ask (unprompted)
        </label>
      </div>
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-line rounded-lg text-ink
                     hover:border-ink-muted transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!participantId || !inboundText}
          className="flex-1 px-4 py-2 bg-ink text-card rounded-lg font-medium
                     hover:bg-ink/90 disabled:bg-line disabled:text-ink-muted
                     transition-colors"
        >
          Log Question
        </button>
      </div>
    </form>
  );
}

function AnswerComposer({
  thread,
  existingAnswer,
  onSave,
  onSend,
  onCancel,
}: {
  thread: Thread;
  existingAnswer?: Answer;
  onSave: (data: {
    theMove: string;
    whatToSay?: string;
    whomToSayItTo?: string;
    orderAndDeadline?: string;
    whyItWorks?: string;
    referralIds?: string[];
    freeTextReferral?: string;
    reviewStatus?: "verified" | "needs_review";
    prefilledFromSeed?: string;
  }) => void;
  onSend: (finalText: string) => void;
  onCancel: () => void;
}) {
  const [theMove, setTheMove] = useState(existingAnswer?.theMove || "");
  const [whatToSay, setWhatToSay] = useState(existingAnswer?.whatToSay || "");
  const [whomToSayItTo, setWhomToSayItTo] = useState(
    existingAnswer?.whomToSayItTo || ""
  );
  const [orderAndDeadline, setOrderAndDeadline] = useState(
    existingAnswer?.orderAndDeadline || ""
  );
  const [whyItWorks, setWhyItWorks] = useState(
    existingAnswer?.whyItWorks || ""
  );
  const [selectedReferralIds, setSelectedReferralIds] = useState<string[]>(
    existingAnswer?.referralIds || []
  );
  const [freeTextReferral, setFreeTextReferral] = useState(
    existingAnswer?.freeTextReferral || ""
  );
  const [reviewStatus, setReviewStatus] = useState<"verified" | "needs_review">(
    existingAnswer?.reviewStatus || "needs_review"
  );
  const [prefilledFrom, setPrefilledFrom] = useState(
    existingAnswer?.prefilledFromSeed || ""
  );
  const [suggesting, setSuggesting] = useState(false);

  const handleSuggest = async () => {
    setSuggesting(true);
    try {
      const res = await fetch("/woz/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: thread.inboundText }),
      });
      const data = await res.json();
      if (data.match) {
        setTheMove(data.match.theMove || "");
        setWhatToSay(data.match.whatToSay || "");
        setWhomToSayItTo(data.match.whomToSayItTo || "");
        setOrderAndDeadline(data.match.orderAndDeadline || "");
        setWhyItWorks(data.match.whyItWorks || "");
        setSelectedReferralIds(data.match.referralIds || []);
        setReviewStatus(data.match.reviewStatus || "needs_review");
        setPrefilledFrom(data.match.id);
      }
    } catch (e) {
      console.error("Suggest failed:", e);
    }
    setSuggesting(false);
  };

  const handleSave = () => {
    onSave({
      theMove,
      whatToSay: whatToSay || undefined,
      whomToSayItTo: whomToSayItTo || undefined,
      orderAndDeadline: orderAndDeadline || undefined,
      whyItWorks: whyItWorks || undefined,
      referralIds: selectedReferralIds.length > 0 ? selectedReferralIds : undefined,
      freeTextReferral: freeTextReferral || undefined,
      reviewStatus,
      prefilledFromSeed: prefilledFrom || undefined,
    });
  };

  const composeFinalText = () => {
    let text = theMove;
    if (whatToSay) text += `\n\nWhat to say: "${whatToSay}"`;
    if (whomToSayItTo) text += `\n\nWho: ${whomToSayItTo}`;
    if (orderAndDeadline) text += `\n\nWhen: ${orderAndDeadline}`;

    const selectedReferrals = referrals.filter((r) =>
      selectedReferralIds.includes(r.id)
    );
    if (selectedReferrals.length > 0) {
      text += "\n\nWho to call next:";
      for (const r of selectedReferrals) {
        text += `\n• ${r.name}: ${r.howToReach}`;
      }
    }
    if (freeTextReferral) {
      text += `\n• ${freeTextReferral}`;
    }

    return text;
  };

  const handleSend = () => {
    const finalText = composeFinalText();
    onSend(finalText);
  };

  const toggleReferral = (id: string) => {
    setSelectedReferralIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-accent-soft/50 border-l-4 border-accent p-4 rounded-r-lg">
        <p className="text-xs font-medium uppercase tracking-wide text-accent mb-1">
          Their question
        </p>
        <p className="text-ink">{thread.inboundText}</p>
      </div>

      <div className="bg-warn-bg/50 border border-warn-fg/20 rounded-lg p-3">
        <p className="text-xs text-warn-fg">
          <strong>Voice check:</strong> If a stranger at a funeral could say it,
          cut it. Be specific. No platitudes.
        </p>
      </div>

      <button
        onClick={handleSuggest}
        disabled={suggesting}
        className="w-full px-4 py-2 border-2 border-accent text-accent rounded-lg
                   hover:bg-accent-soft transition-colors text-sm font-medium"
      >
        {suggesting ? "Matching..." : "Suggest from Seed Library"}
      </button>

      {prefilledFrom && (
        <p className="text-xs text-ink-muted">
          Prefilled from: <code>{prefilledFrom}</code> — edit as needed
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          The Move *
        </label>
        <textarea
          value={theMove}
          onChange={(e) => setTheMove(e.target.value)}
          className="w-full p-2 border border-line rounded-lg bg-card text-ink 
                     focus:border-ink focus:outline-none resize-none"
          rows={4}
          placeholder="What to do. Be specific."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          What to Say
        </label>
        <textarea
          value={whatToSay}
          onChange={(e) => setWhatToSay(e.target.value)}
          className="w-full p-2 border border-line rounded-lg bg-card text-ink 
                     focus:border-ink focus:outline-none resize-none"
          rows={2}
          placeholder="Exact words if applicable"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Who to Talk To
          </label>
          <input
            type="text"
            value={whomToSayItTo}
            onChange={(e) => setWhomToSayItTo(e.target.value)}
            className="w-full p-2 border border-line rounded-lg bg-card text-ink 
                       focus:border-ink focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Timing & Deadline
          </label>
          <input
            type="text"
            value={orderAndDeadline}
            onChange={(e) => setOrderAndDeadline(e.target.value)}
            className="w-full p-2 border border-line rounded-lg bg-card text-ink 
                       focus:border-ink focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          Why This Works
        </label>
        <input
          type="text"
          value={whyItWorks}
          onChange={(e) => setWhyItWorks(e.target.value)}
          className="w-full p-2 border border-line rounded-lg bg-card text-ink 
                     focus:border-ink focus:outline-none"
          placeholder="One sentence"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-2">
          Vetted Handoffs (select from library)
        </label>
        <div className="max-h-48 overflow-y-auto border border-line rounded-lg p-2 space-y-1">
          {referrals.map((r) => (
            <label
              key={r.id}
              className="flex items-start gap-2 p-2 hover:bg-accent-soft/30 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedReferralIds.includes(r.id)}
                onChange={() => toggleReferral(r.id)}
                className="mt-1"
              />
              <div className="text-sm">
                <p className="text-ink font-medium">{r.name}</p>
                <p className="text-ink-muted text-xs">
                  {categoryLabels[r.category]} • {r.howToReach.slice(0, 60)}...
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          Or Free-Text Referral
        </label>
        <input
          type="text"
          value={freeTextReferral}
          onChange={(e) => setFreeTextReferral(e.target.value)}
          className="w-full p-2 border border-line rounded-lg bg-card text-ink 
                     focus:border-ink focus:outline-none"
          placeholder="Custom path if not in library"
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={reviewStatus === "needs_review"}
            onChange={() => setReviewStatus("needs_review")}
          />
          <span className="text-sm text-ink">Needs review</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={reviewStatus === "verified"}
            onChange={() => setReviewStatus("verified")}
          />
          <span className="text-sm text-ink">Verified</span>
        </label>
      </div>

      {theMove && (
        <div className="bg-card border border-line rounded-lg p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted mb-2">
            Preview (what will be sent)
          </p>
          <pre className="text-sm text-ink whitespace-pre-wrap font-sans">
            {composeFinalText()}
          </pre>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-line rounded-lg text-ink
                     hover:border-ink-muted transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!theMove}
          className="flex-1 px-4 py-2 border-2 border-ink rounded-lg text-ink font-medium
                     hover:bg-ink/5 disabled:border-line disabled:text-ink-muted
                     transition-colors"
        >
          Save Draft
        </button>
        <button
          type="button"
          onClick={handleSend}
          disabled={!theMove}
          className="flex-1 px-4 py-2 bg-accent text-card rounded-lg font-medium
                     hover:bg-accent/90 disabled:bg-line disabled:text-ink-muted
                     transition-colors"
        >
          Mark Sent
        </button>
      </div>
    </div>
  );
}

function ThreadCard({
  thread,
  onCompose,
}: {
  thread: Thread;
  onCompose: (thread: Thread) => void;
}) {
  const statusColors: Record<string, string> = {
    new: "bg-warn-bg text-warn-fg",
    drafting: "bg-accent-soft text-accent",
    sent: "bg-ok-bg text-ok-fg",
    follow_up_due: "bg-warn-bg text-warn-fg",
  };

  const statusLabels: Record<string, string> = {
    new: "New",
    drafting: "Drafting",
    sent: "Sent",
    follow_up_due: "Follow-up Due",
  };

  return (
    <div className="bg-card border border-line rounded-lg p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="font-medium text-ink">
            {thread.participant?.name || "Unknown"}
          </p>
          <p className="text-xs text-ink-muted">
            {new Date(thread.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {thread.isSecondAsk && (
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-warn-bg text-warn-fg">
              2nd Ask
            </span>
          )}
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[thread.status]}`}
          >
            {statusLabels[thread.status]}
          </span>
        </div>
      </div>
      <p className="text-ink mb-3">{thread.inboundText}</p>
      {thread.status !== "sent" && thread.status !== "follow_up_due" && (
        <button
          onClick={() => onCompose(thread)}
          className="text-sm text-accent hover:underline"
        >
          {thread.status === "drafting" ? "Continue drafting →" : "Compose answer →"}
        </button>
      )}
      {thread.status === "sent" && thread.answer?.finalSentText && (
        <div className="mt-2 pt-2 border-t border-line">
          <p className="text-xs font-medium text-ink-muted mb-1">Sent:</p>
          <p className="text-sm text-ink-muted whitespace-pre-wrap">
            {thread.answer.finalSentText.slice(0, 200)}
            {thread.answer.finalSentText.length > 200 && "..."}
          </p>
        </div>
      )}
    </div>
  );
}

function Inbox({
  threads,
  participants,
  onRefresh,
}: {
  threads: Thread[];
  participants: Participant[];
  onRefresh: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [composingThread, setComposingThread] = useState<Thread | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const handleCreate = async (data: {
    participantId: string;
    inboundText: string;
    isSecondAsk?: boolean;
  }) => {
    await fetch("/woz/api/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setShowForm(false);
    onRefresh();
  };

  const handleSaveAnswer = async (
    threadId: string,
    existingAnswerId: string | undefined,
    data: {
      theMove: string;
      whatToSay?: string;
      whomToSayItTo?: string;
      orderAndDeadline?: string;
      whyItWorks?: string;
      referralIds?: string[];
      freeTextReferral?: string;
      reviewStatus?: "verified" | "needs_review";
      prefilledFromSeed?: string;
    }
  ) => {
    if (existingAnswerId) {
      await fetch(`/woz/api/answers?id=${existingAnswerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/woz/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, threadId }),
      });
    }
    setComposingThread(null);
    onRefresh();
  };

  const handleSendAnswer = async (
    threadId: string,
    answerId: string,
    finalText: string
  ) => {
    await fetch(`/woz/api/answers?id=${answerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markSent: true, finalText }),
    });

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    await fetch("/woz/api/follow-ups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        threadId,
        dueDate: dueDate.toISOString().split("T")[0],
      }),
    });

    setComposingThread(null);
    onRefresh();
  };

  const filteredThreads =
    filter === "all"
      ? threads
      : threads.filter((t) => t.status === filter);

  if (composingThread) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-ink">
          Composing Answer for {composingThread.participant?.name}
        </h2>
        <AnswerComposer
          thread={composingThread}
          existingAnswer={composingThread.answer}
          onSave={(data) =>
            handleSaveAnswer(
              composingThread.id,
              composingThread.answer?.id,
              data
            )
          }
          onSend={async (finalText) => {
            if (!composingThread.answer) {
              const res = await fetch("/woz/api/answers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  threadId: composingThread.id,
                  theMove: finalText,
                }),
              });
              const answer = await res.json();
              await handleSendAnswer(composingThread.id, answer.id, finalText);
            } else {
              await handleSendAnswer(
                composingThread.id,
                composingThread.answer.id,
                finalText
              );
            }
          }}
          onCancel={() => setComposingThread(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-ink">Inbox</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-ink text-card rounded-lg font-medium
                     hover:bg-ink/90 transition-colors text-sm"
        >
          + Log Question
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-line rounded-lg p-4">
          <h3 className="text-lg font-medium text-ink mb-4">Log New Question</h3>
          <ThreadForm
            participants={participants}
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="flex gap-2">
        {["all", "new", "drafting", "sent", "follow_up_due"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              filter === f
                ? "bg-ink text-card"
                : "bg-accent-soft text-ink hover:bg-accent-soft/70"
            }`}
          >
            {f === "all"
              ? "All"
              : f === "follow_up_due"
                ? "Follow-up"
                : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filteredThreads.length === 0 ? (
        <p className="text-ink-muted py-8 text-center">
          No questions {filter !== "all" && `with status "${filter}"`}. Log one
          when it comes in via SMS.
        </p>
      ) : (
        <div className="space-y-3">
          {filteredThreads.map((t) => (
            <ThreadCard
              key={t.id}
              thread={t}
              onCompose={async (thread) => {
                const res = await fetch(`/woz/api/threads?id=${thread.id}`);
                const fullThread = await res.json();
                setComposingThread(fullThread);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FollowUpsList({ onRefresh }: { onRefresh: () => void }) {
  const [followUps, setFollowUps] = useState<
    (FollowUp & { thread: Thread })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    whatTheyDid: "",
    showedToSibling: false,
    couldNotAnswer: "",
    notes: "",
  });

  const loadFollowUps = useCallback(async () => {
    const res = await fetch("/woz/api/follow-ups");
    const data = await res.json();
    setFollowUps(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadFollowUps();
  }, [loadFollowUps]);

  const startEdit = (fu: FollowUp) => {
    setEditingId(fu.id);
    setEditData({
      whatTheyDid: fu.whatTheyDid || "",
      showedToSibling: fu.showedToSibling || false,
      couldNotAnswer: fu.couldNotAnswer || "",
      notes: fu.notes || "",
    });
  };

  const saveEdit = async (id: string) => {
    await fetch(`/woz/api/follow-ups?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    setEditingId(null);
    loadFollowUps();
    onRefresh();
  };

  const completeFollowUp = async (id: string) => {
    await fetch(`/woz/api/follow-ups?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ complete: true }),
    });
    loadFollowUps();
    onRefresh();
  };

  if (loading) {
    return <p className="text-ink-muted">Loading follow-ups...</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-ink">Day-14 Follow-ups</h2>
      <p className="text-sm text-ink-muted">
        Track what they did with the answer, whether they showed it to a sibling,
        and what we could not answer.
      </p>

      {followUps.length === 0 ? (
        <p className="text-ink-muted py-8 text-center">
          No open follow-ups. They're created automatically 14 days after sending
          an answer.
        </p>
      ) : (
        <div className="space-y-4">
          {followUps.map((fu) => {
            const isOverdue = new Date(fu.dueDate) < new Date();
            return (
              <div
                key={fu.id}
                className={`bg-card border rounded-lg p-4 ${
                  isOverdue ? "border-warn-fg/50" : "border-line"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-ink">
                      {fu.thread.participant?.name}
                    </p>
                    <p className="text-sm text-ink-muted">
                      Due: {new Date(fu.dueDate).toLocaleDateString()}
                      {isOverdue && (
                        <span className="text-warn-fg ml-2">(overdue)</span>
                      )}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-ink-muted mb-3">
                  Original question: {fu.thread.inboundText.slice(0, 100)}...
                </p>

                {editingId === fu.id ? (
                  <div className="space-y-3 pt-3 border-t border-line">
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1">
                        What they did with the answer
                      </label>
                      <textarea
                        value={editData.whatTheyDid}
                        onChange={(e) =>
                          setEditData({ ...editData, whatTheyDid: e.target.value })
                        }
                        className="w-full p-2 border border-line rounded-lg bg-card text-ink 
                                   focus:border-ink focus:outline-none resize-none"
                        rows={2}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editData.showedToSibling}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            showedToSibling: e.target.checked,
                          })
                        }
                      />
                      <label className="text-sm text-ink">
                        Showed it to a sibling
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1">
                        What we could not answer
                      </label>
                      <input
                        type="text"
                        value={editData.couldNotAnswer}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            couldNotAnswer: e.target.value,
                          })
                        }
                        className="w-full p-2 border border-line rounded-lg bg-card text-ink 
                                   focus:border-ink focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1">
                        Notes
                      </label>
                      <textarea
                        value={editData.notes}
                        onChange={(e) =>
                          setEditData({ ...editData, notes: e.target.value })
                        }
                        className="w-full p-2 border border-line rounded-lg bg-card text-ink 
                                   focus:border-ink focus:outline-none resize-none"
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 border border-line rounded-lg text-ink text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEdit(fu.id)}
                        className="px-3 py-1.5 bg-ink text-card rounded-lg text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => completeFollowUp(fu.id)}
                        className="px-3 py-1.5 bg-accent text-card rounded-lg text-sm"
                      >
                        Complete Follow-up
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-line">
                    {fu.whatTheyDid && (
                      <p className="text-sm text-ink mb-1">
                        <strong>What they did:</strong> {fu.whatTheyDid}
                      </p>
                    )}
                    {fu.showedToSibling && (
                      <p className="text-sm text-ok-fg mb-1">✓ Showed to sibling</p>
                    )}
                    {fu.couldNotAnswer && (
                      <p className="text-sm text-warn-fg mb-1">
                        Could not answer: {fu.couldNotAnswer}
                      </p>
                    )}
                    <button
                      onClick={() => startEdit(fu)}
                      className="text-sm text-accent hover:underline mt-2"
                    >
                      Record follow-up →
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function WozConsole() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [metrics, setMetrics] = useState<WozMetrics | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);

  const loadData = useCallback(async () => {
    try {
      const [metricsRes, participantsRes, threadsRes] = await Promise.all([
        fetch("/woz/api/metrics"),
        fetch("/woz/api/participants"),
        fetch("/woz/api/threads"),
      ]);

      if (metricsRes.status === 401) {
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);
      setMetrics(await metricsRes.json());
      setParticipants(await participantsRes.json());
      setThreads(await threadsRes.json());
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <p className="text-ink-muted">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={loadData} />;
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "participants", label: "Participants" },
    { id: "inbox", label: "Inbox" },
    { id: "follow-ups", label: "Follow-ups" },
  ];

  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-card border-b border-line">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-ink">WoZ Console</h1>
              <p className="text-sm text-ink-muted">
                The Concierge — Fieldwork Test
              </p>
            </div>
            <button
              onClick={async () => {
                await fetch("/woz/api/auth", { method: "DELETE" });
                setIsAuthenticated(false);
              }}
              className="text-sm text-ink-muted hover:text-ink"
            >
              Log out
            </button>
          </div>
          <nav className="flex gap-1 mt-4 -mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-paper text-ink border-t border-x border-line"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {activeTab === "dashboard" && <Dashboard metrics={metrics} />}
        {activeTab === "participants" && (
          <ParticipantsList participants={participants} onRefresh={loadData} />
        )}
        {activeTab === "inbox" && (
          <Inbox
            threads={threads}
            participants={participants}
            onRefresh={loadData}
          />
        )}
        {activeTab === "follow-ups" && <FollowUpsList onRefresh={loadData} />}
      </main>
    </div>
  );
}
