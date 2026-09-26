import { isAdminRequest, readAdminPath } from "@/lib/admin-auth";

/**
 * Fiche d'application de l'admin (pour l'installer sur l'écran d'accueil, indispensable sur iPhone
 * pour recevoir les notifications). Servie seulement à l'administrateur connecté : elle contient l'adresse secrète.
 */
export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) return new Response(null, { status: 404 });
  const start = readAdminPath() || "/";

  return Response.json(
    {
      name: "NUVEX Admin",
      short_name: "NUVEX",
      description: "Réservations, clients et notifications NUVEX.",
      id: "/nuvex-admin",
      start_url: start,
      scope: "/",
      display: "standalone",
      orientation: "portrait",
      background_color: "#f6f7fb",
      theme_color: "#3448e8",
      icons: [
        { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
        { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
    },
    { headers: { "Content-Type": "application/manifest+json", "Cache-Control": "private, no-store" } }
  );
}
