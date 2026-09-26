"use client";

import * as React from "react";
import { Loader2, MessageSquarePlus, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { Textarea } from "@/components/ui/textarea";
import { whatsappLink } from "@/lib/format";
import { formsViaWhatsApp } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n-provider";
import { fill } from "@/lib/i18n/fill";

export function ReviewDialog({ whatsapp }: { whatsapp?: string }) {
  const [open, setOpen] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [hover, setHover] = React.useState(0);
  const [sending, setSending] = React.useState(false);
  const { t: all, href } = useI18n();
  const t = all.review;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!rating) {
      toast.error(t.pickRating);
      return;
    }
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("rating", String(rating));

    // Pas encore de base de données : l'avis part sur WhatsApp, déjà rédigé.
    if (formsViaWhatsApp && whatsapp) {
      const text = (k: string) => String(data.get(k) ?? "").trim();
      const message = [
        t.waIntro,
        `${"★".repeat(rating)}${"☆".repeat(5 - rating)} (${rating}/5)`,
        `${t.waName} : ${text("name")}`,
        text("role") && `${t.waRole} : ${text("role")}`,
        `${t.waReview} : ${text("text")}`,
      ]
        .filter(Boolean)
        .join("\n");
      if (!text("website")) window.open(whatsappLink(whatsapp, message), "_blank", "noopener");
      toast.success(t.sentWhatsapp);
      form.reset();
      setRating(0);
      setOpen(false);
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/reviews", { method: "POST", body: data });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? t.error);
      toast.success(t.sent);
      form.reset();
      setRating(0);
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t.error);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} size="lg" className="h-11 rounded-xl px-6 text-sm font-semibold">
        <MessageSquarePlus />
        {t.leave}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto p-6 sm:max-w-md">
          {sending && (
            <div className="absolute inset-0 z-20 grid animate-loader-fade place-items-center rounded-[inherit] bg-background/95 p-6">
              <Loader size="sm" title={t.sendingTitle} messages={t.sendingMessages} />
            </div>
          )}
          <DialogHeader>
            <DialogTitle className="font-heading text-xl font-bold">{t.title}</DialogTitle>
            <DialogDescription>{t.description}</DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="grid gap-4">
            {/* Piège à robots, invisible pour les humains */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

            <div className="grid gap-2">
              <Label>{t.rating}</Label>
              <div className="flex gap-1" onMouseLeave={() => setHover(0)} role="radiogroup" aria-label={t.ratingAria}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={rating === value}
                    aria-label={fill(value > 1 ? t.stars : t.star, { n: value })}
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHover(value)}
                    className="rounded p-0.5 transition-transform hover:scale-110"
                  >
                    <Star
                      className={cn(
                        "size-7",
                        value <= (hover || rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="review-name">{t.name}</Label>
              <Input id="review-name" name="name" required minLength={2} maxLength={60} placeholder={t.namePlaceholder} className="h-10" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="review-role">{t.role}</Label>
              <Input id="review-role" name="role" maxLength={80} placeholder={t.rolePlaceholder} className="h-10" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="review-text">{t.text}</Label>
              <Textarea
                id="review-text"
                name="text"
                required
                minLength={10}
                maxLength={600}
                rows={4}
                placeholder={t.textPlaceholder}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="review-photo">{t.photo}</Label>
              <Input id="review-photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" className="h-10" />
            </div>

            <Button type="submit" disabled={sending} className="mt-1 h-11 rounded-xl text-sm font-semibold">
              {sending && <Loader2 className="animate-spin" />}
              {t.submit}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              {t.notice}{" "}
              <a href={href("/politique-de-confidentialite")} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                {t.privacyLink}
              </a>
              .
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
