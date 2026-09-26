import { isAdminRequest } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase-admin";
import { buildReport, demoRows, type VisitRow } from "@/lib/visits-report";

const PERIODS = [7, 30, 90];
const PAGE = 1000; // nombre maximum de lignes renvoyées par Supabase à chaque lecture

/** Chiffres de la page « Visiteurs » (période choisie + période précédente pour comparer). */
export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) return Response.json({ error: "Session admin expirée. Reconnectez-vous." }, { status: 401 });

  const asked = Number(new URL(request.url).searchParams.get("days"));
  const days = PERIODS.includes(asked) ? asked : 30;

  const supabase = getServiceSupabase();
  if (!supabase) return Response.json({ ...buildReport(demoRows(days), days), demo: true });

  const since = new Date(Date.now() - 2 * days * 86_400_000).toISOString();
  const rows: VisitRow[] = [];
  for (let from = 0; from < 200_000; from += PAGE) {
    const { data, error } = await supabase
      .from("visits")
      .select("created_at, kind, path, lang, source, device, country, visitor, label")
      .gte("created_at", since)
      .order("created_at")
      .range(from, from + PAGE - 1);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    rows.push(...((data as VisitRow[]) ?? []));
    if (!data || data.length < PAGE) break;
  }

  return Response.json(buildReport(rows, days));
}
