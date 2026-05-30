import { useRef, useEffect, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMagnetic } from '../hooks/useMagnetic'

gsap.registerPlugin(ScrollTrigger)

/* ─── Project Data ─────────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    id: 'antarangan',
    name: 'Antarangan',
    year: '2023',
    type: 'Residential Interior',
    location: 'Pune, India',
    area: '2,400 sq.ft',
    shortDesc: ['A contemplative inner court', 'woven from light, memory and', 'reclaimed material heritage.'],
    longDesc: 'Antarangan — meaning "inner space" in Sanskrit — is a residential interior that negotiates between the privacy of the self and the communal breath of a home. Raw concrete meets handwoven textiles; the skylights trace the arc of the afternoon sun across lime-plastered walls.',
    image: '/antarangan.png',
    pdf: '/placeholder.pdf',
  },
  {
    id: 'campus',
    name: 'Breathing Campus',
    year: '2022',
    type: 'Institutional',
    location: 'Nashik, Maharashtra',
    area: '18,000 sq.ft',
    shortDesc: ['A campus that inhales wind', 'and exhales shade — passive', 'design at institutional scale.'],
    longDesc: 'The campus ventilation strategy is derived from the Venturi effect observed in the surrounding ridge topography. Wind corridors are carved through the building mass as public thresholds. Classrooms orient toward the north; verandahs form inhabited sun-shading fins.',
    image: '/campus.png',
    pdf: '/placeholder.pdf',
  },
  {
    id: 'hub',
    name: 'Diagnostic Hub',
    year: '2023',
    type: 'Healthcare Architecture',
    location: 'Pune, India',
    area: '6,200 sq.ft',
    shortDesc: ['Warmth re-engineered into the', 'typically clinical language of', 'diagnostic healthcare space.'],
    longDesc: 'Against the grain of sterile healthcare interiors, the Diagnostic Hub deploys warm terrazzo, arched thresholds and diffused natural light to reduce patient anxiety. Wayfinding is embedded into material transitions — no signage required above 1.2m.',
    image: '/hub.png',
    pdf: '/placeholder.pdf',
  },
]

const GROUP_PROJECTS = [
  {
    id: 'gsen',
    name: 'GSEN',
    year: '2023',
    type: 'GROUP PROJECT',
    shortDesc: 'A community-driven initiative focusing on ecological restoration and sustainable living practices.',
    image: '/gsen_render_1780148902558.png',
    pdf: '/placeholder.pdf',
  },
  {
    id: 'documentation',
    name: 'Documentation',
    year: '2023',
    type: 'GROUP PROJECT',
    shortDesc: 'Comprehensive architectural documentation of historical structures, preserving cultural heritage.',
    image: '/documentation_render_1780148920658.png',
    pdf: '/placeholder.pdf',
  }
]

/* ─── Torn Top SVG ─────────────────────────────────────────────────────────── */
function TornTop() {
  return (
    <svg
      viewBox="0 0 400 14" preserveAspectRatio="none"
      style={{ position: 'absolute', top: -12, left: 0, width: '100%', height: 14, display: 'block', pointerEvents: 'none' }}
      aria-hidden
    >
      <path
        d="M0 14 Q5 2 10 10 Q15 14 20 6 Q25 0 30 9 Q35 14 40 5 Q45 0 50 8 Q55 14 60 5 Q65 0 70 9 Q75 14 80 4 Q85 0 90 9 Q95 14 100 5 Q105 0 110 8 Q115 14 120 4 Q125 0 130 9 Q135 14 140 5 Q145 0 150 8 Q155 14 160 4 Q165 0 170 9 Q175 14 180 4 Q185 0 190 9 Q195 14 200 5 Q205 0 210 9 Q215 14 220 5 Q225 0 230 8 Q235 14 240 5 Q245 0 250 9 Q255 14 260 4 Q265 0 270 8 Q275 14 280 5 Q285 0 290 9 Q295 14 300 4 Q305 0 310 9 Q315 14 320 5 Q325 0 330 9 Q335 14 340 4 Q345 0 350 8 Q355 14 360 5 Q365 0 370 9 Q375 14 380 4 Q385 0 390 8 Q395 14 400 5 L400 14 Z"
        fill="#3D0E18"
      />
    </svg>
  )
}

