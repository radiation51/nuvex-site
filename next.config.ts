import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache le petit bouton « N » de Next.js pendant le travail en local (il n'existe jamais en ligne).
  devIndicators: false,
  images: {
    // Photos Unsplash (avec paramètres de taille dans l'adresse).
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com", pathname: "/**" }],
  },
};

export default nextConfig;
