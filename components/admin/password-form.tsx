"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminPasswordForm({ notConfigured }: { notConfigured: boolean }) {
  const [password, setPassword] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(
    notConfigured ? "Le mot de passe admin n'est pas encore configuré sur le serveur." : null
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/connexion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    }).catch(() => null);
    const json = res ? await res.json().catch(() => ({})) : {};
    setLoading(false);
    if (res?.ok) {
      window.location.replace(`${window.location.origin}/admin`);
      return;
    }
    setError(json.error ?? "Connexion impossible.");
    setPassword("");
  }

  return (
    <form onSubmit={onSubmit} className="grid w-full max-w-sm gap-4 rounded-2xl border bg-card p-8 shadow-sm">
      <div className="text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Lock className="size-5" />
        </span>
        <h1 className="mt-4 font-heading text-2xl font-bold">Espace admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">Entrez le mot de passe pour continuer.</p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="admin-password">Mot de passe</Label>
        <div className="relative">
          <Input
            id="admin-password"
            type={show ? "text" : "password"}
            required
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 pr-10"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted"
            aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 ring-1 ring-red-200">
          {error}
        </p>
      )}

      <Button type="submit" disabled={loading || !password} className="h-11">
        {loading && <Loader2 className="animate-spin" />}
        Entrer
      </Button>
      <Link href="/" className="text-center text-sm text-muted-foreground hover:text-foreground">
        ← Retour au site
      </Link>
    </form>
  );
}
