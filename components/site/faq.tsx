"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/site/section-heading";

const questions = [
  {
    q: "En combien de temps mon site ou mon logiciel est-il livré ?",
    a: "7 jours pour les sites Éco, Pro et Premium comme pour les logiciels Essentiel et Pro, à partir de la validation de la maquette et de la réception de vos contenus (textes, photos, logo, liste de produits). Pour un projet sur-mesure, le délai est fixé ensemble dans le devis.",
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
    q: "Le logiciel fonctionne-t-il sans internet ?",
    a: "Oui. Il est installé sur votre PC et vos données restent chez vous : vous vendez, encaissez et gérez votre stock même quand la connexion est coupée. La synchronisation en ligne est possible en option.",
  },
  {
    q: "Comment se paie un logiciel ?",
    a: "Comme pour les sites : un acompte de 50 % à la commande pour démarrer le développement, et le reste à la fin, quand le logiciel est terminé.",
  },
  {
    q: "Comment le logiciel est-il installé ?",
    a: "Vous le recevez sur une clé USB, livrée gratuitement : branchez-la sur votre PC et l'installation se lance normalement. Sur la clé, une vidéo vous montre chaque étape de l'installation, et une vidéo complète vous apprend à utiliser le logiciel.",
  },
  {
    q: "Et si mon PC tombe en panne ?",
    a: "Vos données sont sauvegardées automatiquement. Il suffit de réinstaller le logiciel sur le nouveau PC avec la clé USB pour tout retrouver.",
  },
  {
    q: "Et si quelque chose ne marche pas après la livraison ?",
    a: "Vous avez une garantie d'un mois : tout défaut de fonctionnement de notre fait est corrigé gratuitement. En revanche, aucun remboursement n'est possible après la livraison. Tout est détaillé dans nos conditions de vente.",
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
