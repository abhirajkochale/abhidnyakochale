import { useRef, useEffect, useState, useMemo } from 'react'
import { useMagnetic } from '../hooks/useMagnetic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Perfect Transparent Doodles (Aligned) ─────────────────────────────────

const ALIGNED_DOODLES = [
  // LEFT SIDE (5 items)
  { id: 'lamp', src: '/doodles/lamp.png', left: '15%', top: '10%', size: 100, rotation: -5 },
  { id: 'building', src: '/doodles/building.png', left: '18%', top: '30%', size: 180, rotation: 0 },
  { id: 'scroll', src: '/doodles/scroll.png', left: '14%', top: '50%', size: 140, rotation: 10 },
  { id: 'triangle', src: '/doodles/triangle.png', left: '12%', top: '70%', size: 120, rotation: -5 },
  { id: 'crane', src: '/doodles/crane.png', left: '16%', top: '90%', size: 130, rotation: -2 },
  
  // RIGHT SIDE (5 items)
  { id: 'tube', src: '/doodles/tube.png', left: '85%', top: '10%', size: 110, rotation: 8 },
  { id: 'dance', src: '/doodles/dance_feet.png', left: '82%', top: '30%', size: 180, rotation: -8 },
  { id: 'laptop', src: '/doodles/laptop.png', left: '88%', top: '50%', size: 160, rotation: -5 },
  { id: 'map', src: '/doodles/map.png', left: '84%', top: '70%', size: 150, rotation: 10 },
  { id: 'tape', src: '/doodles/tape.png', left: '85%', top: '90%', size: 100, rotation: 12 }
];

const CrowdedDoodles = ({ page }) => {
  const isVisible = page === 1;
  const opacity = isVisible ? 0.9 : 0; 

  return (
    <div style={{
      position: 'absolute', inset: 0,
      pointerEvents: 'none',
      opacity: isVisible ? 0.9 : 0,
      transition: 'opacity 0.5s',
      display: window.innerWidth < 768 ? 'none' : 'block',
    }}>
      {ALIGNED_DOODLES.map(item => (
        <img key={item.id} src={item.src} alt={`Doodle ${item.id}`} style={{
          position: 'absolute',
          left: item.left,
          top: item.top,
          width: item.size,
          height: item.size,
          transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
          objectFit: 'contain'
        }} />
      ))}
    </div>
  )
}

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
  const aboutFadeRef = useRef(null)

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

    let portraitW, portraitH, targetLeft, targetTop
    if (vw >= 768) {
      portraitW = Math.round(vw * 0.36)
      portraitH = Math.round(portraitW * (4 / 3))
      targetLeft = Math.round(vw * 0.57)
      targetTop = Math.round((vh - portraitH) / 2)
    } else {
      portraitW = Math.round(vw * 0.75)
      portraitH = Math.round(portraitW * 1.2)
      targetLeft = Math.round((vw - portraitW) / 2)
      targetTop = Math.round(vh * 0.1)
    }

    // fade out page-1 text elements (autoAlpha also sets visibility:hidden at opacity 0)
    gsap.to([quoteRef.current, labelRef.current, nameWrapRef.current, scrollHintRef.current], {
      autoAlpha: 0, y: -20, duration: 0.45, ease: 'power2.in', stagger: 0.06
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
    gsap.set(aboutTextRef.current, { x: 0 })
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

    let landscapeW, landscapeH, targetLeft, targetTop
    if (vw >= 768) {
      landscapeW = Math.min(Math.round(vw * 0.52), 720)
      landscapeH = Math.round(landscapeW * (9 / 16))
      targetLeft = Math.round((vw - landscapeW) / 2)
      targetTop = Math.round((vh - landscapeH) / 2) - 60
    } else {
      landscapeW = Math.round(vw * 0.85)
      landscapeH = Math.round(landscapeW * (9 / 16))
      targetLeft = Math.round((vw - landscapeW) / 2)
      targetTop = Math.round((vh - landscapeH) / 2) - 30
    }

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
      autoAlpha: 1, y: 0, duration: 0.55, delay: 0.5, ease: 'power2.out', stagger: 0.08
    })
    gsap.to(scrollHintRef.current, { autoAlpha: 1, duration: 0.5, delay: 0.9 })
  }

  // lenis state effects removed completely since ScrollTrigger handles the layout.

  // ── set initial image position on mount ───────────────────────
  useEffect(() => {
    const setInitial = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      let w, h, targetLeft, targetTop
      if (vw >= 768) {
        w = Math.min(Math.round(vw * 0.52), 720)
        h = Math.round(w * (9 / 16))
        targetLeft = Math.round((vw - w) / 2)
        targetTop = Math.round((vh - h) / 2) - 60
      } else {
        w = Math.round(vw * 0.85)
        h = Math.round(w * (9 / 16))
        targetLeft = Math.round((vw - w) / 2)
        targetTop = Math.round((vh - h) / 2) - 30
      }
      gsap.set(imgBoxRef.current, {
        left: targetLeft,
        top: targetTop,
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

    // Pin for 200vh. The first 100vh absorbs the "first scroll",
    // making it require a "second scroll" to move to the next page.
    ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: '+=200%', 
      pin: true,
      onUpdate: (self) => {
        // Trigger page 2 at 5% of the 200vh pin (10vh)
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
            
            {/* FLOATING DECORATIONS */}
            <CrowdedDoodles page={page} />
            {/* Quote — centered, near top */}
            <p
              ref={quoteRef}
              style={{
                position: 'absolute',
                top: '6%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '90vw',
                maxWidth: '480px',
                textAlign: 'center',
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: 'clamp(15px, 1.6vw, 21px)',
                color: '#F0EBE1',
                letterSpacing: '0.07em',
                padding: '0 24px',
                pointerEvents: 'none',
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
                  fontSize: 'clamp(40px, 12vw, 104px)',
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

            {/* ── PAGE 2 TEXT WRAPPER ─────────────────────────────────────── */}
            <div ref={aboutFadeRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', willChange: 'filter, opacity' }}>
              <div
                ref={aboutTextRef}
                data-about-text="true"
                className="absolute w-[90vw] max-md:top-[calc(10vh+90vw+48px)] max-md:left-[5vw] max-md:translate-y-0 md:top-[50%] md:left-[7vw] md:-translate-y-1/2 md:w-[42vw] max-w-[480px]"
                style={{
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
                  <strong style={{ fontWeight: 700, color: '#6B1A2A' }}>architect</strong>
                  {' '}who builds spaces with meanings, a{' '}
                  <strong style={{ fontWeight: 700, color: '#6B1A2A' }}>poet</strong>
                  {' '}who writes with heart, a{' '}
                  <strong style={{ fontWeight: 700, color: '#6B1A2A' }}>traveller</strong>
                  {' '}who reads cities &amp; someone who finds entire world in the in-between moments!{' '}
                  <em style={{ fontStyle: 'italic' }}>This is my work and thinking behind it.</em>
                </p>

                <div className="about-buttons-wrapper flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-[24px] mt-[36px]">
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
        </div>
      </>
  )
}
