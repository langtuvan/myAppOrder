import { en } from "./en";
import { vi } from "./vi";
import { useLanguageStore } from "@/store/language";

export const dictionaries = {
  en,
  vi,
};

export type Dictionary = typeof en;

export function useDictionary(): Dictionary {
  const locale = useLanguageStore((state) => state.locale);
  return dictionaries[locale];
}

export function getDictionary(): Dictionary {
  const locale = useLanguageStore.getState().locale;
  return dictionaries[locale];
}
