"use client";

import * as React from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { done } from "@/components/admin/shared";
import { Loading } from "@/components/admin/ui-bits";
import { PushCard } from "@/components/admin/push-card";
import { defaultSettings } from "@/lib/defaults";
import type { Settings } from "@/lib/types";

const fields: { key: keyof Settings; label: string; placeholder: string; type?: string }[] = [
  { key: "whatsapp", label: "Numéro WhatsApp", placeholder: "0555 12 34 56" },
  { key: "phone", label: "Téléphone", placeholder: "0555 12 34 56", type: "tel" },
  { key: "email", label: "E-mail", placeholder: "contact@nuvex.dz", type: "email" },
  { key: "city", label: "Ville / wilaya", placeholder: "Alger, Algérie" },
  { key: "facebook", label: "Lien Facebook", placeholder: "https://facebook.com/…", type: "url" },
  { key: "instagram", label: "Lien Instagram", placeholder: "https://instagram.com/…", type: "url" },
  { key: "tiktok", label: "Lien TikTok", placeholder: "https://tiktok.com/@…", type: "url" },
  { key: "linkedin", label: "Lien LinkedIn", placeholder: "https://linkedin.com/company/…", type: "url" },
];

export function SettingsPanel({ supabase }: { supabase: SupabaseClient }) {
  const [settings, setSettings] = React.useState<Settings | null>(null);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    supabase
      .from("settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => setSettings({ ...defaultSettings, ...(data ?? {}) }));
  }, [supabase]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!settings) return;
    setSaving(true);
    const values = Object.fromEntries(fields.map(({ key }) => [key, settings[key].trim()]));
    const { error } = await supabase.from("settings").upsert({ id: 1, ...values });
    setSaving(false);
    await done(supabase, error, "Paramètres enregistrés.");
  }

  if (!settings) return <Loading />;

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Paramètres</h1>
      <p className="text-sm text-muted-foreground">Coordonnées affichées sur le site. Un réseau social sans lien n&apos;est pas affiché.</p>
      <form onSubmit={onSubmit} className="mt-5 grid gap-4 rounded-2xl border bg-card p-5 sm:grid-cols-2">
        {fields.map(({ key, label, placeholder, type }) => (
          <div key={key} className="grid gap-1.5">
            <Label htmlFor={`s-${key}`}>{label}</Label>
            <Input
              id={`s-${key}`}
              type={type ?? "text"}
              placeholder={placeholder}
              value={settings[key]}
              onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
              className="h-10"
            />
          </div>
        ))}
        <Button type="submit" disabled={saving} className="h-10 sm:col-span-2">
          <Save />
          Enregistrer
        </Button>
      </form>

      <PushCard />
    </div>
  );
}
