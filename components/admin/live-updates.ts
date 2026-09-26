"use client";

import * as React from "react";
import { toast } from "sonner";
import type { AdminData } from "@/components/admin/admin-data";
import type { AdminTab } from "@/components/admin/dashboard-panel";
import { leadKind, leadKindEmoji, leadKindTitle } from "@/lib/lead-kind";

const REFRESH_MS = 20_000;

/** Petit « ding » en deux notes (sans fichier son). Les navigateurs ne l'autorisent qu'après un premier clic sur la page. */
function ding() {
  try {
    const ctx = new AudioContext();
    [880, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = ctx.currentTime + i * 0.16;
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.25, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.4);
    });
    setTimeout(() => ctx.close(), 1000);
  } catch {
    // Pas de son possible : la bannière suffit.
  }
}

/**
 * Admin en direct : les données se rechargent seules toutes les 20 s (et au retour sur l'onglet),
 * avec un son et une bannière à chaque nouvelle demande ou nouvel avis.
 */
export function useLiveUpdates(data: AdminData | null, open: (tab: AdminTab) => void) {
  const seenLeads = React.useRef<Set<string> | null>(null);
  const seenReviews = React.useRef<Set<string> | null>(null);
  const reload = data?.reload;
  const openRef = React.useRef(open);
  React.useEffect(() => {
    openRef.current = open;
  }, [open]);

  // Rechargement automatique.
  React.useEffect(() => {
    if (!reload) return;
    const refresh = () => {
      if (document.visibilityState === "visible") void reload();
    };
    const timer = window.setInterval(refresh, REFRESH_MS);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [reload]);

  // Nouvelles demandes et nouveaux avis depuis le dernier passage.
  React.useEffect(() => {
    if (!data) return;
    const leadIds = new Set(data.leads.map((l) => l.id));
    const reviewIds = new Set(data.reviews.map((r) => r.id));

    if (seenLeads.current && seenReviews.current) {
      const newLeads = data.leads.filter((l) => !seenLeads.current!.has(l.id));
      const newReviews = data.reviews.filter((r) => !seenReviews.current!.has(r.id));
      newLeads.forEach((lead) => {
        const kind = leadKind(lead.offer);
        toast(`${leadKindEmoji[kind]} ${leadKindTitle[kind]}`, {
          description: `${lead.name} · ${lead.phone}${lead.offer ? ` · ${lead.offer.replace(/^Service : /, "")}` : ""}`,
          duration: 15_000,
          action: { label: "Voir", onClick: () => openRef.current("reservations") },
        });
      });
      newReviews.forEach((review) => {
        toast("⭐ Nouvel avis à valider", {
          description: `${review.name} · ${"★".repeat(review.rating)}`,
          duration: 15_000,
          action: { label: "Voir", onClick: () => openRef.current("reviews") },
        });
      });
      if (newLeads.length || newReviews.length) ding();
    }

    seenLeads.current = leadIds;
    seenReviews.current = reviewIds;

    // Onglet du navigateur : « (2) Admin — NUVEX » tant qu'il reste des demandes à traiter.
    const pending = data.leads.filter((l) => l.status === "new").length;
    document.title = `${pending ? `(${pending}) ` : ""}Admin — NUVEX`;
  }, [data]);
}
