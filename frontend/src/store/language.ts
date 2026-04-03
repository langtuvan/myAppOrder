"use client";

import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";

export type AppLocale = "en" | "vi";

type LanguageState = {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  toggleLocale: () => void;
};

const fallbackLocale: AppLocale =
  (process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE as AppLocale) || "vi";

const storage: StateStorage = {
  getItem: (name) => {
    if (typeof window === "undefined") {
      return null;
    }
    return window.localStorage.getItem(name);
  },
  setItem: (name, value) => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(name, value);
  },
  removeItem: (name) => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.removeItem(name);
  },
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      locale: fallbackLocale,
      setLocale: (locale) => set({ locale }),
      toggleLocale: () => set({ locale: get().locale === "vi" ? "en" : "vi" }),
    }),
    {
      name: "language",
      version: 1,
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({ locale: state.locale }),
    },
  ),
);
