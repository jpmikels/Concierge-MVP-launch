"use client";

import { useState, FormEvent } from "react";

interface AskBoxProps {
  onSubmit: (question: string) => void;
  isLoading?: boolean;
}

const placeholders = [
  "Mom just moved in with us. What do I do first?",
  "The hospital is sending Dad home Friday with oxygen and pills. Is that it?",
  "She keeps asking the same question every ten minutes.",
  "My brother says he'll help but nothing happens.",
  "We got a $45,000 hospital bill and they say we're responsible.",
  "Mom started acting confused overnight. Is this her dementia getting worse?",
  "I need to be away for two days and nobody else knows how to do any of this.",
  "Is there a way to check she's okay while I'm at work?",
];

export function AskBox({ onSubmit, isLoading = false }: AskBoxProps) {
  const [question, setQuestion] = useState("");
  const [placeholderIndex] = useState(() =>
    Math.floor(Math.random() * placeholders.length)
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (question.trim() && !isLoading) {
      onSubmit(question.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={placeholders[placeholderIndex]}
          className="w-full min-h-[120px] p-4 text-lg border-2 border-gray-300 rounded-lg 
                     focus:border-gray-900 focus:outline-none resize-none
                     placeholder:text-gray-400 bg-white text-gray-900"
          disabled={isLoading}
          rows={3}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={!question.trim() || isLoading}
          className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg
                     hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed
                     transition-colors"
        >
          {isLoading ? "Finding the move..." : "What's the move?"}
        </button>
      </div>
    </form>
  );
}
