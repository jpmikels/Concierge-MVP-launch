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
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Mom&apos;s Care File
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <p className="text-gray-600">
            No records saved yet. When you get advice that helps, save it here
            to build your family&apos;s care reference.
          </p>
          <button
            onClick={onClose}
            className="mt-6 w-full px-4 py-2 bg-gray-900 text-white rounded-lg
                       hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Mom&apos;s Care File
            </h2>
            <p className="text-sm text-gray-500">
              {record.records.length} saved{" "}
              {record.records.length === 1 ? "record" : "records"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-6">
          {record.records.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{item.question}</p>
                  <p className="text-xs text-gray-500">
                    Saved {new Date(item.savedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-gray-400 hover:text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="text-sm text-gray-700">
                <p className="font-medium text-gray-600 text-xs uppercase tracking-wide mb-1">
                  The Move
                </p>
                <p className="whitespace-pre-line">{item.answer.theMove}</p>
              </div>
              {item.answer.whatToSay && (
                <div className="text-sm">
                  <p className="font-medium text-gray-600 text-xs uppercase tracking-wide mb-1">
                    What to Say
                  </p>
                  <p className="italic text-gray-600">{item.answer.whatToSay}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 space-y-2">
          <button
            onClick={handleCopy}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg font-medium
                       hover:border-gray-400 transition-colors text-gray-700"
          >
            {copied ? "✓ Copied to clipboard" : "Copy all as text (to share)"}
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleClear}
              className="flex-1 px-4 py-2 text-red-600 hover:text-red-700 text-sm"
            >
              Clear all
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg
                         hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
