// Langues du site. Le français reste à l'adresse d'origine (« / »), les autres ont leur préfixe (« /en », « /ar »).
export const locales = ["fr", "en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

/** Cookie qui retient la langue choisie avec le sélecteur. */
export const LOCALE_COOKIE = "nuvex_lang";

export const localeNames: Record<Locale, string> = { fr: "Français", en: "English", ar: "العربية" };
/** Libellé court du sélecteur. */
export const localeShort: Record<Locale, string> = { fr: "FR", en: "EN", ar: "ع" };
/** Langue utilisée pour les dates et les nombres. */
export const intlLocale: Record<Locale, string> = { fr: "fr-FR", en: "en-GB", ar: "ar-DZ-u-nu-latn" };

export const hasLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

export const dirOf = (locale: Locale) => (locale === "ar" ? "rtl" : "ltr");

/**
 * Adresse d'une page dans une langue : localePath("en", "/#contact") → "/en#contact",
 * localePath("fr", "/politique-de-confidentialite") → "/politique-de-confidentialite".
 */
export function localePath(locale: Locale, path = "/") {
  if (locale === defaultLocale) return path;
  if (path === "/") return `/${locale}`;
  if (path.startsWith("/#")) return `/${locale}${path.slice(1)}`;
  return `/${locale}${path}`;
}

/** Retire le préfixe de langue d'une adresse : "/en/politique" → "/politique". */
export function stripLocale(pathname: string) {
  const [, first, ...rest] = pathname.split("/");
  if (first && hasLocale(first)) return `/${rest.join("/")}`;
  return pathname || "/";
}
