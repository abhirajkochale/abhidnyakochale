"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import gsap from "gsap";

const BookPreview = dynamic(() => import("@/components/BookPreview"), { ssr: false });
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PoetryRoute() {
  const containerRef = useRef<HTMLDivElement>(null);
  const page5TextRef = useRef<HTMLDivElement>(null);
  const page6Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Scroll-Scrub Blur Graphic for Page 5 text
    gsap.to(page5TextRef.current, {
      y: -150, // moves up
      opacity: 0,
      filter: "blur(20px)",
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Fade in Page 6 content
    gsap.from(page6Ref.current, {
      opacity: 0,
      y: 100,
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: page6Ref.current,
        start: "top 80%",
        end: "top 20%",
        toggleActions: "play none none reverse",
      },
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen w-full bg-old-parchment text-midnight-ink overflow-hidden selection:bg-dusk-violet selection:text-old-parchment relative">
      
      {/* Header */}
      <header className="fixed top-0 w-full px-8 py-6 flex justify-between z-50 text-midnight-ink pointer-events-none">
        <div className="text-xl font-bold font-sans uppercase tracking-widest pointer-events-auto hover-target cursor-none">
          <Link href="/">Abhidnya</Link>
        </div>
        <nav className="flex gap-8 font-sans font-medium pointer-events-auto">
          <Link href="/#explore-work" className="hover-target hover:text-terra-flame transition-colors cursor-none">
            Work
          </Link>
          <Link href="/#contact" className="hover-target hover:text-terra-flame transition-colors cursor-none">
            Contact
          </Link>
        </nav>
      </header>

      {/* Page 5: Intro */}
      <section className="relative h-[100vh] w-full flex flex-col justify-center items-center px-8">
        <div ref={page5TextRef} className="max-w-4xl will-change-transform">
          <h1 className="font-sans text-3xl md:text-5xl lg:text-6xl text-forest-ink leading-tight text-center mb-8 lowercase font-medium">
            these poems are the traces of places, people and versions of myself i wish to preserve
          </h1>
          <p className="text-right font-sans text-2xl md:text-3xl text-terra-flame italic">
            ~ab
          </p>
        </div>
      </section>

      {/* Page 6: Book Details */}
      <section ref={page6Ref} className="relative min-h-[100vh] w-full px-8 md:px-16 py-32 flex items-center justify-center bg-old-parchment z-10">
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          
          {/* Left Column: Book Cover Image */}
          <div className="relative w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-md shadow-2xl">
            <Image 
              src="/book_cover.png" 
              alt="Poetry Book Cover" 
              fill 
              className="object-cover"
              priority
            />
          </div>

          {/* Right Column: About the Book & CTA */}
          <div className="flex flex-col justify-center gap-10">
            <h2 className="font-display text-7xl md:text-9xl text-midnight-ink uppercase leading-none">
              About The <br /> <span className="text-dusk-violet">Book</span>
            </h2>
            
            <p className="font-sans text-xl md:text-2xl text-forest-ink/90 leading-relaxed">
              This collection is a tactile documentation of ephemeral moments. Just as architecture holds space for living, these pages hold space for memory. Each poem is structured as a room—some filled with light, others casting long, profound shadows. Step inside and explore the emotional landscape of the spaces between spaces.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 mt-4">
              <button className="px-8 py-5 bg-terra-flame text-old-parchment font-display text-2xl md:text-3xl uppercase hover-target rounded-full hover:bg-forest-ink transition-colors duration-300 cursor-none shadow-lg">
                Buy from Bookleaf
              </button>
              <button className="px-8 py-5 bg-forest-ink text-old-parchment font-display text-2xl md:text-3xl uppercase hover-target rounded-full hover:bg-terra-flame transition-colors duration-300 cursor-none shadow-lg">
                Buy from Amazon
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Page 7: Interactive Book */}
      <section className="relative w-full px-8 py-24 bg-old-parchment flex justify-center z-10">
        <div className="max-w-5xl w-full flex flex-col items-center">
          <p className="font-sans text-forest-ink/60 uppercase tracking-widest text-sm mb-4">
            Interactive Preview
          </p>
          <h2 className="font-display text-5xl md:text-7xl text-midnight-ink uppercase mb-12 text-center">
            Flip through the pages
          </h2>
          
          <BookPreview />
        </div>
      </section>

    </div>
  );
}
