"use client";

import * as React from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { done } from "@/components/admin/shared";
import { defaultOffers } from "@/lib/defaults";
import type { Offer } from "@/lib/types";

export function OffersPanel({ supabase }: { supabase: SupabaseClient }) {
  const [offers, setOffers] = React.useState<Offer[] | null>(null);

  React.useEffect(() => {
    supabase
      .from("offers")
      .select("*")
      .order("position")
      .then(({ data }) => setOffers(data?.length ? (data as Offer[]) : defaultOffers));
  }, [supabase]);

  if (!offers) return <p className="text-sm text-muted-foreground">Chargement…</p>;

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Offres et tarifs</h1>
      <p className="text-sm text-muted-foreground">
        Laissez le prix vide pour afficher « Sur devis — Devis 100 % gratuit ».
      </p>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {offers.map((offer) => (
          <OfferEditor key={offer.id} supabase={supabase} initial={offer} />
        ))}
      </div>
    </div>
  );
}

function OfferEditor({ supabase, initial }: { supabase: SupabaseClient; initial: Offer }) {
  const [offer, setOffer] = React.useState(initial);
  const [saving, setSaving] = React.useState(false);

  const set = <K extends keyof Offer>(key: K, value: Offer[K]) => setOffer((o) => ({ ...o, [key]: value }));

  const setFeature = (index: number, patch: Partial<Offer["features"][number]>) =>
    set(
      "features",
      offer.features.map((f, i) => (i === index ? { ...f, ...patch } : f))
    );

  async function save() {
    setSaving(true);
    const features = offer.features.filter((f) => f.label.trim());
    const { error } = await supabase.from("offers").upsert({ ...offer, features });
    setSaving(false);
    await done(supabase, error, `Offre « ${offer.name} » enregistrée.`);
  }

  const id = offer.id;

  return (
    <div className="grid gap-3 rounded-2xl border bg-card p-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor={`${id}-name`}>Nom</Label>
          <Input id={`${id}-name`} value={offer.name} onChange={(e) => set("name", e.target.value)} className="h-10" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={`${id}-price`}>Prix (DA)</Label>
          <Input
            id={`${id}-price`}
            type="number"
            min={0}
            step={1000}
            placeholder="Sur devis"
            value={offer.price ?? ""}
            onChange={(e) => set("price", e.target.value === "" ? null : Number(e.target.value))}
            className="h-10"
          />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-desc`}>Description</Label>
        <Input id={`${id}-desc`} value={offer.description} onChange={(e) => set("description", e.target.value)} className="h-10" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-delivery`}>Délai / en bref</Label>
        <Input id={`${id}-delivery`} value={offer.delivery} onChange={(e) => set("delivery", e.target.value)} className="h-10" />
      </div>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" checked={offer.popular} onChange={(e) => set("popular", e.target.checked)} className="size-4 accent-primary" />
        Mettre en avant (« Le plus populaire »)
      </label>

      <div className="grid gap-2">
        <Label>Ce qui est inclus</Label>
        {offer.features.map((feature, i) => (
          <div key={i} className="flex items-center gap-2">
            <select
              value={feature.included ? "yes" : "no"}
              onChange={(e) => setFeature(i, { included: e.target.value === "yes" })}
              className="h-9 rounded-lg border bg-background px-1.5 text-sm"
              aria-label="Inclus ou non"
            >
              <option value="yes">✓</option>
              <option value="no">✗</option>
            </select>
            <Input value={feature.label} onChange={(e) => setFeature(i, { label: e.target.value })} className="h-9" aria-label="Élément" />
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => set("features", offer.features.filter((_, j) => j !== i))}
              aria-label="Retirer"
            >
              <Trash2 />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() => set("features", [...offer.features, { label: "", included: true }])}
        >
          <Plus />
          Ajouter une ligne
        </Button>
      </div>

      <Button onClick={save} disabled={saving} className="mt-2 h-10">
        <Save />
        Enregistrer
      </Button>
    </div>
  );
}
