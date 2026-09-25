"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// Shader WebGL chargé après la page, uniquement dans le navigateur.
const FlutedGlass = dynamic(() => import("@paper-design/shaders-react").then((m) => m.FlutedGlass), {
  ssr: false,
});

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Panneau bleu à effet « verre cannelé » du footer, réutilisé comme rappel visuel dans tout le site.
 * Sans `shader`, l'effet est reproduit en CSS (léger, idéal pour les petits éléments).
 */
export function GlassPanel({
  children,
  className,
  shader = false,
}: {
  children?: React.ReactNode;
  className?: string;
  shader?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const [showShader, setShowShader] = React.useState(false);

  // Le shader (WebGL, plus lourd) n'est chargé qu'à l'approche du panneau : la page s'ouvre plus vite,
  // et l'effet en CSS (identique à l'œil) reste affiché d'ici là.
  React.useEffect(() => {
    const el = ref.current;
    if (!shader || reduceMotion || !el || !hasWebGL()) return;
    if (!("IntersectionObserver" in window)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- détection navigateur, impossible côté serveur
      setShowShader(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShowShader(true);
        observer.disconnect();
      },
      { rootMargin: "600px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shader, reduceMotion]);

  return (
    <div ref={ref} className={cn("relative isolate overflow-hidden bg-glass text-white", className)}>
      <div aria-hidden className={cn("fluted pointer-events-none absolute inset-0 -z-10", showShader && "hidden")} />
      {showShader && (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <FlutedGlass
            size={0.89}
            shape="lines"
            angle={0}
            distortionShape="prism"
            distortion={0.5}
            shift={0}
            blur={0}
            edges={0.25}
            stretch={0}
            scale={1.11}
            fit="cover"
            highlights={0.1}
            shadows={0.2}
            grainMixer={0.1}
            grainOverlay={0.1}
            colorBack="#00000000"
            colorHighlight="#FFFFFF"
            colorShadow="#000000"
            className="h-full w-full bg-transparent"
          />
        </div>
      )}
      {children}
    </div>
  );
}

/** Grand texte en contour du footer (décoratif, ignoré par les lecteurs d'écran). */
export function OutlineText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "font-heading leading-[0.75] font-semibold whitespace-nowrap text-transparent opacity-50 select-none [-webkit-text-stroke:1px_color-mix(in_oklch,var(--foreground)_45%,transparent)]",
        className
      )}
    >
      {children}
    </div>
  );
}
