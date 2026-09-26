import { lang } from "next/root-params";
import { Loader } from "@/components/ui/loader";
import { defaultLocale, hasLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/** Affiché pendant le chargement d'une page du site. */
export default async function PageLoading() {
  const value = (await lang()) ?? "";
  const t = getDictionary(hasLocale(value) ? value : defaultLocale).loader;

  return (
    <main className="grid min-h-screen place-items-center bg-background p-6">
      <Loader title="NUVEX" messages={[t.page, t.wait]} />
    </main>
  );
}
