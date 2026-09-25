"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Liens vers les sections de l'accueil (« / » devant : ils marchent aussi depuis les autres pages).
export const navLinks = [
  { name: "Accueil", href: "/#accueil" },
  { name: "Offres", href: "/#offres" },
  { name: "Logiciels", href: "/#logiciels" },
  { name: "Réalisations", href: "/#realisations" },
  { name: "Avis", href: "/#avis" },
  { name: "FAQ", href: "/#faq" },
  { name: "Contact", href: "/#contact" },
];

export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <Link href="/#accueil" className={cn("flex items-center gap-2 font-heading text-xl font-bold tracking-tight", className)}>
      <span
        className={cn(
          "grid size-8 place-items-center rounded-lg text-sm transition-colors",
          light ? "bg-white text-primary" : "bg-primary text-primary-foreground"
        )}
      >
        N
      </span>
      NUVEX
    </Link>
  );
}

/** `solid` : fond clair dès le haut de la page (pages sans photo d'accueil). */
export function Header({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // En haut de page, le menu est posé sur la photo de l'accueil : texte blanc.
  const onPhoto = !solid && !scrolled && !open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        onPhoto ? "bg-transparent text-white" : "border-b bg-background/85 text-foreground backdrop-blur-lg"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Logo light={onPhoto} />

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Navigation principale"
          onMouseLeave={() => setHovered(null)}
          onBlur={() => setHovered(null)}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onMouseEnter={() => setHovered(link.href)}
              onFocus={() => setHovered(link.href)}
              className={cn(
                "relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200",
                onPhoto ? "text-white/85 hover:text-white" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {/* Pastille de survol : elle glisse d'un lien à l'autre */}
              <AnimatePresence>
                {hovered === link.href && (
                  <motion.span
                    layoutId="nav-hover"
                    aria-hidden
                    className={cn("absolute inset-0 rounded-full", onPhoto ? "bg-white/15" : "bg-primary/[0.08]")}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34, mass: 0.6 }}
                  />
                )}
              </AnimatePresence>
              <span className="relative">{link.name}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#contact"
            className={cn(
              "hidden rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors sm:inline-flex",
              onPhoto
                ? "text-white ring-1 ring-white/60 hover:bg-white hover:text-ink"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            Devis gratuit
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn("grid size-10 place-items-center rounded-lg lg:hidden", onPhoto ? "hover:bg-white/15" : "hover:bg-muted")}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t bg-background px-4 pb-5 lg:hidden" aria-label="Navigation mobile">
          <ul className="flex flex-col py-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setOpen(false)} className="block py-3 text-base font-medium">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/#contact"
            onClick={() => setOpen(false)}
            className="block rounded-full bg-primary py-3 text-center font-semibold text-primary-foreground"
          >
            Demander un devis gratuit
          </Link>
        </nav>
      )}
    </header>
  );
}
