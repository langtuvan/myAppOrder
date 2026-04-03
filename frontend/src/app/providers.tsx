"use client";

import { createContext, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider, useTheme } from "next-themes";
import ThemeLayout from "@/layouts/ThemeLayout";
import { useLanguageStore } from "@/store/language";
import { dictionaries } from "@/dictionaries/locale";
import * as Yup from "yup";

function usePrevious<T>(value: T) {
  let ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

function ThemeWatcher() {
  let { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    let media = window.matchMedia("(prefers-color-scheme: dark)");

    function onMediaChange() {
      let systemTheme = media.matches ? "dark" : "light";
      if (resolvedTheme === systemTheme) {
        setTheme("system");
      }
    }

    onMediaChange();
    media.addEventListener("change", onMediaChange);

    return () => {
      media.removeEventListener("change", onMediaChange);
    };
  }, [resolvedTheme, setTheme]);

  return null;
}

function LocaleWatcher() {
  const locale = useLanguageStore((state) => state.locale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}

function YupLocaleWatcher() {
  const locale = useLanguageStore((state) => state.locale);

  useEffect(() => {
    Yup.setLocale(
      dictionaries[locale].validation as Parameters<typeof Yup.setLocale>[0],
    );
  }, [locale]);

  return null;
}

export const AppContext = createContext<{ previousPathname?: string }>({});

export function Providers({ children }: { children: React.ReactNode }) {
  let pathname = usePathname();
  let previousPathname = usePrevious(pathname);

  return (
    <AppContext.Provider value={{ previousPathname }}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <ThemeWatcher />
        <LocaleWatcher />
        <YupLocaleWatcher />
        <ThemeLayout>{children}</ThemeLayout>
      </ThemeProvider>
    </AppContext.Provider>
  );
}
