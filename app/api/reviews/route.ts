import { clientIp, isRateLimited } from "@/lib/rate-limit";
import { getServerSupabase } from "@/lib/supabase";

const MAX_PHOTO_BYTES = 3 * 1024 * 1024;
const PHOTO_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export async function POST(request: Request) {
  const form = await request.formData();

  // Piège à robots : un humain ne remplit jamais ce champ invisible.
  if (String(form.get("website") ?? "")) return Response.json({ ok: true });

  if (isRateLimited(`review:${clientIp(request)}`, 3, 60 * 60 * 1000)) {
    return Response.json({ error: "Trop d'envois. Réessayez plus tard." }, { status: 429 });
  }

  const name = String(form.get("name") ?? "").trim();
  const role = String(form.get("role") ?? "").trim();
  const text = String(form.get("text") ?? "").trim();
  const rating = Number(form.get("rating"));
  const photo = form.get("photo");

  if (name.length < 2 || name.length > 60) return Response.json({ error: "Nom invalide." }, { status: 400 });
  if (role.length > 80) return Response.json({ error: "Métier trop long." }, { status: 400 });
  if (text.length < 10 || text.length > 600) {
    return Response.json({ error: "L'avis doit contenir entre 10 et 600 caractères." }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return Response.json({ error: "Choisissez une note de 1 à 5." }, { status: 400 });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return Response.json({ error: "Le site n'est pas encore relié à la base de données." }, { status: 503 });
  }

  let image_url: string | null = null;
  if (photo instanceof File && photo.size > 0) {
    const ext = PHOTO_TYPES[photo.type];
    if (!ext) return Response.json({ error: "Photo : JPG, PNG ou WEBP uniquement." }, { status: 400 });
    if (photo.size > MAX_PHOTO_BYTES) return Response.json({ error: "Photo trop lourde (3 Mo max)." }, { status: 400 });

    const path = `reviews/${crypto.randomUUID()}.${ext}`;
    const upload = await supabase.storage.from("media").upload(path, photo, { contentType: photo.type });
    if (!upload.error) image_url = supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
  }

  const { error } = await supabase
    .from("reviews")
    .insert({ name, role: role || null, text, rating, image_url, status: "pending" });

  if (error) return Response.json({ error: "Envoi impossible pour le moment." }, { status: 500 });
  return Response.json({ ok: true });
}
