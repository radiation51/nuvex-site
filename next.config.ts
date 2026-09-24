import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Photos Unsplash (avec paramètres de taille dans l'adresse).
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com", pathname: "/**" }],
  },
};

export default nextConfig;
