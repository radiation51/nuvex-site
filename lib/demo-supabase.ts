// MODE DÉMO de l'admin : imite le client Supabase avec des données fictives
// enregistrées dans le navigateur. Utilisé uniquement tant que Supabase n'est pas configuré.
import type { SupabaseClient } from "@supabase/supabase-js";
import { defaultOffers, defaultProjects, defaultSettings } from "@/lib/defaults";
import type { Lead } from "@/lib/types";

type Row = Record<string, unknown>;
type Tables = Record<string, Row[]>;

// v2 : repart à vide (les anciennes données fictives enregistrées dans le navigateur sont ignorées).
const STORAGE_KEY = "nuvex-admin-demo-v2";

/** Point de départ : aucune fausse donnée, seulement les vraies infos (offres, réalisations, coordonnées). */
function seed(): Tables {
  return {
    clients: [],
    orders: [],
    leads: [],
    reviews: [],
    offers: defaultOffers as unknown as Row[],
    projects: defaultProjects as unknown as Row[],
    settings: [{ id: 1, ...defaultSettings }],
  };
}

function load(): Tables {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Tables;
  } catch {
    // stockage indisponible : on repart des données de démo
  }
  return seed();
}

function save(tables: Tables) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tables));
  } catch {
    // ignoré : la démo fonctionne quand même pour la session
  }
}

export function resetDemo() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignoré
  }
}

/** Mode démo : ajoute une réservation envoyée depuis le formulaire du site. */
export function addDemoLead(values: Record<string, unknown>) {
  const tables = load();
  const text = (k: string) => String(values[k] ?? "").trim() || null;
  const lead: Lead = {
    id: crypto.randomUUID(),
    name: text("name") ?? "Client",
    phone: text("phone") ?? "",
    email: text("email"),
    offer: text("offer"),
    message: text("message"),
    status: "new",
    created_at: new Date().toISOString(),
  };
  (tables.leads ??= []).unshift(lead as unknown as Row);
  save(tables);
}

type Result = { data: unknown; error: null };

class DemoQuery implements PromiseLike<Result> {
  private op: "select" | "insert" | "update" | "delete" | "upsert" = "select";
  private payload: Row | Row[] | null = null;
  private filters: [string, unknown][] = [];
  private sort: { col: string; asc: boolean } | null = null;
  private max: number | null = null;
  private one = false;

  constructor(
    private tables: Tables,
    private table: string
  ) {}

  select() {
    return this;
  }
  order(col: string, opts?: { ascending?: boolean }) {
    this.sort = { col, asc: opts?.ascending ?? true };
    return this;
  }
  eq(col: string, value: unknown) {
    this.filters.push([col, value]);
    return this;
  }
  limit(n: number) {
    this.max = n;
    return this;
  }
  maybeSingle() {
    this.one = true;
    return this;
  }
  single() {
    this.one = true;
    return this;
  }
  insert(values: Row | Row[]) {
    this.op = "insert";
    this.payload = values;
    return this;
  }
  update(values: Row) {
    this.op = "update";
    this.payload = values;
    return this;
  }
  upsert(values: Row | Row[]) {
    this.op = "upsert";
    this.payload = values;
    return this;
  }
  delete() {
    this.op = "delete";
    return this;
  }

  private matches = (row: Row) => this.filters.every(([col, value]) => row[col] === value);

  private run(): Result {
    const rows = (this.tables[this.table] ??= []);
    const list = (v: Row | Row[] | null) => (Array.isArray(v) ? v : v ? [v] : []);

    if (this.op === "insert") {
      const created = list(this.payload).map((r) => ({ id: crypto.randomUUID(), created_at: new Date().toISOString(), ...r }));
      rows.push(...created);
      save(this.tables);
      return { data: created, error: null };
    }
    if (this.op === "upsert") {
      for (const r of list(this.payload)) {
        const i = rows.findIndex((x) => x.id === r.id);
        if (i >= 0) rows[i] = { ...rows[i], ...r };
        else rows.push({ id: crypto.randomUUID(), created_at: new Date().toISOString(), ...r });
      }
      save(this.tables);
      return { data: null, error: null };
    }
    if (this.op === "update") {
      rows.forEach((r, i) => {
        if (this.matches(r)) rows[i] = { ...r, ...(this.payload as Row) };
      });
      save(this.tables);
      return { data: null, error: null };
    }
    if (this.op === "delete") {
      this.tables[this.table] = rows.filter((r) => !this.matches(r));
      if (this.table === "clients") {
        const ids = new Set(rows.filter(this.matches).map((r) => r.id));
        this.tables.orders = (this.tables.orders ?? []).filter((o) => !ids.has(o.client_id));
      }
      save(this.tables);
      return { data: null, error: null };
    }

    let result = rows.filter(this.matches);
    if (this.sort) {
      const { col, asc } = this.sort;
      result = [...result].sort((a, b) => {
        const x = a[col] as string | number;
        const y = b[col] as string | number;
        return (x > y ? 1 : x < y ? -1 : 0) * (asc ? 1 : -1);
      });
    }
    if (this.max !== null) result = result.slice(0, this.max);
    return { data: this.one ? (result[0] ?? null) : structuredClone(result), error: null };
  }

  then<A = Result, B = never>(
    onfulfilled?: ((value: Result) => A | PromiseLike<A>) | null,
    onrejected?: ((reason: unknown) => B | PromiseLike<B>) | null
  ): PromiseLike<A | B> {
    return Promise.resolve(this.run()).then(onfulfilled, onrejected);
  }
}

/** Faux client Supabase pour le mode démo. */
export function createDemoSupabase(): SupabaseClient {
  const tables = load();
  const files = new Map<string, string>();
  const session = { access_token: "demo", user: { email: "demo@nuvex.dz" } };

  const client = {
    from: (table: string) => new DemoQuery(tables, table),
    rpc: async () => ({ data: true, error: null }),
    auth: {
      getSession: async () => ({ data: { session }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      signInWithPassword: async () => ({ data: { session }, error: null }),
      signOut: async () => {
        window.location.replace(`${window.location.origin}/`);
        return { error: null };
      },
    },
    storage: {
      from: () => ({
        upload: async (path: string, file: Blob) => {
          files.set(path, URL.createObjectURL(file));
          return { data: { path }, error: null };
        },
        getPublicUrl: (path: string) => ({ data: { publicUrl: files.get(path) ?? "" } }),
      }),
    },
  };

  return client as unknown as SupabaseClient;
}
