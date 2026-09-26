"use client";

import * as React from "react";
import { Select } from "@base-ui/react/select";
import { Check, ChevronDown, CircleHelp, Globe, Monitor, Sparkles } from "lucide-react";
import { offerIcons } from "@/components/ui/pricing-module";
import { useI18n } from "@/components/i18n-provider";
import { formatDA } from "@/lib/format";
import type { Offer } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Choix de l'offre dans le formulaire de contact, aux couleurs du site :
 * icône et prix de chaque offre, liste qui s'ouvre en glissant, lignes qui apparaissent l'une après l'autre.
 * La valeur envoyée reste le nom français de l'offre (champ caché « offer »).
 */
export function OfferSelect({
  id,
  offers,
  softwareOffers,
  value,
  onChange,
}: {
  id: string;
  offers: Offer[];
  softwareOffers: Offer[];
  value: string;
  onChange: (value: string) => void;
}) {
  const { t, lang } = useI18n();
  const all = [...offers, ...softwareOffers];
  const selected = all.find((o) => (o.value ?? o.name) === value);
  const price = (o: Offer) => (o.price === null ? t.pricing.onQuote : formatDA(o.price, lang));

  // Position de chaque ligne dans la liste : sert au petit décalage de l'animation d'apparition.
  let row = 0;
  const delay = () => ({ animationDelay: `${40 + row++ * 28}ms` });

  const group = (label: string, Icon: React.ElementType, list: Offer[]) => (
    <Select.Group className="pt-1">
      <Select.GroupLabel className="flex items-center gap-2 px-3 pt-2 pb-1.5 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
        <Icon className="size-3.5 text-primary" />
        {label}
      </Select.GroupLabel>
      {list.map((o) => {
        const OfferIcon = offerIcons[o.id] ?? Sparkles;
        return (
          <Select.Item
            key={o.id}
            value={o.value ?? o.name}
            style={delay()}
            className="offer-option group/item flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm outline-none select-none data-highlighted:bg-primary/[0.07] data-selected:bg-primary/10"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary transition-colors group-data-selected/item:bg-primary group-data-selected/item:text-primary-foreground">
              <OfferIcon className="size-4" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col items-start gap-1">
              <Select.ItemText className="max-w-full truncate font-medium">{o.name}</Select.ItemText>
              {o.popular && (
                <span className="rounded-full bg-lime px-1.5 py-0.5 text-[10px] leading-none font-bold text-ink">{t.pricing.popular}</span>
              )}
            </span>
            <span className="shrink-0 text-xs font-semibold whitespace-nowrap text-muted-foreground">{price(o)}</span>
            <Select.ItemIndicator className="shrink-0 text-primary">
              <Check className="size-4" strokeWidth={3} />
            </Select.ItemIndicator>
          </Select.Item>
        );
      })}
    </Select.Group>
  );

  const SelectedIcon = selected ? (offerIcons[selected.id] ?? Sparkles) : CircleHelp;

  return (
    <Select.Root
      name="offer"
      value={value || null}
      onValueChange={(v) => onChange((v as string | null) ?? "")}
      modal={false}
    >
      <Select.Trigger
        id={id}
        className="group/trigger flex h-11 w-full items-center gap-2.5 rounded-lg border border-input bg-transparent ps-2 pe-3 text-start text-sm outline-none tap hover:border-primary/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:border-primary data-popup-open:ring-3 data-popup-open:ring-primary/15"
      >
        <span
          className={cn(
            "grid size-7 shrink-0 place-items-center rounded-md transition-colors",
            selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}
        >
          <SelectedIcon className="size-4" />
        </span>
        <Select.Value className="flex min-w-0 flex-1 items-center gap-2">
          {() =>
            selected ? (
              <>
                <span className="truncate font-medium">{selected.name}</span>
                <span className="ms-auto shrink-0 text-xs text-muted-foreground">{price(selected)}</span>
              </>
            ) : (
              <span className="text-muted-foreground">{t.contact.dontKnow}</span>
            )
          }
        </Select.Value>
        <Select.Icon className="shrink-0 text-muted-foreground transition-transform duration-300 group-data-popup-open/trigger:rotate-180">
          <ChevronDown className="size-4" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Positioner side="bottom" sideOffset={8} alignItemWithTrigger={false} className="z-50 outline-none">
          <Select.Popup className="offer-popup max-h-(--available-height) w-(--anchor-width) min-w-72 origin-(--transform-origin) overflow-y-auto rounded-2xl border bg-popover p-1.5 text-popover-foreground shadow-2xl shadow-primary/15 outline-none">
            <Select.List>
              <Select.Item
                value={null}
                style={delay()}
                className="offer-option group/item flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm outline-none select-none data-highlighted:bg-primary/[0.07] data-selected:bg-primary/10"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                  <CircleHelp className="size-4" />
                </span>
                <Select.ItemText className="flex-1 font-medium">{t.contact.dontKnow}</Select.ItemText>
                <Select.ItemIndicator className="shrink-0 text-primary">
                  <Check className="size-4" strokeWidth={3} />
                </Select.ItemIndicator>
              </Select.Item>
              {group(t.contact.sitesGroup, Globe, offers)}
              {group(t.contact.softwareGroup, Monitor, softwareOffers)}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
