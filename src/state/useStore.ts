import { create } from "zustand";

type State = {
  demoMode: boolean;
  theme: "light" | "dark";
  setDemoMode: (v: boolean) => void;
  toggleTheme: () => void;
};

export const useStore = create<State>((set) => ({
  demoMode: process.env.NEXT_PUBLIC_DEMO_MODE === "true",
  theme: "light",
  setDemoMode: (v) => set({ demoMode: v }),
  toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
}));
