export type LearningMode = 'summary' | 'detailed' | 'roadmap';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
