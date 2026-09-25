import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Adresse du site (fournie par Netlify) : sert aux liens de l'image d'aperçu de partage.
  metadataBase: new URL(process.env.URL ?? "https://nuvex-agence.netlify.app"),
  title: "NUVEX — Sites web et logiciels de gestion en Algérie | À partir de 25 000 DA",
  description:
    "NUVEX crée des sites web modernes et des logiciels de gestion qui fonctionnent sans internet pour les entreprises en Algérie. Sites à partir de 25 000 DA, devis 100 % gratuit.",
  openGraph: {
    title: "NUVEX — Sites web et logiciels en Algérie",
    description: "Sites web à partir de 25 000 DA et logiciels de gestion sur mesure. Devis 100 % gratuit.",
    locale: "fr_DZ",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${manrope.variable} ${bricolage.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {children}
        <Toaster position="top-center" richColors theme="light" />
      </body>
    </html>
  );
}
