"use client";
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { ChatMessage } from '../../lib/types';
import { Message } from './Message';
import { ChatInput } from './ChatInput';
import { ModeSelector } from './ModeSelector';
import { UploadDropzone } from '../upload/UploadDropzone';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { LoadingState } from './LoadingState';
import { Sidebar } from './Sidebar';
import { EmptyState } from './EmptyState';

type AppPhase = 'landing' | 'analyzing' | 'mode' | 'workspace';

const assistantResponses: Record<string, string> = {
  summary: `# Quick Study Summary

The material centers on a small set of ideas that connect into a larger argument. Start by identifying the core terms, then trace how each definition supports the examples that follow.

## Key Concepts

- **Foundational definitions:** the vocabulary you need before the rest of the material becomes easier to read.
- **Main relationships:** how each idea influences or depends on another.
- **Likely exam focus:** concepts that are repeated, contrasted, or applied in examples.

> A useful revision method is to turn each heading into a question, then answer it without looking at the source.

| Study Focus | What To Do |
| --- | --- |
| Definitions | Write concise one-line explanations |
| Examples | Explain why each example fits the concept |
| Gaps | Mark anything you cannot teach back clearly |`,
  detailed: `# Detailed Learning Report

This topic is best understood as a layered explanation. The first layer is terminology, the second is structure, and the third is application.

## Background Context

Before memorizing details, look for the reason the topic exists. Most academic material is answering a problem: a gap in understanding, a practical challenge, or a pattern that needs explanation.

## Core Explanation

1. Define the essential terms.
2. Group related ideas into categories.
3. Compare the categories using concrete examples.
4. Test your understanding by predicting what happens when one condition changes.

\`\`\`txt
Strong understanding = definition + example + consequence
\`\`\`

## Application

The fastest way to deepen comprehension is to apply the concept to a new case, then explain the result in plain language.`,
  roadmap: `# Learning Roadmap

Treat this material as a sequence. Do not begin with the hardest section; build enough context that the difficult parts have somewhere to attach.

## Step-by-Step Path

1. **Preview the structure:** skim headings, diagrams, formulas, and summaries.
2. **Learn prerequisites:** define terms that appear more than once.
3. **Study the central idea:** write the main claim in one sentence.
4. **Work through examples:** explain each example out loud.
5. **Check mastery:** create three questions the material should help you answer.

## Mastery Checklist

- I can explain the topic without copying the source.
- I can identify the most important vocabulary.
- I can connect examples back to the main idea.
- I know what to review next.`,
};

export function StudyChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mode, setMode] = useState<'summary' | 'detailed' | 'roadmap'>('summary');
  const [phase, setPhase] = useState<AppPhase>('landing');
  const [pasteText, setPasteText] = useState('');

  useEffect(() => {
    if (phase !== 'analyzing') return;
    const timer = window.setTimeout(() => setPhase('mode'), 1500);
    return () => window.clearTimeout(timer);
  }, [phase]);

  function startAnalysis() {
    setPhase('analyzing');
  }

  function handleSend(text: string) {
    setMessages((current) => [
      ...current,
      { role: 'user', content: text },
      { role: 'assistant', content: assistantResponses[mode] },
    ]);
  }

  return (
    <AnimatePresence mode="wait">
      {phase === 'landing' ? (
        <motion.main
          key="landing"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22 }}
          className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-5 py-10 sm:px-8"
        >
          <div className="mx-auto mb-10 flex w-full max-w-2xl flex-col items-center text-center">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[var(--foreground)] text-white">
                <BookOpen aria-hidden="true" size={20} />
              </div>
              <span className="text-xl font-semibold">StudyFlow</span>
            </div>
            <h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
              Understand Anything Faster
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-[var(--muted)]">
              Upload study material and learn it the way your brain prefers.
            </p>
          </div>

          <div className="space-y-5">
            <UploadDropzone onUpload={startAnalysis} />
            <div className="rounded-[8px] border border-[var(--border)] bg-white p-4 sm:p-5">
              <label htmlFor="study-material" className="mb-3 block text-sm font-medium">
                Or paste your study material
              </label>
              <Textarea
                id="study-material"
                value={pasteText}
                onChange={(event) => setPasteText(event.target.value)}
                placeholder="Paste lecture notes, textbook excerpts, research abstracts or assignment material..."
              />
              <div className="mt-4 flex justify-end">
                <Button type="button" onClick={startAnalysis} disabled={!pasteText.trim()}>
                  Analyze text
                </Button>
              </div>
            </div>
          </div>
        </motion.main>
      ) : null}

      {phase === 'analyzing' ? (
        <motion.div
          key="analyzing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <LoadingState />
        </motion.div>
      ) : null}

      {phase === 'mode' ? (
        <motion.main
          key="mode"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22 }}
          className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 py-10 sm:px-8"
        >
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <h1 className="text-3xl font-semibold sm:text-4xl">How would you like to learn this?</h1>
          </div>
          <ModeSelector value={mode} onChange={(nextMode) => setMode(nextMode)} />
          <div className="mt-8 flex justify-center">
            <Button type="button" size="lg" onClick={() => setPhase('workspace')}>
              Continue
            </Button>
          </div>
        </motion.main>
      ) : null}

      {phase === 'workspace' ? (
        <motion.div
          key="workspace"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="min-h-screen lg:flex"
        >
          <Sidebar mode={mode} />
          <div className="flex min-h-screen flex-1 flex-col">
            <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--background)]/95 px-5 py-4 backdrop-blur lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[var(--foreground)] text-white">
                  <BookOpen aria-hidden="true" size={18} />
                </div>
                <div>
                  <p className="font-semibold">StudyFlow</p>
                  <p className="text-xs text-[var(--muted)]">Learning workspace</p>
                </div>
              </div>
            </header>

            <main className="flex-1 px-5 pb-36 pt-8 sm:px-8 lg:pt-12">
              <div className="mx-auto max-w-[720px] space-y-8">
                {messages.length === 0 ? (
                  <EmptyState onSuggestion={handleSend} />
                ) : (
                  messages.map((message, index) => (
                    <Message key={`${message.role}-${index}`} message={message} />
                  ))
                )}
              </div>
            </main>

            <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--border)] bg-[var(--background)]/92 px-3 py-3 backdrop-blur sm:px-5 lg:left-72">
              <ChatInput onSend={handleSend} />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
