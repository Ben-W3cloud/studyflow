import { create } from 'zustand';

interface StudyState {
  material: string;
  fileName?: string;
  setMaterial: (material: string, fileName?: string) => void;
  reset: () => void;
}

export const useStudyStore = create<StudyState>((set) => ({
  material: '',
  fileName: undefined,

  setMaterial: (material, fileName) => set({ material, fileName }),

  reset: () => set({ material: '', fileName: undefined }),
}));
