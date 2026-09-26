"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { cn } from "@/lib/utils";

// Sections de l'accueil (« / » devant : les liens marchent aussi depuis les autres pages).
const sections = ["accueil", "offres", "realisations", "avis", "faq", "contact"] as const;

function useNavLinks() {
  const { t, href } = useI18n();
  const names = [t.nav.home, t.nav.offers, t.nav.projects, t.nav.reviews, t.nav.faq, t.nav.contact];
  return sections.map((id, i) => ({ name: names[i], href: href(`/#${id}`) }));
}

export function Logo({ className, light }: { className?: string; light?: boolean }) {
  const { href } = useI18n();
  return (
    <Link href={href("/#accueil")} className={cn("flex items-center gap-2 font-heading text-xl font-bold tracking-tight", className)}>
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
  const { t, href } = useI18n();
  const navLinks = useNavLinks();

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
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,color] duration-300",
        onPhoto ? "bg-transparent text-white" : "border-b bg-background/85 text-foreground backdrop-blur-lg"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Logo light={onPhoto} />

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label={t.nav.mainNav}
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
                "tap relative rounded-full px-3.5 py-1.5 text-sm font-medium",
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
          <LanguageSwitcher light={onPhoto} className="me-1 sm:me-2" />
          <Link
            href={href("/#contact")}
            className={cn(
              "tap hidden rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap sm:inline-flex",
              onPhoto
                ? "text-white ring-1 ring-white/60 hover:bg-white hover:text-ink"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {t.nav.quote}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn("tap grid size-10 place-items-center rounded-lg lg:hidden", onPhoto ? "hover:bg-white/15" : "hover:bg-muted")}
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={open}
            aria-controls="menu-mobile"
          >
            {/* Les deux icônes se croisent en tournant (CSS uniquement) */}
            <span className="relative size-5">
              <Menu
                className={cn(
                  "absolute inset-0 size-5 transition-[rotate,scale,opacity] duration-300",
                  open ? "scale-50 rotate-90 opacity-0" : "opacity-100"
                )}
              />
              <X
                className={cn(
                  "absolute inset-0 size-5 transition-[rotate,scale,opacity] duration-300",
                  open ? "opacity-100" : "scale-50 -rotate-90 opacity-0"
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Menu téléphone / tablette : se déplie en douceur, les liens apparaissent l'un après l'autre */}
      <div
        id="menu-mobile"
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out lg:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <nav className="border-t bg-background px-4 pb-5" aria-label={t.nav.mobileNav}>
            <ul className="flex flex-col py-2">
              {navLinks.map((link, i) => (
                <li
                  key={link.href}
                  className={cn("transition-[opacity,translate] duration-300 ease-out", open ? "opacity-100" : "-translate-y-1.5 opacity-0")}
                  style={{ transitionDelay: open ? `${40 + i * 30}ms` : "0ms" }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="tap -mx-3 block rounded-xl px-3 py-3 text-base font-medium hover:bg-muted active:bg-primary/[0.08] active:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={href("/#contact")}
              onClick={() => setOpen(false)}
              className="tap block rounded-full bg-primary py-3 text-center font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {t.nav.quoteLong}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
