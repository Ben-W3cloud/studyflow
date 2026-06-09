import { create } from 'zustand';

interface StudyState {
  material: string;

  setMaterial: (
    material: string
  ) => void;
}

export const useStudyStore =
  create<StudyState>((set) => ({
    material: "",

    setMaterial: (material) =>
      set({ material }),
  }));
