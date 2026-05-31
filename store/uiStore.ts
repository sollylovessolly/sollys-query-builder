import { create } from "zustand"

export type ThemeMode = "dark" | "light"

interface UiStore {
  theme: ThemeMode
  toggleTheme: () => void
  setTheme: (theme: ThemeMode) => void
}

export const useUiStore = create<UiStore>((set) => ({
  theme: "dark",
  toggleTheme: () =>
    set(({ theme }) => ({
      theme: theme === "dark" ? "light" : "dark",
    })),
  setTheme: (theme) => set({ theme }),
}))
