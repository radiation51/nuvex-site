// Calcul des chiffres de la page « Visiteurs » de l'admin, à partir des événements de la table « visits ».

export interface VisitRow {
  created_at: string;
  kind: string;
  path: string;
  lang: string | null;
  source: string | null;
  device: string | null;
  country: string | null;
  visitor: string;
  label: string | null;
}

export interface PeriodTotals {
  /** Visiteurs uniques (comptés une fois par jour). */
  visitors: number;
  views: number;
  /** Visiteurs ayant contacté NUVEX (WhatsApp, téléphone ou demande de devis). */
  potentials: number;
  leads: number;
}

export interface VisitsReport {
  demo?: boolean;
  days: number;
  totals: PeriodTotals;
  previous: PeriodTotals;
  daily: { date: string; visitors: number; views: number }[];
  funnel: { visitors: number; sawOffers: number; choseOffer: number; contacted: number; leads: number };
  contacts: { whatsapp: number; phone: number; leads: number };
  sources: [string, number][];
  langs: [string, number][];
  devices: [string, number][];
  countries: [string, number][];
  offers: [string, number][];
}

const CONTACT_KINDS = new Set(["whatsapp", "phone", "lead"]);

/** Date du jour en Algérie (UTC+1), au format AAAA-MM-JJ. */
export const algeriaDay = (iso: string | number) => new Date(new Date(iso).getTime() + 3_600_000).toISOString().slice(0, 10);

/** Identifiant « visiteur du jour » : même personne le même jour = 1 visiteur. */
const visitorDay = (r: VisitRow) => `${r.visitor}|${algeriaDay(r.created_at)}`;

function totalsOf(rows: VisitRow[]): PeriodTotals {
  const visitors = new Set<string>();
  const potentials = new Set<string>();
  let views = 0;
  let leads = 0;
  for (const r of rows) {
    visitors.add(visitorDay(r));
    if (r.kind === "view") views++;
    if (r.kind === "lead") leads++;
    if (CONTACT_KINDS.has(r.kind)) potentials.add(visitorDay(r));
  }
  return { visitors: visitors.size, views, potentials: potentials.size, leads };
}

/** Classement « valeur → nombre de visiteurs », du plus grand au plus petit. */
function ranking(rows: VisitRow[], pick: (r: VisitRow) => string | null, limit = 6): [string, number][] {
  const map = new Map<string, Set<string>>();
  for (const r of rows) {
    const key = pick(r);
    if (!key) continue;
    if (!map.has(key)) map.set(key, new Set());
    map.get(key)!.add(visitorDay(r));
  }
  return [...map.entries()].map(([k, v]) => [k, v.size] as [string, number]).sort((a, b) => b[1] - a[1]).slice(0, limit);
}

export function buildReport(rows: VisitRow[], days: number, now = Date.now()): VisitsReport {
  const start = now - days * 86_400_000;
  const current = rows.filter((r) => new Date(r.created_at).getTime() >= start);
  const previous = rows.filter((r) => new Date(r.created_at).getTime() < start);

  const daily = Array.from({ length: days }, (_, i) => {
    const date = algeriaDay(now - (days - 1 - i) * 86_400_000);
    const ofDay = current.filter((r) => algeriaDay(r.created_at) === date);
    return { date, visitors: new Set(ofDay.map((r) => r.visitor)).size, views: ofDay.filter((r) => r.kind === "view").length };
  });

  const who = (kinds: string[]) => new Set(current.filter((r) => kinds.includes(r.kind)).map(visitorDay)).size;
  const count = (kind: string) => current.filter((r) => r.kind === kind).length;
  const views = current.filter((r) => r.kind === "view");

  const totals = totalsOf(current);
  return {
    days,
    totals,
    previous: totalsOf(previous),
    daily,
    funnel: {
      visitors: totals.visitors,
      sawOffers: who(["offers_seen"]),
      choseOffer: who(["offer"]),
      contacted: who(["whatsapp", "phone"]),
      leads: who(["lead"]),
    },
    contacts: { whatsapp: count("whatsapp"), phone: count("phone"), leads: count("lead") },
    sources: ranking(views, (r) => r.source ?? "Direct"),
    langs: ranking(current, (r) => r.lang ?? "fr", 3),
    devices: ranking(current, (r) => r.device ?? "desktop", 3),
    countries: ranking(current, (r) => r.country, 5),
    offers: ranking(current.filter((r) => r.kind === "offer" || r.kind === "lead"), (r) => r.label, 8),
  };
}

/** Données d'exemple (mode test en local, sans base de données). */
export function demoRows(days: number, now = Date.now()): VisitRow[] {
  const rows: VisitRow[] = [];
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const pick = <T,>(list: [T, number][]) => {
    let r = rand() * list.reduce((s, [, w]) => s + w, 0);
    for (const [v, w] of list) if ((r -= w) <= 0) return v;
    return list[0][0];
  };
  for (let d = days * 2 - 1; d >= 0; d--) {
    const perDay = Math.round(9 + 7 * Math.sin(d / 3) + rand() * 6 + (days * 2 - d) / 6);
    for (let v = 0; v < perDay; v++) {
      const at = new Date(now - d * 86_400_000 - rand() * 80_000_000).toISOString();
      const base = {
        created_at: at,
        path: "/",
        lang: pick([["fr", 62], ["ar", 29], ["en", 9]]),
        device: pick([["mobile", 78], ["desktop", 19], ["tablet", 3]]),
        country: pick([["DZ", 88], ["FR", 8], ["CA", 2], ["AE", 2]]),
        visitor: `demo-${d}-${v}`,
        label: null,
        source: null,
      } satisfies Omit<VisitRow, "kind">;
      rows.push({ ...base, kind: "view", source: pick([["Google", 41], ["Instagram", 27], ["WhatsApp", 14], ["Direct", 18]]) });
      if (rand() < 0.6) rows.push({ ...base, kind: "offers_seen" });
      if (rand() < 0.14) rows.push({ ...base, kind: "offer", label: pick([["Pro", 5], ["Éco", 3], ["Premium", 2], ["Logiciel Pro", 2]]) });
      if (rand() < 0.07) rows.push({ ...base, kind: "whatsapp" });
      if (rand() < 0.015) rows.push({ ...base, kind: "phone" });
      if (rand() < 0.045) rows.push({ ...base, kind: "lead", label: pick([["Pro", 5], ["Éco", 3], ["Sur-mesure", 1]]) });
    }
  }
  return rows;
}
