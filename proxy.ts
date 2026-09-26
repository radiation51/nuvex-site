import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, adminToken, readAdminPassword, readAdminPath, safeEqual } from "@/lib/admin-auth";
import { LOCALE_COOKIE, defaultLocale, hasLocale } from "@/lib/i18n/config";

// 1. L'admin n'est accessible que par son adresse secrète (variable ADMIN_PATH), puis par mot de passe.
// 2. Langues : « / » = français (sans préfixe), « /en » et « /ar » = anglais et arabe.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const notFound = () => NextResponse.rewrite(new URL(`/${defaultLocale}/page-introuvable`, request.url));

  // Les vraies pages de l'admin ne sont jamais accessibles directement.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return notFound();

  const entry = readAdminPath();
  const isEntry = entry !== "" && (pathname === entry || pathname.startsWith(`${entry}/`));
  if (isEntry) {
    const password = readAdminPassword();
    if (!password) {
      // En local, sans mot de passe défini : accès libre pour travailler.
      if (process.env.NODE_ENV !== "production") return NextResponse.rewrite(new URL("/admin", request.url));
      return NextResponse.rewrite(new URL("/admin/connexion?erreur=config", request.url));
    }

    const cookie = request.cookies.get(ADMIN_COOKIE)?.value ?? "";
    const loggedIn = cookie !== "" && safeEqual(cookie, await adminToken(password));
    return NextResponse.rewrite(new URL(loggedIn ? "/admin" : "/admin/connexion", request.url));
  }

  const first = pathname.split("/")[1] ?? "";

  // « /fr/… » : le français n'a pas de préfixe, on renvoie vers l'adresse sans « /fr ».
  if (first === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  // « /en/… », « /ar/… » : page servie telle quelle.
  if (hasLocale(first)) return NextResponse.next();

  // Adresse sans langue : si le visiteur a choisi l'anglais ou l'arabe, il y est renvoyé.
  const preferred = request.cookies.get(LOCALE_COOKIE)?.value ?? "";
  if (hasLocale(preferred) && preferred !== defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${preferred}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url, 307);
  }

  // Sinon : version française, servie en interne depuis « /fr ».
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Toutes les pages (l'adresse secrète n'est connue qu'au moment de la requête),
  // sauf fichiers, API et images générées (aperçu de partage, icônes).
  matcher: ["/((?!_next/|api/|opengraph-image|apple-icon|icon|.*\\.[A-Za-z0-9]+$).*)"],
};
