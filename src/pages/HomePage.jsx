import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ─── Arch Stamp ──────────────────────────────────────────────────────────────*/
function ArchStamp({ style }) {
  return (
    <svg
      width="52" height="52" viewBox="0 0 52 52" fill="none"
      style={{ position: 'absolute', bottom: 6, left: 10, transform: 'rotate(-8deg)', opacity: 0.55, ...style }}
      aria-hidden="true"
    >
      <path d="M26 4 C34 3,46 10,47 22 C48 34,40 47,27 48 C14 49,4 40,4 27 C4 13,15 5,26 4 Z"
        stroke="#8B6040" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M26 6 C35 5,45 13,45 25 C45 36,36 45,25 45 C13 45,6 36,6 25 C6 14,16 7,26 6 Z"
        stroke="#8B6040" strokeWidth="0.6" strokeOpacity="0.4" strokeLinecap="round" fill="none" />
      <circle cx="26" cy="26" r="17" stroke="#8B6040" strokeWidth="0.7" strokeDasharray="2.5 2.5" strokeOpacity="0.5" fill="none" />
      <text x="26" y="29" textAnchor="middle" fontFamily="'Space Mono', monospace"
        fontSize="7" fontWeight="700" letterSpacing="2" fill="#8B6040" fillOpacity="0.85">ARCH.</text>
    </svg>
  )
}

/* ─── Torn Cardstock Button ───────────────────────────────────────────────────*/
function TornButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="hoverable"
      style={{
        background: 'var(--clr-burgundy)',
        color: 'var(--clr-cream)',
        border: 'none',
        padding: '14px 30px 16px',
        fontFamily: "'Caveat', cursive",
        fontWeight: 700,
        fontSize: '1.25rem',
        cursor: 'none',
        position: 'relative',
        clipPath: `polygon(
          0% 3%,  1% 0%,  3% 2%,  5% 0%,  7% 3%,  9% 1%,  11% 0%,
          13% 2%, 15% 0%, 18% 3%, 20% 0%, 22% 2%, 25% 0%,
          100% 0%, 100% 97%, 98% 100%, 96% 97%, 94% 100%, 91% 97%,
          89% 100%, 86% 98%, 83% 100%, 80% 97%, 77% 100%,
          0% 100%
        )`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        letterSpacing: '0.02em',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'rotate(1deg) scale(1.02)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'rotate(0deg) scale(1)'
      }}
    >
      {children}
    </button>
  )
}

/* ─── HomePage ────────────────────────────────────────────────────────────────*/
const NAME = 'Abhidnya'

