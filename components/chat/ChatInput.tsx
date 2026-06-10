"use client";
import React, { useRef, useState } from 'react';
import { Paperclip, Send } from 'lucide-react';
import { Button } from '../ui/Button';

export function ChatInput({
  onSend,
  onAttach,
  disabled = false,
}: {
  onSend: (text: string) => void;
  onAttach?: (file: File) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState('');
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (disabled || !text.trim()) return;
        onSend(text.trim());
        setText('');
      }}
      className="mx-auto flex w-full max-w-[760px] items-end gap-2 rounded-[28px] border border-[var(--border)] bg-white p-2 shadow-lg shadow-stone-200/70"
    >
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        aria-label="Attach file"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            setSelectedFileName(file.name);
            try {
              if (onAttach) await onAttach(file as File);
            } finally {
              // reset so same file can be selected again
              if (fileRef.current) fileRef.current.value = '';
              // clear preview after a short delay
              setTimeout(() => setSelectedFileName(null), 3000);
            }
          }
        }}
      />

      <Button
        type="button"
        variant="icon"
        aria-label="Attach material"
        title="Attach material"
        className="shrink-0"
        onClick={() => fileRef.current?.click()}
      >
        <Paperclip aria-hidden="true" size={24} />
      </Button>
      <label htmlFor="studyflow-chat-input" className="sr-only">
        Ask about your study material
      </label>
      <textarea
        id="studyflow-chat-input"
        className="max-h-36 min-h-11 flex-1 resize-none bg-transparent px-2 py-3 text-sm leading-5 outline-none placeholder:text-[var(--muted)] disabled:opacity-50"
        value={text}
        rows={1}
        disabled={disabled}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            if (disabled) return;
            const value = text.trim();
            if (!value) return;
            onSend(value);
            setText('');
          }
        }}
        placeholder="Ask about your study material..."
      />
      <div className="flex items-center gap-2">
        {selectedFileName ? (
          <div className="mr-2 rounded-full bg-[var(--background)] px-3 py-1 text-xs text-[var(--muted)]">
            {selectedFileName}
          </div>
        ) : null}
        <Button
          type="submit"
          variant="primary"
          aria-label="Send message"
          disabled={disabled}
          className="h-11 w-11 shrink-0 px-0"
        >
          <Send aria-hidden="true" size={24} />
        </Button>
      </div>
    </form>
  );
}
