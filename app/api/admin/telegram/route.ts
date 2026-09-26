import { isAdminRequest } from "@/lib/admin-auth";
import { botUsername, getChatId, linkLatestChat, sendTelegram, telegramToken } from "@/lib/telegram";

const unauthorized = () => Response.json({ error: "Session admin expirée. Reconnectez-vous." }, { status: 401 });

/** État des notifications Telegram (pour Paramètres dans l'admin). */
export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  const token = Boolean(telegramToken());
  return Response.json({
    token,
    bot: token ? await botUsername() : null,
    linked: token ? Boolean(await getChatId()) : false,
  });
}

/** « link » : relie le compte qui a écrit au robot. « test » : envoie un message d'essai. */
export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  const { action } = ((await request.json().catch(() => ({}))) ?? {}) as { action?: string };
  if (!telegramToken()) return Response.json({ error: "La clé du robot (TELEGRAM_BOT_TOKEN) n'est pas encore ajoutée sur Netlify." }, { status: 400 });

  if (action === "link") {
    const chat = await linkLatestChat();
    if (!chat) {
      return Response.json(
        { error: "Aucun message trouvé : ouvrez votre robot dans Telegram, appuyez sur « Démarrer », puis réessayez." },
        { status: 404 }
      );
    }
    await sendTelegram("✅ <b>Notifications NUVEX activées</b>\n\nVous recevrez ici chaque nouvelle commande, demande de devis, abonnement, demande de service et avis.", [], chat.id);
    return Response.json({ ok: true, name: chat.name });
  }

  if (action === "test") {
    const ok = await sendTelegram("🔔 <b>Test NUVEX</b>\n\nLes notifications fonctionnent. À chaque nouvelle demande sur le site, un message arrivera ici.");
    return ok ? Response.json({ ok: true }) : Response.json({ error: "Envoi impossible : reliez d'abord votre Telegram." }, { status: 400 });
  }

  return Response.json({ error: "Action inconnue." }, { status: 400 });
}
