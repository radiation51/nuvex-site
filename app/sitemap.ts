import type { MetadataRoute } from "next";
import { locales, localePath } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/site";

// /sitemap.xml : les pages publiques, chacune avec ses 3 langues (fr, en, ar).
const PAGES = [
  { path: "/", priority: 1 },
  { path: "/services", priority: 0.8 },
  { path: "/politique-de-confidentialite", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap(({ path, priority }) =>
    locales.map((lang) => ({
      url: `${SITE_URL}${localePath(lang, path)}`,
      changeFrequency: "weekly" as const,
      priority,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}${localePath(l, path)}`])) },
    })),
  );
}
