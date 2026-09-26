import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Info } from "lucide-react";
import FooterSection5 from "@/components/ui/footer-section-5";
import { RichText } from "@/components/ui/rich-text";
import { Header } from "@/components/site/header";
import { instagramHandle } from "@/components/site/social-icons";
import { getSiteData } from "@/lib/data";
import { whatsappLink } from "@/lib/format";
import { hasLocale, localePath, locales, type Locale } from "@/lib/i18n/config";
import { localizeSiteData } from "@/lib/i18n/content";
import { fill } from "@/lib/i18n/fill";
import { legalAr } from "@/lib/i18n/legal/ar";
import { legalEn } from "@/lib/i18n/legal/en";
import { legalFr } from "@/lib/i18n/legal/fr";
import type { LegalArticle, LegalDoc } from "@/lib/i18n/legal/types";
import type { Settings } from "@/lib/types";

export const revalidate = 60;

const docs: Record<Locale, LegalDoc> = { fr: legalFr, en: legalEn, ar: legalAr };
const PATH = "/politique-de-confidentialite";

export async function generateMetadata({ params }: PageProps<"/[lang]/politique-de-confidentialite">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return {
    title: docs[lang].metaTitle,
    description: docs[lang].metaDescription,
    alternates: {
      canonical: localePath(lang, PATH),
      languages: { ...Object.fromEntries(locales.map((l) => [l, localePath(l, PATH)])), "x-default": PATH },
    },
  };
}

function Article({ article, n, doc, settings }: { article: LegalArticle; n: number; doc: LegalDoc; settings: Settings }) {
  return (
    <section id={article.id} className="scroll-mt-24">
      <h3 className="font-heading text-xl font-bold">
        <span className="me-2 text-primary">{n}.</span>
        {article.title}
      </h3>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-muted-foreground [&_li]:ms-5 [&_li]:list-disc [&_ul]:space-y-1.5">
        {article.blocks.map((block, i): ReactNode => {
          if ("contacts" in block) return <ContactList key={i} settings={settings} labels={doc.contactLabels} />;
          if ("ul" in block)
            return (
              <ul key={i}>
                {block.ul.map((line) => (
                  <li key={line}>
                    <RichText text={line} />
                  </li>
                ))}
              </ul>
            );
          return (
            <p key={i}>
              <RichText text={block.p} />
            </p>
          );
        })}
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

function ContactList({ settings, labels }: { settings: Settings; labels: LegalDoc["contactLabels"] }) {
  const items = [
    settings.whatsapp && { label: "WhatsApp", value: settings.whatsapp, href: whatsappLink(settings.whatsapp) },
    settings.phone && { label: labels.phone, value: settings.phone, href: `tel:${settings.phone.replace(/\s/g, "")}` },
    settings.email && { label: labels.email, value: settings.email, href: `mailto:${settings.email}` },
    settings.instagram && { label: "Instagram", value: instagramHandle(settings.instagram), href: settings.instagram },
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  return (
    <ul>
      {items.map((item) => (
        <li key={item.label}>
          {item.label} :{" "}
          <a
            href={item.href}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            dir="ltr"
            className="font-medium text-primary hover:underline"
          >
            {item.value}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/politique-de-confidentialite">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const doc = docs[lang];
  const { offers, settings } = localizeSiteData(await getSiteData(), lang);
  const parts = [
    { id: "conditions-de-vente", ...doc.sales },
    { id: "confidentialite", ...doc.privacy },
  ];

  return (
    <>
      <Header solid />
      <main className="bg-background px-4 pt-28 pb-8 md:px-8 md:pt-32">
        <article className="mx-auto max-w-3xl">
          <header>
            <span className="rounded-full border bg-card px-4 py-1 text-sm font-medium text-muted-foreground">{doc.badge}</span>
            <h1 className="mt-5 font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{doc.title}</h1>
            <p className="mt-4 text-muted-foreground">{fill(doc.intro, { date: doc.updatedAt })}</p>
            {doc.officialNotice && (
              <p className="mt-4 flex items-start gap-2 rounded-xl bg-primary/5 p-3 text-sm text-muted-foreground">
                <Info className="mt-0.5 size-4 shrink-0 text-primary" />
                {doc.officialNotice}
              </p>
            )}
          </header>

          {/* L'essentiel */}
          <div className="mt-10 rounded-2xl border bg-muted/40 p-6 sm:p-8">
            <h2 className="font-heading text-lg font-bold">{doc.essentialsTitle}</h2>
            <ul className="mt-4 space-y-3">
              {doc.essentials.map((line) => (
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
          <nav aria-label={doc.tocLabel} className="mt-10 grid gap-8 sm:grid-cols-2">
            {parts.map((part, p) => (
              <div key={part.id}>
                <a href={`#${part.id}`} className="font-heading font-bold hover:text-primary">
                  {p + 1}. {part.toc}
                </a>
                <ol className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {part.articles.map((a, i) => (
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

          {/* Partie 1 : conditions de vente — Partie 2 : confidentialité */}
          {parts.map((part, p) => (
            <div key={part.id} className={p === 0 ? "mt-16 space-y-10" : "mt-20 space-y-10"}>
              <PartTitle id={part.id} label={`${doc.partLabel} ${p + 1}`} title={part.title} />
              {part.articles.map((article, i) => (
                <Article key={article.id} article={article} n={i + 1} doc={doc} settings={settings} />
              ))}
            </div>
          ))}

          <div className="mt-16 rounded-2xl border bg-muted/40 p-6 text-center sm:p-8">
            <p className="font-heading text-lg font-bold">{doc.questionTitle}</p>
            <p className="mt-1 text-muted-foreground">{doc.questionText}</p>
            <Link
              href={localePath(lang, "/#contact")}
              className="mt-5 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {doc.cta}
            </Link>
          </div>
        </article>
      </main>
      <FooterSection5 offers={offers} settings={settings} />
    </>
  );
}
