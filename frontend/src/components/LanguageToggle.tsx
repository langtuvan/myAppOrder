"use client";

import { useLanguageStore } from "@/store/language";

export default function LanguageToggle() {
  const locale = useLanguageStore((state) => state.locale);
  const setLocale = useLanguageStore((state) => state.setLocale);

  if (locale === "en") {
    return (
      <span
        onClick={() => setLocale("vi")}
        className={
          locale === "en"
            ? "font-semibold text-amber-600 dark:text-zinc-100"
            : "text-zinc-500"
        }
      >
        VI
      </span>
    );
  }

  return (
    <span
      onClick={() => setLocale("en")}
      className={
        locale === "vi"
          ? "font-semibold text-amber-600 dark:text-zinc-100"
          : "text-zinc-500"
      }
    >
      EN
    </span>
  );
}
