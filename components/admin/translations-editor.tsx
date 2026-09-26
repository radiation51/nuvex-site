"use client";

import * as React from "react";
import { ChevronDown, Languages } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Lang = "en" | "ar";
const langs: { id: Lang; label: string }[] = [
  { id: "en", label: "Anglais" },
  { id: "ar", label: "Arabe" },
];

export interface TranslationField {
  key: string;
  label: string;
  /** Texte français affiché en exemple dans la case vide. */
  placeholder: string;
}

/**
 * Cases de traduction d'un contenu (offre, réalisation), repliées par défaut.
 * Une case vide affiche le texte français sur le site.
 */
export function TranslationsEditor<T extends object>({
  id,
  fields,
  lists,
  value,
  onChange,
}: {
  id: string;
  fields: TranslationField[];
  /** Listes traduites ligne par ligne (ex. « Ce qui est inclus »). */
  lists?: { key: string; label: string; placeholders: string[] }[];
  value: Partial<Record<Lang, T>> | null | undefined;
  onChange: (value: Partial<Record<Lang, T>>) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [lang, setLang] = React.useState<Lang>("en");
  const current = (value?.[lang] ?? {}) as Record<string, unknown>;

  const set = (key: string, v: unknown) => onChange({ ...value, [lang]: { ...current, [key]: v } as T });
  const filled = langs.filter((l) => Object.values(value?.[l.id] ?? {}).some((v) => (Array.isArray(v) ? v.some(Boolean) : Boolean(v))));

  return (
    <div className="rounded-xl border bg-muted/30">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-start text-sm font-medium"
      >
        <Languages className="size-4 text-primary" />
        Traductions (anglais / arabe)
        <span className="ms-auto text-xs font-normal text-muted-foreground">
          {filled.length ? `${filled.map((l) => l.label).join(" et ")} rempli${filled.length > 1 ? "s" : ""}` : "vides : le français s'affiche"}
        </span>
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="grid gap-3 border-t p-3">
          <div className="flex gap-1.5" role="tablist" aria-label="Langue">
            {langs.map((l) => (
              <button
                key={l.id}
                type="button"
                role="tab"
                aria-selected={lang === l.id}
                onClick={() => setLang(l.id)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold",
                  lang === l.id ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground ring-1 ring-border"
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Laissez une case vide pour afficher le texte français.</p>

          {fields.map((field) => (
            <div key={field.key} className="grid gap-1.5">
              <Label htmlFor={`${id}-${lang}-${field.key}`}>{field.label}</Label>
              <Input
                id={`${id}-${lang}-${field.key}`}
                dir={lang === "ar" ? "rtl" : "ltr"}
                value={String(current[field.key] ?? "")}
                placeholder={field.placeholder}
                onChange={(e) => set(field.key, e.target.value)}
                className="h-9"
              />
            </div>
          ))}

          {lists?.map((list) => {
            const lines = (current[list.key] as string[] | undefined) ?? [];
            return (
              <div key={list.key} className="grid gap-1.5">
                <Label>{list.label}</Label>
                {list.placeholders.map((placeholder, i) => (
                  <Input
                    key={i}
                    dir={lang === "ar" ? "rtl" : "ltr"}
                    value={lines[i] ?? ""}
                    placeholder={placeholder}
                    aria-label={`${list.label} ${i + 1}`}
                    onChange={(e) => {
                      const next = list.placeholders.map((_, j) => (j === i ? e.target.value : (lines[j] ?? "")));
                      set(list.key, next);
                    }}
                    className="h-9"
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
