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

// La page est régénérée au plus toutes les 60 s, et immédiatement après une modification dans l'admin.
export const revalidate = 60;

export default async function Home() {
  const { offers, softwareOffers, reviews, projects, settings } = await getSiteData();

  return (
    <>
      <Header />
      <main>
        <DownloadWithColumnLines badgeTag="Nouveau" badge="Logiciels de gestion" badgeHref="#logiciels" />
        <SectorsStrip />
        <WhyUs />
        <PricingModule plans={offers} footnote="Acompte de 50 % à la commande, le reste une fois le site terminé." />
        <Steps />
        <CtaBand
          outline="SIMPLE"
          title="Prêt à lancer votre site ?"
          text="Un site pro à partir de 25 000 DA, livré en 7 jours et adapté au mobile."
          whatsapp={settings.whatsapp}
        />
        <PricingModule
          id="logiciels"
          badge="Nouveau · Logiciels"
          title="Nos logiciels de gestion"
          subtitle="Des logiciels faits pour votre activité, qui marchent même sans internet. Livrés sur clé USB, prêts à installer."
          plans={softwareOffers}
          muted={false}
          footnote="Acompte de 50 % à la commande, le reste à la fin du développement. Installation guidée par une vidéo intégrée à la clé USB."
        />
        <Projects projects={projects} />
        <Testimonials reviews={reviews} whatsapp={settings.whatsapp} />
        <CtaBand
          outline="GRATUIT"
          title="Votre devis 100 % gratuit"
          text="Expliquez-nous votre projet, on vous répond sous 24 h avec un prix clair. Sans engagement."
          whatsapp={settings.whatsapp}
        />
        <Faq />
        <Contact offers={offers} softwareOffers={softwareOffers} settings={settings} />
      </main>
      <FooterSection5 offers={offers} settings={settings} />
    </>
  );
}
