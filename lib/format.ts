const priceFormatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

/** 25000 → "25 000 DA" */
export function formatDA(value: number) {
  return `${priceFormatter.format(value)} DA`;
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

export function selectOffer(offerName: string) {
  window.dispatchEvent(new CustomEvent(SELECT_OFFER_EVENT, { detail: offerName }));
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
}
