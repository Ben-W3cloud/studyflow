import { z } from 'zod';

export const learningModeSchema = z.enum(['summary', 'detailed', 'roadmap']);

export const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1),
});

export const chatRequestSchema = z.object({
  mode: learningModeSchema,
  material: z.string().min(1),
  messages: z.array(chatMessageSchema),
});

export const uploadResponseSchema = z.object({
  text: z.string(),
  fileName: z.string().optional(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type UploadResponse = z.infer<typeof uploadResponseSchema>;
