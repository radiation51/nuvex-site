"use client";

import * as React from "react";

/** Change le titre de l'onglet (pour les pages qui ne peuvent pas définir leur titre côté serveur, comme la 404). */
export function DocumentTitle({ title }: { title: string }) {
  React.useEffect(() => {
    document.title = title;
  }, [title]);
  return null;
}
