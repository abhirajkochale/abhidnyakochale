import { useRef, useEffect, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMagnetic } from '../hooks/useMagnetic'

gsap.registerPlugin(ScrollTrigger)

/* ─── Unified Project Data ─────────────────────────────────────────────────── */
const ALL_PROJECTS = [
  {
    id: 'antarangan',
    name: 'Antarangan',
    year: '2023',
    type: 'Residential Interior',
    location: 'Pune, India',
    isGroup: false,
    shortDesc: 'A contemplative inner court woven from light, memory and reclaimed material heritage.',
    image: '/antarangan.png',
    pdf: '/placeholder.pdf', // Replace with real PDF
  },
  {
    id: 'campus',
    name: 'Breathing Campus',
    year: '2022',
    type: 'Institutional',
    location: 'Nashik, Maharashtra',
    isGroup: false,
    shortDesc: 'A campus that inhales wind and exhales shade — passive design at institutional scale.',
    image: '/campus.png',
    pdf: '/placeholder.pdf',
  },
  {
    id: 'hub',
    name: 'Diagnostic Hub',
    year: '2023',
    type: 'Healthcare Architecture',
    location: 'Pune, India',
    isGroup: false,
    shortDesc: 'Warmth re-engineered into the typically clinical language of diagnostic healthcare space.',
    image: '/hub.png',
    pdf: '/placeholder.pdf',
  },
  {
    id: 'gsen',
    name: 'GSEN',
    year: '2023',
    type: 'Masterplanning',
    location: 'Academic',
    isGroup: true,
    shortDesc: 'A community-driven initiative focusing on ecological restoration and sustainable living practices.',
    image: '/gsen_render_1780148902558.png',
    pdf: '/placeholder.pdf',
  },
  {
    id: 'documentation',
    name: 'Documentation',
    year: '2023',
    type: 'Heritage Study',
    location: 'Academic',
    isGroup: true,
    shortDesc: 'Comprehensive architectural documentation of historical structures, preserving cultural heritage.',
    image: '/documentation_render_1780148920658.png',
    pdf: '/placeholder.pdf',
  }
]

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
      position: 'fixed', inset: 0, zIndex: 9999,
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


/* ─── Horizontal Gallery Card ──────────────────────────────────────────────── */
function GalleryCard({ project, onClick }) {
  const [isHovered, setIsHovered] = useState(false)
  const imgRef = useRef(null)
  const btnRef = useRef(null)
  
  useMagnetic(btnRef, 0.2)

  useEffect(() => {
    if (imgRef.current) {
      gsap.to(imgRef.current, {
        scale: isHovered ? 1.05 : 1,
        duration: 0.8,
        ease: 'power2.out'
      })
    }
  }, [isHovered])

  return (
    <div 
      className="gallery-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(project)}
      data-hoverable="true"
      style={{
        position: 'relative',
        width: 'clamp(300px, 65vw, 900px)',
        height: '70vh',
        flexShrink: 0,
        overflow: 'hidden',
        cursor: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        background: 'var(--clr-burgundy)',
        boxShadow: '20px 0 50px rgba(0,0,0,0.1)'
      }}
    >
      {/* Background Image */}
      <img 
        ref={imgRef}
        src={project.image} 
        alt={project.name}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          filter: isHovered ? 'brightness(0.9)' : 'brightness(0.65)',
          transition: 'filter 0.5s ease',
        }}
      />

      {/* Gradient Overlay for Text Readability */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(28,16,9,0.9) 0%, rgba(28,16,9,0.4) 30%, transparent 100%)',
        pointerEvents: 'none'
      }} />

      {/* Badges (Top) */}
      <div style={{
        position: 'absolute',
        top: '24px',
        left: '24px',
        display: 'flex',
        gap: '12px'
      }}>
        {project.isGroup && (
          <span style={{
            background: 'var(--clr-sand)', color: 'var(--clr-burgundy-dark)',
            padding: '6px 12px', fontFamily: "'Space Mono', monospace",
            fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase'
          }}>
            Group Work
          </span>
        )}
        <span style={{
          background: 'rgba(240, 235, 225, 0.1)', color: 'var(--clr-cream)',
          padding: '6px 12px', fontFamily: "'Space Mono', monospace",
          fontSize: '0.75rem', backdropFilter: 'blur(4px)',
          border: '1px solid rgba(240,235,225,0.2)'
        }}>
          {project.year}
        </span>
      </div>

      {/* Text Content (Bottom) */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.9rem',
              color: 'var(--clr-sand)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '4px'
            }}>
              {project.type}
            </div>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 'clamp(40px, 5vw, 64px)',
              color: 'var(--clr-cream)',
              margin: 0,
              lineHeight: 1
            }}>
              {project.name}
            </h2>
          </div>
          
          {/* View Project Button */}
          <button 
            ref={btnRef}
            data-hoverable="true"
            style={{
              background: 'none', border: 'none', cursor: 'none',
              fontFamily: "var(--font-display)",
              fontSize: '1.5rem',
              color: 'var(--clr-cream)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateX(0)' : 'translateX(-20px)',
              transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            View Project 
            <span style={{ display: 'inline-block', transform: 'rotate(-45deg)' }}>→</span>
          </button>
        </div>

        <p style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.95rem',
          color: 'var(--clr-cream)',
          opacity: 0.8,
          maxWidth: '600px',
          marginTop: '12px',
          lineHeight: 1.6
        }}>
          {project.shortDesc}
        </p>
      </div>
    </div>
  )
}

