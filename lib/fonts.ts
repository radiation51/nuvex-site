import { Bricolage_Grotesque, IBM_Plex_Sans_Arabic, Manrope, Noto_Kufi_Arabic } from "next/font/google";

export const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

// Polices de la version arabe : téléchargées uniquement sur les pages en arabe.
export const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  preload: false,
});

export const kufiArabic = Noto_Kufi_Arabic({
  variable: "--font-arabic-display",
  subsets: ["arabic"],
  weight: ["500", "600", "700", "800"],
  preload: false,
});
