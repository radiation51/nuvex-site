"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/site/section-heading";

const questions = [
  {
    q: "En combien de temps mon site est-il livré ?",
    a: "7 jours pour les offres Éco, Pro et Premium, à partir de la validation de la maquette et de la réception de vos contenus (textes, photos, logo). Pour un projet sur-mesure, le délai est fixé ensemble dans le devis.",
  },
  {
    q: "Comment se passe le paiement ?",
    a: "Avec un acompte de 50 % à la commande pour démarrer le projet. Le reste est à régler une fois votre site terminé.",
  },
  {
    q: "Le nom de domaine et l'hébergement sont-ils inclus ?",
    a: "Oui, le nom de domaine est inclus dans toutes nos offres (.com ou .dz) : on s'occupe de la réservation pour vous.",
  },
  {
    q: "Pourrai-je modifier mon site après la livraison ?",
    a: "Oui. Les petites modifications sont incluses pendant la période d'accompagnement, et l'offre Premium vous donne un espace d'administration pour tout gérer vous-même.",
  },
  {
    q: "Proposez-vous la maintenance ?",
    a: "Oui, nous proposons un suivi mensuel : mises à jour, sauvegardes, sécurité et petites évolutions. Demandez-nous un devis gratuit.",
  },
  {
    q: "Le devis est-il vraiment gratuit ?",
    a: "Oui, 100 % gratuit et sans engagement. Vous nous expliquez votre projet, on vous répond avec un prix clair.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="bg-muted/40 px-4 py-24 md:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionHeading badge="FAQ" title="Questions fréquentes" />
        <Accordion className="mt-12 rounded-2xl border bg-card px-5 sm:px-7">
          {questions.map((item, i) => (
            <AccordionItem key={i} value={i}>
              <AccordionTrigger className="py-5 text-base font-semibold hover:no-underline">{item.q}</AccordionTrigger>
              <AccordionContent className="pb-5 text-base leading-relaxed text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
