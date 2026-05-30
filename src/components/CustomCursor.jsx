import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'

export default function CustomCursor() {
  const circleRef = useRef(null)
  const dotRef    = useRef(null)
  const labelRef  = useRef(null)
  const location  = useLocation()

  const mouse  = useRef({ x: -200, y: -200 })
  const pos    = useRef({ x: -200, y: -200 })
  const hovering = useRef(false)
  const rafId  = useRef(null)

  // Reset hover state on route change
  useEffect(() => {
    if (hovering.current) {
      hovering.current = false
      gsap.to(circleRef.current, { opacity: 1, scale: 1,   duration: 0.25 })
      gsap.to(dotRef.current,    { opacity: 0, scale: 0.2, duration: 0.2 })
      gsap.to(labelRef.current,  { opacity: 0, x: 8,       duration: 0.18 })
    }
  }, [location.pathname])

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
        // Hide the SVG circle, show filled dot + label
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
    const LERP = 0.12
    const loop = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * LERP
      pos.current.y += (mouse.current.y - pos.current.y) * LERP

      const x = pos.current.x
      const y = pos.current.y

      if (circleRef.current) {
        gsap.set(circleRef.current, { x: x - 14, y: y - 14 })
      }
      if (dotRef.current) {
        gsap.set(dotRef.current, { x: x - 4, y: y - 4 })
      }
      if (labelRef.current) {
        gsap.set(labelRef.current, { x: x + 10, y: y - 8 }) // Adjusted y so it aligns next to dot
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
      <svg
        ref={circleRef}
        width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          pointerEvents: 'none',
          zIndex: 99999,
          mixBlendMode: 'difference',
          willChange: 'transform',
        }}
      >
        <path d="M14 3.5C8.2 3.2 3.2 8.0 3.5 14C3.8 19.8 8.5 24.5 14.2 24.5C20.0 24.8 24.8 20.2 24.5 14.2C24.2 8.5 19.8 3.8 14 3.5Z" 
              stroke="#F0EBE1" 
              strokeWidth="1.5" 
              strokeLinecap="round"
              fill="none"
              style={{ filter: 'url(#roughen)' }}
        />
        <defs>
          <filter id="roughen">
            <feTurbulence type="fractalNoise" baseFrequency="0.065" numOctaves="2" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
      </svg>

      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 8, height: 8,
          borderRadius: '50%',
          background: '#F0EBE1',
          pointerEvents: 'none',
          zIndex: 99999,
          mixBlendMode: 'difference',
          opacity: 0,
          willChange: 'transform',
        }}
      />

      <div
        ref={labelRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          fontFamily: "'Space Mono', monospace",
          fontSize: '9px',
          color: '#F0EBE1',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 99999,
          mixBlendMode: 'difference',
          willChange: 'transform',
          whiteSpace: 'nowrap',
        }}
      >
        click
      </div>
    </>
  )
}
