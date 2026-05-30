import { useRef, useEffect, useState, useCallback } from 'react'
import gsap from 'gsap'

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
        <span style={{ fontFamily: "'Caveat', cursive", fontWeight: 700, fontSize: '1.5rem', color: 'var(--clr-cream)' }}>
          {project.name}
        </span>
        <button onClick={close} data-hoverable="true" style={{
          background: 'none', border: 'none', cursor: 'none',
          fontFamily: "'Caveat', cursive", fontSize: '1.1rem', color: 'var(--clr-sand)',
        }}>
          ✕ close
        </button>
      </div>
      <iframe src={project.pdf} title={`${project.name} PDF`} style={{ flex: 1, border: 'none' }} />
    </div>
  )
}

/* ─── Project Card ─────────────────────────────────────────────────────────── */
function ProjectCard({ project, isHovered, anyHovered, onHover, onLeave, elRef }) {
  const imgRef   = useRef(null)
  const badgeRef = useRef(null)

  /* Duotone ↔ full-color */
  useEffect(() => {
    if (!imgRef.current) return
    gsap.to(imgRef.current, {
      filter: isHovered
        ? 'sepia(0) saturate(1) hue-rotate(0deg) brightness(1)'
        : 'sepia(1) saturate(4) hue-rotate(295deg) brightness(0.55)',
      duration: isHovered ? 0.5 : 0.4,
    })
  }, [isHovered])

  /* Dim non-hovered cards */
  useEffect(() => {
    if (!elRef?.current) return
    gsap.to(elRef.current, {
      opacity: anyHovered && !isHovered ? 0.1 : 1,
      duration: 0.35,
    })
  }, [anyHovered, isHovered, elRef])

  /* Badge enter/leave */
  const showBadge = () =>
    gsap.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' })
  const hideBadge = () =>
    gsap.to(badgeRef.current, { opacity: 0, y: 6, duration: 0.2, ease: 'power2.in' })

  const handleEnter = () => { onHover(); showBadge() }
  const handleLeave = () => { onLeave(); hideBadge() }

  return (
    <div
      ref={elRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      data-hoverable="true"
      style={{
        position: 'relative',
        background: 'var(--clr-burgundy-dark)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: 'none',
        /* no overflow hidden — images should be contained by their own wrapper */
      }}
    >
      <TornTop />

      {/* ── Text block ── */}
      <div style={{ padding: '32px 28px 24px', flexShrink: 0 }}>
        <h3 style={{
          fontFamily: "'Caveat', cursive", fontWeight: 700,
          fontSize: '2.375rem', color: 'var(--clr-cream)',
          lineHeight: 1.05, marginBottom: '0.45rem',
        }}>
          {project.name}
        </h3>

        <p style={{
          fontFamily: "'Space Mono', monospace", fontSize: '0.58rem',
          color: 'var(--clr-sand)', letterSpacing: '0.16em',
          textTransform: 'uppercase', marginBottom: '0.8rem', opacity: 0.6,
        }}>
          {project.year} · {project.type} · {project.area}
        </p>

        {project.shortDesc.map((line, i) => (
          <p key={i} style={{
            fontFamily: "'Space Mono', monospace", fontSize: '0.688rem',
            color: 'var(--clr-sand)', lineHeight: 1.75,
          }}>
            {line}
          </p>
        ))}
      </div>

      {/* ── Image — fills remaining height ── */}
      <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        <img
          ref={imgRef}
          src={project.image}
          alt={project.name}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center top',
            display: 'block',
            filter: 'sepia(1) saturate(4) hue-rotate(295deg) brightness(0.55)',
            transform: isHovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.7s ease',
          }}
        />
      </div>

      {/* ── Explore pill badge ── */}
      <div
        ref={badgeRef}
        style={{
          position: 'absolute',
          bottom: 16, right: 16,
          opacity: 0,
          transform: 'translateY(6px)',
          background: 'rgba(240,235,225,0.12)',
          border: '1px solid rgba(240,235,225,0.3)',
          borderRadius: 100,
          padding: '5px 12px',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        <span style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.6rem',
          color: 'var(--clr-cream)',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
        }}>
          explore →
        </span>
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
      gsap.to(imgRef.current, { filter: 'sepia(0) saturate(1)', duration: 0.4, ease: 'power2.out' })
    }, 120)
  }

  const handleMouseLeave = () => {
    clearTimeout(timer.current)
    gsap.to(cardRef.current, { boxShadow: 'none', duration: 0.3 })
    gsap.to(imgRef.current, { filter: 'sepia(0.6) saturate(0.7)', duration: 0.4 })
  }

  return (
    <div
      ref={cardRef}
      onClick={() => onClick(project)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-hoverable="true"
      style={{
        background: 'var(--clr-burgundy-dark)',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'none',
      }}
    >
      <h3 style={{
        fontFamily: "'Caveat', cursive", fontWeight: 700,
        fontSize: '38px', color: 'var(--clr-cream)',
        lineHeight: 1.05, padding: '28px 28px 12px', margin: 0,
      }}>
        {project.name}
      </h3>
      <p style={{
        fontFamily: "'Space Mono', monospace", fontSize: '10px',
        color: 'var(--clr-sand)', textTransform: 'uppercase',
        padding: '0 28px 16px', margin: 0, letterSpacing: '0.1em'
      }}>
        {project.year} · {project.type}
      </p>

      <div style={{ width: '100%', height: '280px', overflow: 'hidden' }}>
        <img
          ref={imgRef}
          src={project.image}
          alt={project.name}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', display: 'block',
            filter: 'sepia(0.6) saturate(0.7)',
          }}
        />
      </div>

      <p style={{
        fontFamily: "'Space Mono', monospace", fontSize: '12px',
        color: 'var(--clr-sand)', padding: '16px 28px 28px', margin: 0,
        lineHeight: 1.6
      }}>
        {project.shortDesc}
      </p>
    </div>
  )
}

