import { MAX_MATERIAL_CHARS, CHAT_CHUNK_MAX_CHARS, CHAT_CHUNK_OVERLAP } from './constants';
import { SYSTEM_PROMPT } from './prompts';
import { prompts } from './prompts';
import { LearningMode } from './types';
import { splitIntoChunks } from './chunk';
import { extractiveSummarize } from './summarize';

export function truncateMaterial(text: string): string {
  if (text.length <= MAX_MATERIAL_CHARS) return text;
  return text.slice(0, MAX_MATERIAL_CHARS) + '\n\n[Material truncated due to length limits.]';
}

export function buildSystemPrompt(mode: LearningMode, material: string): string {
  let processed = material;

  // If material is very large, produce small local summaries of chunks and send the combined summary.
  if (material.length > MAX_MATERIAL_CHARS) {
    const chunks = splitIntoChunks(material, CHAT_CHUNK_MAX_CHARS, CHAT_CHUNK_OVERLAP);
    const summaries = chunks.map((c) => extractiveSummarize(c, 3));
    processed = `Summaries of material (preprocessed):\n\n${summaries.join('\n\n')}\n\n[Original material truncated due to length.]`;
  } else {
    processed = truncateMaterial(material);
  }

  return `${SYSTEM_PROMPT}
    
  Current Learning Mode:
  
  ${prompts[mode].trim()}
  
  --- STUDY MATERIAL ---
  
  ${processed}
  
  --- END STUDY MATERIAL ---
  `;
  }
  