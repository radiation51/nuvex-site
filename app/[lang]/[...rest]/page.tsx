import { notFound } from "next/navigation";

// Toute adresse inconnue affiche la page 404 dans la langue de la page (voir ../not-found.tsx).
// Rangée hors du groupe (pages) : sans écran de chargement, le serveur répond bien « 404 » à Google.
export default function UnknownPage() {
  notFound();
}
