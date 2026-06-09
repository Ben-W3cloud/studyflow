"use client";

import { Sparkles } from 'lucide-react';

const suggestions = [
  'What are the key concepts?',
  "Explain this topic like I'm a beginner.",
  'What should I learn first?',
];

export function EmptyState({ onSuggestion }: { onSuggestion: (text: string) => void }) {
  return (
    <div className="mx-auto flex min-h-[58vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-pink-50 text-[var(--primary)]">
        <Sparkles aria-hidden="true" size={22} />
      </div>
      <h2 className="text-2xl font-semibold">Ask anything about your study material.</h2>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSuggestion(suggestion)}
            className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--foreground)] transition hover:border-[var(--primary)] hover:bg-pink-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
