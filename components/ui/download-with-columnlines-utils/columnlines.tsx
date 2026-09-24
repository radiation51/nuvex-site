import * as React from "react";
import { cn } from "@/lib/utils";

interface ColumnLinesProps {
  children?: React.ReactNode;
  className?: string;
  /** Largeur d'une colonne en px. */
  columnWidth?: number;
  columnCount?: number;
  /** Début / fin du fondu radial, en % du rayon. */
  radialFadeStart?: number;
  radialFadeEnd?: number;
  /** Couleur des lignes (ex. "border-white/15" sur une photo). */
  lineClassName?: string;
}

/** Fond décoratif : colonnes verticales fines qui s'effacent vers les bords. */
export function ColumnLines({
  children,
  className,
  columnWidth = 80,
  columnCount = 14,
  radialFadeStart = 30,
  radialFadeEnd = 70,
  lineClassName = "border-foreground/[0.07]",
}: ColumnLinesProps) {
  const mask = `radial-gradient(ellipse at center, black ${radialFadeStart}%, transparent ${radialFadeEnd}%)`;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] flex justify-center"
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      >
        {Array.from({ length: columnCount }, (_, i) => (
          <div
            key={i}
            className={cn("h-full shrink-0 border-l last:border-r", lineClassName)}
            style={{ width: columnWidth }}
          />
        ))}
      </div>
      {children}
    </div>
  );
}
