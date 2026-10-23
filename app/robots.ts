import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// /robots.txt : Google peut tout explorer, sauf l'admin et les routes techniques.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
