import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/sonner";
import { bricolage, manrope } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.URL ?? "https://nuvex-algerie.netlify.app"),
  // Admin installable comme une application (notifications sur iPhone).
  appleWebApp: { capable: true, title: "NUVEX", statusBarStyle: "default" },
  icons: { apple: "/icons/icon-180.png" },
};

export const viewport: Viewport = { themeColor: "#3448e8" };

/** L'espace admin reste en français, avec sa propre mise en page. */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="fr" className={`${manrope.variable} ${bricolage.variable} h-full antialiased`}>
      <head>
        {/* Fiche d'application : envoyée avec le cookie admin (elle contient l'adresse secrète). */}
        <link rel="manifest" href="/api/admin/manifest" crossOrigin="use-credentials" />
      </head>
      <body className="flex min-h-full flex-col">
        {children}
        <Toaster position="top-center" richColors theme="light" />
      </body>
    </html>
  );
}
