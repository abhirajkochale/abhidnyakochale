"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Center the initial state slightly offscreen or center
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    const setX = gsap.quickSetter(cursor, "x", "px");
    const setY = gsap.quickSetter(cursor, "y", "px");

    const onMouseMove = (e: MouseEvent) => {
      setX(e.clientX);
      setY(e.clientY);
    };

    window.addEventListener("mousemove", onMouseMove);

    const onMouseEnter = () => {
      gsap.to(cursor, {
        width: 80,
        height: 80,
        backgroundColor: "transparent",
        borderColor: "#8B4FBF", // dusk-violet
        borderWidth: "2px",
        mixBlendMode: "difference",
        duration: 0.3,
        ease: "power3.out",
      });
    };

    const onMouseLeave = () => {
      gsap.to(cursor, {
        width: 16,
        height: 16,
        backgroundColor: "#C4622D", // terra-flame
        borderColor: "transparent",
        borderWidth: "0px",
        mixBlendMode: "normal",
        duration: 0.3,
        ease: "power3.out",
      });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], .hover-target")) {
        onMouseEnter();
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const relatedTarget = e.relatedTarget as HTMLElement;
      const closest = target.closest("a, button, [role='button'], .hover-target");
      if (closest && (!relatedTarget || !closest.contains(relatedTarget))) {
        onMouseLeave();
      }
    };

    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  });

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-4 h-4 rounded-full bg-terra-flame pointer-events-none z-[9999] transform-gpu"
      style={{ willChange: "transform, width, height" }}
    />
  );
}
