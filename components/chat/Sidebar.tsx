"use client";

import { BookOpen, Plus, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { LearningMode } from '../../lib/types';

const modeLabels: Record<LearningMode, string> = {
  summary: 'Quick Summary',
  detailed: 'Detailed Report',
  roadmap: 'Learning Roadmap',
};

export function Sidebar({ mode }: { mode: LearningMode }) {
  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-[var(--border)] bg-[#f7f3ee] px-5 py-6 lg:flex lg:flex-col">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[var(--foreground)] text-white">
          <BookOpen aria-hidden="true" size={18} />
        </div>
        <span className="text-lg font-semibold">StudyFlow</span>
      </div>

      <Button type="button" variant="secondary" className="mt-8 w-full justify-start">
        <Plus aria-hidden="true" size={18} />
        New Session
      </Button>

      <div className="mt-8">
        <p className="px-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          Recent Sessions
        </p>
        <div className="mt-3 space-y-2">
          {['Cell biology notes', 'Research methods', 'Calculus review'].map((item) => (
            <div
              key={item}
              className="rounded-[8px] px-3 py-2 text-sm text-[var(--muted)]"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-[8px] border border-[var(--border)] bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          Current Mode
        </p>
        <p className="mt-2 text-sm font-medium">{modeLabels[mode]}</p>
      </div>

      <div className="mt-auto">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-sm text-[var(--muted)] transition hover:bg-white hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
        >
          <Settings aria-hidden="true" size={17} />
          Settings
        </button>
      </div>
    </aside>
  );
}
