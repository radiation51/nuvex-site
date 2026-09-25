"use client";

import * as React from "react";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoaderProps {
  title?: string;
  /** Messages rassurants qui défilent l'un après l'autre. */
  messages?: string[];
  /** Affiche « Connexion sécurisée » sous le chargement. */
  secure?: boolean;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Chargement aux couleurs de NUVEX : logo « N » entouré d'un anneau qui tourne,
 * halo qui respire, barre de progression et message qui change. Animations CSS uniquement (légères).
 */
export function Loader({ title, messages = [], secure, size = "md", className }: LoaderProps) {
  const [index, setIndex] = React.useState(0);
  const small = size === "sm";

  React.useEffect(() => {
    if (messages.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % messages.length), 1800);
    return () => window.clearInterval(id);
  }, [messages.length]);

  return (
    <div role="status" aria-live="polite" className={cn("flex flex-col items-center text-center", small ? "gap-3" : "gap-5", className)}>
      <div aria-hidden className={cn("relative grid place-items-center", small ? "size-14" : "size-20")}>
        <span className="absolute inset-2 animate-loader-breathe rounded-full bg-primary/25" />
        <span className="loader-ring absolute inset-0 animate-spin [animation-duration:1.1s]" />
        <span
          className={cn(
            "relative grid place-items-center bg-primary font-heading font-bold text-primary-foreground shadow-lg shadow-primary/30",
            small ? "size-8 rounded-lg text-sm" : "size-11 rounded-xl text-lg"
          )}
        >
          N
        </span>
      </div>

      <div>
        {title && <p className={cn("font-heading font-semibold", small ? "text-base" : "text-lg")}>{title}</p>}
        {messages.length > 0 && (
          <p key={index} className="mt-1 animate-loader-text text-sm text-muted-foreground">
            {messages[index % messages.length]}
          </p>
        )}
      </div>

      {!small && (
        <div aria-hidden className="h-1 w-40 overflow-hidden rounded-full bg-primary/10">
          <span className="block h-full w-1/3 animate-loader-bar rounded-full bg-primary" />
        </div>
      )}

      {secure && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 text-emerald-600" />
          Connexion sécurisée
        </p>
      )}
    </div>
  );
}

/** Chargement plein écran (connexion, déconnexion, changement de page). */
export function LoadingScreen(props: LoaderProps) {
  return (
    <div className="fixed inset-0 z-[100] grid animate-loader-fade place-items-center bg-background/95 p-6">
      <Loader {...props} />
    </div>
  );
}
