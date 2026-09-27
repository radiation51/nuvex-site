"use client";

// Dernier recours : même la mise en page du site a planté. Page autonome (son propre <html>), en français.
// Les polices sont chargées directement (next/font n'est pas disponible dans cette page).
import * as React from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Error404 } from "@/components/ui/pixeleted-404-not-found";
import { fr } from "@/lib/i18n/dictionaries/fr";
import { cn } from "@/lib/utils";
import "./globals.css";

const fonts = {
  "--font-sans": "'Manrope', ui-sans-serif, system-ui, sans-serif",
  "--font-display": "'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif",
  "--font-doto": "'Doto'",
} as React.CSSProperties;

export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const e = fr.errorPage;

  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="fr" translate="no" className="h-full antialiased" style={fonts}>
      <head>
        <title>{e.title}</title>
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- page autonome, sans next/font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700&family=Doto:wght@700;900&family=Manrope:wght@400;600&display=swap"
        />
      </head>
      <body className="min-h-full">
        <Error404
          code="500"
          heading={e.heading}
          subtext={e.subtext}
          curvedTextTop={fr.notFound.curvedTop}
          curvedTextBottom={fr.notFound.curvedBottom}
          postcardSlug={e.slug}
          postcardLabel={e.label}
          actions={
            <>
              <Button size="lg" className="h-11 rounded-lg px-6" onClick={() => retry()}>
                <RotateCcw className="size-4" />
                {e.retry}
              </Button>
              <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 rounded-lg px-6")}>
                {e.back}
              </Link>
            </>
          }
        />
      </body>
    </html>
  );
}