/* ─── WorkPage ─────────────────────────────────────────────────────────────── */
export default function WorkPage() {
  const [hoveredProject, setHoveredProject] = useState(null)
  const [isOverlayVisible, setIsOverlayVisible] = useState(false)
  const [pdfProject, setPdfProject] = useState(null)

  const hoverTimer = useRef(null)

  /* Intro refs */
  const pageRef       = useRef(null)
  const blackRef      = useRef(null)
  const bigLabelRef   = useRef(null)
  const smallLabelRef = useRef(null)
  const gridRef       = useRef(null)

  /* Hover overlay refs (fixed, top-level — pointer-events none) */
  const overlayRef  = useRef(null)
  const ovImgRef    = useRef(null)
  const ovTextWrapRef = useRef(null)
  const ovNameRef   = useRef(null)
  const ovMetaRef   = useRef(null)
  const ovDescRef   = useRef(null)
  const ovCtaRef    = useRef(null)

  /* Per-card wrapper refs (for dimming) */
  const card0 = useRef(null)
  const card1 = useRef(null)
  const card2 = useRef(null)

  /* Parallax quickTo */
  const qX = useRef(null)
  const qY = useRef(null)

  /* Group Section Refs */
  const groupLineRef = useRef(null)
  const groupLabelRef = useRef(null)
  const groupEndingRef = useRef(null)

  /* ── Entry animation ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(bigLabelRef.current, { scale: 3, opacity: 0 })
      gsap.set([smallLabelRef.current, gridRef.current], { opacity: 0, y: 20 })

      const tl = gsap.timeline()
      tl.to({}, { duration: 0.3 })
      tl.to(bigLabelRef.current, { scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out' })
      tl.to({}, { duration: 0.5 })
      tl.to(bigLabelRef.current, { opacity: 0, scale: 0.88, duration: 0.28, ease: 'power2.in' })
      tl.to(blackRef.current, { opacity: 0, duration: 0.35 }, '-=0.15')
      tl.to(smallLabelRef.current, { opacity: 1, y: 0, duration: 0.3 }, '-=0.2')
      tl.to(gridRef.current, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '-=0.1')
      
      /* ── Group Section Scroll Triggers ── */
      gsap.fromTo(groupLineRef.current,
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: groupLineRef.current,
            start: 'top 85%',
            end: 'top 60%',
            scrub: true,
          }
        }
      )
      gsap.fromTo(groupLabelRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: groupLineRef.current,
            start: 'top 80%',
          }
        }
      )
      gsap.fromTo(groupEndingRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: groupEndingRef.current,
            start: 'top 95%',
          }
        }
      )
    }, pageRef)
    return () => ctx.revert()
  }, [])

  /* ── Setup parallax quickTo (once, on mount) ── */
  useEffect(() => {
    if (!ovImgRef.current) return
    qX.current = gsap.quickTo(ovImgRef.current, 'x', { duration: 1, ease: 'power3.out' })
    qY.current = gsap.quickTo(ovImgRef.current, 'y', { duration: 1, ease: 'power3.out' })
  }, [])

  /* ── Mouse parallax (only fires when overlay is active) ── */
  useEffect(() => {
    const onMove = (e) => {
      if (!isOverlayVisible) return
      qX.current?.((e.clientX / window.innerWidth  - 0.5) * -25)
      qY.current?.((e.clientY / window.innerHeight - 0.5) * -15)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [isOverlayVisible])

  /* ── Overlay Visibility Animation ── */
  useEffect(() => {
    if (isOverlayVisible) {
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.35, ease: 'power2.out' })
    } else {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.35, ease: 'power2.in' })
      // Reset parallax gently
      gsap.to(ovImgRef.current, { x: 0, y: 0, duration: 0.5 })
    }
  }, [isOverlayVisible])

  /* ── Overlay Content Animation (when hovered project changes) ── */
  useEffect(() => {
    if (!hoveredProject) return

    // Swap content imperatively
    if (ovImgRef.current) {
      ovImgRef.current.src = hoveredProject.image
      gsap.set(ovImgRef.current, { x: 0, y: 0 })
    }
    if (ovNameRef.current) ovNameRef.current.textContent = hoveredProject.name
    if (ovMetaRef.current) ovMetaRef.current.textContent =
      `${hoveredProject.year} · ${hoveredProject.type} · ${hoveredProject.area}`
    if (ovDescRef.current) ovDescRef.current.textContent = hoveredProject.longDesc

    // Animate text sliding in
    gsap.fromTo(
      [ovNameRef.current, ovMetaRef.current, ovDescRef.current, ovCtaRef.current],
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.06, duration: 0.35, ease: 'power2.out' }
    )
  }, [hoveredProject])

  const handleCardEnter = useCallback((project) => {
    clearTimeout(hoverTimer.current)
    hoverTimer.current = setTimeout(() => {
      setHoveredProject(project)
      setIsOverlayVisible(true)
    }, 120) // Hover intent delay
  }, [])

  const handleCardLeave = useCallback(() => {
    clearTimeout(hoverTimer.current)
    setIsOverlayVisible(false)
    setTimeout(() => {
      setHoveredProject(null)
    }, 350)
  }, [])

  const handleOpenPdf = useCallback(() => {
    if (hoveredProject) {
      setPdfProject(hoveredProject)
    }
  }, [hoveredProject])

  return (
    <div
      ref={pageRef}
      style={{
        minHeight: '100vh',
        background: 'var(--clr-burgundy)',
        position: 'relative',
        scrollPaddingTop: 100,
      }}
    >
      {/* ── Black intro veil ── */}
      <div ref={blackRef} style={{
        position: 'fixed', inset: 0, background: '#000',
        zIndex: 100, pointerEvents: 'none',
      }} />

      {/* ── Big "work." (intro only) ── */}
      <div ref={bigLabelRef} style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 101, pointerEvents: 'none',
        fontFamily: "'Caveat', cursive", fontWeight: 700,
        fontSize: '15vw', color: 'var(--clr-cream)',
        lineHeight: 1, whiteSpace: 'nowrap',
      }}>
        work.
      </div>

      {/* ── Small "work." label (top-left, post-intro) ── */}
      <div ref={smallLabelRef} style={{
        position: 'fixed', top: '1.3rem', left: '2rem',
        zIndex: 50, pointerEvents: 'none',
        fontFamily: "'Caveat', cursive", fontWeight: 700,
        fontSize: '1.6rem', color: 'var(--clr-cream)', opacity: 0,
      }}>
        work.
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          HOVER OVERLAY — fixed, top-level, pointerEvents: 'none'
          Left 55%: info panel   Right 45%: blurred project image
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        ref={overlayRef}
        style={{
          position: 'fixed', inset: 0, zIndex: 60,
          opacity: 0, pointerEvents: 'none',
          display: 'grid',
          gridTemplateColumns: '55% 45%',
        }}
      >
        {/* Left: info panel */}
        <div style={{
          background: 'rgba(40,5,15,0.92)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 5vw 0 6vw',
          gap: '1rem',
          pointerEvents: 'none',
        }}>
          <h2 ref={ovNameRef} style={{
            fontFamily: "'Caveat', cursive", fontWeight: 700,
            fontSize: '72px',
            color: 'var(--clr-cream)', lineHeight: 0.95,
            opacity: 0,
          }} />

          <p ref={ovMetaRef} style={{
            fontFamily: "'Space Mono', monospace", fontSize: '11px',
            color: 'var(--clr-sand)', letterSpacing: '0.18em',
            textTransform: 'uppercase', opacity: 0,
          }} />

          <p ref={ovDescRef} style={{
            fontFamily: "'Space Mono', monospace", fontSize: '0.78rem',
            color: 'var(--clr-cream)', lineHeight: 1.9,
            maxWidth: '48ch', opacity: 0,
          }} />

          <div ref={ovCtaRef} style={{ opacity: 0, marginTop: '0.5rem', pointerEvents: 'none' }}>
            <button
              onClick={handleOpenPdf}
              data-hoverable="true"
              style={{
                background: 'none', border: 'none', cursor: 'none', padding: 0,
                fontFamily: "'Caveat', cursive", fontWeight: 700,
                fontSize: '20px', color: 'var(--clr-cream)',
                borderBottom: '2px solid rgba(240,235,225,0.5)',
                paddingBottom: 3,
                transition: 'border-color 0.2s',
                pointerEvents: 'auto', /* ONLY THIS IS CLICKABLE */
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--clr-cream)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(240,235,225,0.5)'}
            >
              View Full Project →
            </button>
          </div>
        </div>

        {/* Right: blurred project image with dark overlay */}
        <div style={{ position: 'relative', overflow: 'hidden', pointerEvents: 'none' }}>
          <img
            ref={ovImgRef}
            src={PROJECTS[0].image}
            alt=""
            style={{
              position: 'absolute', inset: -25,
              width: 'calc(100% + 50px)', height: 'calc(100% + 50px)',
              objectFit: 'cover', objectPosition: 'center',
              filter: 'blur(5px)',
              display: 'block',
              willChange: 'transform',
            }}
          />
          {/* Dark tint */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(40,5,15,0.75)',
          }} />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SCROLLABLE CONTENT
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        ref={gridRef}
        style={{
          position: 'relative', zIndex: 5,
          padding: '0 40px 60px 40px',
          paddingTop: '6rem',
          opacity: 0,
        }}
      >
        {/* Section header + rule */}
        <div style={{ marginBottom: 40 }}>
          <p style={{
            fontFamily: "'Space Mono', monospace", fontSize: '0.58rem',
            color: 'var(--clr-sand)', letterSpacing: '0.25em',
            textTransform: 'uppercase',
            paddingBottom: 20,
          }}>
            Individual Projects — 2022/23
          </p>
          <div style={{
            width: '100%', height: 1,
            background: 'var(--clr-cream)',
            opacity: 0.2,
          }} />
        </div>

        {/* ── 2-column CSS grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 2,
          alignItems: 'stretch',
          /* Height: fills remaining viewport minus header area */
          minHeight: '800px',
        }}>
          {/* Antarangan — spans both rows */}
          <div style={{ gridColumn: '1', gridRow: '1 / 3' }}>
            <ProjectCard
              project={PROJECTS[0]}
              isHovered={isOverlayVisible && hoveredProject?.id === 'antarangan'}
              anyHovered={isOverlayVisible}
              onHover={() => handleCardEnter(PROJECTS[0])}
              onLeave={handleCardLeave}
              elRef={card0}
            />
          </div>

          {/* Breathing Campus — top right */}
          <div style={{ gridColumn: '2', gridRow: '1' }}>
            <ProjectCard
              project={PROJECTS[1]}
              isHovered={isOverlayVisible && hoveredProject?.id === 'campus'}
              anyHovered={isOverlayVisible}
              onHover={() => handleCardEnter(PROJECTS[1])}
              onLeave={handleCardLeave}
              elRef={card1}
            />
          </div>

          {/* Diagnostic Hub — bottom right */}
          <div style={{ gridColumn: '2', gridRow: '2' }}>
            <ProjectCard
              project={PROJECTS[2]}
              isHovered={isOverlayVisible && hoveredProject?.id === 'hub'}
              anyHovered={isOverlayVisible}
              onHover={() => handleCardEnter(PROJECTS[2])}
              onLeave={handleCardLeave}
              elRef={card2}
            />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            GROUP PROJECTS SECTION
        ══════════════════════════════════════════════════════════════════════ */}
        <div style={{ marginTop: '8rem', position: 'relative' }}>
          <svg width="100%" height="2" style={{ display: 'block' }}>
            <line
              ref={groupLineRef}
              x1="0" y1="1" x2="100%" y2="1"
              stroke="var(--clr-cream)" strokeWidth="1" strokeOpacity="0.4"
              strokeDasharray="1" strokeDashoffset="1" pathLength="1"
            />
          </svg>
          <h2 ref={groupLabelRef} style={{
            fontFamily: "'Caveat', cursive", fontWeight: 700,
            fontSize: 'clamp(48px, 8vw, 80px)', color: 'var(--clr-cream)',
            marginTop: '1.5rem', marginBottom: '3rem',
            opacity: 0,
          }}>
            group work.
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
          }}>
            <GroupProjectCard project={GROUP_PROJECTS[0]} onClick={setPdfProject} />
            <GroupProjectCard project={GROUP_PROJECTS[1]} onClick={setPdfProject} />
          </div>

          <p ref={groupEndingRef} style={{
            fontFamily: "'Caveat', cursive", fontStyle: 'italic',
            fontSize: '16px', color: 'var(--clr-sand)',
            textAlign: 'center', marginTop: '6rem', marginBottom: '2rem',
            opacity: 0,
          }}>
            more collaborations coming soon ↓
          </p>
        </div>
      </div>

      {/* ── PDF Overlay ── */}
      {pdfProject && (
        <PdfOverlay project={pdfProject} onClose={() => setPdfProject(null)} />
      )}
    </div>
  )
}
