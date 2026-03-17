import { en } from "./en";
import { vi } from "./vi";

const locale: "en" | "vi" =
  (process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE as "en" | "vi") || "vi";

const formatted = {
  en,
  vi,
};

const language = formatted[locale];

export default language;
