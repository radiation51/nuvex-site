import { isAdminRequest } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase-admin";

const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const MAX_BYTES = 5 * 1024 * 1024;

/** Envoi d'une image par l'admin (réalisations, photos d'avis) vers le stockage Supabase. */
export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return Response.json({ error: { message: "Session admin expirée." } }, { status: 401 });
  const supabase = getServiceSupabase();
  if (!supabase) return Response.json({ error: { message: "Clé serveur Supabase manquante." } }, { status: 503 });

  const form = await request.formData();
  const file = form.get("file");
  const folder = String(form.get("folder") ?? "projects").replace(/[^a-z-]/g, "") || "projects";
  if (!(file instanceof File) || !TYPES[file.type]) return Response.json({ error: { message: "Image JPG, PNG ou WEBP uniquement." } }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ error: { message: "Image trop lourde (5 Mo max)." } }, { status: 400 });

  const path = `${folder}/${crypto.randomUUID()}.${TYPES[file.type]}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type });
  if (error) return Response.json({ error: { message: error.message } }, { status: 500 });
  return Response.json({ path, url: supabase.storage.from("media").getPublicUrl(path).data.publicUrl });
}
