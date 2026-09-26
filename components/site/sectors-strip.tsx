"use client";

import {
  BedDouble,
  Building2,
  CakeSlice,
  Calculator,
  Camera,
  Car,
  CarFront,
  Coffee,
  Croissant,
  Dumbbell,
  Factory,
  Forklift,
  Gem,
  Glasses,
  GraduationCap,
  HardHat,
  HeartHandshake,
  KeyRound,
  Laptop,
  PartyPopper,
  PawPrint,
  Pill,
  Plane,
  Scale,
  Scissors,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Sofa,
  SprayCan,
  Stethoscope,
  Tractor,
  Truck,
  UtensilsCrossed,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";

type Sector = { icon: LucideIcon; label: string };

// Icônes des secteurs, dans l'ordre des libellés du dictionnaire (sectors.rowOne / rowTwo).

const rowOneIcons: LucideIcon[] = [Car, KeyRound, Forklift, UtensilsCrossed, Coffee, ShoppingBag, ShoppingCart, Building2, HardHat, Stethoscope, Pill, Scissors, Dumbbell, BedDouble, Plane, CarFront, GraduationCap];

const rowTwoIcons: LucideIcon[] = [Scale, Calculator, PartyPopper, Camera, CakeSlice, Croissant, Truck, Wrench, Tractor, SprayCan, Laptop, Shirt, Gem, Glasses, PawPrint, Sofa, Factory, HeartHandshake];

/** Une rangée qui défile en boucle (la liste est doublée pour un défilement sans coupure). */
function MarqueeRow({ sectors, reverse }: { sectors: Sector[]; reverse?: boolean }) {
  return (
    // Toujours de gauche à droite (le défilement en boucle en dépend), même en arabe.
    <div dir="ltr" className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <ul
        className={cn(
          "flex w-max animate-marquee group-hover:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]"
        )}
      >
        {[0, 1].map((copy) =>
          sectors.map(({ icon: Icon, label }) => (
            <li
              key={`${copy}-${label}`}
              aria-hidden={copy === 1 || undefined}
              className="mr-10 flex shrink-0 items-center gap-2 text-base font-semibold tracking-tight whitespace-nowrap text-muted-foreground/80"
            >
              <Icon className="size-5" />
              {label}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

/** Bande sobre sous l'accueil, à la manière d'une rangée de logos clients. */
export function SectorsStrip() {
  const { t, lang } = useI18n();
  const rowOne = rowOneIcons.map((icon, i) => ({ icon, label: t.sectors.rowOne[i] }));
  const rowTwo = rowTwoIcons.map((icon, i) => ({ icon, label: t.sectors.rowTwo[i] }));

  return (
    <section aria-label={t.sectors.aria} className="border-b bg-background py-10">
      <p
        className={cn(
          "px-4 text-center text-xs font-medium text-muted-foreground",
          lang === "ar" ? "text-sm" : "tracking-[0.2em] uppercase"
        )}
      >
        {t.sectors.title}
      </p>
      <div className="mx-auto mt-6 flex max-w-6xl flex-col gap-5">
        <MarqueeRow sectors={rowOne} />
        <MarqueeRow sectors={rowTwo} reverse />
      </div>
      <p className="mt-6 px-4 text-center text-sm text-muted-foreground">
        {t.sectors.notListed}{" "}
        <a href="#contact" className="font-semibold text-primary underline-offset-4 hover:underline">
          {t.sectors.adapt}
        </a>
      </p>
    </section>
  );
}
