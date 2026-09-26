"use client";

import * as React from "react";
import { dirOf, localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";

interface I18nValue {
  lang: Locale;
  dir: "ltr" | "rtl";
  t: Dictionary;
  /** Adresse d'une page dans la langue courante : href("/#contact"). */
  href: (path?: string) => string;
}

const I18nContext = React.createContext<I18nValue | null>(null);

/**
 * Donne la langue de la page et ses textes à tous les composants du site.
 * Les textes arrivent du serveur : seul le dictionnaire de la langue affichée est envoyé au navigateur.
 */
export function I18nProvider({ lang, t, children }: { lang: Locale; t: Dictionary; children: React.ReactNode }) {
  const value = React.useMemo<I18nValue>(
    () => ({ lang, dir: dirOf(lang), t, href: (path = "/") => localePath(lang, path) }),
    [lang, t]
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = React.useContext(I18nContext);
  if (!value) throw new Error("useI18n doit être utilisé dans <I18nProvider>.");
  return value;
}