/* ─── PDF Overlay ──────────────────────────────────────────────────────────── */
function PdfOverlay({ project, onClose }) {
  const ref = useRef(null)
  const closeBtnRef = useRef(null)
  useMagnetic(closeBtnRef, 0.4)

  useEffect(() => {
    gsap.fromTo(ref.current, { y: '100%' }, { y: '0%', duration: 0.4, ease: 'power3.out' })
  }, [])

  const close = () =>
    gsap.to(ref.current, { y: '100%', duration: 0.35, ease: 'power3.in', onComplete: onClose })

  return (
    <div ref={ref} style={{
      position: 'fixed', inset: 0, zIndex: 300,
      display: 'flex', flexDirection: 'column',
      background: '#0a0505', transform: 'translateY(100%)',
    }}>
      <div style={{
        background: 'var(--clr-burgundy)', padding: '0.9rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
      }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '1.5rem', color: 'var(--clr-cream)' }}>
          {project.name}
        </span>
        <button ref={closeBtnRef} onClick={close} data-hoverable="true" style={{
          background: 'none', border: 'none', cursor: 'none',
          fontFamily: "var(--font-display)", fontSize: '1.1rem', color: 'var(--clr-sand)',
        }}>
          ✕ close
        </button>
      </div>
      <iframe src={project.pdf} title={`${project.name} PDF`} style={{ flex: 1, border: 'none' }} />
    </div>
  )
}

/* ─── Project Card ─────────────────────────────────────────────────────────── */
/* ─── Left Column Card (Antarangan) ────────────────────────────────────────── */
function LeftColumnCard({ project, isHovered, anyHovered, onHover, onLeave, elRef, onClick }) {
  const imgRef = useRef(null)

  useEffect(() => {
    if (!imgRef.current) return
    gsap.to(imgRef.current, {
      filter: isHovered
        ? 'sepia(0) saturate(1) hue-rotate(0deg) brightness(1)'
        : 'sepia(1) saturate(4) hue-rotate(295deg) brightness(0.55)',
      duration: isHovered ? 0.5 : 0.4,
    })
  }, [isHovered])

  useEffect(() => {
    if (!elRef?.current) return
    gsap.to(elRef.current, {
      opacity: anyHovered && !isHovered ? 0.1 : 1,
      duration: 0.35,
    })
  }, [anyHovered, isHovered, elRef])

  const handleEnter = () => { if (window.innerWidth > 768) onHover() }
  const handleLeave = () => { if (window.innerWidth > 768) onLeave() }
  const handleClick = () => { if (window.innerWidth <= 768) onClick() }

  return (
    <div
      ref={elRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      data-hoverable="true"
      style={{
        position: 'relative',
        background: 'var(--clr-cream)',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        width: '100%',
        cursor: 'none',
      }}
    >
      {/* Text block */}
      <div style={{ padding: '20px 24px 16px', flexShrink: 0 }}>
        <h3 style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: '2.8rem', color: 'var(--clr-burgundy)',
          lineHeight: 1.05, marginBottom: '0.4rem',
        }}>
          {project.name}
        </h3>
        {project.shortDesc.map((line, i) => (
          <p key={i} style={{
            fontFamily: "'Space Mono', monospace", fontSize: '0.85rem',
            color: 'var(--clr-burgundy)', lineHeight: 1.6, opacity: 0.8,
          }}>
            {line}
          </p>
        ))}

        {/* Extra Info & CTA (visible on hover) */}
        <div style={{
          maxHeight: isHovered ? '200px' : '0px',
          opacity: isHovered ? 1 : 0,
          overflow: 'hidden',
          transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        }}>
          <p style={{
            fontFamily: "'Space Mono', monospace", fontSize: '0.85rem',
            color: 'var(--clr-burgundy)', lineHeight: 1.6, marginTop: '12px', opacity: 0.9,
          }}>
            {project.longDesc}
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            data-hoverable="true"
            style={{
              background: 'none', border: 'none', cursor: 'none', padding: 0,
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: '1.4rem', color: 'var(--clr-burgundy)',
              borderBottom: '1px solid rgba(107, 26, 42, 0.4)',
              paddingBottom: 2, marginTop: '16px', display: 'inline-block',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(107, 26, 42, 1)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(107, 26, 42, 0.4)'}
          >
            View Full Project →
          </button>
        </div>
      </div>

      {/* Image */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
        <img
          ref={imgRef}
          src={project.image}
          alt={project.name}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center top',
            display: 'block',
            filter: 'sepia(1) saturate(4) hue-rotate(295deg) brightness(0.55)',
            transform: isHovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.7s ease',
          }}
        />
      </div>
    </div>
  )
}

