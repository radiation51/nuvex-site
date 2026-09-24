// Contenu par défaut, utilisé tant que la base de données est vide ou non configurée.
// Tout ce qui est marqué [À REMPLACER] se modifie ensuite depuis /admin.
import type { Offer, Project, Review, Settings } from "@/lib/types";

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

const demo = (i: number, name: string, role: string, text: string, rating = 5): Review => ({
  id: `demo-${i}`,
  name,
  role,
  text,
  rating,
  image_url: null,
  status: "approved",
  created_at: "2026-01-01T00:00:00Z",
});

// Avis de démonstration : remplacés automatiquement par les vrais avis validés.
export const demoReviews: Review[] = [
  demo(1, "Yacine B.", "Restaurant, Alger", "Site livré rapidement et très propre. Nos clients réservent maintenant directement depuis WhatsApp."),
  demo(2, "Amina K.", "Cabinet dentaire, Oran", "Équipe à l'écoute, de bons conseils. Le site est beau et s'affiche parfaitement sur téléphone."),
  demo(3, "Karim M.", "Agence immobilière", "Le rapport qualité-prix est excellent. On reçoit des demandes chaque semaine grâce au formulaire."),
  demo(4, "Sarah L.", "Boutique de vêtements", "J'avais peur que ce soit compliqué, mais tout a été géré pour moi du début à la fin."),
  demo(5, "Walid H.", "Entreprise BTP, Sétif", "Enfin un site professionnel qui inspire confiance à nos partenaires. Je recommande.", 4),
  demo(6, "Nesrine T.", "Coach sportive", "Design moderne, rapide, et toujours disponibles pour les petites modifications."),
];

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
    description: "[À COMPLÉTER] Logiciel de gestion développé sur mesure.",
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
  instagram: "",
  tiktok: "",
  linkedin: "",
};
