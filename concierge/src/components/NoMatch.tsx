"use client";

interface NoMatchProps {
  clarifyingQuestion: string;
  onTryAgain: () => void;
}

export function NoMatch({ clarifyingQuestion, onTryAgain }: NoMatchProps) {
  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <h2 className="text-lg font-medium text-gray-900 mb-3">
          I need a bit more to go on
        </h2>
        <p className="text-gray-700 mb-4">{clarifyingQuestion}</p>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Try describing:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>What just happened or what&apos;s about to happen</li>
            <li>What you&apos;re trying to figure out</li>
            <li>What&apos;s frustrating you right now</li>
          </ul>
        </div>
      </div>
      <button
        onClick={onTryAgain}
        className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg font-medium
                   hover:bg-gray-800 transition-colors"
      >
        Try a different question
      </button>
    </div>
  );
}
