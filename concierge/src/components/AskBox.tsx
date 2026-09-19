"use client";

import { useState, FormEvent } from "react";
import { exampleQuestions } from "@/lib/examples";

interface AskBoxProps {
  onSubmit: (question: string) => void;
  isLoading?: boolean;
}

export function AskBox({ onSubmit, isLoading = false }: AskBoxProps) {
  const [question, setQuestion] = useState("");
  const [placeholderIndex] = useState(() =>
    Math.floor(Math.random() * exampleQuestions.length)
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (question.trim() && !isLoading) {
      onSubmit(question.trim());
    }
  };

  const handleExampleClick = (example: string) => {
    if (!isLoading) {
      setQuestion(example);
      onSubmit(example);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={exampleQuestions[placeholderIndex]}
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

      <div className="mt-6">
        <p className="text-sm text-gray-500 mb-3">Or try one of these:</p>
        <div className="flex flex-wrap gap-2">
          {exampleQuestions.slice(0, 4).map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleExampleClick(example)}
              disabled={isLoading}
              className="px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg
                         hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors text-left"
            >
              {example.length > 50 ? example.slice(0, 50) + "..." : example}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
