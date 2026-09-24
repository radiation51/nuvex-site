"use client";

import * as React from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ArrowDown, ArrowUp, Camera, ImagePlus, Loader2, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProjectCard } from "@/components/site/projects";
import { captureScreenshot, done, uploadImage } from "@/components/admin/shared";
import type { Project } from "@/lib/types";

type Draft = Pick<Project, "title" | "category" | "description" | "link" | "image_url">;

const emptyDraft: Draft = { title: "", category: "", description: "", link: "", image_url: "" };

export function ProjectsPanel({ supabase }: { supabase: SupabaseClient }) {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [editing, setEditing] = React.useState<Project | null>(null);

  const load = React.useCallback(async () => {
    const { data } = await supabase.from("projects").select("*").order("position");
    setProjects((data as Project[]) ?? []);
  }, [supabase]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- chargement initial des données
    load();
  }, [load]);

  async function add(values: Draft) {
    const position = Math.max(0, ...projects.map((p) => p.position)) + 1;
    const { error } = await supabase.from("projects").insert({ ...values, position });
    const ok = await done(supabase, error, "Réalisation ajoutée au site.");
    if (ok) load();
    return ok;
  }

  async function update(values: Draft) {
    if (!editing) return false;
    const { error } = await supabase.from("projects").update(values).eq("id", editing.id);
    const ok = await done(supabase, error, "Réalisation modifiée.");
    if (ok) {
      setEditing(null);
      load();
    }
    return ok;
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= projects.length) return;
    const reordered = [...projects];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setProjects(reordered);
    const results = await Promise.all(
      reordered.map((p, i) => supabase.from("projects").update({ position: i + 1 }).eq("id", p.id))
    );
    await done(supabase, results.find((r) => r.error)?.error ?? null, "Ordre mis à jour.");
    load();
  }

  async function remove(project: Project) {
    if (!confirm(`Supprimer « ${project.title} » du site ?`)) return;
    const { error } = await supabase.from("projects").delete().eq("id", project.id);
    if (await done(supabase, error, "Réalisation supprimée.")) load();
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Réalisations</h1>
      <p className="text-sm text-muted-foreground">
        Ajoutez vos projets : collez le lien du site et la capture d&apos;écran se fait toute seule.
      </p>

      <section className="mt-5 rounded-2xl border bg-card p-5">
        <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold">
          <Plus className="size-5 text-primary" />
          Nouveau projet
        </h2>
        <ProjectForm supabase={supabase} initial={emptyDraft} submitLabel="Ajouter au site" onSubmit={add} resetAfterSubmit />
      </section>

      <h2 className="mt-8 font-heading text-lg font-semibold">Projets affichés sur le site ({projects.length})</h2>
      {projects.length === 0 && <p className="mt-2 text-sm text-muted-foreground">Aucun projet pour le moment.</p>}
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <div key={project.id} className="flex flex-col gap-2">
            <ProjectCard project={project} />
            <div className="flex items-center gap-1.5">
              <Button size="icon-sm" variant="outline" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Monter">
                <ArrowUp />
              </Button>
              <Button size="icon-sm" variant="outline" onClick={() => move(i, 1)} disabled={i === projects.length - 1} aria-label="Descendre">
                <ArrowDown />
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditing(project)} className="ml-auto">
                <Pencil />
                Modifier
              </Button>
              <Button size="sm" variant="destructive" onClick={() => remove(project)}>
                <Trash2 />
                Supprimer
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[92vh] overflow-y-auto p-6 sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold">Modifier « {editing?.title} »</DialogTitle>
          </DialogHeader>
          {editing && (
            <ProjectForm
              key={editing.id}
              supabase={supabase}
              initial={editing}
              submitLabel="Enregistrer"
              onSubmit={update}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProjectForm({
  supabase,
  initial,
  submitLabel,
  onSubmit,
  resetAfterSubmit,
}: {
  supabase: SupabaseClient;
  initial: Draft;
  submitLabel: string;
  onSubmit: (values: Draft) => Promise<boolean>;
  resetAfterSubmit?: boolean;
}) {
  const [draft, setDraft] = React.useState<Draft>({
    title: initial.title,
    category: initial.category ?? "",
    description: initial.description ?? "",
    link: initial.link ?? "",
    image_url: initial.image_url ?? "",
  });
  const [file, setFile] = React.useState<File | null>(null);
  const [capturing, setCapturing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const fileInput = React.useRef<HTMLInputElement>(null);

  // Aperçu local de l'image choisie, avant envoi.
  const filePreview = React.useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  React.useEffect(() => () => {
    if (filePreview) URL.revokeObjectURL(filePreview);
  }, [filePreview]);

  const set = (key: keyof Draft, value: string) => setDraft((d) => ({ ...d, [key]: value }));
  const link = draft.link?.trim() ?? "";
  const validLink = /^https?:\/\/\S+\.\S+/.test(link);

  async function autoCapture() {
    if (!validLink) {
      toast.error("Collez d'abord le lien du site (https://…).");
      return null;
    }
    setCapturing(true);
    const url = await captureScreenshot(supabase, link);
    setCapturing(false);
    if (url) {
      setFile(null);
      set("image_url", url);
      toast.success("Capture d'écran prête.");
    }
    return url;
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    let image_url = draft.image_url;
    if (file) image_url = (await uploadImage(supabase, file, "projects")) ?? "";
    else if (!image_url && validLink) image_url = (await autoCapture()) ?? "";

    if (!image_url) {
      setSaving(false);
      toast.error("Ajoutez une image, ou un lien pour la capture automatique.");
      return;
    }

    const ok = await onSubmit({
      title: draft.title.trim(),
      category: draft.category?.trim() || null,
      description: draft.description?.trim() || null,
      link: link || null,
      image_url,
    });
    setSaving(false);
    if (ok && resetAfterSubmit) {
      setDraft(emptyDraft);
      setFile(null);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  const preview: Project = {
    id: "apercu",
    position: 0,
    title: draft.title || "Nom du projet",
    category: draft.category || null,
    description: draft.description || null,
    link: link || null,
    image_url: filePreview ?? draft.image_url ?? "",
  };

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="grid content-start gap-3 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="p-title">Nom du projet *</Label>
          <Input id="p-title" required value={draft.title} onChange={(e) => set("title", e.target.value)} className="h-10" placeholder="Ex. Bourahla Auto" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="p-category">Catégorie</Label>
          <Input id="p-category" value={draft.category ?? ""} onChange={(e) => set("category", e.target.value)} className="h-10" placeholder="Ex. Location de voitures" />
        </div>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="p-description">Description courte</Label>
          <Input
            id="p-description"
            maxLength={160}
            value={draft.description ?? ""}
            onChange={(e) => set("description", e.target.value)}
            className="h-10"
            placeholder="Ex. Site vitrine avec réservation en ligne"
          />
        </div>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="p-link">Lien du site (laisser vide pour un logiciel)</Label>
          <Input id="p-link" type="url" value={draft.link ?? ""} onChange={(e) => set("link", e.target.value)} className="h-10" placeholder="https://…" />
        </div>

        <div className="grid gap-2 sm:col-span-2">
          <Label>Image</Label>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={autoCapture} disabled={!validLink || capturing}>
              {capturing ? <Loader2 className="animate-spin" /> : <Camera />}
              {capturing ? "Capture en cours… (≈ 15 s)" : "Capture automatique du site"}
            </Button>
            <Button type="button" variant="outline" onClick={() => fileInput.current?.click()}>
              <ImagePlus />
              Choisir une image
            </Button>
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Sans image, la capture est faite automatiquement à l&apos;enregistrement si un lien est renseigné.
          </p>
        </div>

        <Button type="submit" disabled={saving || capturing} className="h-10 sm:col-span-2">
          {saving ? <Loader2 className="animate-spin" /> : <Save />}
          {submitLabel}
        </Button>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">Aperçu sur le site</p>
        <ProjectCard project={preview} />
      </div>
    </form>
  );
}
