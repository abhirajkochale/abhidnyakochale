"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

const PdfModal = dynamic(() => import("@/components/PdfModal"), { ssr: false });

// ─── Data ─────────────────────────────────────────────────────────────────────

const GROUP_PROJECTS = [
  {
    id: "gsen",
    title: "GSEN",
    subtitle: "Green Social Enterprise Network",
    year: "2023",
    role: "Design Lead — Team of 6",
    type: "Community Infrastructure",
    location: "Pune, India",
    area: "12,000 sq.ft",
    image: "/gsen.png",
    pdf: "/placeholder.pdf",
    info: [
      "A network of micro-hubs connecting social enterprises across three municipal wards, designed to facilitate knowledge exchange and collaborative production.",
      "The architecture employs a modular kit-of-parts system — each hub can be assembled in 72 hours using locally sourced materials and unskilled labour.",
      "Post-occupancy data shows a 34% increase in inter-enterprise collaboration within the first six months of operation.",
    ],
  },
  {
    id: "documentation",
    title: "Documentation",
    subtitle: "Heritage Recording & Conservation",
    year: "2022",
    role: "Researcher — Team of 4",
    type: "Heritage Documentation",
    location: "Wai, Maharashtra",
    area: "Measuring 18 structures",
    image: "/documentation.png",
    pdf: "/placeholder.pdf",
    info: [
      "A comprehensive hand-measured documentation of 18 pre-colonial structures in the Wai river basin — elevations, sections, details and material inventories.",
      "The project employed traditional Indian drawing conventions alongside photogrammetric point clouds to reconcile embodied knowledge with digital precision.",
      "Submitted to the Archaeological Survey of India as a reference archive for future conservation interventions.",
    ],
  },
] as const;

type GroupProjectId = (typeof GROUP_PROJECTS)[number]["id"];

// ─── Card ─────────────────────────────────────────────────────────────────────

function GroupCard({
  project,
  onOpen,
}: {
  project: (typeof GROUP_PROJECTS)[number];
  onOpen: () => void;
}) {
  return (
    <article
      onClick={onOpen}
      className="
        group flex flex-col bg-midnight-ink/5 rounded-2xl overflow-hidden
        border border-midnight-ink/10
        transition-all duration-500 ease-out cursor-none hover-target
        hover:scale-[1.015] hover:border-dusk-violet/60
        hover:[box-shadow:0_0_0_1px_#8B4FBF40,0_8px_40px_#8B4FBF30,0_0_80px_#8B4FBF18]
      "
    >
      {/* Render Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Subtle tint on hover */}
        <div className="absolute inset-0 bg-dusk-violet/0 group-hover:bg-dusk-violet/10 transition-colors duration-500" />
      </div>

      {/* Text Block */}
      <div className="flex flex-col gap-6 p-8 md:p-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-5xl md:text-6xl uppercase text-midnight-ink leading-none">
              {project.title}
            </h3>
            <p className="font-sans text-forest-ink/70 text-base mt-2 italic">
              {project.subtitle}
            </p>
          </div>
          <span className="font-sans text-terra-flame font-bold text-2xl shrink-0 pt-1">
            {project.year}
          </span>
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-3">
          {[project.role, project.type, project.location, project.area].map(
            (chip) => (
              <span
                key={chip}
                className="px-3 py-1 rounded-full border border-forest-ink/20 text-xs font-sans uppercase tracking-wider text-forest-ink/70"
              >
                {chip}
              </span>
            )
          )}
        </div>

        {/* 3 info lines */}
        <ul className="flex flex-col gap-4">
          {project.info.map((line, i) => (
            <li key={i} className="flex gap-4 font-sans text-base text-midnight-ink/80 leading-relaxed">
              <span className="font-display text-dusk-violet text-2xl leading-none mt-0.5 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              {line}
            </li>
          ))}
        </ul>

        {/* Open PDF CTA */}
        <div className="flex items-center gap-3 text-dusk-violet/60 font-sans text-sm mt-2 group-hover:text-dusk-violet transition-colors duration-300">
          <span className="w-8 h-px bg-dusk-violet/40 inline-block group-hover:w-12 transition-all duration-300" />
          Click to open project brief
        </div>
      </div>
    </article>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function GroupProjects() {
  const [activePdf, setActivePdf] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState<string>("");

  const handleOpen = (project: (typeof GROUP_PROJECTS)[number]) => {
    setActiveTitle(project.title);
    setActivePdf(project.pdf);
  };

  return (
    <>
      <section
        id="group-projects"
        className="relative z-40 bg-old-parchment px-8 md:px-16 py-24"
      >
        {/* Section header */}
        <div className="mb-16">
          <p className="font-sans text-forest-ink/50 uppercase tracking-widest text-sm mb-4">
            Collaborative Work
          </p>
          <h2 className="font-display text-[8vw] md:text-[7vw] leading-none text-midnight-ink uppercase">
            Group Projects
          </h2>
        </div>

        {/* 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {GROUP_PROJECTS.map((project) => (
            <GroupCard
              key={project.id}
              project={project}
              onOpen={() => handleOpen(project)}
            />
          ))}
        </div>
      </section>

      {/* Reuse shared PDF Modal */}
      {activePdf && (
        <PdfModal
          pdfUrl={activePdf}
          title={activeTitle}
          onClose={() => setActivePdf(null)}
        />
      )}
    </>
  );
}
