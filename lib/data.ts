import "server-only";
import { defaultOffers, defaultProjects, defaultSettings } from "@/lib/defaults";
import { getServerSupabase } from "@/lib/supabase";
import type { Offer, Project, Review, Settings, SiteData } from "@/lib/types";

/** Charge le contenu public du site. Retombe sur le contenu par défaut en cas d'absence ou d'erreur. */
export async function getSiteData(): Promise<SiteData> {
  const supabase = getServerSupabase();
  if (!supabase) {
    return { offers: defaultOffers, reviews: [], projects: defaultProjects, settings: defaultSettings };
  }

  const [offers, reviews, projects, settings] = await Promise.all([
    supabase.from("offers").select("*").order("position"),
    supabase.from("reviews").select("*").eq("status", "approved").order("created_at", { ascending: false }).limit(30),
    supabase.from("projects").select("*").order("position"),
    supabase.from("settings").select("*").eq("id", 1).maybeSingle(),
  ]);

  const offerRows = (offers.data as Offer[] | null) ?? [];
  const projectRows = (projects.data as Project[] | null) ?? [];

  return {
    offers: offerRows.length ? offerRows : defaultOffers,
    reviews: (reviews.data as Review[] | null) ?? [],
    projects: projectRows.length ? projectRows : defaultProjects,
    settings: { ...defaultSettings, ...((settings.data as Partial<Settings> | null) ?? {}) },
  };
}
