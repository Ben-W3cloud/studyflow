"use client";
import React from 'react';
import { UploadDropzone } from './UploadDropzone';

export function PdfUploader({ onUpload }: { onUpload?: (file: File) => void }) {
  return <UploadDropzone onUpload={(file) => onUpload?.(file)} />;
}
