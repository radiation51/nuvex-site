"use client";

import * as React from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import {
  Activity,
  Briefcase,
  CalendarDays,
  ExternalLink,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  RotateCcw,
  Settings,
  Star,
  Tag,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminData } from "@/components/admin/admin-data";
import { CalendarPanel } from "@/components/admin/calendar-panel";
import { ClientsPanel } from "@/components/admin/clients-panel";
import { DashboardPanel, type AdminTab } from "@/components/admin/dashboard-panel";
import { OffersPanel } from "@/components/admin/offers-panel";
import { OrdersPanel } from "@/components/admin/orders-panel";
import { ProjectsPanel } from "@/components/admin/projects-panel";
import { ReservationsPanel } from "@/components/admin/reservations-panel";
import { ReviewsPanel } from "@/components/admin/reviews-panel";
import { SettingsPanel } from "@/components/admin/settings-panel";
import { VisitorsPanel } from "@/components/admin/visitors-panel";
import { Loading } from "@/components/admin/ui-bits";
import { Loader, LoadingScreen } from "@/components/ui/loader";
import { createDemoSupabase, resetDemo } from "@/lib/demo-supabase";
import { balanceDue, depositDue, isLate } from "@/lib/orders";
import { createRemoteSupabase } from "@/lib/remote-supabase";
import { isSupabaseConfigured } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const nav: { group: string; items: { id: AdminTab; label: string; icon: React.ElementType }[] }[] = [
  {
    group: "Pilotage",
    items: [
      { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
      { id: "visitors", label: "Visiteurs", icon: Activity },
      { id: "calendar", label: "Calendrier", icon: CalendarDays },
    ],
  },
  {
    group: "Activité",
    items: [
      { id: "reservations", label: "Réservations", icon: Inbox },
      { id: "orders", label: "Projets clients", icon: FolderKanban },
      { id: "clients", label: "Clients & paiements", icon: Users },
    ],
  },
  {
    group: "Site web",
    items: [
      { id: "reviews", label: "Avis", icon: Star },
      { id: "offers", label: "Offres", icon: Tag },
      { id: "portfolio", label: "Réalisations", icon: Briefcase },
      { id: "settings", label: "Paramètres", icon: Settings },
    ],
  },
];

function LoginForm({ supabase }: { supabase: SupabaseClient }) {
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(data.get("email")),
      password: String(data.get("password")),
    });
    setLoading(false);
    if (error) toast.error("E-mail ou mot de passe incorrect.");
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto grid w-full max-w-sm gap-4 rounded-2xl border bg-card p-8 shadow-sm">
      <div className="text-center">
        <span className="mx-auto grid size-11 place-items-center rounded-xl bg-primary font-heading text-lg font-bold text-primary-foreground">N</span>
        <h1 className="mt-4 font-heading text-2xl font-bold">Espace admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">Connectez-vous pour gérer votre activité.</p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" required autoComplete="username" className="h-10" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" name="password" type="password" required autoComplete="current-password" className="h-10" />
      </div>
      <Button type="submit" disabled={loading} className="h-10">
        {loading && <Loader2 className="animate-spin" />}
        Se connecter
      </Button>
    </form>
  );
}

export function AdminApp() {
  const demo = !isSupabaseConfigured;
  // Base branchée : tout passe par le serveur, qui vérifie le mot de passe admin (pas de compte e-mail).
  const [supabase] = React.useState<SupabaseClient>(() => (demo ? createDemoSupabase() : createRemoteSupabase()));
  const [session, setSession] = React.useState<Session | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  React.useEffect(() => {
    if (!session) return;
    supabase.rpc("is_admin").then(({ data }) => setIsAdmin(data === true));
  }, [supabase, session]);

  if (session === undefined || (session && isAdmin === null)) {
    return (
      <main className="grid min-h-screen place-items-center p-6">
        <Loader secure title="Espace admin" messages={["Ouverture de votre espace…", "Chargement de vos données…", "Encore un instant…"]} />
      </main>
    );
  }

  if (!session) {
    return (
      <main className="grid min-h-screen place-items-center bg-muted/40 p-4">
        <LoginForm supabase={supabase} />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="grid min-h-screen place-items-center p-4 text-center">
        <div>
          <p className="font-semibold">Ce compte n&apos;a pas les droits administrateur.</p>
          <Button variant="outline" className="mt-4" onClick={() => supabase.auth.signOut()}>
            Se déconnecter
          </Button>
        </div>
      </main>
    );
  }

  return <Dashboard supabase={supabase} demo={demo} />;
}

