// Client de l'admin quand Supabase est branché : chaque action est envoyée au serveur
// (/api/admin/db), qui vérifie le mot de passe admin puis utilise la clé secrète.
// Il imite la petite partie de l'API Supabase utilisée par les écrans de l'admin.
import type { SupabaseClient } from "@supabase/supabase-js";

type Row = Record<string, unknown>;
type Result = { data: unknown; error: { message: string } | null };

class RemoteQuery implements PromiseLike<Result> {
  private body: {
    table: string;
    op: "select" | "insert" | "update" | "upsert" | "delete";
    values?: Row | Row[];
    filters: [string, unknown][];
    order?: { col: string; asc: boolean };
    limit?: number;
    single?: boolean;
  };

  constructor(table: string) {
    this.body = { table, op: "select", filters: [] };
  }

  select() {
    return this;
  }
  order(col: string, opts?: { ascending?: boolean }) {
    this.body.order = { col, asc: opts?.ascending ?? true };
    return this;
  }
  eq(col: string, value: unknown) {
    this.body.filters.push([col, value]);
    return this;
  }
  limit(n: number) {
    this.body.limit = n;
    return this;
  }
  maybeSingle() {
    this.body.single = true;
    return this;
  }
  single() {
    this.body.single = true;
    return this;
  }
  insert(values: Row | Row[]) {
    this.body.op = "insert";
    this.body.values = values;
    return this;
  }
  update(values: Row) {
    this.body.op = "update";
    this.body.values = values;
    return this;
  }
  upsert(values: Row | Row[]) {
    this.body.op = "upsert";
    this.body.values = values;
    return this;
  }
  delete() {
    this.body.op = "delete";
    return this;
  }

  private async run(): Promise<Result> {
    try {
      const res = await fetch("/api/admin/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.body),
      });
      const json = (await res.json()) as Result;
      if (res.status === 401) window.location.reload(); // session expirée : retour à la page du mot de passe
      return json;
    } catch {
      return { data: null, error: { message: "Connexion au serveur impossible." } };
    }
  }

  then<A = Result, B = never>(
    onfulfilled?: ((value: Result) => A | PromiseLike<A>) | null,
    onrejected?: ((reason: unknown) => B | PromiseLike<B>) | null
  ): PromiseLike<A | B> {
    return this.run().then(onfulfilled, onrejected);
  }
}

export function createRemoteSupabase(): SupabaseClient {
  const uploaded = new Map<string, string>();
  const session = { access_token: "admin", user: { email: "admin" } };

  const client = {
    from: (table: string) => new RemoteQuery(table),
    rpc: async () => ({ data: true, error: null }),
    auth: {
      getSession: async () => ({ data: { session }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      signInWithPassword: async () => ({ data: { session }, error: null }),
      signOut: async () => ({ error: null }),
    },
    storage: {
      from: () => ({
        upload: async (path: string, file: Blob) => {
          const form = new FormData();
          form.set("file", file);
          form.set("folder", path.split("/")[0] ?? "projects");
          const res = await fetch("/api/admin/upload", { method: "POST", body: form }).catch(() => null);
          const json = res ? await res.json().catch(() => ({})) : {};
          if (!res?.ok || !json.url) return { data: null, error: json.error ?? { message: "Envoi de l'image impossible." } };
          uploaded.set(path, json.url);
          return { data: { path: json.path }, error: null };
        },
        getPublicUrl: (path: string) => ({ data: { publicUrl: uploaded.get(path) ?? "" } }),
      }),
    },
  };

  return client as unknown as SupabaseClient;
}