/* ─── Main Work Page ───────────────────────────────────────────────────────── */
export default function WorkPage() {
  const [pdfProject, setPdfProject] = useState(null)
  
  const containerRef = useRef(null)
  const stickyRef = useRef(null)
  const trackRef = useRef(null)
  const titleRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro label fade out
      gsap.to(titleRef.current, {
        opacity: 0,
        y: -50,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=400',
          scrub: 1
        }
      })

      // Set height of container to allow scrolling
      gsap.set(containerRef.current, { height: `calc(100vh + ${trackRef.current.scrollWidth}px)` })

      // Horizontal scroll pinning
      gsap.to(trackRef.current, {
        x: () => -(trackRef.current.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${trackRef.current.scrollWidth}`,
          scrub: 1,
          invalidateOnRefresh: true, // Recalculates on resize
        }
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div 
      ref={containerRef}
      style={{
        background: 'var(--clr-burgundy-dark)',
        position: 'relative'
      }}
    >
      <div 
        ref={stickyRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        
        {/* Animated Background Title */}
        <div 
          ref={titleRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: '18vw',
            color: 'var(--clr-cream)',
            opacity: 0.05,
            pointerEvents: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          SELECTED WORK
        </div>

        {/* Horizontal Track */}
        <div 
          ref={trackRef}
          style={{
            display: 'flex',
            gap: '10vw',
            padding: '0 15vw', // Start with space on the left, end with space on the right
            alignItems: 'center',
            height: '100%',
            width: 'fit-content', // Very important for horizontal scroll
            position: 'relative',
            zIndex: 10
          }}
        >
          {/* Header/Intro slide inside the track */}
          <div style={{ width: '30vw', flexShrink: 0 }}>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 'clamp(60px, 8vw, 120px)',
              color: 'var(--clr-cream)',
              lineHeight: 1,
              marginBottom: '24px'
            }}>
              PROJECT<br/>ARCHIVE
            </h1>
            <p style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '1rem',
              color: 'var(--clr-sand)',
              opacity: 0.8,
              lineHeight: 1.6,
              maxWidth: '400px'
            }}>
              A collection of architectural explorations, spanning intimate residential interiors to macro-scale institutional campuses. 
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: '40px',
              color: 'var(--clr-cream)'
            }}>
              <span className="scroll-pulse" style={{ fontSize: '1.2rem', fontFamily: 'monospace' }}>→</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Scroll to explore
              </span>
            </div>
          </div>

          {/* Cards */}
          {ALL_PROJECTS.map(project => (
            <GalleryCard 
              key={project.id} 
              project={project} 
              onClick={setPdfProject} 
            />
          ))}
          
          {/* End padding block so the last card doesn't stick to the very edge of the screen */}
          <div style={{ width: '10vw', flexShrink: 0 }} />
        </div>

      </div>

      {/* PDF Overlay */}
      {pdfProject && (
        <PdfOverlay 
          project={pdfProject} 
          onClose={() => setPdfProject(null)} 
        />
      )}
    </div>
  )
}
