"use client";

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, UploadCloud } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

interface UploadDropzoneProps {
  onUpload: (file: File) => Promise<void> | void;
}

export function UploadDropzone({ onUpload }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) {
      setSelectedFile(file);
      // start upload flow and show progress
      (async () => {
        setUploading(true);
        setProgress(10);
        const t = setInterval(() => setProgress((p) => Math.min(90, p + Math.floor(Math.random() * 10))), 300);
        try {
          await onUpload(file as File);
          setProgress(100);
        } catch (e) {
          setProgress(0);
          throw e;
        } finally {
          clearInterval(t);
          setTimeout(() => {
            setUploading(false);
            setSelectedFile(null);
            setProgress(0);
          }, 700);
        }
      })();
    }
  }

  return (
    <Card
      className={cn(
        'p-4 transition duration-200 sm:p-5',
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
          'flex min-h-30 flex-col items-center justify-center rounded-[8px] border border-dashed border-[var(--border)] bg-[#fffdfb] px-4 py-6 text-center transition',
          isDragging && 'border-[var(--primary)] bg-pink-50/50'
        )}
      >
        {selectedFile ? (
          <div className="flex w-full flex-col items-center">
            <p className="text-sm font-medium">Uploading: {selectedFile.name}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            <div className="mt-3 w-full">
              <div className="h-2 w-full rounded-full bg-[var(--border)]">
                <div className="h-2 rounded-full bg-[var(--primary)]" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
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
