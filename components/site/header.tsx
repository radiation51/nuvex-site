"use client";

import * as React from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const navLinks = [
  { name: "Accueil", href: "#accueil" },
  { name: "Offres", href: "#offres" },
  { name: "Réalisations", href: "#realisations" },
  { name: "Avis", href: "#avis" },
  { name: "FAQ", href: "#faq" },
  { name: "Contact", href: "#contact" },
];

export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <a href="#accueil" className={cn("flex items-center gap-2 font-heading text-xl font-bold tracking-tight", className)}>
      <span
        className={cn(
          "grid size-8 place-items-center rounded-lg text-sm transition-colors",
          light ? "bg-white text-primary" : "bg-primary text-primary-foreground"
        )}
      >
        N
      </span>
      NUVEX
    </a>
  );
}

export function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // En haut de page, le menu est posé sur la photo de l'accueil : texte blanc.
  const onPhoto = !scrolled && !open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        onPhoto ? "bg-transparent text-white" : "border-b bg-background/85 text-foreground backdrop-blur-lg"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Logo light={onPhoto} />

        <nav className="hidden items-center gap-7 md:flex" aria-label="Navigation principale">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors",
                onPhoto ? "text-white/85 hover:text-white" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className={cn(
              "hidden rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:inline-flex",
              onPhoto
                ? "text-white ring-1 ring-white/60 hover:bg-white hover:text-ink"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            Devis gratuit
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn("grid size-10 place-items-center rounded-lg md:hidden", onPhoto ? "hover:bg-white/15" : "hover:bg-muted")}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t bg-background px-4 pb-5 md:hidden" aria-label="Navigation mobile">
          <ul className="flex flex-col py-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setOpen(false)} className="block py-3 text-base font-medium">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="block rounded-full bg-primary py-3 text-center font-semibold text-primary-foreground"
          >
            Demander un devis gratuit
          </a>
        </nav>
      )}
    </header>
  );
}
