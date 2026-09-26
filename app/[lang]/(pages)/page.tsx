import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DownloadWithColumnLines from "@/components/ui/download-with-columnlines";
import FooterSection5 from "@/components/ui/footer-section-5";
import { PricingModule } from "@/components/ui/pricing-module";
import { Contact } from "@/components/site/contact";
import { CtaBand } from "@/components/site/cta-band";
import { Faq } from "@/components/site/faq";
import { Header } from "@/components/site/header";
import { Projects } from "@/components/site/projects";
import { SectorsStrip } from "@/components/site/sectors-strip";
import { Steps } from "@/components/site/steps";
import { Testimonials } from "@/components/site/testimonials";
import { WhyUs } from "@/components/site/why-us";
import { getSiteData } from "@/lib/data";
import { hasLocale, localePath, locales } from "@/lib/i18n/config";
import { localizeSiteData } from "@/lib/i18n/content";
import { getDictionary } from "@/lib/i18n/dictionaries";

// La page est régénérée au plus toutes les 60 s, et immédiatement après une modification dans l'admin.
export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  // Indique à Google les 3 versions de l'accueil.
  return {
    alternates: {
      canonical: localePath(lang, "/"),
      languages: { ...Object.fromEntries(locales.map((l) => [l, localePath(l, "/")])), "x-default": "/" },
    },
  };
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);
  const { offers, softwareOffers, reviews, projects, settings } = localizeSiteData(await getSiteData(), lang);

  return (
    <>
      <Header />
      <main>
        <DownloadWithColumnLines badgeTag={t.hero.badgeTag} badge={t.hero.badge} badgeHref="#logiciels" />
        <SectorsStrip />
        <WhyUs />
        <PricingModule
          title={t.pricing.title}
          groups={[
            { id: "sites", ...t.pricing.sites, plans: offers },
            { id: "logiciels", ...t.pricing.software, plans: softwareOffers },
          ]}
        />
        <Steps />
        <CtaBand {...t.ctaLaunch} whatsapp={settings.whatsapp} />
        <Projects projects={projects} />
        <Testimonials reviews={reviews} whatsapp={settings.whatsapp} />
        <CtaBand {...t.ctaQuote} whatsapp={settings.whatsapp} />
        <Faq />
        <Contact offers={offers} softwareOffers={softwareOffers} settings={settings} />
      </main>
      <FooterSection5 offers={offers} settings={settings} />
    </>
  );
}
