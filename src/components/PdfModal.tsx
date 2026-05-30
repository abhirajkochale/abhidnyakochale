"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function PdfModal({
  pdfUrl,
  title = "Project Brief",
  onClose,
}: {
  pdfUrl: string;
  title?: string;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: "power2.out" }
    );
    gsap.fromTo(
      panelRef.current,
      { y: 60, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" }
    );
  });

  const handleClose = () => {
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
      onComplete: onClose,
    });
    gsap.to(panelRef.current, {
      y: 40,
      scale: 0.96,
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
    });
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-midnight-ink/80 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        ref={panelRef}
        className="relative w-[90vw] h-[90vh] bg-old-parchment rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-forest-ink/20 shrink-0">
          <span className="font-display text-3xl text-forest-ink uppercase">
            {title}
          </span>
          <button
            onClick={handleClose}
            className="hover-target w-12 h-12 rounded-full border-2 border-midnight-ink flex items-center justify-center text-2xl hover:bg-midnight-ink hover:text-old-parchment transition-colors cursor-none"
          >
            ✕
          </button>
        </div>
        {/* PDF Viewer */}
        <iframe src={pdfUrl} className="flex-1 w-full" title={title} />
        <p className="text-center text-sm text-forest-ink/50 py-3 font-sans">
          Add your PDF to{" "}
          <code className="bg-forest-ink/10 px-1 rounded">
            /public/placeholder.pdf
          </code>{" "}
          to preview here.
        </p>
      </div>
    </div>
  );
}
