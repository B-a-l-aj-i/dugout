import { create } from "zustand";

type ToggleStore = {
  isOpen: boolean;
  toggle: () => void;
};

export const useToggleStore = create<ToggleStore>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
