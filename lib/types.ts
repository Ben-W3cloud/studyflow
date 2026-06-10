export type LearningMode = 'summary' | 'detailed' | 'roadmap';

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
  status?: 'pending' | 'streaming' | 'done' | 'error';
  source?: 'uploaded' | 'pasted' | 'user';
  errorMessage?: string;
}