export default function HomePage() {
  // Scroll scaffolding
  const outerRef      = useRef(null)   // 200vh scrollable wrapper
  const stickyRef     = useRef(null)   // 100vh sticky panel

  // Background
  const bgRef         = useRef(null)

  // Photo morphing system
  const photoWrapRef  = useRef(null)   // absolutely positioned, animates position+size
  const polaroidBgRef = useRef(null)   // white bg layer — fades to 0
  const stampRef      = useRef(null)   // fades out with frame
  const tapeRef       = useRef(null)   // fades out with frame
  const photoInnerRef = useRef(null)   // the actual image inset layer

  // Hero overlay text
  const heroOverlayRef = useRef(null)
  const quoteRef       = useRef(null)
  const hiRef          = useRef(null)
  const nameRef        = useRef(null)
  const hintRef        = useRef(null)

  // About section
  const aboutRef       = useRef(null)
  const photoParallaxRef = useRef(null) // for parallax on page 2

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ── 1. Entry animation on mount ── */
      const entry = gsap.timeline({ defaults: { ease: 'power3.out' } })

      entry.fromTo(bgRef.current,
        { backgroundColor: '#000' },
        { backgroundColor: '#6B1A2A', duration: 0.6, ease: 'none' }, 0)

      entry.fromTo(photoWrapRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.55 }, 0.3)

      entry.fromTo(quoteRef.current,
        { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
        { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 0.65, ease: 'power2.out' }, 0.6)

      entry.fromTo(hiRef.current,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35 }, 1.0)

      entry.fromTo(
        nameRef.current?.querySelectorAll('.hero-letter') ?? [],
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.06 }, 1.1)

      entry.fromTo(hintRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4,
          onComplete: () => hintRef.current?.classList.add('bouncing') }, 1.55)

      /* ── 2. Scroll-scrub morph: Page 1 → Page 2 ── */
      const vw = window.innerWidth
      const vh = window.innerHeight

      // Starting size (polaroid: 280px wide, 3:4 portrait + 44px bottom border)
      const START_W = 304   // 280 + 2*12px padding
      const START_H = Math.round(280 * (4 / 3)) + 56  // portrait + borders

      // Set absolute starting position (center of viewport)
      gsap.set(photoWrapRef.current, {
        position: 'absolute',
        left: (vw - START_W) / 2,
        top:  (vh - START_H) / 2,
        width: START_W,
        height: START_H,
        rotation: -2,
      })

      const scrubTl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      })

      // Background: burgundy → cream
      scrubTl.to(bgRef.current, {
        backgroundColor: '#F0EBE1',
        ease: 'none',
        duration: 1,
      }, 0)

      // Hero text + hint fade out (first 40% of scroll)
      scrubTl.to(heroOverlayRef.current, {
        opacity: 0, y: -40,
        duration: 0.4, ease: 'power2.in',
      }, 0)
      scrubTl.to(hintRef.current, {
        opacity: 0, duration: 0.25,
      }, 0)

      // Photo wrapper: move right + expand to full height
      scrubTl.to(photoWrapRef.current, {
        left: vw * 0.58,
        top: 0,
        width: vw * 0.42,
        height: vh,
        rotation: 0,
        ease: 'power2.inOut',
        duration: 0.9,
      }, 0)

      // Polaroid white frame + stamp + tape fade out
      scrubTl.to([polaroidBgRef.current, stampRef.current, tapeRef.current], {
        opacity: 0,
        duration: 0.3,
        ease: 'power1.in',
      }, 0)

      // Photo inner: shrink inset to 0 (remove polaroid padding)
      scrubTl.to(photoInnerRef.current, {
        top: 0, left: 0, right: 0, bottom: 0,
        duration: 0.4, ease: 'power1.inOut',
      }, 0)

      // About content fade in (from 50% of scroll onwards)
      scrubTl.fromTo(aboutRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' },
        0.45)

      /* ── 3. Parallax on the photo when reading Page 2 ── */
      ScrollTrigger.create({
        trigger: outerRef.current,
        start: 'center center',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          if (photoWrapRef.current) {
            gsap.set(photoWrapRef.current, {
              y: self.progress * -80,
            })
          }
        },
      })

    }, outerRef)

    return () => ctx.revert()
  }, [])

  const scrollToWork = () => {
    document.querySelector('#work-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    /* Outer 200vh scroll container */
    <div ref={outerRef} style={{ height: '200vh', position: 'relative' }}>

      {/* ── Sticky 100vh viewport panel ── */}
      <div
        ref={stickyRef}
        className="hero-grain"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Background (GSAP animates from black → burgundy → cream) */}
        <div
          ref={bgRef}
          style={{
            position: 'absolute', inset: 0,
            backgroundColor: '#000',
            zIndex: 0,
          }}
        />

        {/* ══ PHOTO MORPH ELEMENT ══
            Absolutely positioned, GSAP moves this from center → right edge.
            Structure: white bg layer + inset image layer */}
        <div
          ref={photoWrapRef}
          style={{
            position: 'absolute',
            overflow: 'hidden',
            zIndex: 3,
            willChange: 'transform, left, top, width, height',
          }}
        >
          {/* White polaroid background (fades out during scroll) */}
          <div
            ref={polaroidBgRef}
            style={{
              position: 'absolute', inset: 0,
              background: '#fff',
              boxShadow: '3px 4px 0 rgba(80,30,10,0.25), 8px 12px 0 rgba(80,30,10,0.12), 14px 22px 40px rgba(28,10,9,0.45)',
              zIndex: 1,
            }}
          />

          {/* Stamp (on the white border area) */}
          <div ref={stampRef} style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}>
            <ArchStamp />
          </div>

          {/* Tape strip */}
          <div
            ref={tapeRef}
            style={{
              position: 'absolute',
              top: -10, left: '50%',
              transform: 'translateX(-50%) rotate(-1.2deg)',
              width: 72, height: 20,
              background: 'rgba(201,185,154,0.5)',
              borderTop: '1px solid rgba(201,185,154,0.2)',
              borderBottom: '1px solid rgba(201,185,154,0.2)',
              backdropFilter: 'blur(1px)',
              zIndex: 4,
            }}
          />

          {/* Actual photo — inset layer that removes polaroid padding on scroll */}
          <div
            ref={photoInnerRef}
            style={{
              position: 'absolute',
              top: 12, left: 12, right: 12, bottom: 44,
              overflow: 'hidden',
              zIndex: 2,
            }}
          >
            <img
              src="/Abhidnya main.jpeg"
              alt="Abhidnya Kochale"
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
                objectPosition: 'top center',
                display: 'block',
              }}
            />
          </div>
        </div>

        {/* ══ HERO OVERLAY TEXT (fades out on scroll) ══ */}
        <div
          ref={heroOverlayRef}
          style={{
            position: 'absolute', inset: 0,
            zIndex: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          {/* Quote — appears 60px above where the polaroid center will be */}
          <p
            ref={quoteRef}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic', fontWeight: 300,
              fontSize: '1.25rem',
              color: 'var(--clr-cream)',
              letterSpacing: '0.08em',
              textAlign: 'center',
              maxWidth: 360,
              lineHeight: 1.55,
              marginBottom: 60,
              opacity: 0,
            }}
          >
            I preserve stories in spaces,<br />in words and in memory.
          </p>

          {/* Spacer = polaroid height so text sits below it */}
          <div style={{ height: Math.round(280 * (4 / 3)) + 56 }} />

          {/* Hi I am */}
          <p
            ref={hiRef}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.68rem',
              color: 'var(--clr-sand)',
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              textAlign: 'center',
              marginTop: 28,
              opacity: 0,
            }}
          >
            Hi I am
          </p>

          {/* Abhidnya — letter stagger */}
          <div
            ref={nameRef}
            style={{
              fontFamily: "'Caveat', cursive",
              fontWeight: 700,
              fontSize: '6rem',
              color: 'var(--clr-cream)',
              lineHeight: 1,
              letterSpacing: '-0.01em',
              marginTop: 4,
            }}
            aria-label="Abhidnya"
          >
            {NAME.split('').map((ch, i) => (
              <span key={i} className="hero-letter" style={{ opacity: 0 }}>
                {ch}
              </span>
            ))}
          </div>
        </div>

        {/* ══ PAGE 2: ABOUT CONTENT (left 55%, fades in on scroll) ══ */}
        <div
          ref={aboutRef}
          style={{
            position: 'absolute',
            left: 0, top: 0,
            width: '58%',
            height: '100%',
            zIndex: 4,
            opacity: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '5vw 4vw 5vw 6vw',
          }}
        >
          {/* Label */}
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.625rem',
            color: 'var(--clr-sand)',
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            marginBottom: '2rem',
          }}>
            about
          </p>

          {/* Main paragraph with Caveat personality words */}
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.9375rem',
            color: 'var(--clr-ink)',
            lineHeight: 2.2,
            maxWidth: '52ch',
          }}>
            I am an{' '}
            <strong style={{ fontFamily: "'Caveat', cursive", fontWeight: 700, fontSize: '1.35rem', color: 'var(--clr-burgundy)', fontStyle: 'normal', lineHeight: 1 }}>
              architect
            </strong>
            {' '}who builds spaces with meanings, a{' '}
            <strong style={{ fontFamily: "'Caveat', cursive", fontWeight: 700, fontSize: '1.35rem', color: 'var(--clr-burgundy)', fontStyle: 'normal', lineHeight: 1 }}>
              poet
            </strong>
            {' '}who writes with heart, a{' '}
            <strong style={{ fontFamily: "'Caveat', cursive", fontWeight: 700, fontSize: '1.35rem', color: 'var(--clr-burgundy)', fontStyle: 'normal', lineHeight: 1 }}>
              traveller
            </strong>
            {' '}who reads cities &amp; someone who finds entire world in the in-between moments!
            {' '}<em style={{ fontStyle: 'italic' }}>This is my work and thinking behind it.</em>
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1.25rem', marginTop: '2.5rem' }}>

            {/* Torn cardstock button */}
            <TornButton onClick={scrollToWork}>
              Explore Work →
            </TornButton>

            {/* Wavy poem link */}
            <Link
              to="/poems"
              className="hoverable"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: '1.0625rem',
                color: 'var(--clr-ink)',
                textDecoration: 'underline wavy var(--clr-burgundy)',
                textUnderlineOffset: '5px',
                textDecorationThickness: '1.5px',
              }}
            >
              or read a poem first
            </Link>
          </div>
        </div>

        {/* Scroll hint (bottom center, hero only) */}
        <button
          ref={hintRef}
          onClick={() => window.scrollTo({ top: window.innerHeight * 0.5, behavior: 'smooth' })}
          className="scroll-hint hoverable"
          style={{
            position: 'absolute',
            bottom: 32, left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 5,
            background: 'none', border: 'none',
            padding: '8px 16px',
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.625rem',
            color: 'var(--clr-sand)',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            opacity: 0,
          }}
        >
          scroll or click →
        </button>

      </div>{/* end sticky */}
    </div>/* end outer */
  )
}