function Dashboard({ supabase, demo }: { supabase: SupabaseClient; demo: boolean }) {
  const [tab, setTab] = React.useState<AdminTab>("dashboard");
  const data = useAdminData(supabase);

  // Pastilles du menu : ce qui demande votre attention.
  const badges: Partial<Record<AdminTab, { count: number; urgent?: boolean }>> = data
    ? {
        reservations: { count: data.leads.filter((l) => l.status === "new").length },
        orders: { count: data.orders.filter(isLate).length, urgent: true },
        clients: {
          count: data.orders.filter(depositDue).length + data.orders.filter((o) => o.deposit_paid_at && balanceDue(o) && o.status === "delivered").length,
        },
        reviews: { count: data.reviews.filter((r) => r.status === "pending").length },
      }
    : {};

  const go = (next: AdminTab) => {
    setTab(next);
    window.scrollTo({ top: 0 });
  };

  // Sur téléphone, garde l'onglet actif visible dans le menu qui défile.
  React.useEffect(() => {
    document.querySelector(`[data-mobile-tab="${tab}"]`)?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [tab]);

  const navItems = nav.flatMap((g) => g.items);

  // Ferme la session admin (cookie du mot de passe) puis retourne à la page de connexion.
  const [loggingOut, setLoggingOut] = React.useState(false);
  const logout = async () => {
    setLoggingOut(true);
    await fetch("/api/admin/connexion", { method: "DELETE" }).catch(() => {});
    if (!demo) await supabase.auth.signOut();
    window.location.reload(); // l'adresse secrète réaffiche la page de connexion
  };

  return (
    <div className="min-h-screen bg-muted/40">
      {loggingOut && <LoadingScreen title="Déconnexion" messages={["Fermeture de votre session…", "À bientôt !"]} />}
      {demo && (
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 bg-amber-100 px-4 py-2 text-center text-sm text-amber-950">
          <span>
            <strong>Mode test</strong> · la base de données n&apos;est pas encore branchée : ce que vous ajoutez ici reste uniquement dans ce navigateur.
          </span>
          <button
            type="button"
            onClick={() => {
              resetDemo();
              window.location.reload();
            }}
            className="inline-flex items-center gap-1 font-semibold underline underline-offset-2"
          >
            <RotateCcw className="size-3.5" />
            Tout effacer
          </button>
        </div>
      )}

      <div className="mx-auto flex max-w-[1400px]">
        {/* Menu latéral (ordinateur) */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r bg-background px-4 py-5 lg:flex">
          <span className="flex items-center gap-2 px-2 font-heading text-lg font-bold">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-sm text-primary-foreground">N</span>
            NUVEX <span className="font-normal text-muted-foreground">admin</span>
          </span>
          <nav className="mt-6 flex flex-1 flex-col gap-5 overflow-y-auto" aria-label="Menu admin">
            {nav.map((group) => (
              <div key={group.group}>
                <p className="mb-1.5 px-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{group.group}</p>
                <ul className="grid gap-0.5">
                  {group.items.map(({ id, label, icon: Icon }) => {
                    const badge = badges[id];
                    return (
                      <li key={id}>
                        <button
                          type="button"
                          onClick={() => go(id)}
                          className={cn(
                            "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                            tab === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <Icon className="size-4" />
                          <span className="flex-1 text-left">{label}</span>
                          {badge && badge.count > 0 && (
                            <span
                              className={cn(
                                "min-w-5 rounded-full px-1.5 text-center text-xs font-bold",
                                tab === id ? "bg-white/25 text-white" : badge.urgent ? "bg-red-500 text-white" : "bg-amber-400 text-ink"
                              )}
                            >
                              {badge.count}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
          <div className="grid gap-1 border-t pt-3">
            <a href="/" target="_blank" className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
              <ExternalLink className="size-4" />
              Voir le site
            </a>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <LogOut className="size-4" />
              Déconnexion
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {/* Menu horizontal (téléphone / tablette) */}
          <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur lg:hidden">
            <div className="flex h-14 items-center justify-between px-4">
              <span className="flex items-center gap-2 font-heading font-bold">
                <span className="grid size-7 place-items-center rounded-md bg-primary text-xs text-primary-foreground">N</span>
                NUVEX admin
              </span>
              <div className="flex gap-1">
                <a href="/" target="_blank" className="grid size-9 place-items-center rounded-lg hover:bg-muted" aria-label="Voir le site">
                  <ExternalLink className="size-4" />
                </a>
                <button type="button" onClick={logout} className="grid size-9 place-items-center rounded-lg hover:bg-muted" aria-label="Déconnexion">
                  <LogOut className="size-4" />
                </button>
              </div>
            </div>
            <nav className="flex gap-1 overflow-x-auto px-4 pb-2" aria-label="Menu admin">
              {navItems.map(({ id, label, icon: Icon }) => {
                const badge = badges[id];
                return (
                  <button
                    key={id}
                    type="button"
                    data-mobile-tab={id}
                    onClick={() => go(id)}
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium",
                      tab === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="size-4" />
                    {label}
                    {badge && badge.count > 0 && (
                      <span className={cn("rounded-full px-1.5 text-xs font-bold", badge.urgent ? "bg-red-500 text-white" : "bg-amber-400 text-ink")}>
                        {badge.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {!data && ["dashboard", "calendar", "reservations", "orders", "clients"].includes(tab) ? (
              <Loading />
            ) : (
              <>
                {tab === "dashboard" && data && <DashboardPanel data={data} onNavigate={go} />}
                {tab === "visitors" && <VisitorsPanel />}
                {tab === "calendar" && data && <CalendarPanel supabase={supabase} data={data} />}
                {tab === "reservations" && data && <ReservationsPanel supabase={supabase} data={data} onOpenProjects={() => go("orders")} />}
                {tab === "orders" && data && <OrdersPanel supabase={supabase} data={data} />}
                {tab === "clients" && data && <ClientsPanel supabase={supabase} data={data} />}
                {tab === "reviews" && <ReviewsPanel supabase={supabase} onChange={data?.reload} />}
                {tab === "offers" && <OffersPanel supabase={supabase} />}
                {tab === "portfolio" && <ProjectsPanel supabase={supabase} />}
                {tab === "settings" && <SettingsPanel supabase={supabase} />}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
