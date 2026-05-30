"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import PdfModal from "@/components/PdfModal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip);
}

// ─── Data ────────────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    id: "antarangan",
    title: "Antarangan",
    year: "2024",
    type: "Residential Interior",
    location: "Pune, India",
    area: "2,400 sq.ft",
    status: "Built",
    image: "/antarangan.png",
    pdf: "/placeholder.pdf",
    excerpt:
      "A home that breathes inward — a labyrinthine sequence of intimate courtyards, layered thresholds and filtered light that collapses the boundary between shelter and garden.",
    extended:
      "Every room opens onto a micro-landscape. Stone, copper and raw plaster hold memory like skin. The central courtyard's skylight tracks the sun, casting a slow-moving sundial of light across polished concrete. This is a house that teaches you to pause.",
    col: "left", // full left column
  },
  {
    id: "campus",
    title: "Breathing Campus",
    year: "2023",
    type: "Institutional",
    location: "Nashik, India",
    area: "18,000 sq.ft",
    status: "Under Construction",
    image: "/campus.png",
    pdf: "/placeholder.pdf",
    excerpt:
      "A university campus where every corridor becomes a garden, every rooftop a meadow — designed for passive ventilation and radical openness.",
    extended:
      "Vegetation is not cosmetic here — it is structural. Green roofs reduce internal temperatures by 6°C. Woven bamboo screens filter light and act as evaporative surfaces. The result is a campus that respires alongside its students.",
    col: "right-top",
  },
  {
    id: "hub",
    title: "Diagnostic Hub",
    year: "2022",
    type: "Healthcare",
    location: "Mumbai, India",
    area: "9,500 sq.ft",
    status: "Built",
    image: "/hub.png",
    pdf: "/placeholder.pdf",
    excerpt:
      "A diagnostic centre stripped of clinical anxiety — curved walls, warm materials and choreographed natural light make illness feel less isolating.",
    extended:
      "Research shows soft geometry reduces patient cortisol. Every corner is radiused, every material chosen for warmth. The waiting zone dissolves into a garden room. Wayfinding is intuitive — you always know which way the light is coming from.",
    col: "right-bottom",
  },
] as const;

type ProjectId = (typeof PROJECTS)[number]["id"];

// ─── Single Project Card ──────────────────────────────────────────────────────

