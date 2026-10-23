import type { Settings } from "@/lib/types";
import { SITE_URL } from "@/lib/site";

// Les différentes façons dont les clients cherchent nos services sur Google (FR, AR, EN).
const KEYWORDS = [
  "création site web Algérie",
  "création site internet Algérie",
  "site web Algérie",
  "agence web Algérie",
  "conception site web Alger",
  "site vitrine",
  "boutique en ligne Algérie",
  "e-commerce DZ",
  "site web restaurant",
  "logiciel de gestion de stock Algérie",
  "logiciel de caisse",
  "إنشاء موقع إلكتروني",
  "انشاء موقع الكتروني في الجزائر",
  "تصميم مواقع الويب",
  "متجر إلكتروني",
  "برنامج تسيير المخزون",
  "website design Algeria",
];

const AREA_CITIES = ["Alger", "Oran", "Constantine", "Annaba", "Blida", "Sétif", "Tizi Ouzou", "Béjaïa"];

// Réseaux NUVEX toujours cités, même si le champ correspondant de l'admin est vide.
const PROFILES = ["https://www.instagram.com/nuvex.213/", "https://www.tiktok.com/@nuvex.cration.sites"];

/** Numéro algérien « 0791 84 00 45 » → format international « +213791840045 ». */
function intlPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("0") ? `+213${digits.slice(1)}` : `+${digits}`;
}

/**
 * Données structurées (schema.org) de l'accueil : NUVEX comme organisation / entreprise locale,
 * et le site lui-même. Google s'en sert pour le panneau d'entreprise et l'extrait enrichi.
 */
export function StructuredData({ settings, description }: { settings: Settings; description: string }) {
  const sameAs = [...new Set([...PROFILES, settings.instagram, settings.tiktok, settings.facebook, settings.linkedin].filter(Boolean))];
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": `${SITE_URL}/#organization`,
        name: "NUVEX",
        alternateName: ["NUVEX DZ", "Nuvex Algérie", "نوفكس"],
        url: SITE_URL,
        logo: `${SITE_URL}/icons/icon-512.png`,
        image: `${SITE_URL}/opengraph-image`,
        description,
        telephone: intlPhone(settings.phone || settings.whatsapp),
        ...(settings.email ? { email: settings.email } : {}),
        address: { "@type": "PostalAddress", addressLocality: "Chéraga", addressRegion: "Alger", addressCountry: "DZ" },
        openingHours: "Mo-Su 00:00-23:59",
        areaServed: [
          { "@type": "Country", name: "Algérie" },
          ...AREA_CITIES.map((name) => ({ "@type": "City", name })),
        ],
        knowsLanguage: ["fr", "ar", "en"],
        knowsAbout: KEYWORDS,
        keywords: KEYWORDS.join(", "),
        sameAs,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "NUVEX",
        url: SITE_URL,
        inLanguage: ["fr", "ar", "en"],
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Contenu fixe généré par le site (pas de saisie visiteur) ; « < » échappé par sécurité.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }}
    />
  );
}
