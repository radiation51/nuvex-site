import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowDown, BellRing, MapPin, ShieldCheck } from "lucide-react";
import FooterSection5 from "@/components/ui/footer-section-5";
import { PricingModule } from "@/components/ui/pricing-module";
import { Header } from "@/components/site/header";
import { ServiceRequest } from "@/components/site/service-request";
import { ServicesExtras } from "@/components/site/services-extras";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { getSiteData } from "@/lib/data";
import { whatsappLink } from "@/lib/format";
import { hasLocale, localePath, locales } from "@/lib/i18n/config";
import { localizeSiteData } from "@/lib/i18n/content";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getServicesContent } from "@/lib/services";

export const revalidate = 60;

const PATH = "/services";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).services;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: {
      canonical: localePath(lang, PATH),
      languages: { ...Object.fromEntries(locales.map((l) => [l, localePath(l, PATH)])), "x-default": PATH },
    },
  };
}

/** Page « Services » : formules de suivi annuel, services à la carte et demande de service. */
export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const all = getDictionary(lang);
  const t = all.services;
  const { offers, settings } = localizeSiteData(await getSiteData(), lang);
  const { plans, groups } = getServicesContent(lang);
  const perks = [ShieldCheck, BellRing, MapPin];

  return (
    <>
      <Header solid />
      <main>
        {/* En-tête de la page */}
        <section className="relative overflow-hidden px-4 pt-32 pb-16 md:px-8 md:pt-40 md:pb-20">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-32 left-1/2 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute top-40 -right-24 h-64 w-64 rounded-full bg-lime/30 blur-3xl" />
          </div>
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <span className="rounded-full border bg-card px-4 py-1 text-sm font-medium text-muted-foreground">{t.badge}</span>
            <h1 className="mt-5 font-heading text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">{t.title}</h1>
            <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">{t.subtitle}</p>

            <ul className="mt-8 flex flex-wrap justify-center gap-2.5">
              {t.perks.map((perk, i) => {
                const Icon = perks[i];
                return (
                  <li key={perk} className="flex items-center gap-2 rounded-full border bg-card py-1.5 ps-1.5 pe-4 text-sm font-medium shadow-sm">
                    <span className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground">
                      <Icon className="size-3.5" />
                    </span>
                    {perk}
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <a
                href="#formules"
                className="group flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 tap hover:-translate-y-0.5"
              >
                {t.plansTitle}
                <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
              </a>
              {settings.whatsapp && (
                <a
                  href={whatsappLink(settings.whatsapp, t.waIntro)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border bg-card px-6 py-3 text-sm font-semibold tap hover:border-[#25D366] hover:text-[#128C4B]"
                >
                  <WhatsAppIcon className="size-4 text-[#25D366]" />
                  {all.contact.writeWhatsapp}
                </a>
              )}
            </div>
          </div>
        </section>

        <PricingModule
          id="formules"
          title={t.plansTitle}
          groups={[
            {
              id: "suivi",
              label: t.plansTitle,
              subtitle: t.plansSubtitle,
              plans,
              footnote: t.plansFootnote,
              priceLabel: t.planLabel,
              chooseLabel: t.choosePlan,
            },
          ]}
        />

        <ServicesExtras groups={groups} whatsapp={settings.whatsapp} />
        <ServiceRequest plans={plans} groups={groups} whatsapp={settings.whatsapp} />
      </main>
      <FooterSection5 offers={offers} settings={settings} />
    </>
  );
}
