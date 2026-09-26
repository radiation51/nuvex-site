"use client";

import * as React from "react";
import { Eye, Globe2, Languages, MessageCircle, MousePointerClick, Phone, Smartphone, Tag, Target, TrendingDown, TrendingUp, Users } from "lucide-react";
import { Loading, PageHeader } from "@/components/admin/ui-bits";
import type { PeriodTotals, VisitsReport } from "@/lib/visits-report";
import { cn } from "@/lib/utils";

const PERIODS = [
  { days: 7, label: "7 jours" },
  { days: 30, label: "30 jours" },
  { days: 90, label: "90 jours" },
];

const LANG_NAMES: Record<string, string> = { fr: "Français", ar: "Arabe", en: "Anglais" };
const DEVICE_NAMES: Record<string, string> = { mobile: "Téléphone", desktop: "Ordinateur", tablet: "Tablette" };
const COUNTRY_NAMES = new Intl.DisplayNames(["fr"], { type: "region" });
const dayLabel = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" });
const numberFr = new Intl.NumberFormat("fr-FR");

const countryName = (code: string) => {
  try {
    return COUNTRY_NAMES.of(code) ?? code;
  } catch {
    return code;
  }
};

/** Page « Visiteurs » : qui vient sur le site, d'où, et combien deviennent des clients potentiels. */
export function VisitorsPanel() {
  const [days, setDays] = React.useState(30);
  const [report, setReport] = React.useState<VisitsReport | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/visits?days=${days}`)
      .then(async (res) => {
        const json = await res.json();
        if (res.status === 401) window.location.reload();
        if (!res.ok) throw new Error(json.error ?? "Chargement impossible.");
        if (!cancelled) {
          setReport(json);
          setError(null);
        }
      })
      .catch((e: Error) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [days]);

  return (
    <div>
      <PageHeader
        title="Visiteurs"
        subtitle="Qui vient sur votre site, d'où, et combien vous contactent. Mesure anonyme, sans cookie."
        action={
          <div role="tablist" aria-label="Période" className="inline-flex rounded-full border bg-card p-1 shadow-sm">
            {PERIODS.map((p) => (
              <button
                key={p.days}
                type="button"
                role="tab"
                aria-selected={days === p.days}
                onClick={() => setDays(p.days)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-semibold tap",
                  days === p.days ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        }
      />

      {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {!report && !error && <Loading />}
      {report && <Report report={report} />}
    </div>
  );
}

function Report({ report }: { report: VisitsReport }) {
  const { totals, previous } = report;
  const rate = (t: PeriodTotals) => (t.visitors ? (t.potentials / t.visitors) * 100 : 0);
  const empty = totals.visitors === 0;

  return (
    <div className="grid gap-5">
      {report.demo && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Données d&apos;exemple : les vrais chiffres s&apos;afficheront ici dès que le site sera en ligne.
        </p>
      )}
      {empty && !report.demo && (
        <p className="rounded-xl bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
          Pas encore de visite sur cette période. Les chiffres se remplissent tout seuls à chaque visite du site.
        </p>
      )}

      {/* Chiffres clés */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Kpi label="Visiteurs" icon={Users} value={totals.visitors} before={previous.visitors} hint="uniques par jour" />
        <Kpi label="Pages vues" icon={Eye} value={totals.views} before={previous.views} />
        <Kpi label="Clients potentiels" icon={Target} value={totals.potentials} before={previous.potentials} hint="WhatsApp, appel ou devis" accent />
        <Kpi
          label="Taux de contact"
          icon={MousePointerClick}
          value={rate(totals)}
          before={rate(previous)}
          format={(v) => `${v.toFixed(1).replace(".", ",")} %`}
          hint="visiteurs qui vous contactent"
          points
        />
      </div>

      {/* Courbe */}
      <Card title="Visiteurs par jour" icon={TrendingUp}>
        <AreaChart data={report.daily} />
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Du visiteur au client potentiel" icon={Target}>
          <Funnel
            steps={[
              { label: "Visiteurs", value: report.funnel.visitors },
              { label: "Ont regardé les offres", value: report.funnel.sawOffers },
              { label: "Ont choisi une offre", value: report.funnel.choseOffer },
              { label: "Vous ont écrit ou appelé", value: report.funnel.contacted },
              { label: "Ont envoyé une demande de devis", value: report.funnel.leads },
            ]}
          />
          <div className="mt-5 grid grid-cols-3 gap-2 border-t pt-4 text-center">
            <MiniStat icon={MessageCircle} label="Clics WhatsApp" value={report.contacts.whatsapp} tone="text-[#128C4B] bg-[#25D366]/15" />
            <MiniStat icon={Phone} label="Appels" value={report.contacts.phone} tone="text-primary bg-primary/10" />
            <MiniStat icon={Target} label="Devis" value={report.contacts.leads} tone="text-ink bg-lime" />
          </div>
        </Card>

        <Card title="D'où viennent les visiteurs" icon={Globe2}>
          <Bars rows={report.sources} empty="Aucune visite pour le moment." />
        </Card>

        <Card title="Offres qui intéressent" icon={Tag}>
          <Bars rows={report.offers} empty="Aucune offre choisie pour le moment." color="bg-lime" />
        </Card>

        <div className="grid gap-5 sm:grid-cols-2">
          <Card title="Langues" icon={Languages}>
            <Bars rows={report.langs.map(([k, v]) => [LANG_NAMES[k] ?? k, v])} empty="—" compact />
          </Card>
          <Card title="Appareils" icon={Smartphone}>
            <Bars rows={report.devices.map(([k, v]) => [DEVICE_NAMES[k] ?? k, v])} empty="—" compact />
          </Card>
          <Card title="Pays" icon={Globe2} className="sm:col-span-2">
            <Bars rows={report.countries.map(([k, v]) => [countryName(k), v])} empty="Le pays s'affichera sur le site en ligne." compact />
          </Card>
        </div>
      </div>
    </div>
  );
}

function Kpi({
  label,
  icon: Icon,
  value,
  before,
  hint,
  format = (v) => numberFr.format(v),
  points,
  accent,
}: {
  label: string;
  icon: React.ElementType;
  value: number;
  before: number;
  hint?: string;
  format?: (v: number) => string;
  /** Écart affiché en points (pour un pourcentage). */
  points?: boolean;
  accent?: boolean;
}) {
  const diff = value - before;
  const pct = before ? (diff / before) * 100 : null;
  const up = diff >= 0;
  const change = points
    ? `${up ? "+" : ""}${diff.toFixed(1).replace(".", ",")} pt`
    : pct === null
      ? value
        ? "nouveau"
        : "—"
      : `${up ? "+" : ""}${Math.round(pct)} %`;

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border p-4 sm:p-5", accent ? "isolate bg-glass text-white" : "bg-card")}>
      {accent && <div aria-hidden className="fluted pointer-events-none absolute inset-0 -z-10" />}
      <div className="flex items-center justify-between gap-2">
        <p className={cn("text-xs font-medium sm:text-sm", accent ? "text-white/75" : "text-muted-foreground")}>{label}</p>
        <span className={cn("grid size-8 shrink-0 place-items-center rounded-xl sm:size-9", accent ? "bg-white/10 text-lime" : "bg-primary/10 text-primary")}>
          <Icon className="size-4.5" />
        </span>
      </div>
      <p className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">{format(value)}</p>
      <p className={cn("mt-1 flex flex-wrap items-center gap-1.5 text-xs", accent ? "text-white/70" : "text-muted-foreground")}>
        {change !== "—" && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold",
              accent ? "bg-white/15 text-white" : up ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
            )}
          >
            {up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {change}
          </span>
        )}
        <span className="hidden sm:inline">{hint ?? "vs période précédente"}</span>
      </p>
    </div>
  );
}

function Card({ title, icon: Icon, children, className }: { title: string; icon: React.ElementType; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border bg-card p-5", className)}>
      <h2 className="mb-4 flex items-center gap-2 font-heading text-base font-bold">
        <Icon className="size-4 text-primary" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function MiniStat({ icon: Icon, label, value, tone }: { icon: React.ElementType; label: string; value: number; tone: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className={cn("grid size-8 place-items-center rounded-lg", tone)}>
        <Icon className="size-4" />
      </span>
      <span className="font-heading text-lg font-bold">{numberFr.format(value)}</span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}

/** Barres horizontales qui se remplissent en douceur. */
function Bars({ rows, empty, color = "bg-primary", compact }: { rows: [string, number][]; empty: string; color?: string; compact?: boolean }) {
  const total = rows.reduce((s, [, v]) => s + v, 0);
  const max = Math.max(1, ...rows.map(([, v]) => v));
  if (!rows.length) return <p className="text-sm text-muted-foreground">{empty}</p>;
  return (
    <ul className={cn("grid", compact ? "gap-2.5" : "gap-3.5")}>
      {rows.map(([name, value], i) => (
        <li key={name}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate font-medium">{name}</span>
            <span className="shrink-0 text-muted-foreground">
              <strong className="text-foreground">{numberFr.format(value)}</strong> · {Math.round((value / total) * 100)} %
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn("visits-bar h-full rounded-full", color)}
              style={{ width: `${(value / max) * 100}%`, animationDelay: `${i * 70}ms` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Entonnoir : chaque étape en proportion du nombre de visiteurs. */
function Funnel({ steps }: { steps: { label: string; value: number }[] }) {
  const top = Math.max(1, steps[0].value);
  return (
    <ol className="grid gap-2">
      {steps.map((step, i) => {
        const pct = (step.value / top) * 100;
        return (
          <li key={step.label} className="relative overflow-hidden rounded-xl bg-muted/60">
            <div
              className="visits-bar absolute inset-y-0 start-0 rounded-xl bg-primary/15"
              style={{ width: `${Math.max(pct, 2)}%`, animationDelay: `${i * 90}ms` }}
            />
            <div className="relative flex items-center justify-between gap-3 px-3.5 py-2.5 text-sm">
              <span className="flex items-center gap-2.5 font-medium">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">{i + 1}</span>
                {step.label}
              </span>
              <span className="shrink-0 text-muted-foreground">
                <strong className="font-heading text-base text-foreground">{numberFr.format(step.value)}</strong>
                {i > 0 && <span className="ms-1.5 text-xs">({pct.toFixed(pct < 10 ? 1 : 0).replace(".", ",")} %)</span>}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Courbe des visiteurs par jour, avec infobulle au survol. */
function AreaChart({ data }: { data: VisitsReport["daily"] }) {
  const [hover, setHover] = React.useState<number | null>(null);
  const box = React.useRef<HTMLDivElement>(null);
  const [W, setW] = React.useState(800);
  React.useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setW(Math.max(280, Math.round(entry.contentRect.width))));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const H = 220;
  const pad = { top: 16, bottom: 28, left: 34, right: 12 };
  const max = Math.max(4, ...data.map((d) => d.visitors));
  const niceMax = Math.ceil(max / 4) * 4;
  const x = (i: number) => pad.left + (data.length === 1 ? 0 : (i / (data.length - 1)) * (W - pad.left - pad.right));
  const y = (v: number) => pad.top + (1 - v / niceMax) * (H - pad.top - pad.bottom);

  // Courbe lissée.
  const pts = data.map((d, i) => [x(i), y(d.visitors)] as const);
  const line = pts.reduce((acc, [px, py], i) => {
    if (i === 0) return `M${px},${py}`;
    const [qx, qy] = pts[i - 1];
    const cx = (qx + px) / 2;
    return `${acc} C${cx},${qy} ${cx},${py} ${px},${py}`;
  }, "");
  const area = `${line} L${x(data.length - 1)},${H - pad.bottom} L${x(0)},${H - pad.bottom} Z`;
  const labelEvery = Math.ceil(data.length / (W < 520 ? 4 : 7));
  const h = hover !== null ? data[hover] : null;

  return (
    <div ref={box} className="relative" dir="ltr">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        className="block max-w-full overflow-visible"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const box = e.currentTarget.getBoundingClientRect();
          const rel = ((e.clientX - box.left) / box.width) * W;
          const i = Math.round(((rel - pad.left) / (W - pad.left - pad.right)) * (data.length - 1));
          setHover(Math.min(data.length - 1, Math.max(0, i)));
        }}
        role="img"
        aria-label="Nombre de visiteurs par jour"
      >
        <defs>
          <linearGradient id="visits-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}>
            <line x1={pad.left} x2={W - pad.right} y1={y(niceMax * f)} y2={y(niceMax * f)} stroke="currentColor" className="text-border" strokeDasharray={f ? "3 5" : undefined} />
            <text x={pad.left - 8} y={y(niceMax * f) + 4} textAnchor="end" className="fill-muted-foreground text-[11px]">
              {Math.round(niceMax * f)}
            </text>
          </g>
        ))}
        <path d={area} fill="url(#visits-fill)" className="visits-area" />
        <path d={line} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" className="visits-line" pathLength={1} />
        {data.map((d, i) =>
          i % labelEvery === 0 || i === data.length - 1 ? (
            <text key={d.date} x={x(i)} y={H - 8} textAnchor="middle" className="fill-muted-foreground text-[11px]">
              {i === data.length - 1 ? "Auj." : dayLabel.format(new Date(`${d.date}T12:00:00`))}
            </text>
          ) : null
        )}
        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={pad.top} y2={H - pad.bottom} stroke="var(--primary)" strokeOpacity="0.35" />
            <circle cx={x(hover)} cy={y(data[hover].visitors)} r="5" fill="var(--card)" stroke="var(--primary)" strokeWidth="2.5" />
          </g>
        )}
      </svg>
      {h && hover !== null && (
        <div
          className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-xl border bg-popover px-3 py-2 text-xs shadow-lg"
          style={{ left: `${(x(hover) / W) * 100}%` }}
        >
          <p className="font-semibold">{dayLabel.format(new Date(`${h.date}T12:00:00`))}</p>
          <p className="text-muted-foreground">
            <strong className="text-foreground">{h.visitors}</strong> visiteurs · {h.views} pages vues
          </p>
        </div>
      )}
    </div>
  );
}