function ProjectCard({
  project,
  isExpanded,
  isHidden,
  onHoverStart,
  onHoverEnd,
  onClick,
}: {
  project: (typeof PROJECTS)[number];
  isExpanded: boolean;
  isHidden: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const extendedRef = useRef<HTMLDivElement>(null);

  // Animate extended text in/out
  useGSAP(() => {
    if (!extendedRef.current) return;
    if (isExpanded) {
      gsap.fromTo(
        extendedRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.25 }
      );
    } else {
      gsap.to(extendedRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.2,
        ease: "power2.in",
      });
    }
  }, [isExpanded]);

  return (
    <div
      ref={cardRef}
      data-flip-id={project.id}
      onClick={isExpanded ? onClick : undefined}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      className={[
        "project-flip-card relative overflow-hidden transition-opacity duration-500 hover-target cursor-none",
        isHidden ? "opacity-0 pointer-events-none" : "opacity-100",
        isExpanded
          ? "fixed inset-0 z-[100] rounded-none"
          : "rounded-2xl",
        project.col === "left" ? "h-full" : "h-full",
      ].join(" ")}
      style={
        isExpanded
          ? { width: "100vw", height: "100vh" }
          : {}
      }
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className={[
            "object-cover transition-transform duration-700",
            isExpanded ? "scale-105" : "scale-100",
          ].join(" ")}
        />
        {/* Gradient overlay */}
        <div
          className={[
            "absolute inset-0 transition-opacity duration-500",
            isExpanded
              ? "bg-gradient-to-t from-midnight-ink/90 via-midnight-ink/40 to-transparent"
              : "bg-gradient-to-t from-midnight-ink/70 via-midnight-ink/20 to-transparent",
          ].join(" ")}
        />
      </div>

      {/* Card Content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 md:p-12">
        {/* Meta row */}
        <div className="flex gap-4 text-old-parchment/60 font-sans text-sm uppercase tracking-widest mb-4">
          <span>{project.type}</span>
          <span>·</span>
          <span>{project.location}</span>
          <span>·</span>
          <span>{project.area}</span>
        </div>

        {/* Title */}
        <h3
          className={[
            "font-display text-old-parchment uppercase transition-all duration-500 leading-none",
            isExpanded ? "text-[8vw]" : "text-5xl md:text-7xl",
          ].join(" ")}
        >
          {project.title}
        </h3>

        {/* Year badge */}
        <div className="flex items-center gap-4 mt-3 mb-6">
          <span className="font-sans text-terra-flame font-bold text-xl">
            {project.year}
          </span>
          <span
            className={[
              "px-3 py-1 rounded-full text-xs font-sans uppercase tracking-wider border",
              project.status === "Built"
                ? "border-old-parchment/40 text-old-parchment/70"
                : "border-terra-flame/60 text-terra-flame",
            ].join(" ")}
          >
            {project.status}
          </span>
        </div>

        {/* Excerpt (always visible) */}
        <p className="font-sans text-old-parchment/80 text-base md:text-lg leading-relaxed max-w-2xl">
          {project.excerpt}
        </p>

        {/* Extended text (only when expanded) */}
        <div ref={extendedRef} className="opacity-0 mt-6">
          <p className="font-sans text-old-parchment/70 text-base md:text-xl leading-relaxed max-w-2xl mb-8">
            {project.extended}
          </p>
          <div className="flex items-center gap-3 text-old-parchment/50 font-sans text-sm">
            <span className="w-8 h-px bg-old-parchment/40 inline-block" />
            Click anywhere to open the project brief PDF
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Work Grid ────────────────────────────────────────────────────────────────

export default function WorkGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<ProjectId | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const isAnimating = useRef(false);

  const handleHoverStart = useCallback(
    (id: ProjectId) => {
      if (isAnimating.current || expandedId === id) return;
      isAnimating.current = true;

      // Capture the current state of all flip cards
      if (!gridRef.current) { isAnimating.current = false; return; }
      const cards = gridRef.current.querySelectorAll(".project-flip-card");
      const state = Flip.getState(cards);

      setExpandedId(id);

      // After React re-renders with new classes, animate from old state
      requestAnimationFrame(() => {
        Flip.from(state, {
          duration: 0.65,
          ease: "power3.inOut",
          absolute: true,
          onComplete: () => {
            isAnimating.current = false;
          },
        });
      });
    },
    [expandedId]
  );

  const handleHoverEnd = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    if (!gridRef.current) { isAnimating.current = false; return; }
    const cards = gridRef.current.querySelectorAll(".project-flip-card");
    const state = Flip.getState(cards);

    setExpandedId(null);

    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.55,
        ease: "power3.inOut",
        absolute: true,
        onComplete: () => {
          isAnimating.current = false;
        },
      });
    });
  }, []);

  const handleCardClick = useCallback(
    (project: (typeof PROJECTS)[number]) => {
      if (expandedId === project.id) {
        setPdfUrl(project.pdf);
      }
    },
    [expandedId]
  );

  return (
    <>
      {/* Section Header */}
      <div className="px-8 md:px-16 pt-24 pb-12">
        <p className="font-sans text-forest-ink/60 uppercase tracking-widest text-sm mb-4">
          Selected Works
        </p>
        <h2 className="font-display text-[10vw] leading-none text-midnight-ink uppercase">
          Explore Work
        </h2>
      </div>

      {/* The Grid */}
      <div
        ref={gridRef}
        className="w-full px-8 md:px-16 pb-24 grid grid-cols-1 md:grid-cols-2 gap-4"
        style={{ minHeight: "100vh" }}
      >
        {/* Left Column: Antarangan (full height) */}
        <div
          className="md:row-span-2 min-h-[80vh]"
          onMouseLeave={expandedId === "antarangan" ? handleHoverEnd : undefined}
        >
          <ProjectCard
            project={PROJECTS[0]}
            isExpanded={expandedId === "antarangan"}
            isHidden={expandedId !== null && expandedId !== "antarangan"}
            onHoverStart={() => handleHoverStart("antarangan")}
            onHoverEnd={handleHoverEnd}
            onClick={() => handleCardClick(PROJECTS[0])}
          />
        </div>

        {/* Right Column: two rows */}
        <div className="flex flex-col gap-4 min-h-[80vh]">
          {/* Right Top: Breathing Campus */}
          <div className="flex-1">
            <ProjectCard
              project={PROJECTS[1]}
              isExpanded={expandedId === "campus"}
              isHidden={expandedId !== null && expandedId !== "campus"}
              onHoverStart={() => handleHoverStart("campus")}
              onHoverEnd={handleHoverEnd}
              onClick={() => handleCardClick(PROJECTS[1])}
            />
          </div>
          {/* Right Bottom: Diagnostic Hub */}
          <div className="flex-1">
            <ProjectCard
              project={PROJECTS[2]}
              isExpanded={expandedId === "hub"}
              isHidden={expandedId !== null && expandedId !== "hub"}
              onHoverStart={() => handleHoverStart("hub")}
              onHoverEnd={handleHoverEnd}
              onClick={() => handleCardClick(PROJECTS[2])}
            />
          </div>
        </div>
      </div>

      {/* PDF Modal */}
      {pdfUrl && (
        <PdfModal pdfUrl={pdfUrl} onClose={() => setPdfUrl(null)} />
      )}
    </>
  );
}
