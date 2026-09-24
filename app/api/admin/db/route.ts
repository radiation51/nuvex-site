import { isAdminRequest } from "@/lib/admin-auth";
import { ADMIN_TABLES, getServiceSupabase } from "@/lib/supabase-admin";

type Row = Record<string, unknown>;

interface DbRequest {
  table: string;
  op: "select" | "insert" | "update" | "upsert" | "delete";
  values?: Row | Row[];
  filters?: [string, string | number | boolean | null][];
  order?: { col: string; asc: boolean };
  limit?: number;
  single?: boolean;
}

const COLUMN = /^[a-z_]+$/;

/** Toutes les lectures / écritures de l'admin passent ici, après vérification du mot de passe. */
export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return Response.json({ data: null, error: { message: "Session admin expirée. Reconnectez-vous." } }, { status: 401 });
  }

  const supabase = getServiceSupabase();
  if (!supabase) {
    return Response.json({ data: null, error: { message: "Clé serveur Supabase manquante (SUPABASE_SERVICE_ROLE_KEY)." } }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as DbRequest | null;
  if (!body || !(ADMIN_TABLES as readonly string[]).includes(body.table)) {
    return Response.json({ data: null, error: { message: "Table non autorisée." } }, { status: 400 });
  }
  const filters = body.filters ?? [];
  if (filters.some(([col]) => !COLUMN.test(col)) || (body.order && !COLUMN.test(body.order.col))) {
    return Response.json({ data: null, error: { message: "Requête invalide." } }, { status: 400 });
  }

  const table = supabase.from(body.table);
  // Les modifications / suppressions exigent au moins un filtre (jamais toute la table d'un coup).
  if ((body.op === "update" || body.op === "delete") && filters.length === 0) {
    return Response.json({ data: null, error: { message: "Filtre obligatoire." } }, { status: 400 });
  }

  let query;
  switch (body.op) {
    case "select":
      query = table.select("*");
      break;
    case "insert":
      query = table.insert(body.values ?? {});
      break;
    case "upsert":
      query = table.upsert(body.values ?? {});
      break;
    case "update":
      query = table.update((body.values ?? {}) as Row);
      break;
    case "delete":
      query = table.delete();
      break;
    default:
      return Response.json({ data: null, error: { message: "Opération inconnue." } }, { status: 400 });
  }

  for (const [col, value] of filters) query = query.eq(col, value as never);
  if (body.op === "select") {
    let select = query as ReturnType<typeof table.select>;
    if (body.order) select = select.order(body.order.col, { ascending: body.order.asc });
    if (body.limit) select = select.limit(body.limit);
    const { data, error } = body.single ? await select.maybeSingle() : await select;
    return Response.json({ data, error: error ? { message: error.message } : null });
  }

  const { error } = await query;
  return Response.json({ data: null, error: error ? { message: error.message } : null });
}
