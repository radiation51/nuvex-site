import type { Metadata } from "next";
import { AdminPasswordForm } from "@/components/admin/password-form";

export const metadata: Metadata = {
  title: "Connexion admin — NUVEX",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  const { erreur } = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-muted/40 p-4">
      <AdminPasswordForm notConfigured={erreur === "config"} />
    </main>
  );
}
