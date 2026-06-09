"use client";

import { motion } from 'framer-motion';
import { BookOpen, Check, ClipboardList, Map } from 'lucide-react';
import { LearningMode } from '../../lib/types';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

const modeCopy = {
  summary: {
    title: 'Quick Summary',
    description: 'Perfect for revision and exam preparation.',
    features: ['Key concepts', 'Important definitions', 'Revision notes', 'Main takeaways'],
    icon: ClipboardList,
  },
  detailed: {
    title: 'Detailed Report',
    description: 'Deep understanding through structured explanations.',
    features: ['Background context', 'Terminology', 'Core concepts', 'Applications'],
    icon: BookOpen,
  },
  roadmap: {
    title: 'Learning Roadmap',
    description: 'Master complex topics step-by-step.',
    features: ['Prerequisites', 'Learning path', 'Progression roadmap', 'Mastery checklist'],
    icon: Map,
  },
};

interface ModeCardProps {
  mode: LearningMode;
  selected: boolean;
  onSelect: (mode: LearningMode) => void;
}

export function ModeCard({ mode, selected, onSelect }: ModeCardProps) {
  const Icon = modeCopy[mode].icon;

  return (
    <motion.button
      type="button"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.18 }}
      onClick={() => onSelect(mode)}
      className="h-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
      aria-pressed={selected}
    >
      <Card
        className={cn(
          'h-full p-5 transition duration-200 sm:p-6',
          selected
            ? 'border-[var(--primary)] bg-pink-50/60 shadow-pink-100'
            : 'hover:border-[#ded8d2] hover:shadow-md hover:shadow-stone-200/60'
        )}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-[#f5f1ec] text-[var(--foreground)]">
            <Icon aria-hidden="true" size={22} />
          </div>
          {selected ? (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary)] text-white">
              <Check aria-hidden="true" size={16} />
            </span>
          ) : null}
        </div>
        <h3 className="text-lg font-semibold">{modeCopy[mode].title}</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{modeCopy[mode].description}</p>
        <ul className="mt-5 space-y-2 text-sm text-[var(--foreground)]">
          {modeCopy[mode].features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
              {feature}
            </li>
          ))}
        </ul>
      </Card>
    </motion.button>
  );
}
