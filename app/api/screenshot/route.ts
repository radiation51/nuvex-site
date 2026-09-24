import { isAdminRequest } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase-admin";

// Service de capture d'écran (gratuit, ~50 captures par jour sans clé).
const SCREENSHOT_API = "https://api.microlink.io/";

/**
 * Réservé à l'admin : prend une capture d'écran d'un site à partir de son adresse,
 * l'enregistre dans le stockage Supabase et renvoie son adresse publique.
 */
export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return Response.json({ error: "Non autorisé." }, { status: 401 });

  const supabase = getServiceSupabase();
  if (!supabase) return Response.json({ error: "Non configuré." }, { status: 503 });

  const body = (await request.json().catch(() => null)) as { url?: string } | null;
  let target: URL;
  try {
    target = new URL(String(body?.url ?? ""));
    if (target.protocol !== "https:" && target.protocol !== "http:") throw new Error();
  } catch {
    return Response.json({ error: "Adresse du site invalide." }, { status: 400 });
  }

  const params = new URLSearchParams({
    url: target.toString(),
    screenshot: "true",
    meta: "false",
    "screenshot.type": "jpeg",
    "viewport.width": "1440",
    "viewport.height": "900",
    "viewport.deviceScaleFactor": "1",
    waitForTimeout: "2500",
  });

  try {
    const res = await fetch(`${SCREENSHOT_API}?${params}`, { signal: AbortSignal.timeout(45_000) });
    const json = (await res.json()) as { status?: string; data?: { screenshot?: { url?: string } } };
    const shotUrl = json.data?.screenshot?.url;
    if (json.status !== "success" || !shotUrl) throw new Error("capture");

    const image = await fetch(shotUrl, { signal: AbortSignal.timeout(30_000) });
    if (!image.ok) throw new Error("image");
    const bytes = await image.arrayBuffer();

    const path = `projects/${crypto.randomUUID()}.jpg`;
    const upload = await supabase.storage.from("media").upload(path, bytes, { contentType: "image/jpeg" });
    if (upload.error) throw new Error(upload.error.message);

    return Response.json({ url: supabase.storage.from("media").getPublicUrl(path).data.publicUrl });
  } catch {
    return Response.json(
      { error: "Capture automatique impossible pour le moment. Ajoutez une image vous-même." },
      { status: 502 }
    );
  }
}
