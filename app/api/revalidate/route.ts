import { revalidatePath } from "next/cache";
import { getServerSupabase } from "@/lib/supabase";

/** Appelé par l'admin après une modification : la page publique est régénérée tout de suite. */
export async function POST(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return Response.json({ error: "Non autorisé." }, { status: 401 });

  const supabase = getServerSupabase(token);
  if (!supabase) return Response.json({ error: "Non configuré." }, { status: 503 });

  const { data, error } = await supabase.rpc("is_admin");
  if (error || data !== true) return Response.json({ error: "Non autorisé." }, { status: 403 });

  revalidatePath("/");
  return Response.json({ ok: true });
}
