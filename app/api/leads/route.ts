import { clientIp, isRateLimited } from "@/lib/rate-limit";
import { getServerSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return Response.json({ error: "Requête invalide." }, { status: 400 });

  if (String(body.website ?? "")) return Response.json({ ok: true });

  if (isRateLimited(`lead:${clientIp(request)}`, 5, 60 * 60 * 1000)) {
    return Response.json({ error: "Trop d'envois. Réessayez plus tard." }, { status: 429 });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const email = String(body.email ?? "").trim();
  const offer = String(body.offer ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (name.length < 2 || name.length > 80) return Response.json({ error: "Nom invalide." }, { status: 400 });
  if (phone.replace(/\D/g, "").length < 9 || phone.length > 30) {
    return Response.json({ error: "Numéro de téléphone invalide." }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Adresse e-mail invalide." }, { status: 400 });
  }
  if (offer.length > 60 || message.length > 2000) {
    return Response.json({ error: "Message trop long." }, { status: 400 });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    // En local sans Supabase : on simule l'envoi pour tester le parcours (la demande va dans l'admin de démo).
    if (process.env.NODE_ENV !== "production") return Response.json({ ok: true, demo: true });
    return Response.json({ error: "Le site n'est pas encore relié à la base de données." }, { status: 503 });
  }

  const { error } = await supabase.from("leads").insert({
    name,
    phone,
    email: email || null,
    offer: offer || null,
    message: message || null,
    status: "new",
  });

  if (error) return Response.json({ error: "Envoi impossible pour le moment." }, { status: 500 });
  return Response.json({ ok: true });
}
