"use client";
import React from 'react';
import { LearningMode } from '../../lib/types';
import { ModeCard } from './ModeCard';

export function ModeSelector({ value, onChange }: { value: LearningMode; onChange: (m: LearningMode) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {(['summary', 'detailed', 'roadmap'] as LearningMode[]).map((m) => (
        <ModeCard
          key={m}
          mode={m}
          selected={value === m}
          onSelect={onChange}
        />
      ))}
    </div>
  );
}
