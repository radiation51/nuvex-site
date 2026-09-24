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
import { cn } from "@/lib/utils";

type Sector = { icon: LucideIcon; label: string };

const rowOne: Sector[] = [
  { icon: Car, label: "Location de voitures" },
  { icon: KeyRound, label: "Location d'appartements" },
  { icon: Forklift, label: "Location de matériel" },
  { icon: UtensilsCrossed, label: "Restaurants" },
  { icon: Coffee, label: "Cafés" },
  { icon: ShoppingBag, label: "Boutiques" },
  { icon: ShoppingCart, label: "E-commerce" },
  { icon: Building2, label: "Immobilier" },
  { icon: HardHat, label: "BTP" },
  { icon: Stethoscope, label: "Cabinets médicaux" },
  { icon: Pill, label: "Pharmacies" },
  { icon: Scissors, label: "Coiffure & beauté" },
  { icon: Dumbbell, label: "Salles de sport" },
  { icon: BedDouble, label: "Hôtels" },
  { icon: Plane, label: "Agences de voyage" },
  { icon: CarFront, label: "Auto-écoles" },
  { icon: GraduationCap, label: "Écoles & formations" },
];

const rowTwo: Sector[] = [
  { icon: Scale, label: "Avocats & notaires" },
  { icon: Calculator, label: "Comptables" },
  { icon: PartyPopper, label: "Salles des fêtes" },
  { icon: Camera, label: "Photographes" },
  { icon: CakeSlice, label: "Traiteurs & pâtisseries" },
  { icon: Croissant, label: "Boulangeries" },
  { icon: Truck, label: "Transport & logistique" },
  { icon: Wrench, label: "Garages & artisans" },
  { icon: Tractor, label: "Agriculture" },
  { icon: SprayCan, label: "Nettoyage" },
  { icon: Laptop, label: "Informatique" },
  { icon: Shirt, label: "Mode" },
  { icon: Gem, label: "Bijouteries" },
  { icon: Glasses, label: "Opticiens" },
  { icon: PawPrint, label: "Vétérinaires" },
  { icon: Sofa, label: "Meubles & déco" },
  { icon: Factory, label: "Industrie" },
  { icon: HeartHandshake, label: "Associations" },
];

/** Une rangée qui défile en boucle (la liste est doublée pour un défilement sans coupure). */
function MarqueeRow({ sectors, reverse }: { sectors: Sector[]; reverse?: boolean }) {
  return (
    <div className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
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
  return (
    <section aria-label="Secteurs" className="border-b bg-background py-10">
      <p className="px-4 text-center text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
        Des sites pour tous les secteurs
      </p>
      <div className="mx-auto mt-6 flex max-w-6xl flex-col gap-5">
        <MarqueeRow sectors={rowOne} />
        <MarqueeRow sectors={rowTwo} reverse />
      </div>
      <p className="mt-6 px-4 text-center text-sm text-muted-foreground">
        Votre activité n&apos;est pas dans la liste ?{" "}
        <a href="#contact" className="font-semibold text-primary underline-offset-4 hover:underline">
          On s&apos;adapte, parlons-en.
        </a>
      </p>
    </section>
  );
}
