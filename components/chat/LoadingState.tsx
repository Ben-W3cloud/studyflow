"use client";

import { motion } from 'framer-motion';

export function LoadingState() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-6 text-center">
      <div className="mb-8 flex items-center gap-2" aria-hidden="true">
        {[0, 1, 2].map((item) => (
          <motion.span
            key={item}
            className="h-3 w-3 rounded-full bg-[var(--primary)]"
            animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: item * 0.12 }}
          />
        ))}
      </div>
      <h1 className="text-2xl font-semibold">Analyzing your material...</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">
        Identifying concepts, definitions, formulas and key topics.
      </p>
      <span className="sr-only">Analyzing your material</span>
    </div>
  );
}
