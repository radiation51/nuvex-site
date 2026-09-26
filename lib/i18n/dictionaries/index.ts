import type { Locale } from "@/lib/i18n/config";
import { ar } from "./ar";
import { en } from "./en";
import { fr, type Dictionary } from "./fr";

export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { fr, en, ar };

export const getDictionary = (locale: Locale) => dictionaries[locale];

export { fill } from "@/lib/i18n/fill";
