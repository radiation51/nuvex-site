import * as React from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { toast } from "sonner";

/** Régénère la page publique pour que la modification apparaisse tout de suite. */
export async function refreshSite(supabase: SupabaseClient) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token || token === "demo") return;
  await fetch("/api/revalidate", { method: "POST" }).catch(() => {});
}

/** Demande au serveur une capture d'écran automatique d'un site ; renvoie l'adresse de l'image. */
export async function captureScreenshot(supabase: SupabaseClient, url: string) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return null;
  if (token === "demo") {
    toast.info("En mode démo, la capture automatique n'est pas disponible. Elle marchera une fois Supabase configuré.");
    return null;
  }
  const res = await fetch("/api/screenshot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  }).catch(() => null);
  const json = res ? await res.json().catch(() => ({})) : {};
  if (!res?.ok || !json.url) {
    toast.error(json.error ?? "Capture automatique impossible.");
    return null;
  }
  return json.url as string;
}

/** Affiche le résultat d'une opération Supabase et régénère le site si tout va bien. */
export async function done(supabase: SupabaseClient, error: { message: string } | null, success: string) {
  if (error) {
    toast.error(`Erreur : ${error.message}`);
    return false;
  }
  toast.success(success);
  await refreshSite(supabase);
  return true;
}

/** Envoie une image dans le stockage Supabase et renvoie son adresse publique. */
export async function uploadImage(supabase: SupabaseClient, file: File, folder: string) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type });
  if (error) {
    toast.error(`Envoi de l'image impossible : ${error.message}`);
    return null;
  }
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

export const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" });

export const fieldClass =
  "h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

/** Charge une table et la recharge à la demande. */
export function useTable<T>(supabase: SupabaseClient, table: string, orderBy = "created_at", ascending = false) {
  const [rows, setRows] = React.useState<T[] | null>(null);
  const reload = React.useCallback(async () => {
    const { data } = await supabase.from(table).select("*").order(orderBy, { ascending });
    setRows((data as T[]) ?? []);
  }, [supabase, table, orderBy, ascending]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- chargement initial des données
    reload();
  }, [reload]);

  return [rows, reload] as const;
}
