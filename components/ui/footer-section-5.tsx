"use client";

import { GlassPanel, OutlineText } from "@/components/site/glass-panel";
import { SocialLinks } from "@/components/site/social-icons";
import { selectOffer, whatsappLink } from "@/lib/format";
import type { Offer, Settings } from "@/lib/types";

const companyName = "NUVEX";

const navigation = [
  { name: "Accueil", href: "#accueil" },
  { name: "Nos offres", href: "#offres" },
  { name: "Réalisations", href: "#realisations" },
  { name: "Avis clients", href: "#avis" },
  { name: "FAQ", href: "#faq" },
  { name: "Contact", href: "#contact" },
];

const linkClass = "text-white/70 hover:text-white transition-colors text-sm md:text-[15px] font-medium text-left";

export default function FooterSection5({ offers, settings }: { offers: Offer[]; settings: Settings }) {
  const contactLinks = [
    settings.whatsapp && { name: "WhatsApp", href: whatsappLink(settings.whatsapp) },
    settings.phone && { name: settings.phone, href: `tel:${settings.phone.replace(/\s/g, "")}` },
    settings.email && { name: settings.email, href: `mailto:${settings.email}` },
  ].filter(Boolean) as { name: string; href: string }[];

  return (
    <footer className="relative w-full overflow-hidden bg-background antialiased [font-synthesis:none]">
      {/* Grand texte en contour (décoratif, pas un titre) */}
      <div className="relative z-0 flex w-full items-end justify-center pt-24 pb-0 md:pt-32">
        <OutlineText className="-mb-3 text-[26vw] sm:text-[160px] md:-mb-6 md:text-[210px]">{companyName}</OutlineText>
      </div>

      {/* Panneau couleur principale, effet verre */}
      <GlassPanel shader className="z-10 min-h-[400px] w-full">
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-between gap-14 px-6 py-16 md:px-12 md:py-24 lg:flex-row lg:gap-8 lg:px-24">
          {/* Gauche */}
          <div className="flex w-full max-w-sm flex-col justify-between">
            <div className="flex flex-col">
              <span className="mb-3 flex items-center gap-2 font-heading text-2xl font-bold text-white">
                <span className="grid size-9 place-items-center rounded-lg bg-white text-base text-primary">N</span>
                {companyName}
              </span>
              <p className="text-xl leading-tight font-medium text-white md:text-[22px]">
                Des sites web modernes
                <br />
                qui font grandir votre activité.
              </p>
            </div>

            <div className="flex flex-col gap-4 pt-8 lg:mt-auto">
              <SocialLinks
                settings={settings}
                className="flex flex-wrap gap-2"
                iconClassName="grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white hover:text-primary"
              />
              <p className="text-xs font-light text-white/80 md:text-[13px]">
                © {new Date().getFullYear()} {companyName} — Tous droits réservés
              </p>
            </div>
          </div>

          {/* Droite : liens */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:gap-16 lg:gap-20">
            <div className="flex flex-col gap-5">
              <h3 className="text-lg font-semibold text-white md:text-xl">Navigation</h3>
              <ul className="flex flex-col gap-3 md:gap-4">
                {navigation.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className={linkClass}>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-5">
              <h3 className="text-lg font-semibold text-white md:text-xl">Nos offres</h3>
              <ul className="flex flex-col gap-3 md:gap-4">
                {offers.map((offer) => (
                  <li key={offer.id}>
                    <button type="button" onClick={() => selectOffer(offer.name)} className={linkClass}>
                      {offer.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 flex flex-col gap-5 sm:col-span-1">
              <h3 className="text-lg font-semibold text-white md:text-xl">Contact</h3>
              <ul className="flex flex-col gap-3 md:gap-4">
                {contactLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className={`${linkClass} break-all`}>
                      {link.name}
                    </a>
                  </li>
                ))}
                {settings.city && <li className="text-sm text-white/70 md:text-[15px]">{settings.city}</li>}
              </ul>
            </div>
          </div>
        </div>
      </GlassPanel>
    </footer>
  );
}
