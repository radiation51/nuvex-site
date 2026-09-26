import type { LegalDoc } from "./types";

// Version officielle (en cas de différence avec une traduction, c'est ce texte qui fait foi).
export const legalFr: LegalDoc = {
  metaTitle: "Politique de confidentialité et conditions de vente — NUVEX",
  metaDescription:
    "Conditions de vente des sites web et logiciels NUVEX (acompte, livraison, garantie d'un mois, remboursement) et politique de confidentialité de vos données.",
  badge: "Informations légales",
  title: "Politique de confidentialité et conditions de vente",
  intro:
    "Dernière mise à jour : {date}. En demandant un devis sur ce site, vous déclarez avoir lu et accepté l'ensemble de ce document.",
  updatedAt: "26 septembre 2026",
  essentialsTitle: "L'essentiel en 5 points",
  essentials: [
    "Acompte de 50 % pour lancer le site ; le reste est payé une fois le site terminé, avant sa publication et sa livraison.",
    "Aucun remboursement après la livraison du site ou du logiciel.",
    "Une garantie d'un mois : tout défaut de notre fait est corrigé gratuitement.",
    "Vos données servent uniquement à traiter votre demande : elles ne sont jamais vendues.",
    "Vous pouvez demander à consulter, corriger ou supprimer vos données à tout moment.",
  ],
  tocLabel: "Sommaire",
  partLabel: "Partie",
  sales: {
    toc: "Conditions de vente",
    title: "Conditions générales de vente",
    articles: [
      {
        id: "qui-sommes-nous",
        title: "Qui sommes-nous",
        blocks: [
          {
            p: "**NUVEX** est une agence basée en Algérie qui crée des sites web et des logiciels de gestion pour les professionnels et les particuliers. Vous pouvez nous joindre :",
          },
          { contacts: true },
        ],
      },
      {
        id: "objet",
        title: "Objet des conditions",
        blocks: [
          {
            p: "Ces conditions s'appliquent à toutes nos prestations : création de sites web (offres Éco, Pro, Premium et Sur-mesure), création de logiciels (offres Logiciel Essentiel, Logiciel Pro et Logiciel Sur-mesure), ainsi qu'à toute prestation complémentaire (modifications, maintenance, nouvelles fonctionnalités).",
          },
          {
            p: "Elles sont acceptées par le client avant toute demande de devis, au moyen de la case à cocher du formulaire de contact. Toute commande passée par un autre moyen (WhatsApp, téléphone, rendez-vous) vaut également acceptation de ces conditions.",
          },
        ],
      },
      {
        id: "devis-commande",
        title: "Devis et commande",
        blocks: [
          {
            ul: [
              "Le devis est **gratuit et sans engagement**.",
              "La commande devient ferme lorsque le client accepte le devis (par écrit, par message WhatsApp ou par tout autre moyen) **et** paie l'acompte.",
              "La prestation comprend uniquement ce qui est décrit dans l'offre choisie ou dans le devis. Toute demande en plus (pages, fonctions, modules, changements de design après validation) fait l'objet d'un nouveau devis.",
            ],
          },
        ],
      },
      {
        id: "prix-paiement",
        title: "Prix et paiement",
        blocks: [
          {
            ul: [
              "Les prix sont indiqués en dinars algériens (DA). La mention « à partir de » correspond au prix de base de l'offre : le prix final est celui du devis accepté.",
              "**Acompte de 50 % à la commande : le travail ne commence qu'après le versement de cet acompte.**",
              "**Le solde (les 50 % restants) est payé une fois le site ou le logiciel terminé, avant sa publication et sa livraison** : le site n'est mis en ligne, et le logiciel n'est remis sur clé USB, qu'après le paiement complet.",
              "Moyens de paiement acceptés : espèces, CCP, BaridiMob ou virement.",
              "Tant que le solde n'est pas payé, NUVEX peut suspendre la mise en ligne du site ou ne pas remettre le logiciel.",
            ],
          },
        ],
      },
      {
        id: "delais",
        title: "Délais de livraison",
        blocks: [
          {
            ul: [
              "Sites Éco, Pro et Premium, logiciels Essentiel et Pro : **livraison en 7 jours**. Offres Sur-mesure : délai fixé dans le devis.",
              "Le délai commence lorsque NUVEX a reçu l'acompte **et** tous les éléments nécessaires (textes, photos, logo, liste de produits, informations sur l'activité) et que la maquette a été validée.",
              "Si le client envoie ses éléments en retard ou tarde à répondre ou à valider, la date de livraison est décalée d'autant. Un retard lié à un cas de force majeure (panne générale, coupure prolongée, événement indépendant de notre volonté) ne peut pas être reproché à NUVEX.",
            ],
          },
        ],
      },
      {
        id: "engagements-client",
        title: "Engagements du client",
        blocks: [
          {
            ul: [
              "Fournir des informations et des contenus exacts, dans des délais raisonnables.",
              "Disposer des droits sur les textes, photos, logos et marques qu'il fournit. NUVEX n'est pas responsable du contenu fourni par le client.",
              "Utiliser le site et le logiciel pour une activité légale, dans le respect de la loi algérienne.",
              "Suivre les vidéos d'installation et d'utilisation fournies avec le logiciel, et conserver la clé USB en lieu sûr.",
            ],
          },
        ],
      },
      {
        id: "livraison",
        title: "Livraison",
        blocks: [
          {
            ul: [
              "**Site web :** la livraison correspond à la mise en ligne du site à l'adresse prévue.",
              "**Logiciel :** la livraison correspond à la remise de la clé USB, livrée gratuitement, qui contient le logiciel, une vidéo d'installation et une vidéo complète expliquant comment utiliser le logiciel.",
              "À la livraison, le client vérifie la prestation. Les défauts constatés sont corrigés dans le cadre de la garantie d'un mois.",
            ],
          },
        ],
      },
      {
        id: "remboursement",
        title: "Aucun remboursement après la livraison",
        blocks: [
          {
            p: "Nos sites et logiciels sont créés sur mesure pour chaque client. C'est pourquoi, **une fois le site ou le logiciel livré, aucun remboursement, total ou partiel, n'est possible**, quel que soit le motif : changement d'avis, arrêt ou changement d'activité, non-utilisation, choix d'un autre prestataire, etc.",
          },
          {
            p: "Si le client annule la commande pendant la réalisation, l'acompte reste acquis à NUVEX, car il correspond au travail déjà engagé. Si NUVEX n'est pas en mesure de réaliser la prestation de son propre fait, l'acompte est remboursé intégralement.",
          },
          { p: "En cas de problème après la livraison, la solution est la correction prévue par la garantie ci-dessous." },
        ],
      },
      {
        id: "garantie",
        title: "Garantie d'un mois",
        blocks: [
          {
            p: "Pendant **un mois à compter de la date de livraison**, NUVEX corrige gratuitement tout défaut de fonctionnement dû à son travail : page qui ne s'affiche pas, formulaire ou bouton qui ne marche pas, erreur de calcul, blocage du logiciel, fonction prévue dans l'offre qui ne fonctionne pas correctement. Les corrections sont faites dans les meilleurs délais.",
          },
          { p: "La garantie prend la forme d'une correction, jamais d'un remboursement. Elle ne couvre pas :" },
          {
            ul: [
              "les nouvelles fonctionnalités, les nouvelles pages ou les changements de design après validation ;",
              "les modifications faites par le client ou par une autre personne que NUVEX ;",
              "une mauvaise utilisation ou le non-respect des vidéos d'installation et d'utilisation ;",
              "les problèmes de matériel ou de système : panne ou vol du PC, virus, mise à jour de Windows, coupure de courant, perte ou casse de la clé USB ;",
              "les services extérieurs : hébergeur, fournisseur du nom de domaine, fournisseur d'accès à internet, WhatsApp ;",
              "la perte de données lorsque les sauvegardes n'ont pas été conservées.",
            ],
          },
          { p: "Après ce mois, toute intervention fait l'objet d'un devis (maintenance, modifications, dépannage)." },
        ],
      },
      {
        id: "domaine-hebergement",
        title: "Nom de domaine et hébergement",
        blocks: [
          {
            ul: [
              "Le nom de domaine est inclus dans nos offres de sites pour la **première année** : NUVEX s'occupe de la réservation. Son renouvellement les années suivantes est à la charge du client ; NUVEX peut s'en occuper sur demande.",
              "Les sites sont hébergés par des prestataires techniques reconnus. NUVEX ne peut pas être tenue responsable d'une interruption de service provenant de ces prestataires.",
            ],
          },
        ],
      },
      {
        id: "formules-suivi",
        title: "Formules de suivi annuel",
        blocks: [
          {
            p: "Après la livraison, le client peut souscrire une formule de suivi annuel (Essentiel, Confort ou Sérénité), présentée sur la page Services. La formule est **payée une fois par an, à l'avance**, et couvre les douze mois qui suivent le paiement. Elle comprend le renouvellement du nom de domaine et de l'hébergement pendant cette période, la vérification mensuelle du site et le nombre d'interventions prévu par la formule. Une intervention correspond à une petite modification, mise à jour ou correction d'environ une heure de travail ; les interventions non utilisées ne sont pas reportées à l'année suivante. Les demandes plus importantes (nouvelle page hors formule, refonte, nouvelle fonction) font l'objet d'un devis, avec la réduction prévue par la formule. Le client reçoit un rappel avant chaque échéance et peut choisir de ne pas renouveler : dans ce cas, le renouvellement du nom de domaine et de l'hébergement redevient à sa charge. Une année commencée reste due et n'est pas remboursée.",
          },
        ],
      },
      {
        id: "propriete",
        title: "Propriété et licence d'utilisation",
        blocks: [
          {
            ul: [
              "**Site web :** une fois le paiement complet reçu, le client peut utiliser librement son site et son contenu. NUVEX conserve ses droits sur ses outils et éléments techniques réutilisables.",
              "**Logiciel :** une fois le paiement complet reçu, le client obtient le droit d'utiliser le logiciel pour son activité, sur le nombre de postes prévu par son offre. Le logiciel ne peut pas être revendu, copié pour d'autres personnes, loué ou modifié sans l'accord écrit de NUVEX. Le code source reste la propriété de NUVEX, sauf accord écrit contraire prévu dans un devis sur mesure.",
              "Tant que le paiement n'est pas complet, le site et le logiciel restent la propriété de NUVEX.",
            ],
          },
        ],
      },
      {
        id: "references",
        title: "Références",
        blocks: [
          {
            p: "NUVEX peut présenter le projet réalisé (nom, logo, captures d'écran, lien) dans ses réalisations et sur ses réseaux sociaux, sauf si le client le refuse par écrit.",
          },
        ],
      },
      {
        id: "responsabilite",
        title: "Responsabilité",
        blocks: [
          {
            ul: [
              "NUVEX s'engage à mettre en œuvre tous les moyens nécessaires pour réaliser une prestation de qualité.",
              "NUVEX n'est pas responsable des dommages indirects (perte de chiffre d'affaires, de clients ou de données). Dans tous les cas, sa responsabilité est limitée au montant payé pour la prestation concernée.",
              "Le client reste responsable de son activité, du contenu de son site et du respect de ses obligations légales, fiscales et comptables, même lorsqu'il utilise un logiciel NUVEX pour les gérer.",
            ],
          },
        ],
      },
      {
        id: "litiges",
        title: "Droit applicable et litiges",
        blocks: [
          {
            p: "Ces conditions sont soumises au droit algérien. En cas de désaccord, les deux parties s'engagent à chercher d'abord une solution à l'amiable, en nous contactant directement. À défaut d'accord, le litige sera porté devant les tribunaux algériens compétents.",
          },
          {
            p: "NUVEX peut modifier ces conditions à tout moment. Les conditions applicables sont celles acceptées au moment de la commande.",
          },
        ],
      },
    ],
  },
  privacy: {
    toc: "Politique de confidentialité",
    title: "Politique de confidentialité",
    articles: [
      {
        id: "responsable",
        title: "Qui est responsable de vos données",
        blocks: [
          {
            p: "Le responsable de toutes les données recueillies sur ce site est **NUVEX**, agence basée en Algérie spécialisée dans la création de sites web et de logiciels de gestion, joignable aux coordonnées indiquées dans la partie 1 (WhatsApp, téléphone, e-mail ou Instagram). C'est NUVEX qui décide des données collectées, de la manière dont elles sont utilisées et de la durée pendant laquelle elles sont conservées. Cette politique explique, simplement et sans jargon, ce que nous faisons de vos informations lorsque vous visitez le site, demandez un devis, laissez un avis ou devenez client, et elle s'applique de la même façon aux trois versions du site : français, anglais et arabe.",
          },
        ],
      },
      {
        id: "donnees-collectees",
        title: "Les données que nous recueillons",
        blocks: [
          {
            p: "Nous ne recueillons que ce qui est vraiment utile. Lorsque vous **demandez un devis**, vous nous transmettez votre nom, votre numéro de téléphone, votre e-mail si vous choisissez de le donner, l'offre qui vous intéresse et la description de votre projet ; selon le cas, cette demande nous arrive par notre formulaire ou s'ouvre directement dans WhatsApp, déjà rédigée, pour que vous nous l'envoyiez vous-même. Lorsque vous **laissez un avis**, nous recevons votre nom, votre métier ou le nom de votre entreprise, votre note, le texte de votre avis et, si vous le souhaitez, une photo. Lorsque vous **devenez client**, nous gardons les informations nécessaires au suivi de votre projet et de vos paiements : vos coordonnées, l'offre choisie, les montants, les dates d'acompte et de solde et le moyen de paiement utilisé (espèces, CCP, BaridiMob ou virement). Nous ne vous demandons jamais de numéro de carte bancaire, de code secret ni de mot de passe.",
          },
          {
            p: "Pour savoir si notre site est utile et l'améliorer, nous mesurons aussi sa **fréquentation, de façon anonyme et sans aucun cookie** : à chaque page consultée, nous enregistrons la page vue, la langue du site, le type d'appareil (téléphone, tablette ou ordinateur), le pays approximatif, le site d'où vous venez (par exemple Google, Instagram ou WhatsApp) et, le cas échéant, un geste qui montre votre intérêt, comme l'ouverture de la section des offres, le choix d'une offre, un clic sur WhatsApp ou sur le numéro de téléphone, ou l'envoi d'une demande de devis. Pour compter les visiteurs sans les suivre, nous calculons une empreinte anonyme qui change automatiquement chaque jour : elle ne permet ni de vous identifier, ni de vous reconnaître d'un jour à l'autre, et **votre adresse IP n'est jamais enregistrée**. Cette adresse IP est seulement utilisée, un court instant, pour protéger le site contre le spam et les tentatives d'intrusion.",
          },
        ],
      },
      {
        id: "utilisation",
        title: "Ce que nous faisons de vos données",
        blocks: [
          {
            p: "Vos données servent uniquement à vous rappeler et à répondre à votre demande, à préparer votre devis, à réaliser votre site ou votre logiciel, à suivre le paiement de l'acompte et du solde, à publier votre avis sur le site après l'avoir vérifié, à comprendre, grâce aux statistiques anonymes, quelles pages et quelles offres intéressent nos visiteurs, et à assurer la sécurité du site. Elles sont traitées parce que vous nous avez donné votre accord en cochant la case prévue dans le formulaire, parce qu'elles sont nécessaires pour exécuter la prestation que vous avez commandée, ou pour respecter nos obligations légales, notamment comptables. **Elles ne sont jamais vendues, louées, échangées ni utilisées pour de la publicité**, et nous ne vous envoyons aucun message commercial sans votre accord.",
          },
        ],
      },
      {
        id: "destinataires",
        title: "Qui peut voir vos données",
        blocks: [
          {
            p: "Seule l'équipe NUVEX a accès à vos informations, depuis un espace d'administration privé protégé par une adresse secrète et un mot de passe. Pour fonctionner, le site s'appuie sur des prestataires techniques reconnus : l'hébergeur du site et le service de base de données qui conserve les demandes, les avis, les dossiers clients et les statistiques anonymes pour notre compte. Leurs serveurs peuvent être situés hors d'Algérie, et ils appliquent des mesures de sécurité reconnues. Si vous choisissez de nous écrire sur WhatsApp ou sur Instagram, vos messages passent aussi par ces applications et sont soumis à leurs propres règles de confidentialité. Vos données ne sont communiquées aux autorités que si la loi l'exige. Enfin, les avis que nous approuvons (nom, métier ou entreprise, note, texte et photo) sont, par nature, visibles par tous les visiteurs du site.",
          },
        ],
      },
      {
        id: "conservation",
        title: "Combien de temps nous les gardons",
        blocks: [
          {
            p: "Nous ne gardons vos données que le temps nécessaire. Une demande de devis qui n'a pas donné suite est effacée au plus tard deux ans après notre dernier échange. Les informations des clients sont conservées pendant toute la durée de notre collaboration, puis pendant la durée imposée par la loi pour les documents comptables. Les avis restent en ligne tant qu'ils sont publiés, ou jusqu'à ce que vous demandiez leur retrait. Les statistiques de fréquentation, déjà anonymes, sont conservées treize mois au maximum, et les adresses IP utilisées pour la sécurité ne sont gardées que quelques jours tout au plus.",
          },
        ],
      },
      {
        id: "cookies",
        title: "Cookies",
        blocks: [
          {
            p: "Ce site n'utilise **aucun cookie publicitaire, de suivi ou de réseau social**, et la mesure de fréquentation décrite plus haut fonctionne sans cookie. Seuls deux petits cookies techniques existent : le premier retient simplement la langue que vous avez choisie (français, anglais ou arabe) pour vous l'afficher à votre prochaine visite, et le second sert uniquement à l'espace d'administration privé de NUVEX, il ne concerne donc pas les visiteurs. Ces cookies ne contiennent aucune information personnelle et ne servent à rien d'autre.",
          },
        ],
      },
      {
        id: "securite",
        title: "Sécurité",
        blocks: [
          {
            p: "Toutes les pages du site sont protégées par une connexion chiffrée (HTTPS), ce qui empêche vos informations d'être lues pendant leur envoi. L'espace d'administration n'est accessible que par une adresse privée et un mot de passe vérifié sur le serveur, et il bloque automatiquement les tentatives de connexion répétées. L'accès à la base de données passe uniquement par notre serveur, avec une clé secrète qui n'est jamais envoyée aux visiteurs, et il est limité au strict nécessaire. Le formulaire de contact et le formulaire d'avis sont en plus protégés contre les robots et les envois abusifs.",
          },
        ],
      },
      {
        id: "vos-droits",
        title: "Vos droits",
        blocks: [
          {
            p: "Conformément à la loi n° 18-07 du 10 juin 2018 relative à la protection des personnes physiques dans le traitement des données à caractère personnel, vous pouvez à tout moment savoir quelles données nous détenons sur vous et en obtenir une copie, les faire corriger si elles sont inexactes, vous opposer à leur utilisation, demander leur suppression ou demander le retrait de votre avis du site. Il vous suffit de nous contacter par WhatsApp, par téléphone ou par e-mail : nous vous répondons dans un délai d'un mois au maximum, et généralement bien plus vite. Si vous estimez que vos droits ne sont pas respectés, vous pouvez également saisir l'Autorité nationale de protection des données à caractère personnel (ANPDP).",
          },
        ],
      },
      {
        id: "modifications",
        title: "Mises à jour de cette politique",
        blocks: [
          {
            p: "Cette politique peut évoluer, par exemple si nous ajoutons un nouveau service ou si la loi change. La date de la dernière mise à jour est toujours indiquée en haut de cette page, et la version publiée sur le site est la seule qui fait foi. Nos services s'adressent aux professionnels et aux personnes majeures.",
          },
        ],
      },
    ],
  },
  contactLabels: { phone: "Téléphone", email: "E-mail" },
  questionTitle: "Une question sur ces conditions ?",
  questionText: "Écrivez-nous, on vous répond sous 24 h.",
  cta: "Demander un devis gratuit",
};
