import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/*
  CustomCursor
  ────────────
  • Default state: rough hand-drawn SVG circle (imperfect, wobbly path)
    in --clr-cream, mix-blend-mode: difference
  • Lerp lag: 0.08 applied via requestAnimationFrame
  • Hover state (.hoverable / a / button):
      - circle shrinks and fills as a solid dot
      - "click" label appears in Caveat next to it
*/

export default function CustomCursor() {
  const circleRef = useRef(null)
  const dotRef    = useRef(null)
  const labelRef  = useRef(null)

  const mouse  = useRef({ x: -200, y: -200 })
  const pos    = useRef({ x: -200, y: -200 })
  const hovering = useRef(false)
  const rafId  = useRef(null)

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    const isHoverable = (el) =>
      el && el.closest('a, button, [role="button"], [data-hoverable="true"]')

    const onOver = (e) => {
      if (isHoverable(e.target) && !hovering.current) {
        hovering.current = true
        // Hide the wobbly circle, show filled dot + label
        gsap.to(circleRef.current, { opacity: 0, scale: 0.4, duration: 0.2 })
        gsap.to(dotRef.current,    { opacity: 1, scale: 1,   duration: 0.2 })
        gsap.to(labelRef.current,  { opacity: 1, x: 18,      duration: 0.25, ease: 'power2.out' })
      }
    }

    const onOut = (e) => {
      const rel = e.relatedTarget
      if (hovering.current && !isHoverable(rel)) {
        hovering.current = false
        gsap.to(circleRef.current, { opacity: 1, scale: 1,   duration: 0.25 })
        gsap.to(dotRef.current,    { opacity: 0, scale: 0.2, duration: 0.2 })
        gsap.to(labelRef.current,  { opacity: 0, x: 8,       duration: 0.18 })
      }
    }

    // Lerp loop
    const LERP = 0.08
    const loop = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * LERP
      pos.current.y += (mouse.current.y - pos.current.y) * LERP

      const x = pos.current.x
      const y = pos.current.y

      if (circleRef.current) {
        circleRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate(${x}px, ${y}px) translate(10px, -50%)`
      }

      rafId.current = requestAnimationFrame(loop)
    }
    rafId.current = requestAnimationFrame(loop)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    window.addEventListener('mouseout',  onOut)

    return () => {
      cancelAnimationFrame(rafId.current)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mouseout',  onOut)
    }
  }, [])

  return (
    <>
      {/* ── Wobbly hand-drawn circle ── */}
      <svg
        ref={circleRef}
        width="44" height="44"
        viewBox="0 0 44 44"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'difference',
          willChange: 'transform',
        }}
      >
        {/*
          Imperfect closed path — mimics a quick pen scribble around a point.
          The control points are deliberately asymmetric so the circle
          looks hand-drawn rather than geometrically perfect.
        */}
        <path
          d="M22 6
             C28 4, 38 8, 38 16
             C39 23, 35 34, 27 37
             C19 40, 7 36, 5 27
             C3 18, 8 6, 16 5
             C18 4.5, 20 5.8, 22 6 Z"
          fill="none"
          stroke="#F0EBE1"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Second slight offset stroke for extra hand-drawn texture */}
        <path
          d="M22 7
             C29 5.5, 37 10, 37.5 18
             C38 25, 33 36, 25 38
             C17 40.5, 6 35, 5.5 26
             C5 17, 10 7, 18 6
             C19.5 5.5, 21 6.5, 22 7 Z"
          fill="none"
          stroke="#F0EBE1"
          strokeWidth="0.5"
          strokeOpacity="0.35"
          strokeLinecap="round"
        />
      </svg>

      {/* ── Filled dot (hover state) ── */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 10, height: 10,
          borderRadius: '50%',
          background: '#F0EBE1',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'difference',
          opacity: 0,
          willChange: 'transform',
        }}
      />

      {/* ── "click" label (hover state) ── */}
      <div
        ref={labelRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          fontFamily: "'Caveat', cursive",
          fontSize: '1rem',
          color: '#F0EBE1',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'difference',
          opacity: 0,
          willChange: 'transform',
          whiteSpace: 'nowrap',
        }}
      >
        click
      </div>
    </>
  )
}
