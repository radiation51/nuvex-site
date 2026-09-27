import type { Locale } from "@/lib/i18n/config";
import type { Offer, Project, SiteData } from "@/lib/types";

// Contenu modifié depuis l'admin (offres, réalisations) : on prend la traduction quand elle existe,
// sinon le texte français. Une case vide dans l'admin affiche donc toujours le français.

const pick = (translated: string | undefined, original: string) => (translated?.trim() ? translated : original);

const arabicDays = (n: number) => (n === 1 ? "يوم واحد" : n === 2 ? "يومين" : n <= 10 ? `${n} أيام` : `${n} يومًا`);

/**
 * Délai de livraison traduit à partir du français (« Livré en 3 jours », « Livré en 3 à 5 jours · livraison gratuite »),
 * pour que l'anglais et l'arabe suivent toujours le délai réglé dans l'admin. Autre formulation : traduction enregistrée.
 */
function autoDelivery(french: string, locale: Locale): string | undefined {
  const m = french.trim().match(/^Livré en (\d+)(?:\s*(?:à|-|–)\s*(\d+))?\s*jours?\s*(·\s*livraison gratuite)?$/i);
  if (!m || locale === "fr") return undefined;
  const [a, b] = [Number(m[1]), m[2] ? Number(m[2]) : null];
  if (locale === "en") {
    const days = b ? `${a} to ${b} days` : `${a} day${a > 1 ? "s" : ""}`;
    return `Delivered in ${days}${m[3] ? " · free delivery" : ""}`;
  }
  const days = b ? `${a} إلى ${arabicDays(b)}` : arabicDays(a);
  return `التسليم في ${days}${m[3] ? " · توصيل مجاني" : ""}`;
}

export function localizeOffer(offer: Offer, locale: Locale): Offer {
  const tr = locale === "fr" ? undefined : offer.translations?.[locale];
  return {
    ...offer,
    value: offer.name,
    name: pick(tr?.name, offer.name),
    description: pick(tr?.description, offer.description),
    delivery: autoDelivery(offer.delivery, locale) ?? pick(tr?.delivery, offer.delivery),
    features: offer.features.map((f, i) => ({ ...f, label: pick(tr?.features?.[i], f.label) })),
  };
}

export function localizeProject(project: Project, locale: Locale): Project {
  const tr = locale === "fr" ? undefined : project.translations?.[locale];
  return {
    ...project,
    title: pick(tr?.title, project.title),
    category: project.category ? pick(tr?.category, project.category) : project.category,
    description: project.description ? pick(tr?.description, project.description) : project.description,
  };
}

// Ville indiquée dans les paramètres de l'admin : traduite quand c'est la valeur par défaut.
const cityNames: Record<string, Partial<Record<Locale, string>>> = {
  algérie: { en: "Algeria", ar: "الجزائر" },
  alger: { en: "Algiers", ar: "الجزائر العاصمة" },
};

/** Contenu du site dans une langue. Les avis clients restent dans la langue où ils ont été écrits. */
export function localizeSiteData(data: SiteData, locale: Locale): SiteData {
  const city = cityNames[data.settings.city.trim().toLowerCase()]?.[locale];
  return {
    ...data,
    settings: city ? { ...data.settings, city } : data.settings,
    offers: data.offers.map((o) => localizeOffer(o, locale)),
    softwareOffers: data.softwareOffers.map((o) => localizeOffer(o, locale)),
    projects: data.projects.map((p) => localizeProject(p, locale)),
  };
}
