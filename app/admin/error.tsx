"use client";

import * as React from "react";
import { RefreshCw, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Error404 } from "@/components/ui/pixeleted-404-not-found";

/** Une page de l'admin plante : même design que la page introuvable du site, avec « Réessayer ». */
export default function AdminError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Error404
      code="500"
      heading="(Oups) Cette page de l'admin a trébuché."
      subtext="Un petit souci technique, vos données ne sont pas touchées. Réessayez ; si ça continue, rechargez l'admin."
      curvedTextTop="NUVEX · Espace admin"
      curvedTextBottom="Algérie"
      postcardSlug="admin"
      postcardLabel="Erreur passagère"
      actions={
        <>
          <Button size="lg" className="h-11 rounded-lg px-6" onClick={() => retry()}>
            <RotateCcw className="size-4" />
            Réessayer
          </Button>
          <Button size="lg" variant="outline" className="h-11 rounded-lg px-6" onClick={() => window.location.reload()}>
            <RefreshCw className="size-4" />
            Recharger l&apos;admin
          </Button>
        </>
      }
    />
  );
}
