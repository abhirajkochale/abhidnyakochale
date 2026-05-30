"use client";

import React from "react";
import HTMLFlipBook from "react-pageflip";

const FlipBook = HTMLFlipBook as any;

interface PageProps {
  children: React.ReactNode;
  pageNumber?: number;
}

const Page = React.forwardRef<HTMLDivElement, PageProps>(
  ({ children, pageNumber }, ref) => {
    return (
      <div
        ref={ref}
        className="w-full h-full bg-[#E8D5A3] overflow-hidden flex flex-col relative"
        style={{
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.05)",
          borderRight: "1px solid rgba(0,0,0,0.1)",
          borderLeft: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        {/* Subtle page texture gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5 pointer-events-none" />
        
        <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-12 relative z-10 text-center">
          {children}
        </div>

        {pageNumber && (
          <div className="absolute bottom-6 left-0 w-full text-center font-sans text-sm text-forest-ink/60">
            {pageNumber}
          </div>
        )}
      </div>
    );
  }
);
Page.displayName = "Page";

export default function BookPreview() {
  return (
    <div className="w-full flex justify-center items-center py-20 overflow-hidden cursor-grab active:cursor-grabbing">
      {/* We use a wrapper with max-width so the book scales nicely. HTMLFlipBook handles the 3D CSS magic. */}
      <div className="relative shadow-2xl drop-shadow-2xl">
        <FlipBook
          width={350}
          height={500}
          size="stretch"
          minWidth={250}
          maxWidth={450}
          minHeight={400}
          maxHeight={650}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          className="demo-book"
        >
          {/* Cover Page */}
          <Page>
            <div className="w-full h-full bg-[#2D4A3E] absolute inset-0 flex flex-col items-center justify-center border-l-4 border-[#1C1917] shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none" />
              <div className="border border-[#E8D5A3]/30 p-8 w-[80%] h-[80%] flex flex-col items-center justify-center z-10 text-[#E8D5A3]">
                <h2 className="font-display text-4xl uppercase tracking-widest text-center">
                  Traces
                </h2>
                <div className="w-12 h-px bg-[#E8D5A3]/50 my-6" />
                <p className="font-sans text-sm tracking-[0.3em] uppercase">
                  Abhidnya
                </p>
              </div>
            </div>
          </Page>

          {/* Page 1 (Inside Cover / Blank) */}
          <Page pageNumber={1}>
            <div className="w-full h-full flex flex-col items-center justify-center">
              <p className="font-sans text-forest-ink/40 text-sm italic">
                This page intentionally left blank.
              </p>
            </div>
          </Page>

          {/* Page 2 */}
          <Page pageNumber={2}>
            <h3 className="font-display text-2xl text-midnight-ink uppercase mb-6">
              The Concrete Sighs
            </h3>
            <p className="font-sans text-forest-ink text-lg leading-loose italic max-w-[250px]">
              The city breathes<br />
              in concrete sighs,<br />
              a rhythm of steel<br />
              where the horizon dies.<br />
              <br />
              But in the cracks,<br />
              a sudden bloom—<br />
              a quiet protest<br />
              in the shadow's gloom.
            </p>
          </Page>

          {/* Page 3 */}
          <Page pageNumber={3}>
            <h3 className="font-display text-2xl text-midnight-ink uppercase mb-6">
              Parchment Skin
            </h3>
            <p className="font-sans text-forest-ink text-lg leading-loose italic max-w-[250px]">
              We draft our lives<br />
              on parchment skin,<br />
              measuring walls<br />
              where the light breaks in.<br />
              <br />
              Yet every space<br />
              we try to hold,<br />
              eventually returns<br />
              to the dark, the cold.
            </p>
          </Page>

          {/* Page 4 */}
          <Page pageNumber={4}>
            <h3 className="font-display text-2xl text-midnight-ink uppercase mb-6">
              Fragile Monument
            </h3>
            <p className="font-sans text-forest-ink text-lg leading-loose italic max-w-[250px]">
              I traced your name<br />
              in the courtyard dust,<br />
              a fragile monument<br />
              of fading trust.<br />
              <br />
              The rain will come,<br />
              the stones will stay,<br />
              but this little mark<br />
              will wash away.
            </p>
          </Page>

          {/* Page 5 (Back Inside Cover) */}
          <Page pageNumber={5}>
            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
              <div className="w-8 h-8 rounded-full bg-terra-flame opacity-80" />
              <p className="font-sans text-forest-ink/60 text-sm tracking-widest uppercase">
                Studio Arc
              </p>
            </div>
          </Page>

          {/* Back Cover */}
          <Page>
            <div className="w-full h-full bg-[#2D4A3E] absolute inset-0 flex flex-col items-center justify-center border-r-4 border-[#1C1917] shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-l from-black/20 via-transparent to-transparent pointer-events-none" />
              <p className="font-sans text-[#E8D5A3]/70 text-sm tracking-widest uppercase z-10 text-center px-8">
                "Architecture holds space for living. These pages hold space for memory."
              </p>
            </div>
          </Page>
        </FlipBook>
      </div>
    </div>
  );
}
