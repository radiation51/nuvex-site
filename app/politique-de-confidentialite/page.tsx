import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import FooterSection5 from "@/components/ui/footer-section-5";
import { Header } from "@/components/site/header";
import { instagramHandle } from "@/components/site/social-icons";
import { getSiteData } from "@/lib/data";
import { whatsappLink } from "@/lib/format";
import type { Settings } from "@/lib/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Politique de confidentialité et conditions de vente — NUVEX",
  description:
    "Conditions de vente des sites web et logiciels NUVEX (acompte, livraison, garantie d'un mois, remboursement) et politique de confidentialité de vos données.",
};

const UPDATED_AT = "25 septembre 2026";

const essentials = [
  "Acompte de 50 % à la commande, le reste à la fin de la réalisation.",
  "Aucun remboursement après la livraison du site ou du logiciel.",
  "Une garantie d'un mois : tout défaut de notre fait est corrigé gratuitement.",
  "Vos données servent uniquement à traiter votre demande : elles ne sont jamais vendues.",
  "Vous pouvez demander à consulter, corriger ou supprimer vos données à tout moment.",
];

const salesArticles = [
  { id: "qui-sommes-nous", title: "Qui sommes-nous" },
  { id: "objet", title: "Objet des conditions" },
  { id: "devis-commande", title: "Devis et commande" },
  { id: "prix-paiement", title: "Prix et paiement" },
  { id: "delais", title: "Délais de livraison" },
  { id: "engagements-client", title: "Engagements du client" },
  { id: "livraison", title: "Livraison" },
  { id: "remboursement", title: "Aucun remboursement après la livraison" },
  { id: "garantie", title: "Garantie d'un mois" },
  { id: "domaine-hebergement", title: "Nom de domaine et hébergement" },
  { id: "propriete", title: "Propriété et licence d'utilisation" },
  { id: "references", title: "Références" },
  { id: "responsabilite", title: "Responsabilité" },
  { id: "litiges", title: "Droit applicable et litiges" },
];

const privacyArticles = [
  { id: "responsable", title: "Responsable des données" },
  { id: "donnees-collectees", title: "Données collectées" },
  { id: "utilisation", title: "Utilisation des données" },
  { id: "destinataires", title: "Qui peut voir vos données" },
  { id: "conservation", title: "Durée de conservation" },
  { id: "cookies", title: "Cookies" },
  { id: "securite", title: "Sécurité" },
  { id: "vos-droits", title: "Vos droits" },
  { id: "modifications", title: "Modifications" },
];

