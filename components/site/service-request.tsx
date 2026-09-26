"use client";

import * as React from "react";
import { motion } from "motion/react";
import { BellRing, Check, HeartHandshake, Loader2, MapPin, RotateCcw, Send, ShieldCheck, Wrench } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "@/components/ui/loader";
import { RichText } from "@/components/ui/rich-text";
import { GlassPanel } from "@/components/site/glass-panel";
import { OfferSelect } from "@/components/site/offer-select";
import { SectionHeading } from "@/components/site/section-heading";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { useI18n } from "@/components/i18n-provider";
import { track } from "@/lib/analytics";
import { SELECT_OFFER_EVENT, whatsappLink } from "@/lib/format";
import { fill } from "@/lib/i18n/fill";
import type { ServiceGroup } from "@/lib/services";
import { formsViaWhatsApp } from "@/lib/supabase";
import type { Offer } from "@/lib/types";

/** Formulaire « Demande de service » de la page Services : la demande arrive dans l'admin (Réservations). */
export function ServiceRequest({ plans, groups, whatsapp }: { plans: Offer[]; groups: ServiceGroup[]; whatsapp?: string }) {
  const { t: all, lang, href } = useI18n();
  const t = all.services;
  const c = all.contact;
  const [service, setService] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState<{ name: string; whatsappUrl?: string } | null>(null);
  const successRef = React.useRef<HTMLDivElement>(null);

  // « Choisir cette formule » / « Demander » plus haut dans la page : service présélectionné.
  React.useEffect(() => {
    const onSelect = (e: Event) => setService((e as CustomEvent<string>).detail);
    window.addEventListener(SELECT_OFFER_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_OFFER_EVENT, onSelect);
  }, []);

  const everything = [...plans, ...groups.flatMap((g) => g.items)];

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const text = (k: string) => String(data[k] ?? "").trim();
    const chosen = everything.find((o) => (o.value ?? o.name) === text("offer"));
    const site = text("site_url");
    const message = [site && `${t.waSite} : ${site}`, text("message")].filter(Boolean).join("\n\n");
    const done = (whatsappUrl?: string) => {
      track({ kind: "lead", path: window.location.pathname, lang, label: text("offer") || undefined });
      form.reset();
      setService("");
      setSent({ name: text("name").split(/\s+/)[0], whatsappUrl });
      requestAnimationFrame(() => successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
    };

    // Pas encore de base de données : la demande part sur WhatsApp, déjà rédigée.
    if (formsViaWhatsApp && whatsapp) {
      const lines = [
        chosen ? fill(t.waService, { service: chosen.name }) : t.waIntro,
        `${c.waName} : ${text("name")}`,
        `${c.waPhone} : ${text("phone")}`,
        site && `${t.waSite} : ${site}`,
        text("message") && `${c.waProject} : ${text("message")}`,
      ].filter(Boolean);
      const url = whatsappLink(whatsapp, lines.join("\n"));
      if (!text("website")) window.open(url, "_blank", "noopener");
      done(url);
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, message }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(lang === "fr" ? (json.error ?? c.error) : c.error);
      if (json.demo) import("@/lib/demo-supabase").then((m) => m.addDemoLead({ ...data, message }));
      done();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : c.error);
    } finally {
      setSending(false);
    }
  }

  const perks = [
    { icon: ShieldCheck, text: t.perks[0] },
    { icon: BellRing, text: t.perks[1] },
    { icon: MapPin, text: t.perks[2] },
  ];

  return (
    <section id="contact" className="scroll-mt-20 bg-muted/40 px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading badge={t.formBadge} title={t.formTitle} subtitle={t.formSubtitle} />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <GlassPanel className="flex flex-col gap-4 rounded-2xl p-7">
            <span className="grid size-11 place-items-center rounded-xl bg-white/10 text-lime">
              <HeartHandshake className="size-5" />
            </span>
            <h3 className="font-heading text-xl font-bold">{t.helpTitle}</h3>
            <p className="text-sm text-white/75">{t.helpText}</p>
            <ul className="mt-1 grid gap-3">
              {perks.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/10 text-lime">
                    <Icon className="size-4" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
            {whatsapp && (
              <a
                href={whatsappLink(whatsapp, t.waIntro)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 font-semibold text-ink tap hover:opacity-90"
              >
                <WhatsAppIcon className="size-5" />
                {c.writeWhatsapp}
              </a>
            )}
          </GlassPanel>

          {sent ? (
            <motion.div
              ref={successRef}
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center rounded-2xl border bg-card p-8 text-center sm:p-12"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
                className="grid size-16 place-items-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
              >
                <Check className="size-8" strokeWidth={3} />
              </motion.span>
              <h3 className="mt-6 font-heading text-2xl font-bold sm:text-3xl">{sent.whatsappUrl ? c.readyTitle : c.sentTitle}</h3>
              <p className="mt-3 max-w-md text-muted-foreground">
                <RichText text={fill(sent.whatsappUrl ? c.readyText : c.sentText, { name: sent.name ? ` ${sent.name}` : "" })} />
              </p>
              {sent.whatsappUrl && (
                <a
                  href={sent.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 font-semibold text-ink tap hover:opacity-90"
                >
                  <WhatsAppIcon className="size-5" />
                  {c.openWhatsapp}
                </a>
              )}
              <button
                type="button"
                onClick={() => setSent(null)}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                <RotateCcw className="size-3.5" />
                {c.another}
              </button>
            </motion.div>
          ) : (
            <form onSubmit={onSubmit} aria-busy={sending} className="relative grid gap-4 rounded-2xl border bg-card p-6 sm:p-8">
              {sending && (
                <div className="absolute inset-0 z-10 grid animate-loader-fade place-items-center rounded-2xl bg-card/95 p-6">
                  <Loader size="sm" secure secureLabel={all.loader.secure} title={c.sendingTitle} messages={c.sendingMessages} />
                </div>
              )}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="service-name">{c.name}</Label>
                  <Input id="service-name" name="name" required minLength={2} maxLength={80} autoComplete="name" className="h-11" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="service-phone">{c.phoneLabel}</Label>
                  <Input id="service-phone" name="phone" type="tel" required autoComplete="tel" placeholder="0555 12 34 56" dir="ltr" className="h-11 rtl:text-right" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="service-site">{t.siteUrl}</Label>
                  <Input id="service-site" name="site_url" type="url" maxLength={200} placeholder={t.siteUrlPlaceholder} dir="ltr" className="h-11 rtl:text-right" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="service-offer">{t.service}</Label>
                  <OfferSelect
                    id="service-offer"
                    value={service}
                    onChange={setService}
                    noneLabel={t.servicePlaceholder}
                    groups={[
                      { label: t.plansGroup, icon: ShieldCheck, items: plans },
                      { label: t.extrasGroup, icon: Wrench, items: groups.flatMap((g) => g.items) },
                    ]}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="service-message">{c.project}</Label>
                <Textarea id="service-message" name="message" rows={5} maxLength={1800} placeholder={t.messagePlaceholder} />
              </div>

              <label className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                <input type="checkbox" name="terms" required className="mt-1 size-4 shrink-0 accent-primary" />
                <span>
                  {c.termsBefore}{" "}
                  <a
                    href={href("/politique-de-confidentialite")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    {c.termsLink}
                  </a>
                  . *
                </span>
              </label>

              <Button type="submit" disabled={sending} className="h-12 rounded-xl text-base font-semibold">
                {sending ? <Loader2 className="animate-spin" /> : <Send className="rtl:-scale-x-100" />}
                {c.send}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
