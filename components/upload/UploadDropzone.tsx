"use client";

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, UploadCloud } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

interface UploadDropzoneProps {
  onUpload: (file: File) => void;
}

export function UploadDropzone({ onUpload }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) onUpload(file);
  }

  return (
    <Card
      className={cn(
        'p-5 transition duration-200 sm:p-6',
        isDragging && 'border-[var(--primary)] bg-pink-50/40'
      )}
    >
      <div className="mb-5 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] bg-pink-50 text-[var(--primary)]">
          <UploadCloud aria-hidden="true" size={24} />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-normal">Upload Study Material</h2>
          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
            PDFs, lecture notes, research papers and textbooks
          </p>
        </div>
      </div>

      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
        className={cn(
          'flex min-h-44 flex-col items-center justify-center rounded-[8px] border border-dashed border-[var(--border)] bg-[#fffdfb] px-4 py-8 text-center transition',
          isDragging && 'border-[var(--primary)] bg-pink-50/50'
        )}
      >
        <FileText aria-hidden="true" className="mb-4 text-[var(--muted)]" size={30} />
        <p className="text-sm font-medium">Drop your file here</p>
        <p className="mt-1 text-sm text-[var(--muted)]">or choose a document from your computer below 20MB</p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-5"
          onClick={() => inputRef.current?.click()}
        >
          Browse file
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown"
          className="sr-only"
          aria-label="Upload study material"
          onChange={(event) => handleFiles(event.target.files)}
        />
      </motion.div>
    </Card>
  );
}
