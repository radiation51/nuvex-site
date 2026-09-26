import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Offer } from "@/lib/types";

// Page « Services » : formules de suivi annuel et services à la carte, dans la langue de la page.
// « value » garde le nom français : c'est lui qui arrive dans l'admin avec la demande.

export interface ServiceGroup {
  title: string;
  items: Offer[];
}

export function getServicesContent(locale: Locale) {
  const t = getDictionary(locale).services;
  const fr = getDictionary("fr").services;

  const plans: Offer[] = t.plans.map((plan, i) => ({
    id: plan.id,
    name: plan.name,
    description: plan.description,
    price: plan.price,
    delivery: plan.perMonth,
    features: plan.features,
    popular: plan.popular,
    position: i + 1,
    value: `Suivi ${fr.plans[i].name}`,
  }));

  const groups: ServiceGroup[] = t.groups.map((group, g) => ({
    title: group.title,
    items: group.items.map((item, i) => ({
      id: item.id,
      name: item.title,
      description: item.text,
      price: null,
      delivery: "",
      features: [],
      popular: false,
      position: i + 1,
      value: `Service : ${fr.groups[g].items[i].title}`.slice(0, 60),
    })),
  }));

  return { plans, groups };
}
