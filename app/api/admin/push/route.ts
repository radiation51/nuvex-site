import { isAdminRequest } from "@/lib/admin-auth";
import { countSubscriptions, getPublicKey, removeSubscription, saveSubscription, sendPush } from "@/lib/push";

const unauthorized = () => Response.json({ error: "Session admin expirée. Reconnectez-vous." }, { status: 401 });

/** Clé publique (pour activer les notifications sur l'appareil) et nombre d'appareils activés. */
export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  return Response.json({ publicKey: await getPublicKey(), devices: await countSubscriptions() });
}

interface Body {
  action?: "subscribe" | "unsubscribe" | "test";
  subscription?: { endpoint?: string; keys?: { p256dh?: string; auth?: string } };
  endpoint?: string;
  device?: string;
}

/** « subscribe » : active cet appareil. « unsubscribe » : le désactive. « test » : notification d'essai. */
export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  const body = ((await request.json().catch(() => ({}))) ?? {}) as Body;

  if (body.action === "subscribe") {
    const { endpoint, keys } = body.subscription ?? {};
    if (!endpoint?.startsWith("https://") || !keys?.p256dh || !keys.auth) {
      return Response.json({ error: "Abonnement invalide." }, { status: 400 });
    }
    await saveSubscription({ endpoint, p256dh: keys.p256dh, auth: keys.auth, device: (body.device ?? "").slice(0, 80) || null });
    return Response.json({ ok: true, devices: await countSubscriptions() });
  }

  if (body.action === "unsubscribe" && body.endpoint) {
    await removeSubscription(body.endpoint);
    return Response.json({ ok: true, devices: await countSubscriptions() });
  }

  if (body.action === "test") {
    const sent = await sendPush({
      title: "🔔 Test NUVEX",
      body: "Les notifications fonctionnent ! Chaque nouvelle commande, demande de devis, abonnement, demande de service ou avis arrivera ici.",
      tag: "test",
    });
    return sent
      ? Response.json({ ok: true, sent })
      : Response.json({ error: "Aucun appareil activé : activez d'abord les notifications sur votre téléphone." }, { status: 400 });
  }

  return Response.json({ error: "Action inconnue." }, { status: 400 });
}
