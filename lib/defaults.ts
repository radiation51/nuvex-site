// Contenu par défaut, utilisé tant que la base de données est vide ou non configurée.
// Offres, réalisations et coordonnées se modifient ensuite depuis /admin.
import type { Offer, Project, Settings } from "@/lib/types";

export const defaultOffers: Offer[] = [
  {
    id: "eco",
    name: "Éco",
    description: "L'essentiel pour être visible en ligne.",
    price: 25000,
    delivery: "Livré en 7 jours",
    features: [
      { label: "Site one-page", included: true },
      { label: "Nom de domaine inclus", included: true },
      { label: "Adapté mobile", included: true },
      { label: "Bouton WhatsApp", included: true },
      { label: "Formulaire de contact", included: true },
      { label: "Référencement Google", included: false },
    ],
    popular: false,
    position: 1,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Le choix idéal pour les entreprises.",
    price: 45000,
    delivery: "Livré en 7 jours",
    features: [
      { label: "Jusqu'à 5 pages", included: true },
      { label: "Nom de domaine inclus", included: true },
      { label: "Adapté mobile", included: true },
      { label: "Bouton WhatsApp", included: true },
      { label: "Référencement Google de base", included: true },
      { label: "Espace d'administration", included: false },
    ],
    popular: true,
    position: 2,
  },
  {
    id: "premium",
    name: "Premium",
    description: "Un site complet que vous gérez vous-même.",
    price: 95000,
    delivery: "Livré en 7 jours",
    features: [
      { label: "Pages illimitées", included: true },
      { label: "Nom de domaine inclus", included: true },
      { label: "Design 100 % personnalisé", included: true },
      { label: "Espace d'administration", included: true },
      { label: "Référencement Google avancé", included: true },
      { label: "Support prioritaire", included: true },
    ],
    popular: false,
    position: 3,
  },
  {
    id: "sur-mesure",
    name: "Sur-mesure",
    description: "E-commerce, réservation, application… on s'adapte.",
    price: null,
    delivery: "Délai fixé ensemble selon le projet",
    features: [
      { label: "Analyse de votre besoin", included: true },
      { label: "Nom de domaine inclus", included: true },
      { label: "Fonctionnalités sur mesure", included: true },
      { label: "Boutique en ligne possible", included: true },
      { label: "Accompagnement dédié", included: true },
    ],
    popular: false,
    position: 4,
  },
];

// Les offres logiciels sont des lignes de la même table « offers », repérées par leur identifiant.
const SOFTWARE_PREFIX = "logiciel-";

export const isSoftwareOffer = (offer: Pick<Offer, "id">) => offer.id.startsWith(SOFTWARE_PREFIX);

export const defaultSoftwareOffers: Offer[] = [
  {
    id: "logiciel-essentiel",
    name: "Logiciel Essentiel",
    description: "Un logiciel simple pour gérer votre activité au quotidien.",
    price: 25000,
    delivery: "Livré en 7 jours · livraison gratuite",
    features: [
      { label: "Fonctionne sans internet", included: true },
      { label: "1 poste (1 PC)", included: true },
      { label: "Encaissement, tickets et factures", included: true },
      { label: "Produits, stock et clients", included: true },
      { label: "Rapports du jour et du mois", included: true },
      { label: "Sauvegarde automatique", included: true },
      { label: "Clé USB livrée gratuitement, avec vidéo d'installation", included: true },
      { label: "Vidéo complète : comment utiliser le logiciel", included: true },
      { label: "Comptes employés", included: false },
    ],
    popular: false,
    position: 11,
  },
  {
    id: "logiciel-pro",
    name: "Logiciel Pro",
    description: "Pour les commerces qui travaillent avec des employés.",
    price: 50000,
    delivery: "Livré en 7 jours · livraison gratuite",
    features: [
      { label: "Tout le Logiciel Essentiel", included: true },
      { label: "Jusqu'à 2 postes (2 PC)", included: true },
      { label: "Comptes patron et employés", included: true },
      { label: "Crédit clients et fournisseurs", included: true },
      { label: "Modules métier (péremption, tailles, balance…)", included: true },
      { label: "Bénéfices et meilleures ventes", included: true },
      { label: "Clé USB livrée gratuitement, avec vidéo d'installation", included: true },
      { label: "Vidéo complète : comment utiliser le logiciel", included: true },
    ],
    popular: true,
    position: 12,
  },
  {
    id: "logiciel-sur-mesure",
    name: "Logiciel Sur-mesure",
    description: "Un logiciel conçu entièrement pour votre activité.",
    price: null,
    delivery: "Délai fixé ensemble · livraison gratuite",
    features: [
      { label: "Analyse de votre besoin", included: true },
      { label: "Fonctionnalités sur mesure", included: true },
      { label: "Nombre de postes au choix", included: true },
      { label: "Synchronisation en ligne possible", included: true },
      { label: "Clé USB livrée gratuitement, avec vidéo d'installation", included: true },
      { label: "Vidéo complète : comment utiliser le logiciel", included: true },
      { label: "Accompagnement dédié", included: true },
    ],
    popular: false,
    position: 13,
  },
];

/**
 * Sépare les offres enregistrées en sites / logiciels.
 * Sites : offres par défaut si aucune n'est enregistrée. Logiciels : chaque offre par défaut
 * pas encore enregistrée est ajoutée, pour qu'enregistrer l'une d'elles ne fasse pas disparaître les autres.
 */
export function splitOffers(rows: Offer[]) {
  const sites = rows.filter((o) => !isSoftwareOffer(o));
  const software = rows.filter(isSoftwareOffer);
  const missing = defaultSoftwareOffers.filter((d) => !software.some((o) => o.id === d.id));
  return {
    offers: sites.length ? sites : defaultOffers,
    softwareOffers: [...software, ...missing].sort((a, b) => a.position - b.position),
  };
}

// Nos vraies réalisations, affichées tant qu'aucun projet n'est enregistré dans l'admin.
export const defaultProjects: Project[] = [
  {
    id: "bourahla-auto",
    title: "Bourahla Auto",
    category: "Transport VIP & chauffeur privé",
    description: "Site vitrine haut de gamme : services, galerie et réservation de trajets en ligne.",
    image_url: "/projects/bourahla-auto.jpg",
    link: "https://bourahla-auto.com",
    position: 1,
  },
  {
    id: "qalb-alhaba",
    title: "Qalb Al Haba — قلب الحبة",
    category: "Boutique en ligne · huile d'olive",
    description: "E-commerce en arabe, français et anglais, avec panier et commande via WhatsApp.",
    image_url: "/projects/qalb-alhaba.jpg",
    link: "https://qalb-alhaba.netlify.app",
    position: 2,
  },
  {
    id: "mayfer",
    title: "Logiciel Mayfer",
    category: "Logiciel sur mesure",
    description: "Boutique de costumes avec logiciel de gestion : produits, stock, commandes et sur-mesure.",
    image_url: "/projects/mayfer.svg",
    link: null,
    position: 3,
  },
];

export const defaultSettings: Settings = {
  whatsapp: "0791 84 00 45",
  phone: "0791 84 00 45",
  email: "",
  city: "Algérie",
  facebook: "",
  instagram: "https://www.instagram.com/nuvex.213/",
  tiktok: "",
  linkedin: "",
};
