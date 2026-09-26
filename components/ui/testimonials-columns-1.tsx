"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Star } from "lucide-react";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n-provider";
import { fill } from "@/lib/i18n/fill";

export interface Testimonial {
  text: string;
  image?: string | null;
  name: string;
  role?: string | null;
  rating: number;
}

export function Stars({ rating, className }: { rating: number; className?: string }) {
  const { t } = useI18n();
  return (
    <div className={cn("flex gap-0.5", className)} aria-label={fill(t.testimonials.outOf5, { n: rating })}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={cn("size-4", i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")} />
      ))}
    </div>
  );
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  const reduceMotion = useReducedMotion();

  return (
    <div className={props.className}>
      <motion.div
        animate={reduceMotion ? undefined : { translateY: "-50%" }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 bg-background pb-6"
      >
        {new Array(2).fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role, rating }, i) => (
              <div
                className="w-full max-w-xs rounded-3xl border bg-card p-8 shadow-lg shadow-primary/10"
                key={i}
                aria-hidden={index === 1 || undefined}
              >
                <Stars rating={rating} />
                <p dir="auto" className="mt-4 leading-relaxed">{text}</p>
                <div className="mt-5 flex items-center gap-3">
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element -- photo envoyée par le client
                    <img width={40} height={40} src={image} alt={name} className="size-10 rounded-full object-cover" />
                  ) : (
                    <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {initials(name)}
                    </span>
                  )}
                  <div className="flex flex-col">
                    <div className="leading-5 font-medium tracking-tight">{name}</div>
                    {role && <div className="text-sm leading-5 tracking-tight opacity-60">{role}</div>}
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};
