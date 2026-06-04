import { useRef, useEffect, useState } from 'react'
import { useMagnetic } from '../hooks/useMagnetic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const NAME = 'Abhidnya'

/*
  DESIGN:
  ─────────────────────────────────────────────────────────────────
  Two full-viewport "pages" stacked vertically inside one scrollable
  container.  A single <img> element stays in the DOM the whole time.

  PAGE 1  (hero)
    • burgundy background
    • centered layout, flex-column
    • quote above image
    • image: landscape crop, centered
    • "Hi I am" + "Abhidnya" below image

  PAGE 2  (about) — revealed by scrolling or clicking
    • cream background
    • two-column layout
    • LEFT col: about text + CTA buttons
    • RIGHT col: same image, now portrait crop, right-aligned
    • Image moves via GSAP from its page-1 position to page-2 position

  HOW THE IMAGE MOVES:
    We DON'T reparent the DOM node. Instead:
    - One <img> sits inside a <div id="img-stage"> that is
      position:fixed over the whole viewport.
    - On page 1 it is centered and landscape.
    - On scroll/click GSAP tweens it to a portrait frame on the right.
    - The actual layout columns use invisible placeholder divs the same
      size as the image so the text lays out correctly.
  ─────────────────────────────────────────────────────────────────
*/

export default function HomePage() {
  const wrapperRef = useRef(null)   // scrollable wrapper
  const imgStageRef = useRef(null)   // fixed image stage
  const imgBoxRef = useRef(null)   // the animating box inside stage
  const quoteRef = useRef(null)
  const labelRef = useRef(null)
  const nameWrapRef = useRef(null)
  const aboutTextRef = useRef(null)
  const poemLinkRef = useRef(null)
  const exploreRef = useRef(null)
  const scrollHintRef = useRef(null)

  const [page, setPage] = useState(1)   // 1 = hero, 2 = about
  const pageRef = useRef(1)           // mirror for use inside event listeners
  const animating = useRef(false)

  useMagnetic(poemLinkRef, 0.2)

  // ── page-1 entrance ────────────────────────────────────────────
  useEffect(() => {
    gsap.set(quoteRef.current, { opacity: 1 })
    gsap.set('.quote-word', { opacity: 0, y: 10 })
    gsap.set(labelRef.current, { opacity: 0, y: 12 })
    gsap.set('.hero-letter', { opacity: 0, y: 44 })
    gsap.set(scrollHintRef.current, { opacity: 0 })
    gsap.set(aboutTextRef.current, { opacity: 0, x: -28 })

    const tl = gsap.timeline({ delay: 0.2 })
    tl.to('.quote-word', { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power2.out' })
      .to(labelRef.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.2')
      .to('.hero-letter', { opacity: 1, y: 0, duration: 0.5, stagger: 0.055, ease: 'power3.out' }, '-=0.15')
      .to(scrollHintRef.current, { opacity: 1, duration: 0.6 }, '-=0.1')
  }, [])

  // ── transition to page 2 ───────────────────────────────────────
  const goToPage2 = () => {
    if (pageRef.current === 2 || animating.current) return
    animating.current = true
    pageRef.current = 2
    setPage(2)

    const vw = window.innerWidth
    const vh = window.innerHeight

    // portrait target: right side, vertically centred
    // right edge at ~95vw, width ~36vw, height = width * (4/3)
    const portraitW = Math.round(vw * 0.36)
    const portraitH = Math.round(portraitW * (4 / 3))
    const targetLeft = Math.round(vw * 0.57)
    const targetTop = Math.round((vh - portraitH) / 2)

    // fade out page-1 text elements
    gsap.to([quoteRef.current, labelRef.current, nameWrapRef.current, scrollHintRef.current], {
      opacity: 0, y: -20, duration: 0.45, ease: 'power2.in', stagger: 0.06
    })

    // background colour
    gsap.to(wrapperRef.current, {
      backgroundColor: '#EDE0C8', duration: 0.9, delay: 0.15, ease: 'power2.inOut'
    })

    // image moves to portrait on the right
    gsap.to(imgBoxRef.current, {
      left: targetLeft,
      top: targetTop,
      width: portraitW,
      height: portraitH,
      duration: 1.0,
      delay: 0.1,
      ease: 'power3.inOut',
      onComplete: () => {
        animating.current = false;
      }
    })

    // about text slides in from left
    gsap.to(aboutTextRef.current, {
      opacity: 1, x: 0, duration: 0.7, delay: 0.65, ease: 'power2.out'
    })
  }

  // ── transition back to page 1 ──────────────────────────────────
  const goToPage1 = () => {
    if (pageRef.current === 1 || animating.current) return
    animating.current = true
    pageRef.current = 1
    setPage(1)

    const vw = window.innerWidth
    const vh = window.innerHeight

    // landscape hero target: centered
    const landscapeW = Math.min(Math.round(vw * 0.52), 720)
    const landscapeH = Math.round(landscapeW * (9 / 16))
    const targetLeft = Math.round((vw - landscapeW) / 2)
    const targetTop = Math.round((vh - landscapeH) / 2) - 60

    // about text out
    gsap.to(aboutTextRef.current, {
      opacity: 0, x: -28, duration: 0.35, ease: 'power2.in'
    })

    // bg colour back
    gsap.to(wrapperRef.current, {
      backgroundColor: '#6B1A2A', duration: 0.8, delay: 0.1, ease: 'power2.inOut'
    })

    // image back to center landscape
    gsap.to(imgBoxRef.current, {
      left: targetLeft,
      top: targetTop,
      width: landscapeW,
      height: landscapeH,
      duration: 0.95,
      delay: 0.05,
      ease: 'power3.inOut',
      onComplete: () => { animating.current = false }
    })

    // hero text in
    gsap.to([quoteRef.current, labelRef.current, nameWrapRef.current], {
      opacity: 1, y: 0, duration: 0.55, delay: 0.5, ease: 'power2.out', stagger: 0.08
    })
    gsap.to(scrollHintRef.current, { opacity: 1, duration: 0.5, delay: 0.9 })
  }

  // lenis state effects removed completely since ScrollTrigger handles the layout.

  // ── set initial image position on mount ───────────────────────
  useEffect(() => {
    const setInitial = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const w = Math.min(Math.round(vw * 0.52), 720)
      const h = Math.round(w * (9 / 16))
      gsap.set(imgBoxRef.current, {
        left: Math.round((vw - w) / 2),
        top: Math.round((vh - h) / 2) - 60,
        width: w,
        height: h,
      })
    }
    setInitial()
    window.addEventListener('resize', setInitial)
    return () => window.removeEventListener('resize', setInitial)
  }, [])

  // ── scroll listener ───────────────────────────────────────────
  useEffect(() => {
    const el = wrapperRef.current

    ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: '+=100%', // Pin for 100vh of scrolling distance to absorb momentum
      pin: true,
      onUpdate: (self) => {
        if (self.progress > 0.05 && pageRef.current === 1) {
          goToPage2()
        } else if (self.progress <= 0.05 && pageRef.current === 2) {
          goToPage1()
        }
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars.trigger === el) t.kill()
      })
    }
  }, [])

  // ── click anywhere on page 1 ──────────────────────────────────
  const handleClick = () => {
    if (pageRef.current === 1) {
      window.lenis?.scrollTo(window.innerHeight * 0.1, { duration: 1 })
    }
  }

  return (
    <>
      <style>{`
        :root {
          --burgundy : #6B1A2A;
          --cream    : #EDE0C8;
          --ink      : #2C1A10;
          --sand     : #C9B99A;
          --light    : #F0EBE1;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes bob {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(6px); }
        }
      `}</style>

      {/*
        OUTER WRAPPER — 100vh tall, pinned by ScrollTrigger
      */}
      <div
        ref={wrapperRef}
        onClick={handleClick}
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          backgroundColor: '#6B1A2A',
          overflow: 'hidden',
          cursor: page === 1 ? 'default' : 'auto',
        }}
      >

          {/*
        FIXED IMAGE STAGE — sits above everything
        imgBoxRef is absolutely positioned inside it and tweened by GSAP
      */}
          <div
            ref={imgStageRef}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 10,
              pointerEvents: 'none',
              overflow: 'hidden',
            }}
          >
            <div
              ref={imgBoxRef}
              style={{
                position: 'absolute',
                borderRadius: '6px',
                overflow: 'hidden',
                boxShadow: '0 8px 40px rgba(0,0,0,0.28)',
              }}
            >
              <img
                src="/Abhidnya main.jpeg"
                alt="Abhidnya Kochale"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top center',
                  display: 'block',
                }}
              />
            </div>
          </div>

          {/*
        FIXED UI LAYER — quote + name (page 1) and about text (page 2)
        Both live here always; we fade/show the right one
      */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 11,
              pointerEvents: 'none',
            }}
          >

            {/* ── PAGE 1 TEXT ─────────────────────────────────────── */}

            {/* Quote — centered, near top */}
            <p
              ref={quoteRef}
              style={{
                position: 'absolute',
                top: '6%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                textAlign: 'center',
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: 'clamp(15px, 1.6vw, 21px)',
                color: '#F0EBE1',
                letterSpacing: '0.07em',
                padding: '0 24px',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {"I preserve stories in spaces, in words and in memory.".split(' ').map((word, i, arr) => (
                <span key={i} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
                  <span className="quote-word" style={{ display: 'inline-block' }}>{word}</span>
                  {i !== arr.length - 1 ? ' ' : ''}
                </span>
              ))}
            </p>

            {/* "Hi I am" + "Abhidnya" — centered, near bottom */}
            <div
              style={{
                position: 'absolute',
                bottom: '10%',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                pointerEvents: 'none',
              }}
            >
              <p
                ref={labelRef}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: '28px',
                  color: 'var(--clr-sand)',
                  letterSpacing: '0.08em',
                  textAlign: 'center',
                  lineHeight: 1,
                }}
              >
                Hi I am
              </p>
              <div
                ref={nameWrapRef}
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 'clamp(56px, 8vw, 104px)',
                  color: '#F0EBE1',
                  lineHeight: 0.92,
                  display: 'flex',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {NAME.split('').map((l, i) => (
                  <span key={i} className="hero-letter" style={{ display: 'inline-block' }}>{l}</span>
                ))}
              </div>
            </div>

            {/* Scroll / click hint */}
            <p
              ref={scrollHintRef}
              style={{
                position: 'absolute',
                bottom: '5%',
                left: '50%',
                transform: 'translateX(-50%)',
                fontFamily: "'Space Mono', monospace",
                fontSize: '12px',
                color: '#C9B99A',
                letterSpacing: '0.15em',
                animation: 'bob 2s ease-in-out infinite',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              scroll or click ↓
            </p>

            {/* ── PAGE 2 TEXT ─────────────────────────────────────── */}
            <div
              ref={aboutTextRef}
              style={{
                position: 'absolute',
                top: '50%',
                left: '7vw',
                transform: 'translateY(-50%)',
                width: '42vw',
                maxWidth: '480px',
                pointerEvents: page === 2 ? 'auto' : 'none',
              }}
            >
              <p style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '14px',
                color: '#9B7B5B',
                textTransform: 'uppercase',
                letterSpacing: '0.25em',
                marginBottom: '28px',
                opacity: 0.75,
              }}>
                about
              </p>

              <p style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 'clamp(16px, 1.5vw, 20px)',
                color: '#2C1A10',
                lineHeight: 2.1,
              }}>
                I am an{' '}
                <strong style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '1.7rem', color: '#6B1A2A', fontStyle: 'normal', lineHeight: 1 }}>architect</strong>
                {' '}who builds spaces with meanings, a{' '}
                <strong style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '1.7rem', color: '#6B1A2A', fontStyle: 'normal', lineHeight: 1 }}>poet</strong>
                {' '}who writes with heart, a{' '}
                <strong style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '1.7rem', color: '#6B1A2A', fontStyle: 'normal', lineHeight: 1 }}>traveller</strong>
                {' '}who reads cities &amp; someone who finds entire world in the in-between moments!{' '}
                <em style={{ fontStyle: 'italic' }}>This is my work and thinking behind it.</em>
              </p>

              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px', marginTop: '36px' }}>
                {/* Explore Work button */}
                <button
                  ref={exploreRef}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.lenis?.start();
                    window.lenis?.scrollTo('#work');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    pointerEvents: page === 2 ? 'auto' : 'none',
                  }}
                  onMouseEnter={() => gsap.to(exploreRef.current, { scale: 1.04, rotation: 1, duration: 0.22 })}
                  onMouseLeave={() => gsap.to(exploreRef.current, { scale: 1, rotation: 0, duration: 0.22 })}
                >
                  <span style={{
                    display: 'inline-block',
                    background: '#6B1A2A',
                    color: '#F0EBE1',
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: '22px',
                    padding: '13px 28px',
                    clipPath: 'polygon(0% 0%, 97% 2%, 100% 100%, 3% 98%)',
                    letterSpacing: '0.02em',
                  }}>
                    Explore Work →
                  </span>
                </button>

                {/* Poem link */}
                <a
                  href="#poems"
                  ref={poemLinkRef}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    window.lenis?.start();
                    window.lenis?.scrollTo('#poems');
                  }}
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: 'italic',
                    fontWeight: 300,
                    fontSize: '1.05rem',
                    color: '#2C1A10',
                    textDecoration: 'underline wavy #6B1A2A',
                    textUnderlineOffset: '5px',
                    textDecorationThickness: '1.5px',
                    pointerEvents: page === 2 ? 'auto' : 'none',
                    cursor: 'none'
                  }}
                >
                  or read a poem first
                </a>
              </div>
            </div>

            {/* Back arrow on page 2 */}
            {page === 2 && (
              <button
                onClick={(e) => { e.stopPropagation(); goToPage1() }}
                style={{
                  position: 'absolute',
                  top: '36px',
                  left: '7vw',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '11px',
                  color: '#9B7B5B',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  pointerEvents: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                ← back
              </button>
            )}
          </div>
        </div>
      </>
  )
}