/* ─── Right Column Card (Campus, Hub) ── Side-by-side Portrait ── */
function RightColumnCard({ project, isHovered, anyHovered, onHover, onLeave, elRef, onClick, containerStyle }) {
  const imgRef = useRef(null)

  useEffect(() => {
    if (!imgRef.current) return
    gsap.to(imgRef.current, {
      filter: isHovered
        ? 'sepia(0) saturate(1) hue-rotate(0deg) brightness(1)'
        : 'sepia(1) saturate(4) hue-rotate(295deg) brightness(0.55)',
      duration: isHovered ? 0.5 : 0.4,
    })
  }, [isHovered])

  useEffect(() => {
    if (!elRef?.current) return
    gsap.to(elRef.current, {
      opacity: anyHovered && !isHovered ? 0.2 : 1,
      duration: 0.35,
    })
  }, [anyHovered, isHovered, elRef])

  const handleEnter = () => { if (window.innerWidth > 768) onHover() }
  const handleLeave = () => { if (window.innerWidth > 768) onLeave() }
  const handleClick = () => { if (window.innerWidth <= 768) onClick() }

  return (
    <div
      ref={elRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      data-hoverable="true"
      style={{
        position: 'relative',
        background: 'var(--clr-cream)',
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        width: '100%',
        cursor: 'none',
        overflow: 'hidden',
        ...containerStyle,
      }}
    >
      {/* Left Side: Text block */}
      <div style={{ flex: 1, padding: '24px 20px 24px 28px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <h3 style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: '2.4rem', color: 'var(--clr-burgundy)',
          lineHeight: 1.05, marginBottom: '0.4rem', flexShrink: 0
        }}>
          {project.name}
        </h3>
        <div style={{ flexShrink: 0 }}>
          {project.shortDesc.map((line, i) => (
            <p key={i} style={{
              fontFamily: "'Space Mono', monospace", fontSize: '0.8rem',
              color: 'var(--clr-burgundy)', lineHeight: 1.5, opacity: 0.8,
            }}>
              {line}
            </p>
          ))}
        </div>

        {/* Extra Info & CTA (visible on hover) */}
        <div style={{
          maxHeight: isHovered ? '240px' : '0px',
          opacity: isHovered ? 1 : 0,
          overflow: 'hidden',
          transition: 'all 0.8s cubic-bezier(0.25, 1, 0.3, 1)',
          flexShrink: 0
        }}>
          <p style={{
            fontFamily: "'Space Mono', monospace", fontSize: '0.6rem',
            color: 'var(--clr-burgundy)', lineHeight: 1.5, marginTop: '12px', opacity: 0.9,
          }}>
            {project.longDesc}
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            data-hoverable="true"
            style={{
              background: 'none', border: 'none', cursor: 'none', padding: 0,
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: '1.3rem', color: 'var(--clr-burgundy)',
              borderBottom: '1px solid rgba(107, 26, 42, 0.4)',
              paddingBottom: 2, marginTop: '12px', display: 'inline-block',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(107, 26, 42, 1)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(107, 26, 42, 0.4)'}
          >
            View Full Project →
          </button>
        </div>
      </div>

      {/* Right Side: Portrait Image */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <img
          ref={imgRef}
          src={project.image}
          alt={project.name}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: 'sepia(1) saturate(4) hue-rotate(295deg) brightness(0.55)',
            transform: isHovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.7s ease',
          }}
        />
      </div>
    </div>
  )
}

/* ─── Group Project Card ───────────────────────────────────────────────────── */
function GroupProjectCard({ project, onClick }) {
  const cardRef = useRef(null)
  const imgRef = useRef(null)
  const timer = useRef(null)

  const handleMouseEnter = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      gsap.to(cardRef.current, { boxShadow: '0 0 0 2px #C9B99A, 0 0 28px 6px rgba(201,185,154,0.25)', duration: 0.3 })
      gsap.to(imgRef.current, { filter: 'sepia(0) saturate(1)', duration: 0.4, ease: 'power2.out', transform: 'scale(1.02)' })
    }, 120)
  }

  const handleMouseLeave = () => {
    clearTimeout(timer.current)
    gsap.to(cardRef.current, { boxShadow: 'none', duration: 0.3 })
    gsap.to(imgRef.current, { filter: 'sepia(0.6) saturate(0.7)', duration: 0.4, transform: 'scale(1)' })
  }

  return (
    <div
      ref={cardRef}
      onClick={() => onClick(project)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-hoverable="true"
      style={{
        background: 'var(--clr-cream)',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'none',
        overflow: 'hidden', // keep image scale contained
        transition: 'box-shadow 0.3s ease',
      }}
    >
      <h3 style={{
        fontFamily: "var(--font-display)", fontWeight: 700,
        fontSize: '38px', color: 'var(--clr-burgundy)',
        lineHeight: 1.05, padding: '28px 28px 20px', margin: 0,
      }}>
        {project.name}
      </h3>

      <div style={{
        width: '100%',
        height: '260px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <img
          ref={imgRef}
          src={project.image}
          alt={project.name}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: 'sepia(0.6) saturate(0.7)',
            transition: 'transform 0.5s ease',
          }}
        />
      </div>

      <p style={{
        fontFamily: "'Space Mono', monospace", fontSize: '12px',
        color: 'var(--clr-burgundy)', padding: '24px 28px 28px', margin: 0, opacity: 0.8,
      }}>
        {project.shortDesc}
      </p>
    </div>
  )
}

