import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { bricolage, manrope } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.URL ?? "https://nuvex-agence.netlify.app"),
};

/** L'espace admin reste en français, avec sa propre mise en page. */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="fr" className={`${manrope.variable} ${bricolage.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {children}
        <Toaster position="top-center" richColors theme="light" />
      </body>
    </html>
  );
}