function Article({ id, n, title, children }: { id: string; n: number; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h3 className="font-heading text-xl font-bold">
        <span className="mr-2 text-primary">{n}.</span>
        {title}
      </h3>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-muted-foreground [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-foreground [&_ul]:space-y-1.5">
        {children}
      </div>
    </section>
  );
}

function PartTitle({ id, label, title }: { id: string; label: string; title: string }) {
  return (
    <div id={id} className="scroll-mt-24 border-b pb-4">
      <p className="text-sm font-semibold tracking-wide text-primary uppercase">{label}</p>
      <h2 className="mt-1 font-heading text-2xl font-bold sm:text-3xl">{title}</h2>
    </div>
  );
}

function ContactList({ settings }: { settings: Settings }) {
  const items = [
    settings.whatsapp && { label: "WhatsApp", value: settings.whatsapp, href: whatsappLink(settings.whatsapp) },
    settings.phone && { label: "Téléphone", value: settings.phone, href: `tel:${settings.phone.replace(/\s/g, "")}` },
    settings.email && { label: "E-mail", value: settings.email, href: `mailto:${settings.email}` },
    settings.instagram && { label: "Instagram", value: instagramHandle(settings.instagram), href: settings.instagram },
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  return (
    <ul>
      {items.map((item) => (
        <li key={item.label}>
          {item.label} :{" "}
          <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="font-medium text-primary hover:underline">
            {item.value}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default async function PrivacyPage() {
  const { offers, settings } = await getSiteData();

  return (
    <>
      <Header solid />
      <main className="bg-background px-4 pt-28 pb-8 md:px-8 md:pt-32">
        <article className="mx-auto max-w-3xl">
          <header>
            <span className="rounded-full border bg-card px-4 py-1 text-sm font-medium text-muted-foreground">Informations légales</span>
            <h1 className="mt-5 font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Politique de confidentialité et conditions de vente
            </h1>
            <p className="mt-4 text-muted-foreground">
              Dernière mise à jour : {UPDATED_AT}. En demandant un devis sur ce site, vous déclarez avoir lu et accepté l&apos;ensemble
              de ce document.
            </p>
          </header>

          {/* L'essentiel */}
          <div className="mt-10 rounded-2xl border bg-muted/40 p-6 sm:p-8">
            <h2 className="font-heading text-lg font-bold">L&apos;essentiel en 5 points</h2>
            <ul className="mt-4 space-y-3">
              {essentials.map((line) => (
                <li key={line} className="flex items-start gap-3 text-[15px]">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </div>

          {/* Sommaire */}
          <nav aria-label="Sommaire" className="mt-10 grid gap-8 sm:grid-cols-2">
            {[
              { id: "conditions-de-vente", title: "Conditions de vente", list: salesArticles },
              { id: "confidentialite", title: "Politique de confidentialité", list: privacyArticles },
            ].map((part, p) => (
              <div key={part.id}>
                <a href={`#${part.id}`} className="font-heading font-bold hover:text-primary">
                  {p + 1}. {part.title}
                </a>
                <ol className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {part.list.map((a, i) => (
                    <li key={a.id}>
                      <a href={`#${a.id}`} className="hover:text-primary">
                        {i + 1}. {a.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </nav>

          {/* ---------- Partie 1 : conditions de vente ---------- */}
          <div className="mt-16 space-y-10">
            <PartTitle id="conditions-de-vente" label="Partie 1" title="Conditions générales de vente" />

            <Article id="qui-sommes-nous" n={1} title="Qui sommes-nous">
              <p>
                <strong>NUVEX</strong> est une agence basée en Algérie qui crée des sites web et des logiciels de gestion pour les
                professionnels et les particuliers. Vous pouvez nous joindre :
              </p>
              <ContactList settings={settings} />
            </Article>

            <Article id="objet" n={2} title="Objet des conditions">
              <p>
                Ces conditions s&apos;appliquent à toutes nos prestations : création de sites web (offres Éco, Pro, Premium et
                Sur-mesure), création de logiciels (offres Logiciel Essentiel, Logiciel Pro et Logiciel Sur-mesure), ainsi qu&apos;à
                toute prestation complémentaire (modifications, maintenance, nouvelles fonctionnalités).
              </p>
              <p>
                Elles sont acceptées par le client avant toute demande de devis, au moyen de la case à cocher du formulaire de
                contact. Toute commande passée par un autre moyen (WhatsApp, téléphone, rendez-vous) vaut également acceptation de ces
                conditions.
              </p>
            </Article>

            <Article id="devis-commande" n={3} title="Devis et commande">
              <ul>
                <li>Le devis est <strong>gratuit et sans engagement</strong>.</li>
                <li>
                  La commande devient ferme lorsque le client accepte le devis (par écrit, par message WhatsApp ou par tout autre
                  moyen) <strong>et</strong> paie l&apos;acompte.
                </li>
                <li>
                  La prestation comprend uniquement ce qui est décrit dans l&apos;offre choisie ou dans le devis. Toute demande en
                  plus (pages, fonctions, modules, changements de design après validation) fait l&apos;objet d&apos;un nouveau devis.
                </li>
              </ul>
            </Article>

            <Article id="prix-paiement" n={4} title="Prix et paiement">
              <ul>
                <li>
                  Les prix sont indiqués en dinars algériens (DA). La mention « à partir de » correspond au prix de base de
                  l&apos;offre : le prix final est celui du devis accepté.
                </li>
                <li>
                  <strong>Acompte de 50 % à la commande.</strong> Le travail commence à la réception de l&apos;acompte.
                </li>
                <li>
                  <strong>Le reste (50 %) est payé à la fin de la réalisation</strong>, lorsque le site ou le logiciel est terminé,
                  avant la mise en ligne définitive du site ou la remise de la clé USB du logiciel.
                </li>
                <li>Moyens de paiement acceptés : espèces, CCP, BaridiMob ou virement.</li>
                <li>
                  Tant que le solde n&apos;est pas payé, NUVEX peut suspendre la mise en ligne du site ou ne pas remettre le
                  logiciel.
                </li>
              </ul>
            </Article>

            <Article id="delais" n={5} title="Délais de livraison">
              <ul>
                <li>
                  Sites Éco, Pro et Premium, logiciels Essentiel et Pro : <strong>livraison en 7 jours</strong>. Offres
                  Sur-mesure : délai fixé dans le devis.
                </li>
                <li>
                  Le délai commence lorsque NUVEX a reçu l&apos;acompte <strong>et</strong> tous les éléments nécessaires (textes,
                  photos, logo, liste de produits, informations sur l&apos;activité) et que la maquette a été validée.
                </li>
                <li>
                  Si le client envoie ses éléments en retard ou tarde à répondre ou à valider, la date de livraison est décalée
                  d&apos;autant. Un retard lié à un cas de force majeure (panne générale, coupure prolongée, événement indépendant de
                  notre volonté) ne peut pas être reproché à NUVEX.
                </li>
              </ul>
            </Article>

            <Article id="engagements-client" n={6} title="Engagements du client">
              <ul>
                <li>Fournir des informations et des contenus exacts, dans des délais raisonnables.</li>
                <li>
                  Disposer des droits sur les textes, photos, logos et marques qu&apos;il fournit. NUVEX n&apos;est pas responsable du
                  contenu fourni par le client.
                </li>
                <li>Utiliser le site et le logiciel pour une activité légale, dans le respect de la loi algérienne.</li>
                <li>
                  Suivre les vidéos d&apos;installation et d&apos;utilisation fournies avec le logiciel, et conserver la clé USB en
                  lieu sûr.
                </li>
              </ul>
            </Article>

            <Article id="livraison" n={7} title="Livraison">
              <ul>
                <li>
                  <strong>Site web :</strong> la livraison correspond à la mise en ligne du site à l&apos;adresse prévue.
                </li>
                <li>
                  <strong>Logiciel :</strong> la livraison correspond à la remise de la clé USB, livrée gratuitement, qui contient le logiciel, une vidéo
                  d&apos;installation et une vidéo complète expliquant comment utiliser le logiciel.
                </li>
                <li>
                  À la livraison, le client vérifie la prestation. Les défauts constatés sont corrigés dans le cadre de la garantie
                  d&apos;un mois.
                </li>
              </ul>
            </Article>

            <Article id="remboursement" n={8} title="Aucun remboursement après la livraison">
              <p>
                Nos sites et logiciels sont créés sur mesure pour chaque client. C&apos;est pourquoi,{" "}
                <strong>une fois le site ou le logiciel livré, aucun remboursement, total ou partiel, n&apos;est possible</strong>,
                quel que soit le motif : changement d&apos;avis, arrêt ou changement d&apos;activité, non-utilisation, choix
                d&apos;un autre prestataire, etc.
              </p>
              <p>
                Si le client annule la commande pendant la réalisation, l&apos;acompte reste acquis à NUVEX, car il correspond au
                travail déjà engagé. Si NUVEX n&apos;est pas en mesure de réaliser la prestation de son propre fait, l&apos;acompte
                est remboursé intégralement.
              </p>
              <p>En cas de problème après la livraison, la solution est la correction prévue par la garantie ci-dessous.</p>
            </Article>

            <Article id="garantie" n={9} title="Garantie d'un mois">
              <p>
                Pendant <strong>un mois à compter de la date de livraison</strong>, NUVEX corrige gratuitement tout défaut de
                fonctionnement dû à son travail : page qui ne s&apos;affiche pas, formulaire ou bouton qui ne marche pas, erreur de
                calcul, blocage du logiciel, fonction prévue dans l&apos;offre qui ne fonctionne pas correctement. Les corrections
                sont faites dans les meilleurs délais.
              </p>
              <p>La garantie prend la forme d&apos;une correction, jamais d&apos;un remboursement. Elle ne couvre pas :</p>
              <ul>
                <li>les nouvelles fonctionnalités, les nouvelles pages ou les changements de design après validation ;</li>
                <li>les modifications faites par le client ou par une autre personne que NUVEX ;</li>
                <li>une mauvaise utilisation ou le non-respect des vidéos d&apos;installation et d&apos;utilisation ;</li>
                <li>
                  les problèmes de matériel ou de système : panne ou vol du PC, virus, mise à jour de Windows, coupure de courant,
                  perte ou casse de la clé USB ;
                </li>
                <li>
                  les services extérieurs : hébergeur, fournisseur du nom de domaine, fournisseur d&apos;accès à internet,
                  WhatsApp ;
                </li>
                <li>la perte de données lorsque les sauvegardes n&apos;ont pas été conservées.</li>
              </ul>
              <p>Après ce mois, toute intervention fait l&apos;objet d&apos;un devis (maintenance, modifications, dépannage).</p>
            </Article>

            <Article id="domaine-hebergement" n={10} title="Nom de domaine et hébergement">
              <ul>
                <li>
                  Le nom de domaine est inclus dans nos offres de sites pour la <strong>première année</strong> : NUVEX
                  s&apos;occupe de la réservation. Son renouvellement les années suivantes est à la charge du client ; NUVEX peut
                  s&apos;en occuper sur demande.
                </li>
                <li>
                  Les sites sont hébergés par des prestataires techniques reconnus. NUVEX ne peut pas être tenue responsable
                  d&apos;une interruption de service provenant de ces prestataires.
                </li>
              </ul>
            </Article>

            <Article id="propriete" n={11} title="Propriété et licence d'utilisation">
              <ul>
                <li>
                  <strong>Site web :</strong> une fois le paiement complet reçu, le client peut utiliser librement son site et son
                  contenu. NUVEX conserve ses droits sur ses outils et éléments techniques réutilisables.
                </li>
                <li>
                  <strong>Logiciel :</strong> une fois le paiement complet reçu, le client obtient le droit d&apos;utiliser le
                  logiciel pour son activité, sur le nombre de postes prévu par son offre. Le logiciel ne peut pas être revendu,
                  copié pour d&apos;autres personnes, loué ou modifié sans l&apos;accord écrit de NUVEX. Le code source reste la
                  propriété de NUVEX, sauf accord écrit contraire prévu dans un devis sur mesure.
                </li>
                <li>Tant que le paiement n&apos;est pas complet, le site et le logiciel restent la propriété de NUVEX.</li>
              </ul>
            </Article>

            <Article id="references" n={12} title="Références">
              <p>
                NUVEX peut présenter le projet réalisé (nom, logo, captures d&apos;écran, lien) dans ses réalisations et sur ses
                réseaux sociaux, sauf si le client le refuse par écrit.
              </p>
            </Article>

            <Article id="responsabilite" n={13} title="Responsabilité">
              <ul>
                <li>NUVEX s&apos;engage à mettre en œuvre tous les moyens nécessaires pour réaliser une prestation de qualité.</li>
                <li>
                  NUVEX n&apos;est pas responsable des dommages indirects (perte de chiffre d&apos;affaires, de clients ou de
                  données). Dans tous les cas, sa responsabilité est limitée au montant payé pour la prestation concernée.
                </li>
                <li>
                  Le client reste responsable de son activité, du contenu de son site et du respect de ses obligations légales,
                  fiscales et comptables, même lorsqu&apos;il utilise un logiciel NUVEX pour les gérer.
                </li>
              </ul>
            </Article>

            <Article id="litiges" n={14} title="Droit applicable et litiges">
              <p>
                Ces conditions sont soumises au droit algérien. En cas de désaccord, les deux parties s&apos;engagent à chercher
                d&apos;abord une solution à l&apos;amiable, en nous contactant directement. À défaut d&apos;accord, le litige sera
                porté devant les tribunaux algériens compétents.
              </p>
              <p>
                NUVEX peut modifier ces conditions à tout moment. Les conditions applicables sont celles acceptées au moment de la
                commande.
              </p>
            </Article>
          </div>

          {/* ---------- Partie 2 : confidentialité ---------- */}
          <div className="mt-20 space-y-10">
            <PartTitle id="confidentialite" label="Partie 2" title="Politique de confidentialité" />

            <Article id="responsable" n={1} title="Responsable des données">
              <p>
                Le responsable des données collectées sur ce site est <strong>NUVEX</strong>, joignable aux coordonnées indiquées
                dans la partie 1.
              </p>
            </Article>

            <Article id="donnees-collectees" n={2} title="Données collectées">
              <p>Nous collectons uniquement les données nécessaires :</p>
              <ul>
                <li>
                  <strong>Demande de devis :</strong> nom, numéro de téléphone, e-mail (facultatif), offre choisie et description
                  de votre projet.
                </li>
                <li>
                  <strong>Avis clients :</strong> nom, métier ou entreprise, note, texte de l&apos;avis et photo (facultative).
                </li>
                <li>
                  <strong>Clients :</strong> les informations utiles au suivi du projet et des paiements (coordonnées, offre,
                  montants, dates, moyen de paiement). Nous ne demandons jamais de numéro de carte bancaire ni de mot de passe.
                </li>
                <li>
                  <strong>Données techniques :</strong> l&apos;adresse IP, utilisée temporairement pour protéger le site contre le
                  spam et les tentatives d&apos;intrusion.
                </li>
              </ul>
            </Article>

            <Article id="utilisation" n={3} title="Utilisation des données">
              <p>Vos données servent uniquement à :</p>
              <ul>
                <li>vous rappeler et répondre à votre demande, puis établir votre devis ;</li>
                <li>réaliser votre site ou votre logiciel, et suivre les paiements ;</li>
                <li>publier votre avis sur le site, seulement après notre validation ;</li>
                <li>assurer la sécurité du site.</li>
              </ul>
              <p>
                Elles sont traitées avec votre accord (case cochée dans le formulaire), pour exécuter la prestation commandée, ou
                pour respecter nos obligations légales. <strong>Elles ne sont jamais vendues, louées ni utilisées pour de la
                publicité.</strong>
              </p>
            </Article>

            <Article id="destinataires" n={4} title="Qui peut voir vos données">
              <ul>
                <li>Uniquement l&apos;équipe NUVEX, depuis un espace d&apos;administration protégé.</li>
                <li>
                  Nos prestataires techniques (hébergement du site et base de données), qui les stockent pour notre compte. Leurs
                  serveurs peuvent être situés hors d&apos;Algérie ; ils appliquent des mesures de sécurité reconnues.
                </li>
                <li>
                  Si vous nous écrivez sur WhatsApp ou Instagram, vos messages sont aussi soumis aux règles de confidentialité de ces
                  applications.
                </li>
                <li>Les autorités, uniquement si la loi l&apos;exige.</li>
              </ul>
              <p>Les avis approuvés (nom, métier ou entreprise, note, texte, photo) sont visibles par tous les visiteurs du site.</p>
            </Article>

            <Article id="conservation" n={5} title="Durée de conservation">
              <ul>
                <li>Demandes de devis sans suite : 2 ans maximum après le dernier contact.</li>
                <li>
                  Clients : pendant toute la durée de la relation, puis pendant la durée imposée par la loi pour les documents
                  comptables.
                </li>
                <li>Avis : tant qu&apos;ils sont publiés, ou jusqu&apos;à ce que vous demandiez leur suppression.</li>
                <li>Adresses IP : quelques jours au maximum, pour la sécurité.</li>
              </ul>
            </Article>

            <Article id="cookies" n={6} title="Cookies">
              <p>
                Ce site n&apos;utilise <strong>aucun cookie publicitaire ni de suivi</strong>. Seul un cookie technique est utilisé
                pour l&apos;espace d&apos;administration privé de NUVEX ; il ne concerne pas les visiteurs.
              </p>
            </Article>

            <Article id="securite" n={7} title="Sécurité">
              <p>
                Le site est protégé par une connexion chiffrée (HTTPS). L&apos;espace d&apos;administration est accessible par une
                adresse privée et un mot de passe, et bloque les tentatives de connexion répétées. L&apos;accès à la base de données
                est limité au strict nécessaire.
              </p>
            </Article>

            <Article id="vos-droits" n={8} title="Vos droits">
              <p>
                Conformément à la loi n° 18-07 du 10 juin 2018 relative à la protection des personnes physiques dans le traitement
                des données à caractère personnel, vous pouvez à tout moment :
              </p>
              <ul>
                <li>savoir quelles données nous avons sur vous et en obtenir une copie ;</li>
                <li>les faire corriger ;</li>
                <li>vous opposer à leur utilisation ou demander leur suppression ;</li>
                <li>demander le retrait de votre avis du site.</li>
              </ul>
              <p>
                Pour cela, contactez-nous par WhatsApp, par téléphone ou par e-mail : nous répondons dans un délai d&apos;un mois au
                maximum. Vous pouvez aussi saisir l&apos;Autorité nationale de protection des données à caractère personnel (ANPDP).
              </p>
            </Article>

            <Article id="modifications" n={9} title="Modifications">
              <p>
                Cette politique peut être mise à jour. La date de la dernière mise à jour est indiquée en haut de cette page. Nos
                services s&apos;adressent aux professionnels et aux personnes majeures.
              </p>
            </Article>
          </div>

          <div className="mt-16 rounded-2xl border bg-muted/40 p-6 text-center sm:p-8">
            <p className="font-heading text-lg font-bold">Une question sur ces conditions ?</p>
            <p className="mt-1 text-muted-foreground">Écrivez-nous, on vous répond sous 24 h.</p>
            <Link
              href="/#contact"
              className="mt-5 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Demander un devis gratuit
            </Link>
          </div>
        </article>
      </main>
      <FooterSection5 offers={offers} settings={settings} />
    </>
  );
}
