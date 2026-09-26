"use client";

import { usePathname } from "next/navigation";
import { useI18n } from "@/components/i18n-provider";
import { LOCALE_COOKIE, localeNames, localePath, localeShort, locales, stripLocale, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/** Retient le choix : la prochaine visite de « / » ouvrira directement cette langue. */
function remember(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

/** Sélecteur discret « FR · EN · ع » : la langue active est soulignée en vert citron. */
export function LanguageSwitcher({ light, className }: { light?: boolean; className?: string }) {
  const { lang, t } = useI18n();
  const path = stripLocale(usePathname() ?? "/");

  return (
    // Toujours dans le même ordre « FR EN ع », quelle que soit la langue de la page.
    <nav dir="ltr" aria-label={t.nav.language} className={cn("flex items-center gap-2.5", className)}>
      {locales.map((locale) => {
        const active = locale === lang;
        return (
          <a
            key={locale}
            href={localePath(locale, path)}
            hrefLang={locale}
            lang={locale}
            title={localeNames[locale]}
            aria-label={localeNames[locale]}
            aria-current={active ? "true" : undefined}
            onClick={(event) => {
              remember(locale);
              if (active) {
                event.preventDefault();
                return;
              }
              // Garde la section affichée (ex. #offres) en changeant de langue.
              event.currentTarget.href = localePath(locale, path) + window.location.hash;
            }}
            className={cn(
              "tap py-1 text-xs font-semibold tracking-wide underline-offset-[6px]",
              locale === "ar" && "text-sm leading-none",
              active
                ? cn("underline decoration-lime decoration-2", light ? "text-white" : "text-foreground")
                : light
                  ? "text-white/65 hover:text-white"
                  : "text-muted-foreground hover:text-foreground"
            )}
          >
            {localeShort[locale]}
          </a>
        );
      })}
    </nav>
  );
}
