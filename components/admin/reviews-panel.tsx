"use client";

import * as React from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Stars } from "@/components/ui/testimonials-columns-1";
import { dateFormatter, done, fieldClass, uploadImage } from "@/components/admin/shared";
import { initials } from "@/lib/format";
import type { Review, ReviewStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const filters: { id: ReviewStatus | "all"; label: string }[] = [
  { id: "pending", label: "En attente" },
  { id: "approved", label: "Publiés" },
  { id: "rejected", label: "Refusés" },
  { id: "all", label: "Tous" },
];

const statusStyle: Record<ReviewStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
};
const statusLabel: Record<ReviewStatus, string> = { pending: "En attente", approved: "Publié", rejected: "Refusé" };

export function ReviewsPanel({ supabase, onChange }: { supabase: SupabaseClient; onChange?: () => void }) {
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [filter, setFilter] = React.useState<ReviewStatus | "all">("pending");
  const [editing, setEditing] = React.useState<Review | "new" | null>(null);

  const load = React.useCallback(async () => {
    const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    setReviews((data as Review[]) ?? []);
  }, [supabase]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- chargement initial des données
    load();
  }, [load]);

  const refresh = () => {
    load();
    onChange?.();
  };

  async function setStatus(review: Review, status: ReviewStatus) {
    const { error } = await supabase.from("reviews").update({ status }).eq("id", review.id);
    if (await done(supabase, error, status === "approved" ? "Avis publié sur le site." : "Avis refusé.")) refresh();
  }

  async function remove(review: Review) {
    if (!confirm(`Supprimer définitivement l'avis de ${review.name} ?`)) return;
    const { error } = await supabase.from("reviews").delete().eq("id", review.id);
    if (await done(supabase, error, "Avis supprimé.")) refresh();
  }

  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  const visible = filter === "all" ? reviews : reviews.filter((r) => r.status === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold">Avis clients</h1>
          <p className="text-sm text-muted-foreground">
            {pendingCount > 0 ? `${pendingCount} avis en attente de validation.` : "Aucun avis en attente."}
          </p>
        </div>
        <Button onClick={() => setEditing("new")}>
          <Plus />
          Ajouter un avis
        </Button>
      </div>

      <div className="mt-5 flex gap-1 overflow-x-auto">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium",
              filter === f.id ? "border-foreground bg-foreground text-background" : "bg-background"
            )}
          >
            {f.label}
            {f.id === "pending" && pendingCount > 0 && (
              <span className="ml-1.5 rounded-full bg-amber-400 px-1.5 text-xs text-ink">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {visible.length === 0 && <p className="text-sm text-muted-foreground">Rien à afficher ici.</p>}
        {visible.map((review) => (
          <article key={review.id} className="flex flex-col gap-3 rounded-2xl border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {review.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- photo envoyée par le client
                  <img src={review.image_url} alt="" className="size-10 rounded-full object-cover" />
                ) : (
                  <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {initials(review.name)}
                  </span>
                )}
                <div>
                  <p className="font-semibold">{review.name}</p>
                  {review.role && <p className="text-xs text-muted-foreground">{review.role}</p>}
                </div>
              </div>
              <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold", statusStyle[review.status])}>
                {statusLabel[review.status]}
              </span>
            </div>
            <Stars rating={review.rating} />
            <p className="text-sm leading-relaxed">{review.text}</p>
            <p className="text-xs text-muted-foreground">{dateFormatter.format(new Date(review.created_at))}</p>
            <div className="mt-auto flex flex-wrap gap-2 border-t pt-3">
              {review.status !== "approved" && (
                <Button size="sm" onClick={() => setStatus(review, "approved")} className="bg-emerald-600 hover:bg-emerald-700">
                  <Check />
                  Approuver
                </Button>
              )}
              {review.status !== "rejected" && (
                <Button size="sm" variant="outline" onClick={() => setStatus(review, "rejected")}>
                  <X />
                  Refuser
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={() => setEditing(review)}>
                <Pencil />
                Modifier
              </Button>
              <Button size="sm" variant="destructive" onClick={() => remove(review)}>
                <Trash2 />
                Supprimer
              </Button>
            </div>
          </article>
        ))}
      </div>

      <ReviewForm
        supabase={supabase}
        review={editing}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          refresh();
        }}
      />
    </div>
  );
}

function ReviewForm({
  supabase,
  review,
  onClose,
  onSaved,
}: {
  supabase: SupabaseClient;
  review: Review | "new" | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const current = review && review !== "new" ? review : null;
  const [saving, setSaving] = React.useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSaving(true);

    let image_url = current?.image_url ?? null;
    const photo = data.get("photo");
    if (photo instanceof File && photo.size > 0) image_url = (await uploadImage(supabase, photo, "reviews")) ?? image_url;

    const values = {
      name: String(data.get("name")).trim(),
      role: String(data.get("role")).trim() || null,
      text: String(data.get("text")).trim(),
      rating: Number(data.get("rating")),
      status: String(data.get("status")) as ReviewStatus,
      image_url,
    };

    const { error } = current
      ? await supabase.from("reviews").update(values).eq("id", current.id)
      : await supabase.from("reviews").insert(values);
    setSaving(false);
    if (await done(supabase, error, current ? "Avis modifié." : "Avis ajouté.")) onSaved();
  }

  return (
    <Dialog open={review !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-6 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg font-bold">{current ? "Modifier l'avis" : "Ajouter un avis"}</DialogTitle>
        </DialogHeader>
        <form key={current?.id ?? "new"} onSubmit={onSubmit} className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="r-name">Nom *</Label>
            <Input id="r-name" name="name" required minLength={2} maxLength={60} defaultValue={current?.name} className="h-10" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="r-role">Métier / entreprise</Label>
            <Input id="r-role" name="role" maxLength={80} defaultValue={current?.role ?? ""} className="h-10" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="r-text">Avis *</Label>
            <Textarea id="r-text" name="text" required minLength={10} maxLength={600} rows={4} defaultValue={current?.text} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="r-rating">Note</Label>
              <select id="r-rating" name="rating" defaultValue={current?.rating ?? 5} className={fieldClass}>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} étoile{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="r-status">Statut</Label>
              <select id="r-status" name="status" defaultValue={current?.status ?? "approved"} className={fieldClass}>
                <option value="approved">Publié</option>
                <option value="pending">En attente</option>
                <option value="rejected">Refusé</option>
              </select>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="r-photo">Photo</Label>
            <Input id="r-photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" className="h-10" />
          </div>
          <Button type="submit" disabled={saving} className="mt-2 h-10">
            Enregistrer
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
