"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  badge,
  title,
  subtitle,
  className,
}: {
  badge: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-80px" }}
      className={cn("mx-auto flex max-w-2xl flex-col items-center text-center", className)}
    >
      <span className="rounded-full border bg-card px-4 py-1 text-sm font-medium text-muted-foreground">{badge}</span>
      <h2 className="mt-5 font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-base text-muted-foreground sm:text-lg">{subtitle}</p>}
    </motion.div>
  );
}
