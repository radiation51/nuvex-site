"use client";

import { MessageSquareHeart } from "lucide-react";
import { Stars, TestimonialsColumn, type Testimonial } from "@/components/ui/testimonials-columns-1";
import { ReviewDialog } from "@/components/site/review-dialog";
import { SectionHeading } from "@/components/site/section-heading";
import { initials } from "@/lib/format";
import type { Review } from "@/lib/types";
import { useI18n } from "@/components/i18n-provider";

// En dessous de ce nombre d'avis, on les affiche simplement (pas de colonnes qui défilent).
const MIN_FOR_SCROLL = 6;

function StaticCard({ item }: { item: Testimonial }) {
  return (
    <div className="w-full rounded-3xl border bg-card p-8 shadow-lg shadow-primary/10">
      <Stars rating={item.rating} />
      <p dir="auto" className="mt-4 leading-relaxed">{item.text}</p>
      <div className="mt-5 flex items-center gap-3">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- photo envoyée par le client
          <img width={40} height={40} src={item.image} alt={item.name} className="size-10 rounded-full object-cover" />
        ) : (
          <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">{initials(item.name)}</span>
        )}
        <div className="flex flex-col">
          <div className="leading-5 font-medium tracking-tight">{item.name}</div>
          {item.role && <div className="text-sm leading-5 tracking-tight opacity-60">{item.role}</div>}
        </div>
      </div>
    </div>
  );
}

export function Testimonials({ reviews, whatsapp }: { reviews: Review[]; whatsapp?: string }) {
  const { t } = useI18n();
  const items: Testimonial[] = reviews.map((r) => ({
    text: r.text,
    image: r.image_url,
    name: r.name,
    role: r.role,
    rating: r.rating,
  }));

  // Répartit les avis en 3 colonnes équilibrées.
  const columns: Testimonial[][] = [[], [], []];
  items.forEach((item, i) => columns[i % 3].push(item));

  return (
    <section id="avis" className="relative bg-background px-4 py-24 md:px-8">
      <div className="z-10 mx-auto max-w-6xl">
        <SectionHeading
          badge={t.testimonials.badge}
          title={t.testimonials.title}
          subtitle={items.length ? t.testimonials.subtitle : t.testimonials.subtitleEmpty}
          className="max-w-[560px]"
        />

        {items.length === 0 ? (
          <div className="mx-auto mt-10 flex max-w-md flex-col items-center rounded-3xl border border-dashed bg-card/60 p-10 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
              <MessageSquareHeart className="size-7" />
            </span>
            <p className="mt-4 font-heading text-xl font-semibold">{t.testimonials.beFirst}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t.testimonials.verified}</p>
            <div className="mt-6">
              <ReviewDialog whatsapp={whatsapp} />
            </div>
          </div>
        ) : (
          <>
            {items.length < MIN_FOR_SCROLL ? (
              <div className="mx-auto mt-10 grid max-w-5xl justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item, i) => (
                  <StaticCard key={i} item={item} />
                ))}
              </div>
            ) : (
              <div className="mt-10 flex max-h-[740px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
                <TestimonialsColumn testimonials={columns[0]} duration={15} />
                <TestimonialsColumn testimonials={columns[1]} className="hidden md:block" duration={19} />
                <TestimonialsColumn testimonials={columns[2]} className="hidden lg:block" duration={17} />
              </div>
            )}

            <div className="mt-10 flex flex-col items-center gap-3 text-center">
              <p className="text-sm text-muted-foreground">{t.testimonials.workedWithUs}</p>
              <ReviewDialog whatsapp={whatsapp} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
