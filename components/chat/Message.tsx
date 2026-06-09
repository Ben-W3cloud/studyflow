"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { ChatMessage } from '../../lib/types';

export function Message({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={isUser ? 'flex justify-end' : 'w-full'}
    >
      {isUser ? (
        <div className="max-w-[82%] rounded-[8px] border border-[var(--border)] bg-white px-4 py-3 text-sm leading-6 shadow-sm">
          {message.content}
        </div>
      ) : (
        <article className="study-article w-full">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </article>
      )}
    </motion.div>
  );
}
