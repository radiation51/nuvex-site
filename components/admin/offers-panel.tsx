"use client";

import * as React from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { done } from "@/components/admin/shared";
import { Loading } from "@/components/admin/ui-bits";
import { TranslationsEditor } from "@/components/admin/translations-editor";
import { splitOffers } from "@/lib/defaults";
import type { Offer, OfferText } from "@/lib/types";

export function OffersPanel({ supabase }: { supabase: SupabaseClient }) {
  const [groups, setGroups] = React.useState<ReturnType<typeof splitOffers> | null>(null);

  React.useEffect(() => {
    supabase
      .from("offers")
      .select("*")
      .order("position")
      .then(({ data }) => setGroups(splitOffers((data as Offer[] | null) ?? [])));
  }, [supabase]);

  if (!groups) return <Loading />;

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Offres et tarifs</h1>
      <p className="text-sm text-muted-foreground">
        Laissez le prix vide pour afficher « Sur devis — Devis 100 % gratuit ».
      </p>
      {[
        { title: "Sites web", list: groups.offers },
        { title: "Logiciels", list: groups.softwareOffers },
      ].map(({ title, list }) => (
        <section key={title} className="mt-8">
          <h2 className="font-heading text-lg font-bold">{title}</h2>
          <div className="mt-3 grid gap-5 lg:grid-cols-2">
            {list.map((offer) => (
              <OfferEditor key={offer.id} supabase={supabase} initial={offer} />
            ))}
          </div>
        </section>
      ))}
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

  // Retire une ligne « Ce qui est inclus », et sa traduction à la même place.
  const removeFeature = (index: number) =>
    setOffer((o) => ({
      ...o,
      features: o.features.filter((_, j) => j !== index),
      translations: withoutLines(o.translations, (lines) => lines.filter((_, j) => j !== index)),
    }));

  async function save() {
    setSaving(true);
    const kept = offer.features.map((f, i) => (f.label.trim() ? i : -1)).filter((i) => i >= 0);
    const features = kept.map((i) => offer.features[i]);
    const translations = withoutLines(offer.translations, (lines) => kept.map((i) => lines[i] ?? ""));
    const { error } = await supabase.from("offers").upsert({ ...offer, features, translations });
    setSaving(false);
    await done(supabase, error, `Offre « ${offer.name} » enregistrée.`);
  }

  const id = offer.id;

  return (
    <div className="grid content-start gap-3 rounded-2xl border bg-card p-5">
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
              onClick={() => removeFeature(i)}
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

      <TranslationsEditor<OfferText>
        id={id}
        fields={[
          { key: "name", label: "Nom", placeholder: offer.name },
          { key: "description", label: "Description", placeholder: offer.description },
          { key: "delivery", label: "Délai / en bref", placeholder: offer.delivery },
        ]}
        lists={[{ key: "features", label: "Ce qui est inclus", placeholders: offer.features.map((f) => f.label || "…") }]}
        value={offer.translations}
        onChange={(translations) => set("translations", translations)}
      />

      <Button onClick={save} disabled={saving} className="mt-2 h-10">
        <Save />
        Enregistrer
      </Button>
    </div>
  );
}

/** Applique `change` aux lignes traduites de « Ce qui est inclus », dans chaque langue. */
function withoutLines(translations: Offer["translations"], change: (lines: string[]) => string[]): Offer["translations"] {
  if (!translations) return translations;
  const next: NonNullable<Offer["translations"]> = {};
  for (const lang of ["en", "ar"] as const) {
    const tr = translations[lang];
    if (tr) next[lang] = { ...tr, features: tr.features ? change(tr.features) : tr.features };
  }
  return next;
}
