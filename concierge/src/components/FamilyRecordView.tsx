"use client";

import { useState, useMemo, useCallback } from "react";
import {
  getFamilyRecord,
  FamilyRecord,
  removeFromFamilyRecord,
  exportFamilyRecord,
  clearFamilyRecord,
} from "@/lib/storage";

interface FamilyRecordViewProps {
  onClose: () => void;
}

export function FamilyRecordView({ onClose }: FamilyRecordViewProps) {
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [copied, setCopied] = useState(false);

  const record = useMemo<FamilyRecord | null>(() => {
    if (typeof window === "undefined") return null;
    return getFamilyRecord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateTrigger]);

  const handleRemove = useCallback((id: string) => {
    removeFromFamilyRecord(id);
    setUpdateTrigger((t) => t + 1);
  }, []);

  const handleCopy = useCallback(async () => {
    const text = exportFamilyRecord();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleClear = useCallback(() => {
    if (
      window.confirm(
        "Clear all saved records? This cannot be undone."
      )
    ) {
      clearFamilyRecord();
      setUpdateTrigger((t) => t + 1);
    }
  }, []);

  if (!record || record.records.length === 0) {
    return (
      <div className="fixed inset-0 bg-ink/50 flex items-center justify-center p-4 z-50">
        <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-ink">
              Mom&apos;s Care File
            </h2>
            <button
              onClick={onClose}
              className="text-ink-muted hover:text-ink"
            >
              ✕
            </button>
          </div>
          <p className="text-ink-muted">
            No records saved yet. When you get advice that helps, save it here
            to build your family&apos;s care reference.
          </p>
          <button
            onClick={onClose}
            className="mt-6 w-full px-4 py-2 bg-ink text-card rounded-lg
                       hover:bg-ink/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-line p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-ink">
              Mom&apos;s Care File
            </h2>
            <p className="text-sm text-ink-muted">
              {record.records.length} saved{" "}
              {record.records.length === 1 ? "record" : "records"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-ink-muted hover:text-ink text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-6">
          {record.records.map((item) => (
            <div
              key={item.id}
              className="border border-line rounded-lg p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-ink">{item.question}</p>
                  <p className="text-xs text-ink-muted">
                    Saved {new Date(item.savedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-ink-muted hover:text-warn-fg text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="text-sm text-ink-muted">
                <p className="font-medium text-ink-muted text-xs uppercase tracking-wide mb-1">
                  The Move
                </p>
                <p className="whitespace-pre-line text-ink">{item.answer.theMove}</p>
              </div>
              {item.answer.whatToSay && (
                <div className="text-sm">
                  <p className="font-medium text-ink-muted text-xs uppercase tracking-wide mb-1">
                    What to Say
                  </p>
                  <p className="italic text-ink-muted">{item.answer.whatToSay}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-card border-t border-line p-4 space-y-2">
          <button
            onClick={handleCopy}
            className="w-full px-4 py-2 border-2 border-line rounded-lg font-medium
                       hover:border-ink-muted transition-colors text-ink"
          >
            {copied ? "✓ Copied to clipboard" : "Copy all as text (to share)"}
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleClear}
              className="flex-1 px-4 py-2 text-warn-fg hover:text-warn-fg/80 text-sm"
            >
              Clear all
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-ink text-card rounded-lg
                         hover:bg-ink/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
