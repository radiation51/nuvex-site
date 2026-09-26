"use client";

import * as React from "react";
import { BellRing, CheckCircle2, Loader2, Send, Link2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Status {
  token: boolean;
  bot: string | null;
  linked: boolean;
}

/** Paramètres > Notifications Telegram : relier son téléphone et envoyer un test. */
export function TelegramCard() {
  const [status, setStatus] = React.useState<Status | null>(null);
  const [busy, setBusy] = React.useState<"link" | "test" | null>(null);

  const load = React.useCallback(async () => {
    const res = await fetch("/api/admin/telegram").catch(() => null);
    if (res?.status === 401) window.location.reload();
    setStatus(res?.ok ? await res.json() : { token: false, bot: null, linked: false });
  }, []);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- chargement initial de l'état
    load();
  }, [load]);

  async function run(action: "link" | "test") {
    setBusy(action);
    const res = await fetch("/api/admin/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    }).catch(() => null);
    const json = res ? await res.json().catch(() => ({})) : {};
    setBusy(null);
    if (!res?.ok) {
      toast.error(json.error ?? "Connexion au serveur impossible.");
      return;
    }
    toast.success(action === "link" ? "Telegram relié : regardez votre téléphone !" : "Message de test envoyé.");
    load();
  }

  const steps = [
    { done: status?.token, text: "Dans Telegram, écrivez à @BotFather, envoyez /newbot et choisissez un nom : il vous donne une clé." },
    { done: status?.token, text: "Ajoutez cette clé sur Netlify dans la variable TELEGRAM_BOT_TOKEN, puis republiez le site." },
    { done: status?.linked, text: `Ouvrez votre robot${status?.bot ? ` @${status.bot}` : ""} dans Telegram et appuyez sur « Démarrer ».` },
    { done: status?.linked, text: "Revenez ici et cliquez sur « Relier mon Telegram »." },
  ];

  return (
    <section className="mt-6 rounded-2xl border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[#229ED9]/15 text-[#229ED9]">
            <BellRing className="size-5" />
          </span>
          <div>
            <h2 className="font-heading text-lg font-bold">Notifications sur le téléphone</h2>
            <p className="text-sm text-muted-foreground">
              Un message Telegram à chaque nouvelle commande, demande de devis, abonnement, demande de service ou avis.
            </p>
          </div>
        </div>
        {status && (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
              status.linked ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
            )}
          >
            {status.linked ? <CheckCircle2 className="size-3.5" /> : null}
            {status.linked ? "Activées" : "Pas encore activées"}
          </span>
        )}
      </div>

      {!status ? (
        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Vérification…
        </p>
      ) : (
        <>
          <ol className="mt-5 grid gap-2.5">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold",
                    step.done ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                  )}
                >
                  {step.done ? <CheckCircle2 className="size-3.5" /> : i + 1}
                </span>
                <span className={cn(step.done && "text-muted-foreground line-through")}>{step.text}</span>
              </li>
            ))}
          </ol>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={() => run("link")} disabled={!status.token || busy !== null} className="h-10">
              {busy === "link" ? <Loader2 className="animate-spin" /> : <Link2 />}
              {status.linked ? "Relier un autre Telegram" : "Relier mon Telegram"}
            </Button>
            <Button variant="outline" onClick={() => run("test")} disabled={!status.linked || busy !== null} className="h-10">
              {busy === "test" ? <Loader2 className="animate-spin" /> : <Send />}
              Envoyer un test
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
