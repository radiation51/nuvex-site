"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/site/section-heading";
import { useI18n } from "@/components/i18n-provider";

export function Faq() {
  const { t } = useI18n();
  const questions = t.faq.items;
  return (
    <section id="faq" className="bg-muted/40 px-4 py-24 md:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionHeading badge={t.nav.faq} title={t.faq.title} />
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
