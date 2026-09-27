"use client";

import * as React from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { DocumentTitle } from "@/components/ui/document-title";
import { Error404 } from "@/components/ui/pixeleted-404-not-found";
import { cn } from "@/lib/utils";

/** Page du site public qui plante : même design que la page introuvable, avec « Réessayer ». */
export default function PageError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const { lang, t, href } = useI18n();
  const e = t.errorPage;

  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <DocumentTitle title={e.title} />
      <Error404
        code="500"
        heading={e.heading}
        subtext={e.subtext}
        curvedTextTop={t.notFound.curvedTop}
        curvedTextBottom={t.notFound.curvedBottom}
        postcardSlug={e.slug}
        postcardLabel={e.label}
        pixelHeading={lang !== "ar"}
        actions={
          <>
            <Button size="lg" className="h-11 rounded-lg px-6" onClick={() => retry()}>
              <RotateCcw className="size-4" />
              {e.retry}
            </Button>
            <Link href={href("/")} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 rounded-lg px-6")}>
              {e.back}
            </Link>
          </>
        }
      />
    </>
  );
}
