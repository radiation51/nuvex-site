"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Check, Clock, Loader2, Mail, MapPin, MessageCircle, Phone, RotateCcw, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GlassPanel } from "@/components/site/glass-panel";
import { SectionHeading } from "@/components/site/section-heading";
import { SELECT_OFFER_EVENT, formatDA, whatsappLink } from "@/lib/format";
import { formsViaWhatsApp } from "@/lib/supabase";
import type { Offer, Settings } from "@/lib/types";

export function Contact({ offers, settings }: { offers: Offer[]; settings: Settings }) {
  const [offer, setOffer] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState<{ name: string; phone: string; offer: string; whatsappUrl?: string } | null>(null);
  const successRef = React.useRef<HTMLDivElement>(null);

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
      const message = [
        "Bonjour NUVEX, je souhaite un devis pour mon site web.",
        `Nom : ${text("name")}`,
        `Téléphone : ${text("phone")}`,
        text("email") && `E-mail : ${text("email")}`,
        `Offre : ${text("offer") || "je ne sais pas encore"}`,
        text("message") && `Mon projet : ${text("message")}`,
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
      if (!res.ok) throw new Error(json.error ?? "Envoi impossible.");
      // Mode démo (Supabase pas encore branché) : la demande apparaît dans l'admin de démo.
      if (json.demo) import("@/lib/demo-supabase").then((m) => m.addDemoLead(payload));
      form.reset();
      setOffer("");
      setSent(summary);
      requestAnimationFrame(() => successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Envoi impossible.");
    } finally {
      setSending(false);
    }
  }

  const contactItems = [
    settings.whatsapp && { icon: MessageCircle, label: "WhatsApp", value: settings.whatsapp, href: whatsappLink(settings.whatsapp, "Bonjour NUVEX, je souhaite un devis pour mon site web.") },
    settings.phone && { icon: Phone, label: "Téléphone", value: settings.phone, href: `tel:${settings.phone.replace(/\s/g, "")}` },
    settings.email && { icon: Mail, label: "E-mail", value: settings.email, href: `mailto:${settings.email}` },
    settings.city && { icon: MapPin, label: "Localisation", value: settings.city, href: null },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string; href: string | null }[];

  return (
    <section id="contact" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          badge="Devis 100 % gratuit"
          title="Parlons de votre projet"
          subtitle="Remplissez le formulaire ou écrivez-nous sur WhatsApp. Réponse sous 24 h, sans engagement."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <GlassPanel className="flex flex-col gap-4 rounded-2xl p-7">
            <h3 className="font-heading text-xl font-bold">Contact direct</h3>
            <p className="text-sm text-white/75">Le plus rapide : un message WhatsApp. On vous répond sous 24 h.</p>
            <ul className="mt-2 flex flex-col gap-3">
              {contactItems.length === 0 && (
                <li className="text-sm text-white/50">Coordonnées à renseigner dans l&apos;admin (Paramètres).</li>
              )}
              {contactItems.map(({ icon: Icon, label, value, href }) => {
                const inner = (
                  <>
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-lime">
                      <Icon className="size-5" />
                    </span>
                    <span>
                      <span className="block text-xs text-white/55">{label}</span>
                      <span className="block font-medium break-all">{value}</span>
                    </span>
                  </>
                );
                return (
                  <li key={label}>
                    {href ? (
                      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl p-1 transition-colors hover:bg-white/5">
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
                href={whatsappLink(settings.whatsapp, "Bonjour NUVEX, je souhaite un devis pour mon site web.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 font-semibold text-ink transition-opacity hover:opacity-90"
              >
                <MessageCircle className="size-5" />
                Écrire sur WhatsApp
              </a>
            )}
          </GlassPanel>

          {sent ? (
            <SuccessPanel
              ref={successRef}
              name={sent.name}
              phone={sent.phone}
              offer={offers.find((o) => o.name === sent.offer)}
              whatsappUrl={sent.whatsappUrl}
              onReset={() => setSent(null)}
            />
          ) : (
          <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border bg-card p-6 sm:p-8">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="lead-name">Nom *</Label>
                <Input id="lead-name" name="name" required minLength={2} maxLength={80} autoComplete="name" className="h-11" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lead-phone">Téléphone *</Label>
                <Input id="lead-phone" name="phone" type="tel" required autoComplete="tel" placeholder="0555 12 34 56" className="h-11" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="lead-email">E-mail</Label>
                <Input id="lead-email" name="email" type="email" autoComplete="email" className="h-11" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lead-offer">Offre souhaitée</Label>
                <select
                  id="lead-offer"
                  name="offer"
                  value={offer}
                  onChange={(e) => setOffer(e.target.value)}
                  className="h-11 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">Je ne sais pas encore</option>
                  {offers.map((o) => (
                    <option key={o.id} value={o.name}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lead-message">Votre projet</Label>
              <Textarea id="lead-message" name="message" rows={5} maxLength={2000} placeholder="Votre activité, ce que vous attendez du site, vos délais…" />
            </div>

            <Button type="submit" disabled={sending} className="h-12 rounded-xl text-base font-semibold">
              {sending ? <Loader2 className="animate-spin" /> : <Send />}
              Envoyer ma demande
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
          <h3 className="mt-6 font-heading text-2xl font-bold sm:text-3xl">Votre demande est prête !</h3>
          <p className="mt-3 max-w-md text-muted-foreground">
            Merci{name ? ` ${name}` : ""} ! Votre demande s&apos;est ouverte dans WhatsApp : appuyez sur{" "}
            <strong className="text-foreground">Envoyer</strong> pour nous la transmettre. Vous recevrez un appel ou une réponse dans les{" "}
            <strong className="text-foreground">prochaines 24 heures</strong>.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 font-semibold text-ink transition-opacity hover:opacity-90"
          >
            <MessageCircle className="size-5" />
            Ouvrir WhatsApp
          </a>
        </>
      ) : (
        <>
          <h3 className="mt-6 font-heading text-2xl font-bold sm:text-3xl">Demande envoyée avec succès !</h3>
          <p className="mt-3 max-w-md text-muted-foreground">
            Merci{name ? ` ${name}` : ""}, votre demande a bien été reçue. Vous recevrez un appel ou une réponse dans les{" "}
            <strong className="text-foreground">prochaines 24 heures</strong>.
          </p>
        </>
      )}

      <div className="mt-6 grid w-full max-w-sm gap-2 rounded-xl bg-muted/60 p-4 text-left text-sm">
        {offer && (
          <p className="flex justify-between gap-3">
            <span className="text-muted-foreground">Offre choisie</span>
            <strong>
              {offer.name} · {offer.price != null ? `dès ${formatDA(offer.price)}` : "sur devis"}
            </strong>
          </p>
        )}
        {phone && (
          <p className="flex justify-between gap-3">
            <span className="text-muted-foreground">On vous appelle au</span>
            <strong>{phone}</strong>
          </p>
        )}
        <p className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="size-3.5" />
          Réponse sous 24 h · devis 100 % gratuit
        </p>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
      >
        <RotateCcw className="size-3.5" />
        Envoyer une autre demande
      </button>
    </motion.div>
  );
}
