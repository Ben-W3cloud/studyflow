"use client";

import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { ChatMessage } from '../../lib/types';
import { Button } from '../ui/Button';
import { Loader2, RefreshCw, X } from 'lucide-react';

export function Message({
  message,
  isStreaming = false,
}: {
  message: ChatMessage;
  isStreaming?: boolean;
}) {
  const isUser = message.role === 'user';
  const [expanded, setExpanded] = useState(false);
  const time = message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : null;

  const isLong = useMemo(() => message.content.length > 800, [message.content]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={isUser ? 'flex justify-end' : 'w-full'}
    >
      {isUser ? (
        <div className="max-w-[82%] rounded-[8px] border border-[var(--border)] bg-white px-4 py-3 text-sm leading-6 shadow-sm">
          <div className="whitespace-pre-wrap">{message.content}</div>
          <div className="mt-2 flex items-center justify-end gap-2 text-xs text-[var(--muted)]">
            {time ? <span>{time}</span> : null}
            <span>you</span>
          </div>
        </div>
      ) : (
        <article className="study-article w-full">
          <div className="rounded-[8px] border border-[var(--border)] bg-white p-4 text-sm leading-6 shadow-sm">
            <div className="prose max-w-none">
              <ReactMarkdown>{isLong && !expanded ? `${message.content.slice(0, 800)}...` : message.content}</ReactMarkdown>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs text-[var(--muted)]">
                {time ? <span>{time}</span> : null}
                {message.source ? <span className="ml-2">• {message.source}</span> : null}
              </div>
              <div className="flex items-center gap-2">
                {message.status === 'streaming' || isStreaming ? (
                  <span className="flex items-center gap-2 text-[var(--muted)]">
                    <Loader2 className="animate-spin" size={14} />
                    <span className="text-xs">Streaming...</span>
                    <Button size="sm" variant="ghost" onClick={() => window.dispatchEvent(new CustomEvent('studyflow-stop'))}>
                      <X size={14} />
                    </Button>
                  </span>
                ) : null}

                {message.status === 'error' ? (
                  <span className="flex items-center gap-2">
                    <span className="text-xs text-red-600">Error</span>
                    <Button size="sm" variant="ghost" onClick={() => window.dispatchEvent(new CustomEvent('studyflow-retry', { detail: { id: message.id } }))}>
                      <RefreshCw size={14} /> Retry
                    </Button>
                  </span>
                ) : null}

                {isLong ? (
                  <button type="button" onClick={() => setExpanded((v) => !v)} className="text-xs text-[var(--primary)]">
                    {expanded ? 'Show less' : 'Show more'}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
          {message.status === 'error' && message.errorMessage ? (
            <div className="mt-2 rounded-[8px] border-l-4 border-red-400 bg-red-50 p-3 text-sm text-red-700">
              {message.errorMessage}
            </div>
          ) : null}
        </article>
      )}
    </motion.div>
  );
}
