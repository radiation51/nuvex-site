"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/components/i18n-provider";
import { track, type VisitKind } from "@/lib/analytics";
import { SELECT_OFFER_EVENT } from "@/lib/format";

/**
 * Compte les visites et les gestes des clients potentiels (page vue, offres vues, clic WhatsApp / téléphone,
 * offre choisie). Invisible, sans cookie : les chiffres s'affichent dans l'admin, page « Visiteurs ».
 */
export function VisitTracker() {
  const pathname = usePathname() ?? "/";
  const { lang } = useI18n();

  // Une page vue à chaque changement de page.
  React.useEffect(() => {
    const external = document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer : "";
    const utm = new URLSearchParams(window.location.search).get("utm_source") ?? undefined;
    track({ kind: "view", path: pathname, lang, referrer: external, utm });
  }, [pathname, lang]);

  // « A vu les offres » : la section des offres est apparue à l'écran (une fois par page).
  React.useEffect(() => {
    const section = document.getElementById("offres");
    if (!section || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        track({ kind: "offers_seen", path: pathname, lang });
        observer.disconnect();
      },
      { threshold: 0.25 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [pathname, lang]);

  // Clics sur WhatsApp / téléphone, et offres choisies.
  React.useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const href = (event.target as Element | null)?.closest?.("a")?.getAttribute("href") ?? "";
      let kind: VisitKind | null = null;
      if (href.startsWith("https://wa.me/")) kind = "whatsapp";
      else if (href.startsWith("tel:")) kind = "phone";
      if (kind) track({ kind, path: pathname, lang });
    };
    const onOffer = (event: Event) => track({ kind: "offer", path: pathname, lang, label: (event as CustomEvent<string>).detail });
    document.addEventListener("click", onClick, { capture: true });
    window.addEventListener(SELECT_OFFER_EVENT, onOffer);
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener(SELECT_OFFER_EVENT, onOffer);
    };
  }, [pathname, lang]);

  return null;
}
