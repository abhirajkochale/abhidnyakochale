import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const wrapperRef = useRef(null)
  const arrowRef   = useRef(null)
  const handRef    = useRef(null)
  const labelRef   = useRef(null)

  const mouse    = useRef({ x: -200, y: -200 })
  const pos      = useRef({ x: -200, y: -200 })
  const hovering = useRef(false)
  const rafId    = useRef(null)

  useEffect(() => {
    if (hovering.current) {
      hovering.current = false
      gsap.to(arrowRef.current, { opacity: 1, scale: 1,   duration: 0.25, overwrite: true })
      gsap.to(handRef.current,  { opacity: 0, scale: 0.8, duration: 0.2,  overwrite: true })
      gsap.to(labelRef.current, { opacity: 0, x: 8,       duration: 0.18, overwrite: true })
    }
  }, [])

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const onMove = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    const isHoverable = (el) =>
      el && el.closest('a, button, [role="button"], [data-hoverable="true"]')

    const onOver = (e) => {
      if (isHoverable(e.target) && !hovering.current) {
        hovering.current = true
        gsap.to(arrowRef.current, { opacity: 0, scale: 0.8, duration: 0.2, overwrite: true })
        gsap.to(handRef.current,  { opacity: 1, scale: 1,   duration: 0.25, ease: 'back.out(1.5)', overwrite: true })
        gsap.to(labelRef.current, { opacity: 1, x: 18,      duration: 0.25, ease: 'power2.out', overwrite: true })
      }
    }

    const onOut = (e) => {
      const rel = e.relatedTarget
      if (hovering.current && !isHoverable(rel)) {
        hovering.current = false
        gsap.to(arrowRef.current, { opacity: 1, scale: 1,   duration: 0.25, overwrite: true })
        gsap.to(handRef.current,  { opacity: 0, scale: 0.8, duration: 0.2,  overwrite: true })
        gsap.to(labelRef.current, { opacity: 0, x: 8,       duration: 0.18, overwrite: true })
      }
    }

    // Lerp loop
    const LERP = 0.25 // slightly faster so the tip feels responsive
    const loop = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * LERP
      pos.current.y += (mouse.current.y - pos.current.y) * LERP

      if (wrapperRef.current) {
        // Offset slightly to perfectly align the visual tip with the native cursor hotspot
        gsap.set(wrapperRef.current, { x: pos.current.x, y: pos.current.y })
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

  if (!window.matchMedia('(pointer: fine)').matches) return null;

  return (
    <>
      <style>{`
        @media (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
      <div
        ref={wrapperRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
        }}
      >
        {/* CUSTOM ARROW */}
        <div ref={arrowRef} style={{ position: 'absolute', top: 0, left: 0, transformOrigin: '2px 2px' }}>
          <svg width="28" height="28" viewBox="-2 -2 28 28" style={{ overflow: 'visible' }}>
            <path 
              d="M 0 0 L 19 7 L 10 10 L 7 19 L 0 0 Z" 
              fill="#6B1A2A" stroke="#F0EBE1" strokeWidth="1.5" strokeLinejoin="round"
            />
            {/* Embossed inner star */}
            <path 
              d="M7 5C7 6.5 7.5 7 9 7C7.5 7 7 7.5 7 9C7 7.5 6.5 7 5 7C6.5 7 7 6.5 7 5Z" 
              fill="#F0EBE1" 
            />
          </svg>
        </div>

        {/* CUSTOM HAND (Hover state) */}
        <div ref={handRef} style={{ position: 'absolute', top: 0, left: 0, opacity: 0, transform: 'scale(0.8)', transformOrigin: '2px 2px' }}>
          <svg width="32" height="32" viewBox="-2 -2 32 32" style={{ overflow: 'visible' }}>
            {/* Translate to position the index finger tip perfectly at (0,0) */}
            <g transform="translate(-10.6, -2.0)">
              <path 
                d="M7.7,18.1 C7.2,17.4 5.9,15.6 4.9,14.6 C4.1,13.7 3.8,13.3 3.8,12.7 C3.8,11.8 4.6,11.0 5.6,11.0 C6.3,11.0 6.9,11.3 7.8,12.0 L8.4,12.5 L8.4,4.2 C8.4,3.0 9.4,2.0 10.6,2.0 C11.8,2.0 12.8,3.0 12.8,4.2 L12.8,10.6 L13.1,10.6 C13.4,9.6 14.3,8.8 15.4,8.8 C16.4,8.8 17.2,9.4 17.5,10.3 C17.9,9.7 18.7,9.3 19.5,9.3 C20.6,9.3 21.4,10.0 21.7,10.9 C22.2,10.7 22.8,10.6 23.3,10.6 C24.7,10.6 25.8,11.7 25.8,13.1 L25.8,18.0 C25.8,21.5 22.9,24.4 19.4,24.4 L13.2,24.4 C11.5,24.4 10.0,23.5 9.0,22.1 L7.7,18.1 Z" 
                fill="#6B1A2A" stroke="#F0EBE1" strokeWidth="1.5" strokeLinejoin="round"
              />
              {/* Embossed inner star */}
              <path 
                d="M15 13C15 14.5 15.5 15 17 15C15.5 15 15 15.5 15 17C15 15.5 14.5 15 13 15C14.5 15 15 14.5 15 13Z" 
                fill="#F0EBE1" 
              />
            </g>
          </svg>
        </div>

        <div
          ref={labelRef}
          style={{
            position: 'absolute',
            top: 20, left: 16,
            fontFamily: "'Space Mono', monospace",
            fontSize: '10px',
            color: '#2C1A10',
            backgroundColor: '#F0EBE1',
            padding: '2px 6px',
            borderRadius: '12px',
            opacity: 0,
            whiteSpace: 'nowrap',
          }}
        >
          click
        </div>
      </div>
    </>
  )
}
