"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Dynamically import WorkGrid (client-only, GSAP Flip)
const WorkGrid = dynamic(() => import("@/components/WorkGrid"), { ssr: false });
const GroupProjects = dynamic(() => import("@/components/GroupProjects"), { ssr: false });

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const container = useRef<HTMLDivElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  
  const topTextRef = useRef<HTMLDivElement>(null);
  const bottomTextRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const page2ContentRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    // Master timeline for the scroll-scrub Home → About sequence
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinContainerRef.current,
        start: "top top",
        end: "+=2500",
        pin: true,
        scrub: 1,
      },
    });

    // Fade Page 1 text out
    tl.to([topTextRef.current, bottomTextRef.current], {
      opacity: 0,
      y: -50,
      duration: 1,
      ease: "power2.inOut",
    }, 0);

    // Morph image 16:9 center → 3:4 right
    tl.to(imageWrapperRef.current, {
      left: "75%",
      width: "30vw",
      height: "40vw",
      duration: 2,
      ease: "power2.inOut",
    }, 0);

    // Slide in Page 2 About text
    tl.fromTo(
      page2ContentRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
      1.5
    );
  }, { scope: container });

  const scrollToWork = () => {
    document.getElementById("explore-work")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={container} className="min-h-screen w-full bg-old-parchment text-midnight-ink">
      
      {/* ── Header ── */}
      <header className="fixed top-0 w-full px-8 py-6 flex justify-between z-50 mix-blend-difference text-old-parchment pointer-events-none">
        <div className="text-xl font-bold font-sans uppercase tracking-widest pointer-events-auto hover-target cursor-none">
          Abhidnya
        </div>
        <nav className="flex gap-8 font-sans font-medium pointer-events-auto">
          <a
            href="#explore-work"
            onClick={(e) => { e.preventDefault(); scrollToWork(); }}
            className="hover-target hover:text-terra-flame transition-colors cursor-none"
          >
            Work
          </a>
          <a href="#contact" className="hover-target hover:text-terra-flame transition-colors cursor-none">
            Contact
          </a>
        </nav>
      </header>

      {/* ── Page 1 + 2: Pinned Scroll Sequence ── */}
      <section
        ref={pinContainerRef}
        className="relative h-screen w-full bg-old-parchment overflow-hidden"
      >
        {/* Top text */}
        <div
          ref={topTextRef}
          className="absolute top-[15%] left-1/2 -translate-x-1/2 w-full text-center px-4 z-10"
        >
          <p className="text-2xl md:text-3xl font-sans text-forest-ink">
            I preserve stories in spaces, in words and in memory.
          </p>
        </div>

        {/* Morphing hero image */}
        <div
          ref={imageWrapperRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden z-20 will-change-[left,width,height]"
          style={{ width: "60vw", height: "33.75vw" }}
        >
          <Image
            src="/hero.png"
            alt="Architectural work by Abhidnya"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Bottom hero text */}
        <div
          ref={bottomTextRef}
          className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-full text-center flex flex-col items-center z-10"
        >
          <span className="text-2xl md:text-3xl font-sans text-terra-flame mb-2">
            Hi I am
          </span>
          <h1 className="text-[12vw] leading-[0.8] font-display text-dusk-violet uppercase mix-blend-multiply">
            Abhidnya
          </h1>
        </div>

        {/* Page 2 About text (revealed during scrub) */}
        <div
          ref={page2ContentRef}
          className="absolute left-[6%] top-1/2 -translate-y-1/2 w-[90vw] md:w-[48vw] flex flex-col gap-10 z-30 opacity-0 pointer-events-none"
        >
          <p className="text-2xl md:text-3xl lg:text-4xl font-sans text-forest-ink leading-snug pointer-events-auto">
            I am an architect who builds spaces with meanings, a poet who writes
            with heart, a traveller who reads cities &amp; someone who finds
            entire world in the in-between moments!{" "}
            <em className="not-italic text-terra-flame">
              This is my work and thinking behind it.
            </em>
          </p>
          <div className="flex flex-col sm:flex-row gap-5 pointer-events-auto">
            <button
              onClick={scrollToWork}
              className="px-8 py-5 bg-terra-flame text-old-parchment font-display text-2xl uppercase hover-target rounded-full hover:bg-forest-ink transition-colors duration-300 cursor-none"
            >
              1. Explore work
            </button>
            <Link
              href="/poetry"
              className="inline-flex items-center justify-center px-8 py-5 border-2 border-dusk-violet text-dusk-violet font-display text-2xl uppercase hover-target rounded-full hover:bg-dusk-violet hover:text-old-parchment transition-colors duration-300 cursor-none"
            >
              2. or read a poem first.
            </Link>
          </div>
        </div>
      </section>

      {/* ── Page 3: Explore Work ── */}
      <section id="explore-work" className="relative z-40 bg-old-parchment">
        <WorkGrid />
      </section>

      {/* ── Page 4: Group Projects ── */}
      <GroupProjects />

      {/* ── Footer ── */}
      <footer
        id="contact"
        className="py-32 bg-forest-ink text-old-parchment text-center flex flex-col items-center justify-center gap-8 relative z-40"
      >
        <h2 className="text-6xl md:text-8xl font-display uppercase">
          Let&apos;s Build
        </h2>
        <a
          href="mailto:hello@studioarc.com"
          className="text-2xl font-sans hover-target hover:text-terra-flame transition-colors cursor-none"
        >
          hello@studioarc.com
        </a>
      </footer>
    </div>
  );
}
