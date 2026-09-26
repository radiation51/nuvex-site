"use client";

import * as React from "react";
import { BellOff, BellRing, CheckCircle2, Loader2, Send, Share, Smartphone, SquarePlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type State =
  | { step: "loading" }
  | { step: "unsupported" }
  | { step: "install" } // iPhone : l'admin doit d'abord être ajouté à l'écran d'accueil
  | { step: "denied" }
  | { step: "off" | "on"; devices: number; publicKey: string; endpoint?: string };

const toKey = (base64: string) => {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
};

const deviceName = () => {
  const ua = navigator.userAgent;
  if (/iPhone/.test(ua)) return "iPhone";
  if (/iPad/.test(ua)) return "iPad";
  if (/Android/.test(ua)) return "Android";
  return /Mac/.test(ua) ? "Mac" : /Windows/.test(ua) ? "PC Windows" : "Navigateur";
};

async function api(body?: Record<string, unknown>) {
  const res = await fetch("/api/admin/push", body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : undefined);
  if (res.status === 401) window.location.reload();
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error ?? "Connexion au serveur impossible.");
  return json;
}

/** Paramètres > Notifications sur le téléphone (comme Instagram ou WhatsApp), à activer sur chaque appareil. */
export function PushCard() {
  const [state, setState] = React.useState<State>({ step: "loading" });
  const [busy, setBusy] = React.useState(false);

  const refresh = React.useCallback(async () => {
    const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const installed = window.matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone === true;
    if (ios && !installed) return setState({ step: "install" });
    if (!supported) return setState({ step: "unsupported" });
    if (Notification.permission === "denied") return setState({ step: "denied" });
    try {
      const [{ publicKey, devices }, registration] = await Promise.all([api(), navigator.serviceWorker.register("/sw.js", { scope: "/" })]);
      const current = await registration.pushManager.getSubscription();
      setState({ step: current ? "on" : "off", devices, publicKey, endpoint: current?.endpoint });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur inattendue.");
      setState({ step: "unsupported" });
    }
  }, []);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- détection de l'appareil, impossible côté serveur
    refresh();
  }, [refresh]);

  async function enable() {
    if (state.step !== "off" && state.step !== "on") return;
    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState({ step: "denied" });
        return;
      }
      const registration = await navigator.serviceWorker.ready;
      const subscription =
        (await registration.pushManager.getSubscription()) ??
        (await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: toKey(state.publicKey) }));
      await api({ action: "subscribe", subscription: subscription.toJSON(), device: deviceName() });
      toast.success("Notifications activées sur cet appareil.");
      await api({ action: "test" }).catch(() => null);
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Activation impossible.");
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    if (state.step !== "on") return;
    setBusy(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await api({ action: "unsubscribe", endpoint: subscription.endpoint });
        await subscription.unsubscribe();
      }
      toast.success("Notifications désactivées sur cet appareil.");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur inattendue.");
    } finally {
      setBusy(false);
    }
  }

  async function test() {
    setBusy(true);
    try {
      const { sent } = await api({ action: "test" });
      toast.success(`Notification de test envoyée (${sent} appareil${sent > 1 ? "s" : ""}).`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Envoi impossible.");
    } finally {
      setBusy(false);
    }
  }

  const on = state.step === "on";
  const devices = state.step === "on" || state.step === "off" ? state.devices : 0;

  return (
    <section className="mt-6 rounded-2xl border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <BellRing className="size-5" />
          </span>
          <div>
            <h2 className="font-heading text-lg font-bold">Notifications sur le téléphone</h2>
            <p className="text-sm text-muted-foreground">
              Comme Instagram ou WhatsApp : une notification NUVEX à chaque nouvelle commande, demande de devis, abonnement, demande de service ou avis.
            </p>
          </div>
        </div>
        {(state.step === "on" || state.step === "off") && (
          <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", on ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800")}>
            {on && <CheckCircle2 className="size-3.5" />}
            {on ? "Activées sur cet appareil" : "Pas activées sur cet appareil"}
          </span>
        )}
      </div>

      <div className="mt-5">
        {state.step === "loading" && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Vérification…
          </p>
        )}

        {state.step === "install" && (
          <div className="rounded-xl bg-primary/5 p-4 text-sm">
            <p className="font-semibold">Sur iPhone, installez d&apos;abord l&apos;admin sur votre écran d&apos;accueil :</p>
            <ol className="mt-3 grid gap-2.5">
              <li className="flex items-start gap-2.5">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">1</span>
                <span>
                  Ouvrez cette page dans <strong>Safari</strong>, puis touchez le bouton <Share className="inline size-4 align-text-bottom" /> <strong>Partager</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">2</span>
                <span>
                  Choisissez <SquarePlus className="inline size-4 align-text-bottom" /> <strong>« Sur l&apos;écran d&apos;accueil »</strong>, puis <strong>Ajouter</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">3</span>
                <span>
                  Ouvrez l&apos;application <strong>NUVEX</strong> depuis votre écran d&apos;accueil, connectez-vous, et revenez ici dans <strong>Paramètres</strong> pour activer les notifications.
                </span>
              </li>
            </ol>
          </div>
        )}

        {state.step === "unsupported" && (
          <p className="rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">
            Ce navigateur ne permet pas les notifications. Utilisez Safari sur iPhone (après l&apos;avoir ajouté à l&apos;écran d&apos;accueil), ou Chrome sur Android et sur ordinateur.
          </p>
        )}

        {state.step === "denied" && (
          <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
            Les notifications ont été refusées sur cet appareil. Autorisez-les dans les réglages du téléphone (Réglages → Notifications → NUVEX), puis rechargez cette page.
          </p>
        )}

        {(state.step === "on" || state.step === "off") && (
          <>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Smartphone className="size-4" />
              {devices === 0 ? "Aucun appareil ne reçoit encore les notifications." : `${devices} appareil${devices > 1 ? "s reçoivent" : " reçoit"} les notifications.`}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {on ? (
                <Button variant="outline" onClick={disable} disabled={busy} className="h-10">
                  <BellOff />
                  Désactiver sur cet appareil
                </Button>
              ) : (
                <Button onClick={enable} disabled={busy} className="h-10">
                  {busy ? <Loader2 className="animate-spin" /> : <BellRing />}
                  Activer les notifications sur cet appareil
                </Button>
              )}
              <Button variant="outline" onClick={test} disabled={busy || devices === 0} className="h-10">
                <Send />
                Envoyer un test
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
