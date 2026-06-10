import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage, LearningMode } from '../lib/types';

export interface Session {
  id: string;
  name?: string;
  messages: ChatMessage[];
  mode: LearningMode;
  material: string;
  fileName?: string;
  createdAt: number;
}

interface StudyState {
  material: string;
  fileName?: string;
  sessions: Session[];
  setMaterial: (material: string, fileName?: string) => void;
  reset: () => void;
  saveSession: (s: Omit<Session, 'id' | 'createdAt'>) => string;
  getSession: (id: string) => Session | undefined;
  deleteSession: (id: string) => void;
  clearSessions: () => void;
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      material: '',
      fileName: undefined,
      sessions: [],

      setMaterial: (material, fileName) => set({ material, fileName }),

      reset: () => set({ material: '', fileName: undefined }),

      saveSession: (s) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const session: Session = { ...s, id, createdAt: Date.now() };
        set((state) => ({ sessions: [session, ...state.sessions] }));
        return id;
      },

      getSession: (id) => {
        return get().sessions.find((s) => s.id === id);
      },

      deleteSession: (id) => {
        set((state) => ({ sessions: state.sessions.filter((s) => s.id !== id) }));
      },

      clearSessions: () => set({ sessions: [] }),
    }),
    {
      name: 'studyflow-store',
      partialize: (state) => ({ sessions: state.sessions, material: state.material, fileName: state.fileName }),
    }
  )
);
