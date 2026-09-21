import { create } from 'zustand';

interface Family {
  _id: string;
  name: string;
  slug: string;
  role: string;
}

interface FamilyState {
  activeFamily: Family | null;
  families: Family[];
  setActive: (f: Family | null) => void;
  setFamilies: (f: Family[]) => void;
}

export const useFamilyStore = create<FamilyState>((set) => ({
  activeFamily: null,
  families: [],
  setActive: (activeFamily) => set({ activeFamily }),
  setFamilies: (families) => set({ families }),
}));