// Forme commune de la page « Politique de confidentialité et conditions de vente » dans chaque langue.
// Textes : « **mot** » = en gras.

export type LegalBlock = { p: string } | { ul: string[] } | { contacts: true };

export interface LegalArticle {
  id: string;
  title: string;
  blocks: LegalBlock[];
}

export interface LegalDoc {
  metaTitle: string;
  metaDescription: string;
  badge: string;
  title: string;
  /** « {date} » = date de mise à jour. */
  intro: string;
  updatedAt: string;
  /** Rappel affiché dans les traductions : la version française fait foi. */
  officialNotice?: string;
  essentialsTitle: string;
  essentials: string[];
  tocLabel: string;
  partLabel: string;
  sales: { toc: string; title: string; articles: LegalArticle[] };
  privacy: { toc: string; title: string; articles: LegalArticle[] };
  contactLabels: { phone: string; email: string };
  questionTitle: string;
  questionText: string;
  cta: string;
}
