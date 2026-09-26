import type { Locale } from "@/lib/i18n/config";

const frenchNumbers = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
const englishNumbers = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });

/** 25000 → "25 000 DA" (fr), "25,000 DA" (en), "25 000 دج" (ar). */
export function formatDA(value: number, locale: Locale = "fr") {
  if (locale === "en") return `${englishNumbers.format(value)} DA`;
  return `${frenchNumbers.format(value)} ${locale === "ar" ? "دج" : "DA"}`;
}

/** Numéro saisi librement → lien wa.me (ex. "0555 12 34 56" → 213555123456). */
export function whatsappLink(phone: string, text?: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = `213${digits.slice(1)}`;
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${query}`;
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

/** Demande au formulaire de contact de pré-sélectionner une offre, puis y fait défiler la page. */
export const SELECT_OFFER_EVENT = "nuvex:select-offer";

/** `contactHref` : adresse du formulaire dans la langue de la page (ex. "/en#contact"). */
export function selectOffer(offerName: string, contactHref = "/#contact") {
  window.dispatchEvent(new CustomEvent(SELECT_OFFER_EVENT, { detail: offerName }));
  const contact = document.getElementById("contact");
  // Sur une autre page que l'accueil : on y retourne, au formulaire.
  if (contact) contact.scrollIntoView({ behavior: "smooth" });
  else window.location.href = contactHref;
}
