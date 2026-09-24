// MODE DÉMO de l'admin : imite le client Supabase avec des données fictives
// enregistrées dans le navigateur. Utilisé uniquement tant que Supabase n'est pas configuré.
import type { SupabaseClient } from "@supabase/supabase-js";
import { defaultOffers, defaultProjects, defaultSettings, demoReviews } from "@/lib/defaults";
import { addDays, todayISO } from "@/lib/orders";
import type { Client, Lead, Order, Review } from "@/lib/types";

type Row = Record<string, unknown>;
type Tables = Record<string, Row[]>;

const STORAGE_KEY = "nuvex-admin-demo-v1";

function seed(): Tables {
  const t = todayISO();
  const at = (days: number) => `${addDays(t, days)}T10:00:00Z`;

  const clients: Client[] = [
    { id: "c1", name: "Restaurant El Bahdja", phone: "0555 11 22 33", email: "contact@elbahdja.dz", company: "El Bahdja", city: "Alger", notes: null, created_at: at(-9) },
    { id: "c2", name: "Dr Meziane", phone: "0661 44 55 66", email: null, company: "Cabinet dentaire", city: "Oran", notes: "Préfère être appelé le matin.", created_at: at(-1) },
    { id: "c3", name: "Auto Location Sétif", phone: "0770 12 34 56", email: "autoloc.setif@gmail.com", company: null, city: "Sétif", notes: null, created_at: at(-6) },
    { id: "c4", name: "Lina Mode", phone: "0550 98 76 54", email: null, company: "Boutique de vêtements", city: "Blida", notes: null, created_at: at(-20) },
    { id: "c5", name: "Immo Tlemcen", phone: "0662 00 11 22", email: "immo.tlemcen@gmail.com", company: "Agence immobilière", city: "Tlemcen", notes: null, created_at: at(-70) },
    { id: "c6", name: "FitZone", phone: "0771 33 44 55", email: null, company: "Salle de sport", city: "Constantine", notes: null, created_at: at(-8) },
    { id: "c7", name: "Pâtisserie Yasmine", phone: "0558 66 77 88", email: null, company: null, city: "Béjaïa", notes: null, created_at: at(-110) },
  ];

  const order = (o: Partial<Order> & Pick<Order, "id" | "client_id" | "title" | "offer" | "price" | "status">): Order => ({
    lead_id: null,
    deposit_percent: 50,
    deposit_paid_at: null,
    deposit_method: null,
    balance_paid_at: null,
    balance_method: null,
    start_date: null,
    due_date: null,
    delivered_at: null,
    notes: null,
    created_at: at(0),
    ...o,
  });

  const orders: Order[] = [
    order({ id: "o1", client_id: "c1", title: "Site vitrine + réservation", offer: "Pro", price: 45000, status: "in_progress", deposit_paid_at: addDays(t, -5), deposit_method: "baridimob", start_date: addDays(t, -5), due_date: addDays(t, 2), created_at: at(-9) }),
    order({ id: "o2", client_id: "c2", title: "Site du cabinet", offer: "Éco", price: 25000, status: "todo", start_date: t, due_date: addDays(t, 7), created_at: at(-1), lead_id: "l5" }),
    order({ id: "o3", client_id: "c3", title: "Site de location de voitures", offer: "Premium", price: 95000, status: "in_progress", deposit_paid_at: addDays(t, -2), deposit_method: "ccp", start_date: addDays(t, -2), due_date: addDays(t, 5), created_at: at(-6), lead_id: "l6" }),
    order({ id: "o4", client_id: "c4", title: "Boutique en ligne", offer: "Pro", price: 45000, status: "delivered", deposit_paid_at: addDays(t, -18), deposit_method: "especes", start_date: addDays(t, -18), due_date: addDays(t, -11), delivered_at: addDays(t, -11), created_at: at(-20) }),
    order({ id: "o5", client_id: "c5", title: "Plateforme d'annonces immobilières", offer: "Sur-mesure", price: 180000, status: "delivered", deposit_paid_at: addDays(t, -68), deposit_method: "virement", balance_paid_at: addDays(t, -40), balance_method: "virement", start_date: addDays(t, -68), due_date: addDays(t, -42), delivered_at: addDays(t, -41), created_at: at(-70) }),
    order({ id: "o6", client_id: "c6", title: "Site de la salle", offer: "Éco", price: 25000, status: "in_progress", deposit_paid_at: addDays(t, -8), deposit_method: "especes", start_date: addDays(t, -8), due_date: addDays(t, -1), created_at: at(-8) }),
    order({ id: "o7", client_id: "c7", title: "Site vitrine", offer: "Éco", price: 25000, status: "delivered", deposit_paid_at: addDays(t, -108), deposit_method: "especes", balance_paid_at: addDays(t, -100), balance_method: "especes", start_date: addDays(t, -108), due_date: addDays(t, -101), delivered_at: addDays(t, -101), created_at: at(-110) }),
  ];

  const lead = (l: Partial<Lead> & Pick<Lead, "id" | "name" | "phone">): Lead => ({
    email: null, offer: null, message: null, status: "new", created_at: at(0), ...l,
  });

  const leads: Lead[] = [
    lead({ id: "l1", name: "Sofiane Kaci", phone: "0556 21 43 65", offer: "Pro", message: "Bonjour, je voudrais un site pour mon agence de voyage avec les circuits et un formulaire.", created_at: `${t}T08:40:00Z` }),
    lead({ id: "l2", name: "Nadia Belkacem", phone: "0662 87 65 43", email: "nadia.b@gmail.com", offer: "Éco", message: "Site simple pour mon salon de coiffure.", created_at: at(-1) }),
    lead({ id: "l3", name: "Hôtel Les Oliviers", phone: "0770 55 66 77", offer: "Sur-mesure", message: "Site avec réservation de chambres en ligne.", created_at: at(-2) }),
    lead({ id: "l4", name: "Mehdi Ouali", phone: "0551 00 99 88", offer: "Premium", message: "Auto-école, besoin d'un site avec inscription.", status: "contacted", created_at: at(-3) }),
    lead({ id: "l5", name: "Dr Meziane", phone: "0661 44 55 66", offer: "Éco", status: "converted", created_at: at(-2) }),
    lead({ id: "l6", name: "Auto Location Sétif", phone: "0770 12 34 56", offer: "Premium", status: "converted", created_at: at(-7) }),
  ];

  const reviews: Review[] = [
    ...demoReviews,
    { id: "r-p1", name: "Lina", role: "Lina Mode, Blida", text: "Très contente de ma boutique en ligne, livrée à temps !", rating: 5, image_url: null, status: "pending", created_at: at(-1) },
    { id: "r-p2", name: "Karim", role: null, text: "Bon travail et équipe réactive.", rating: 4, image_url: null, status: "pending", created_at: at(-3) },
  ];

  return {
    clients: clients as unknown as Row[],
    orders: orders as unknown as Row[],
    leads: leads as unknown as Row[],
    reviews: reviews as unknown as Row[],
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
