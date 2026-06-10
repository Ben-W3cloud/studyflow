"use client";
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { ChatMessage } from '../../lib/types';
import { uploadResponseSchema } from '../../lib/validation';
import { useStudyStore } from '../../store/study-store';
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

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (typeof data.error === 'string') return data.error;
  } catch {
    // ignore
  }
  return 'Something went wrong. Please try again.';
}

export function StudyChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mode, setMode] = useState<'summary' | 'detailed' | 'roadmap'>('summary');
  const [phase, setPhase] = useState<AppPhase>('landing');
  const [pasteText, setPasteText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingIndex, setStreamingIndex] = useState<number | null>(null);

  const material = useStudyStore((state) => state.material);
  const setMaterial = useStudyStore((state) => state.setMaterial);

  async function handleFileUpload(file: File) {
    setPhase('analyzing');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });

      if (!res.ok) {
        throw new Error(await parseErrorMessage(res));
      }

      const data = uploadResponseSchema.parse(await res.json());
      setMaterial(data.text, data.fileName);
      setPhase('mode');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload file');
      setPhase('landing');
    }
  }

  function handlePasteAnalysis() {
    const text = pasteText.trim();
    if (!text) return;

    setMaterial(text);
    setPhase('mode');
  }

  async function handleSend(text: string) {
    if (isStreaming || !material.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: text };
    const history = [...messages, userMessage];
    const assistantIndex = history.length;

    setMessages([...history, { role: 'assistant', content: '' }]);
    setIsStreaming(true);
    setStreamingIndex(assistantIndex);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          material,
          messages: history,
        }),
      });

      if (!res.ok) {
        throw new Error(await parseErrorMessage(res));
      }

      if (!res.body) {
        throw new Error('No response stream received');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let content = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        content += decoder.decode(value, { stream: true });
        const nextContent = content;

        setMessages((current) =>
          current.map((message, index) =>
            index === assistantIndex ? { ...message, content: nextContent } : message
          )
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get response';
      toast.error(message);
      setMessages((current) => {
        const next = [...current];
        const assistant = next[assistantIndex];
        if (assistant?.role === 'assistant' && !assistant.content.trim()) {
          next.splice(assistantIndex, 1);
        }
        return next;
      });
    } finally {
      setIsStreaming(false);
      setStreamingIndex(null);
    }
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
                <BookOpen aria-hidden="true" size={24} />
              </div>
              <span className="text-xl font-semibold">StudyFlow</span>
            </div>
            <h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
              Understand Anything Faster
            </h1>
            <p className="mt-1 max-w-lg text-base leading-7 text-[var(--muted)]">
              Upload study material and learn it the way your brain prefers.
            </p>
          </div>

          <div className="space-y-5">
            <UploadDropzone onUpload={handleFileUpload} />
            <div className="rounded-[16px] border border-[var(--border)] bg-white p-4 sm:p-5">
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
                <Button type="button" onClick={handlePasteAnalysis} disabled={!pasteText.trim()}>
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
                    <Message
                      key={`${message.role}-${index}`}
                      message={message}
                      isStreaming={isStreaming && streamingIndex === index}
                    />
                  ))
                )}
              </div>
            </main>

            <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--border)] bg-[var(--background)]/92 px-3 py-3 backdrop-blur sm:px-5 lg:left-72">
              <ChatInput onSend={handleSend} disabled={isStreaming} />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
