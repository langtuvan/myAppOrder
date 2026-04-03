"use client";

import { useLanguageStore } from "@/store/language";
import { NavbarItem } from "./navbar";

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

export function LanguageToggleNavbarItem() {
  const locale = useLanguageStore((state) => state.locale);
  const setLocale = useLanguageStore((state) => state.setLocale);

  if (locale === "en") {
    return (
      <NavbarItem
        aria-label="Toggle Language"
        onClick={() => setLocale("vi")}
        className="font-semibold text-amber-600 dark:text-zinc-100"
      >
        VI
      </NavbarItem>
    );
  }

  return (
    <NavbarItem
      onClick={() => setLocale("en")}
      className="font-semibold text-blue-600 dark:text-zinc-100"
    >
      EN
    </NavbarItem>
  );
}
