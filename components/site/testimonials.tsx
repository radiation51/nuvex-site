"use client";

import { TestimonialsColumn, type Testimonial } from "@/components/ui/testimonials-columns-1";
import { ReviewDialog } from "@/components/site/review-dialog";
import { SectionHeading } from "@/components/site/section-heading";
import type { Review } from "@/lib/types";

export function Testimonials({ reviews }: { reviews: Review[] }) {
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
          badge="Avis clients"
          title="Ce que nos clients disent de nous"
          subtitle="Des entreprises algériennes qui nous ont fait confiance."
          className="max-w-[560px]"
        />

        <div className="mt-10 flex max-h-[740px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
          <TestimonialsColumn testimonials={columns[0]} duration={15} />
          <TestimonialsColumn testimonials={columns[1]} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={columns[2]} className="hidden lg:block" duration={17} />
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-muted-foreground">Vous avez travaillé avec nous ?</p>
          <ReviewDialog />
        </div>
      </div>
    </section>
  );
}
