import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type Locale = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh';

export interface AppState {
  theme: Theme;
  locale: Locale;
  aiKillSwitch: boolean;
  setTheme: (theme: Theme) => void;
  setLocale: (locale: Locale) => void;
  toggleAiKillSwitch: () => void;
  setAiKillSwitch: (value: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Default state
      theme: 'system',
      locale: 'en',
      aiKillSwitch: false,

      // Actions
      setTheme: (theme) => set({ theme }),
      setLocale: (locale) => set({ locale }),
      toggleAiKillSwitch: () => set((state) => ({ aiKillSwitch: !state.aiKillSwitch })),
      setAiKillSwitch: (value) => set({ aiKillSwitch: value }),
    }),
    {
      name: 'phoenix-workshop-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
