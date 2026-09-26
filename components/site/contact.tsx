"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Check, Clock, Loader2, Mail, MapPin, Phone, RotateCcw, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GlassPanel } from "@/components/site/glass-panel";
import { Loader } from "@/components/ui/loader";
import { SectionHeading } from "@/components/site/section-heading";
import { SELECT_OFFER_EVENT, formatDA, whatsappLink } from "@/lib/format";
import { formsViaWhatsApp } from "@/lib/supabase";
import type { Offer, Settings } from "@/lib/types";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { InstagramIcon, instagramHandle } from "@/components/site/social-icons";
import { RichText } from "@/components/ui/rich-text";
import { useI18n } from "@/components/i18n-provider";
import { fill } from "@/lib/i18n/fill";

export function Contact({
  offers,
  softwareOffers,
  settings,
}: {
  offers: Offer[];
  softwareOffers: Offer[];
  settings: Settings;
}) {
  const [offer, setOffer] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState<{ name: string; phone: string; offer: string; whatsappUrl?: string } | null>(null);
  const successRef = React.useRef<HTMLDivElement>(null);
  const { t: all, lang, href } = useI18n();
  const t = all.contact;

  React.useEffect(() => {
    const onSelect = (e: Event) => setOffer((e as CustomEvent<string>).detail);
    window.addEventListener(SELECT_OFFER_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_OFFER_EVENT, onSelect);
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    const text = (k: string) => String(payload[k] ?? "").trim();
    const summary = { name: text("name").split(/\s+/)[0], phone: text("phone"), offer: text("offer") };

    // Pas encore de base de données : la demande part sur WhatsApp, déjà rédigée.
    if (formsViaWhatsApp && settings.whatsapp) {
      const chosen = [...offers, ...softwareOffers].find((o) => (o.value ?? o.name) === text("offer"));
      const wantsSoftware = softwareOffers.some((o) => (o.value ?? o.name) === text("offer"));
      const message = [
        fill(t.waIntro, { what: wantsSoftware ? t.waSoftware : t.waSite }),
        `${t.waName} : ${text("name")}`,
        `${t.waPhone} : ${text("phone")}`,
        text("email") && `${t.waEmail} : ${text("email")}`,
        `${t.waOffer} : ${chosen?.name ?? t.waDontKnow}`,
        text("message") && `${t.waProject} : ${text("message")}`,
      ]
        .filter(Boolean)
        .join("\n");
      const whatsappUrl = whatsappLink(settings.whatsapp, message);
      if (!text("website")) window.open(whatsappUrl, "_blank", "noopener");
      form.reset();
      setOffer("");
      setSent({ ...summary, whatsappUrl });
      requestAnimationFrame(() => successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(lang === "fr" ? (json.error ?? t.error) : t.error);
      // Mode démo (Supabase pas encore branché) : la demande apparaît dans l'admin de démo.
      if (json.demo) import("@/lib/demo-supabase").then((m) => m.addDemoLead(payload));
      form.reset();
      setOffer("");
      setSent(summary);
      requestAnimationFrame(() => successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t.error);
    } finally {
      setSending(false);
    }
  }

  const contactItems = [
    settings.whatsapp && { icon: WhatsAppIcon, label: "WhatsApp", value: settings.whatsapp, href: whatsappLink(settings.whatsapp, all.whatsappHello) },
    settings.phone && { icon: Phone, label: t.phone, value: settings.phone, href: `tel:${settings.phone.replace(/\s/g, "")}` },
    settings.email && { icon: Mail, label: t.email, value: settings.email, href: `mailto:${settings.email}` },
    settings.instagram && { icon: InstagramIcon, label: "Instagram", value: instagramHandle(settings.instagram), href: settings.instagram },
    settings.city && { icon: MapPin, label: t.location, value: settings.city, href: null },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string; href: string | null }[];

  return (
    <section id="contact" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          badge={t.badge}
          title={t.title}
          subtitle={t.subtitle}
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <GlassPanel className="flex flex-col gap-4 rounded-2xl p-7">
            <h3 className="font-heading text-xl font-bold">{t.direct}</h3>
            <p className="text-sm text-white/75">{t.directText}</p>
            <ul className="mt-2 flex flex-col gap-3">
              {contactItems.length === 0 && (
                <li className="text-sm text-white/50">{t.emptyContacts}</li>
              )}
              {contactItems.map(({ icon: Icon, label, value, href }) => {
                const inner = (
                  <>
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-lime">
                      <Icon className="size-5" />
                    </span>
                    <span>
                      <span className="block text-xs text-white/55">{label}</span>
                      <span dir="ltr" className="block font-medium break-all">{value}</span>
                    </span>
                  </>
                );
                return (
                  <li key={label}>
                    {href ? (
                      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl p-1 tap hover:bg-white/5">
                        {inner}
                      </a>
                    ) : (
                      <div className="flex items-center gap-3 p-1">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
            {settings.whatsapp && (
              <a
                href={whatsappLink(settings.whatsapp, all.whatsappHello)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 font-semibold text-ink tap hover:opacity-90"
              >
                <WhatsAppIcon className="size-5" />
                {t.writeWhatsapp}
              </a>
            )}
          </GlassPanel>

          {sent ? (
            <SuccessPanel
              ref={successRef}
              name={sent.name}
              phone={sent.phone}
              offer={[...offers, ...softwareOffers].find((o) => (o.value ?? o.name) === sent.offer)}
              whatsappUrl={sent.whatsappUrl}
              onReset={() => setSent(null)}
            />
          ) : (
          <form onSubmit={onSubmit} aria-busy={sending} className="relative grid gap-4 rounded-2xl border bg-card p-6 sm:p-8">
            {/* Pendant l'envoi : message rassurant par-dessus le formulaire */}
            {sending && (
              <div className="absolute inset-0 z-10 grid animate-loader-fade place-items-center rounded-2xl bg-card/95 p-6">
                <Loader
                  size="sm"
                  secure
                  title={t.sendingTitle}
                  messages={t.sendingMessages}
                  secureLabel={all.loader.secure}
                />
              </div>
            )}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="lead-name">{t.name}</Label>
                <Input id="lead-name" name="name" required minLength={2} maxLength={80} autoComplete="name" className="h-11" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lead-phone">{t.phoneLabel}</Label>
                <Input id="lead-phone" name="phone" type="tel" required autoComplete="tel" placeholder="0555 12 34 56" dir="ltr" className="h-11 rtl:text-right" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="lead-email">{t.emailLabel}</Label>
                <Input id="lead-email" name="email" type="email" autoComplete="email" dir="ltr" className="h-11 rtl:text-right" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lead-offer">{t.offer}</Label>
                <select
                  id="lead-offer"
                  name="offer"
                  value={offer}
                  onChange={(e) => setOffer(e.target.value)}
                  className="h-11 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">{t.dontKnow}</option>
                  <optgroup label={t.sitesGroup}>
                    {offers.map((o) => (
                      <option key={o.id} value={o.value ?? o.name}>
                        {o.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label={t.softwareGroup}>
                    {softwareOffers.map((o) => (
                      <option key={o.id} value={o.value ?? o.name}>
                        {o.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lead-message">{t.project}</Label>
              <Textarea id="lead-message" name="message" rows={5} maxLength={2000} placeholder={t.projectPlaceholder} />
            </div>

            <label className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
              <input type="checkbox" name="terms" required className="mt-1 size-4 shrink-0 accent-primary" />
              <span>
                {t.termsBefore}{" "}
                <a
                  href={href("/politique-de-confidentialite")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  {t.termsLink}
                </a>{" "}
                {t.termsAfter}
              </span>
            </label>

            <Button type="submit" disabled={sending} className="h-12 rounded-xl text-base font-semibold">
              {sending ? <Loader2 className="animate-spin" /> : <Send className="rtl:-scale-x-100" />}
              {t.send}
            </Button>
          </form>
          )}
        </div>
      </div>
    </section>
  );
}

/** Message affiché une fois la demande envoyée. */
function SuccessPanel({
  ref,
  name,
  phone,
  offer,
  whatsappUrl,
  onReset,
}: {
  ref: React.Ref<HTMLDivElement>;
  name: string;
  phone: string;
  offer?: Offer;
  /** Présent quand la demande est transmise via WhatsApp. */
  whatsappUrl?: string;
  onReset: () => void;
}) {
  const { t: all, lang } = useI18n();
  const t = all.contact;
  const thanks = name ? ` ${name}` : "";
  return (
    <motion.div
      ref={ref}
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
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

      {whatsappUrl ? (
        <>
          <h3 className="mt-6 font-heading text-2xl font-bold sm:text-3xl">{t.readyTitle}</h3>
          <p className="mt-3 max-w-md text-muted-foreground">
            <RichText text={fill(t.readyText, { name: thanks })} />
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 font-semibold text-ink tap hover:opacity-90"
          >
            <WhatsAppIcon className="size-5" />
            {t.openWhatsapp}
          </a>
        </>
      ) : (
        <>
          <h3 className="mt-6 font-heading text-2xl font-bold sm:text-3xl">{t.sentTitle}</h3>
          <p className="mt-3 max-w-md text-muted-foreground">
            <RichText text={fill(t.sentText, { name: thanks })} />
          </p>
        </>
      )}

      <div className="mt-6 grid w-full max-w-sm gap-2 rounded-xl bg-muted/60 p-4 text-start text-sm">
        {offer && (
          <p className="flex justify-between gap-3">
            <span className="text-muted-foreground">{t.chosenOffer}</span>
            <strong>
              {offer.name} · {offer.price != null ? fill(t.fromPrice, { price: formatDA(offer.price, lang) }) : t.onQuote}
            </strong>
          </p>
        )}
        {phone && (
          <p className="flex justify-between gap-3">
            <span className="text-muted-foreground">{t.callYou}</span>
            <strong dir="ltr">{phone}</strong>
          </p>
        )}
        <p className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="size-3.5" />
          {t.answer}
        </p>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
      >
        <RotateCcw className="size-3.5" />
        {t.another}
      </button>
    </motion.div>
  );
}