/* ─── WorkPage ─────────────────────────────────────────────────────────────── */
export default function WorkPage() {
  const [hoveredProject, setHoveredProject] = useState(null)
  const [pdfProject, setPdfProject] = useState(null)

  const hoverTimer = useRef(null)

  /* Intro refs */
  const pageRef       = useRef(null)
  const blackRef      = useRef(null)
  const bigLabelRef   = useRef(null)
  const gridRef       = useRef(null)

  /* Per-card wrapper refs */
  const card0 = useRef(null)
  const card1 = useRef(null)
  const card2 = useRef(null)

  /* Group Section Refs */
  const groupLabelRef = useRef(null)
  const scrollTrackRef = useRef(null)  // 200vh scroll generator
  const groupPageRef  = useRef(null)   // Page 2 (Group Work)

  /* ── Entry animation ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(bigLabelRef.current, { scale: 3, opacity: 0 })
      gsap.set([gridRef.current], { opacity: 0, y: 20 })

      const tl = gsap.timeline({ delay: 0.4 })
      tl.to(bigLabelRef.current, { scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' })
      tl.to({}, { duration: 1.0 })
      tl.to(bigLabelRef.current, { opacity: 0, scale: 0.88, duration: 0.4, ease: 'power2.in' })
      tl.to(blackRef.current, { opacity: 0, duration: 0.5 }, '-=0.2')

      tl.to(gridRef.current, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '-=0.1')

      /* ── Page Scrub: Individual → Group Work ── */
      gsap.set(groupPageRef.current, { yPercent: 100 })

      const scrubTl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollTrackRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        }
      })
      // Page 1 exits: scale back + fade out
      scrubTl.to(gridRef.current, {
        scale: 0.94,
        opacity: 0,
        ease: 'power2.inOut',
      }, 0)
      // Page 2 enters: slides up from below
      scrubTl.to(groupPageRef.current, {
        yPercent: 0,
        ease: 'power2.inOut',
      }, 0)
      // Group label fades in slightly after slide starts
      scrubTl.fromTo(groupLabelRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, ease: 'power2.out' },
        0.4
      )

    }, pageRef)
    return () => ctx.revert()
  }, [])

  const handleCardEnter = useCallback((project) => {
    clearTimeout(hoverTimer.current)
    hoverTimer.current = setTimeout(() => {
      setHoveredProject(project)
    }, 120) // Hover intent delay
  }, [])

  const handleCardLeave = useCallback(() => {
    clearTimeout(hoverTimer.current)
    setHoveredProject(null)
  }, [])

  const handleOpenPdf = useCallback(() => {
    if (hoveredProject) {
      setPdfProject(hoveredProject)
    }
  }, [hoveredProject])

  return (
    /* ── 200vh scroll track — generates the physical scroll distance ── */
    <div
      ref={scrollTrackRef}
      style={{ height: '200vh', position: 'relative' }}
    >
      {/* ── 100vh sticky stage — both pages live here ── */}
      <div
        ref={pageRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          background: 'var(--clr-burgundy)',
        }}
      >
        {/* ── Black intro veil ── */}
        <div ref={blackRef} style={{
          position: 'fixed', inset: 0, background: '#000',
          zIndex: 100, pointerEvents: 'none',
        }} />

        {/* ── Big "WORK." (intro only) ── */}
        <div ref={bigLabelRef} style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          zIndex: 999, pointerEvents: 'none',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          overflow: 'hidden',
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: '15vw', color: 'var(--clr-cream)',
          lineHeight: 1, whiteSpace: 'nowrap',
        }}>
          work.
        </div>

        {/* ══════════════════════
            PAGE 1: INDIVIDUAL PROJECTS
        ══════════════════════ */}
        <div
          ref={gridRef}
          style={{
            position: 'absolute', inset: 0,
            zIndex: 5,
            opacity: 0,
            transformOrigin: 'center center',
            padding: '80px 2vw 2vw 2vw',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Section header */}
          <div style={{ marginBottom: '16px', flexShrink: 0 }}>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: 'clamp(48px, 6vw, 70px)', color: 'var(--clr-cream)',
              margin: 0, lineHeight: 1, letterSpacing: '0.02em',
            }}>
              INDIVIDUAL PROJECTS
            </h2>
          </div>

          {/* ── 2-column Static Grid ── */}
          <div className="work-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            gap: '2px',
            width: '100%',
            flex: 1,
            minHeight: 0,
          }}>
            {/* Antarangan — full height left column */}
            <div className="antarangan-card" style={{
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
            }}>
              <LeftColumnCard
                project={PROJECTS[0]}
                isHovered={hoveredProject?.id === 'antarangan'}
                anyHovered={!!hoveredProject}
                onHover={() => handleCardEnter(PROJECTS[0])}
                onLeave={handleCardLeave}
                onClick={() => setPdfProject(PROJECTS[0])}
                elRef={card0}
              />
            </div>

            {/* Right column: two equal cells */}
            <div className="right-column" style={{
              display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden',
              minWidth: 0,
            }}>
              <RightColumnCard
                project={PROJECTS[1]}
                isHovered={hoveredProject?.id === 'campus'}
                anyHovered={!!hoveredProject}
                onHover={() => handleCardEnter(PROJECTS[1])}
                onLeave={handleCardLeave}
                onClick={() => setPdfProject(PROJECTS[1])}
                elRef={card1}
                containerStyle={{ flex: 1 }}
              />
              <RightColumnCard
                project={PROJECTS[2]}
                isHovered={hoveredProject?.id === 'hub'}
                anyHovered={!!hoveredProject}
                onHover={() => handleCardEnter(PROJECTS[2])}
                onLeave={handleCardLeave}
                onClick={() => setPdfProject(PROJECTS[2])}
                elRef={card2}
                containerStyle={{ flex: 1 }}
              />
            </div>
          </div>
        </div>

        {/* ══════════════════════
            PAGE 2: GROUP WORK
        ══════════════════════ */}
        <div
          ref={groupPageRef}
          style={{
            position: 'absolute', inset: 0,
            zIndex: 6,
            background: 'var(--clr-burgundy)',
            padding: '80px 40px 60px 40px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h2 ref={groupLabelRef} style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: 'clamp(48px, 8vw, 80px)', color: 'var(--clr-cream)',
            marginBottom: '3rem', opacity: 0,
          }}>
            GROUP WORK.
          </h2>

          <div className="group-grid" style={{
            display: 'grid',
            gap: 4,
          }}>
            <GroupProjectCard project={GROUP_PROJECTS[0]} onClick={setPdfProject} />
            <GroupProjectCard project={GROUP_PROJECTS[1]} onClick={setPdfProject} />
          </div>
        </div>

      </div>{/* end sticky stage */}

      {/* ── PDF Overlay ── */}
      {pdfProject && (
        <PdfOverlay project={pdfProject} onClose={() => setPdfProject(null)} />
      )}
    </div>
  )
}
