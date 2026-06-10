import { MAX_MATERIAL_CHARS } from './constants';
import { SYSTEM_PROMPT } from './prompts';
import { prompts } from './prompts';
import { LearningMode } from './types';

export function truncateMaterial(text: string): string {
  if (text.length <= MAX_MATERIAL_CHARS) return text;
  return text.slice(0, MAX_MATERIAL_CHARS) + '\n\n[Material truncated due to length limits.]';
}

export function buildSystemPrompt(mode: LearningMode, material: string): string {
  const truncated = truncateMaterial(material);

  return `${SYSTEM_PROMPT}
    
  Current Learning Mode:
  
  ${prompts[mode].trim()}
  
  --- STUDY MATERIAL ---
  
  ${truncated}
  
  --- END STUDY MATERIAL ---
  `;
  }
  