import { revalidatePath } from "next/cache";
import { isAdminRequest } from "@/lib/admin-auth";

/** Appelé par l'admin après une modification : la page publique est régénérée tout de suite. */
export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return Response.json({ error: "Non autorisé." }, { status: 401 });
  revalidatePath("/");
  return Response.json({ ok: true });
}
