import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { I18nProvider } from "@/components/i18n-provider";
import { Toaster } from "@/components/ui/sonner";
import { bricolage, kufiArabic, manrope, plexArabic } from "@/lib/fonts";
import { dirOf, hasLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";
import "../globals.css";

// Seules les langues prévues existent (« /de » → page introuvable).
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const ogLocale = { fr: "fr_DZ", en: "en_GB", ar: "ar_DZ" } as const;

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    // Adresse du site (fournie par Netlify) : sert aux liens de l'image d'aperçu de partage.
    metadataBase: new URL(process.env.URL ?? "https://nuvex-agence.netlify.app"),
    title: t.meta.title,
    description: t.meta.description,
    openGraph: {
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
      locale: ogLocale[lang],
      type: "website",
    },
  };
}

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html
      lang={lang}
      dir={dirOf(lang)}
      className={cn(manrope.variable, bricolage.variable, lang === "ar" && [plexArabic.variable, kufiArabic.variable], "h-full antialiased")}
    >
      <body className="flex min-h-full flex-col">
        <I18nProvider lang={lang} t={getDictionary(lang)}>
          {children}
        </I18nProvider>
        <Toaster position="top-center" richColors theme="light" dir={dirOf(lang)} />
      </body>
    </html>
  );
}
