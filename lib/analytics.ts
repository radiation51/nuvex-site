// Mesure d'audience maison, anonyme et sans cookie : chaque événement part vers /api/track,
// qui l'enregistre dans la table « visits » (voir supabase/migration-visiteurs.sql).

/** Types d'événements comptés. */
export const VISIT_KINDS = ["view", "offers_seen", "offer", "whatsapp", "phone", "lead"] as const;
export type VisitKind = (typeof VISIT_KINDS)[number];

export interface TrackPayload {
  kind: VisitKind;
  path: string;
  lang: string;
  /** Site d'où vient le visiteur (document.referrer), seulement pour les pages vues. */
  referrer?: string;
  /** Paramètre ?utm_source= du lien (ex. un lien partagé sur Instagram). */
  utm?: string;
  /** Détail : nom de l'offre choisie, etc. */
  label?: string;
}

/** Envoie un événement sans ralentir la page (même si le visiteur quitte le site juste après). */
export function track(event: TrackPayload) {
  try {
    const body = JSON.stringify(event);
    if (navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }))) return;
    void fetch("/api/track", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
  } catch {
    // La mesure d'audience ne doit jamais gêner la visite.
  }
}
