import { lang } from "next/root-params";
import { DocumentTitle } from "@/components/ui/document-title";
import { Error404 } from "@/components/ui/pixeleted-404-not-found";
import { defaultLocale, hasLocale, localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

async function currentLocale() {
  const value = (await lang()) ?? "";
  return hasLocale(value) ? value : defaultLocale;
}

export default async function NotFound() {
  const locale = await currentLocale();
  const t = getDictionary(locale).notFound;

  return (
    <>
      <DocumentTitle title={t.title} />
      <Error404
        heading={t.heading}
        subtext={t.subtext}
        curvedTextTop={t.curvedTop}
        curvedTextBottom={t.curvedBottom}
        postcardSlug={t.slug}
        postcardLabel={t.label}
        pixelHeading={locale !== "ar"}
        backButtonLabel={t.back}
        backButtonHref={localePath(locale, "/")}
        secondaryLabel={t.offers}
        secondaryHref={localePath(locale, "/#offres")}
      />
    </>
  );
}
