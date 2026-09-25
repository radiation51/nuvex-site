"use client";

import { motion } from "motion/react";
import { ArrowUpRight, ImageIcon, Lock } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import type { Project } from "@/lib/types";

function domainOf(link: string | null) {
  if (!link) return null;
  try {
    return new URL(link).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** Carte d'une réalisation (aussi utilisée comme aperçu dans l'admin). */
export function ProjectCard({ project }: { project: Project }) {
  const domain = domainOf(project.link);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-xl hover:shadow-primary/10">
      {/* Capture dans une mini-fenêtre de navigateur */}
      <div className="border-b bg-muted/60 p-3 pb-0">
        <div className="flex items-center gap-1.5 px-1 pb-2">
          <span className="size-2 rounded-full bg-[#ff5f57]" />
          <span className="size-2 rounded-full bg-[#febc2e]" />
          <span className="size-2 rounded-full bg-[#28c840]" />
          <span className="ml-2 flex min-w-0 items-center gap-1 truncate rounded-md bg-background px-2 py-0.5 text-[11px] text-muted-foreground">
            <Lock className="size-2.5 shrink-0" />
            {domain ?? "logiciel"}
          </span>
        </div>
        <div className="aspect-[16/10] overflow-hidden rounded-t-lg bg-muted">
          {project.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- captures locales ou hébergées sur Supabase
            <img
              src={project.image_url}
              alt={`Aperçu de ${project.title}`}
              loading="lazy"
              className="size-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="grid size-full place-items-center text-muted-foreground">
              <ImageIcon className="size-8 opacity-40" />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {project.category && <p className="text-xs font-semibold text-primary">{project.category}</p>}
        <h3 className="mt-1 font-heading text-lg font-semibold">{project.title}</h3>
        {project.description && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.description}</p>}
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-semibold text-foreground tap hover:text-primary"
          >
            Voir le site
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        )}
      </div>
    </article>
  );
}

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="realisations" className="bg-muted/40 px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          badge="Réalisations"
          title="Nos derniers projets"
          subtitle="Des sites et logiciels réels, en ligne et utilisés par nos clients."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
