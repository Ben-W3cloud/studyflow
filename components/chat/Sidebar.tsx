"use client";

import React from 'react';
import { BookOpen, Plus, Settings, Pin, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { LearningMode } from '../../lib/types';
import { Session } from '../../store/study-store';

const modeLabels: Record<LearningMode, string> = {
  summary: 'Quick Summary',
  detailed: 'Detailed Report',
  roadmap: 'Learning Roadmap',
};

export function Sidebar({
  mode,
  sessions = [],
  onNewSession,
  onLoadSession,
  onPin,
  onDelete,
  onOpenSettings,
}: {
  mode: LearningMode;
  sessions?: Session[];
  onNewSession?: () => void;
  onLoadSession?: (id: string) => void;
  onPin?: (id: string) => void;
  onDelete?: (id: string) => void;
  onOpenSettings?: () => void;
}) {
  const [q, setQ] = React.useState('');
  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-[var(--border)] bg-[#f7f3ee] px-5 py-6 lg:flex lg:flex-col">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[var(--foreground)] text-white">
          <BookOpen aria-hidden="true" size={18} />
        </div>
        <span className="text-lg font-semibold">StudyFlow</span>
      </div>

      <Button type="button" variant="secondary" className="mt-8 w-full justify-start" onClick={onNewSession}>
        <Plus aria-hidden="true" size={18} />
        New Session
      </Button>

      <div className="mt-8">
        <p className="px-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Recent Sessions</p>
        <div className="mt-3">
          <input
            aria-label="Search sessions"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search sessions"
            className="w-full rounded-[8px] border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none"
          />
        </div>
        <div className="mt-3 space-y-2">
          {sessions.filter((s) => s.name?.toLowerCase().includes(q.toLowerCase()) || s.material.toLowerCase().includes(q.toLowerCase())).length === 0 ? (
            <div className="rounded-[8px] px-3 py-2 text-sm text-[var(--muted)]">No sessions</div>
          ) : (
            sessions
              .filter((s) => s.name?.toLowerCase().includes(q.toLowerCase()) || s.material.toLowerCase().includes(q.toLowerCase()))
              .map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-[8px] px-3 py-2 text-sm text-[var(--muted)] hover:bg-white">
                  <div
                    onClick={() => onLoadSession?.(s.id)}
                    role="button"
                    tabIndex={0}
                    className="cursor-pointer"
                  >
                    <div className="font-medium text-[var(--foreground)]">{(s.name ?? s.material.slice(0, 40)) || 'Untitled'}</div>
                    <div className="text-xs text-[var(--muted)]">{new Date(s.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="ml-2 flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={s.pinned ? 'Unpin session' : 'Pin session'}
                      onClick={() => onPin?.(s.id)}
                      className={`text-[var(--muted)] ${s.pinned ? 'text-[var(--primary)]' : ''}`}
                    >
                      <Pin size={14} />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete session"
                      onClick={() => onDelete?.(s.id)}
                      className="text-[var(--muted)]"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
          )}
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
          onClick={onOpenSettings}
          className="flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-sm text-[var(--muted)] transition hover:bg-white hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
        >
          <Settings aria-hidden="true" size={17} />
          Settings
        </button>
      </div>
    </aside>
  );
}
