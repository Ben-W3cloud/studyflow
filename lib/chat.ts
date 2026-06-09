import { MAX_MATERIAL_CHARS } from './constants';
import { prompts } from './prompts';
import { LearningMode } from './types';

export function truncateMaterial(text: string): string {
  if (text.length <= MAX_MATERIAL_CHARS) return text;
  return text.slice(0, MAX_MATERIAL_CHARS) + '\n\n[Material truncated due to length limits.]';
}

export function buildSystemPrompt(mode: LearningMode, material: string): string {
  const truncated = truncateMaterial(material);

  return `${prompts[mode].trim()}

You are helping a student understand the study material below. Ground all answers in this material. Use clear markdown formatting. If asked about something not covered in the material, say so honestly.

--- STUDY MATERIAL ---
${truncated}
--- END STUDY MATERIAL ---`;
}
