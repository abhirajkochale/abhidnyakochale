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
    image: '/Antarangan/Antarangan6.jpg.jpeg',
    pdf: '/Antarangan/Antarangan.pdf',
    images: [
      '/Antarangan/Antarangan.jpg.jpeg',
      '/Antarangan/Antarangan2.jpg.jpeg',
      '/Antarangan/Antarangan3.jpg.jpeg',
      '/Antarangan/Antarangan4.jpg.jpeg',
      '/Antarangan/Antarangan5.jpg.jpeg',
      '/Antarangan/Antarangan6.jpg.jpeg'
    ]
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
    pdf: '/Breathing Campus/Breathing Campus .pdf',
    images: [
      '/Breathing Campus/Breathing Campus.jpg.jpeg',
      '/Breathing Campus/Breathing Campus2.jpg.jpeg',
      '/Breathing Campus/Breathing Campus3.jpg.jpeg',
      '/Breathing Campus/Breathing Campus4.jpg.jpeg'
    ]
  },
  {
    id: 'hub',
    name: 'Diagnostic Hub',
    year: '2023',
    type: 'Healthcare Architecture',
    location: 'Pune, India',
    isGroup: false,
    shortDesc: 'Warmth re-engineered into the typically clinical language of diagnostic healthcare space.',
    image: '/Diagnostic hub/Diagnostic Hub5.jpg.jpeg',
    pdf: '/Diagnostic hub/Diagnostic Hub.pdf',
    images: [
      '/Diagnostic hub/Diagnostic Hub.jpg.jpeg',
      '/Diagnostic hub/Diagnostic Hub2.jpg.jpeg',
      '/Diagnostic hub/Diagnostic Hub3.jpg.jpeg',
      '/Diagnostic hub/Diagnostic Hub4.jpg.jpeg',
      '/Diagnostic hub/Diagnostic Hub5.jpg.jpeg'
    ]
  },
  {
    id: 'gsen',
    name: 'GSEN',
    year: '2023',
    type: 'Masterplanning',
    location: 'Academic',
    isGroup: true,
    shortDesc: 'A community-driven initiative focusing on ecological restoration and sustainable living practices.',
    image: '/Antarangan/Antarangan2.jpg.jpeg',
    pdf: '/GSEN/66GSEN-30_SHEETS.pdf',
    images: []
  },
  {
    id: 'andc',
    name: 'ANDC',
    year: '2021',
    type: 'Documentation',
    location: 'Historical Site',
    isGroup: true,
    shortDesc: 'Comprehensive architectural documentation of historical structures, preserving cultural heritage.',
    image: '/Breathing Campus/Breathing Campus3.jpg.jpeg',
    pdf: '/ANDC/65ANDC-127 Sheets.pdf',
    images: []
  }
]

/* ─── Project Viewer Overlay ─────────────────────────────────────────────────── */
function ProjectViewer({ project, onClose }) {
  const ref = useRef(null)
  const closeBtnRef = useRef(null)
  const [zoom, setZoom] = useState(100) // 100%

  useMagnetic(closeBtnRef, 0.4)

  useEffect(() => {
    // Stop Lenis to prevent background scrolling
    if (window.lenis) window.lenis.stop()
    
    gsap.fromTo(ref.current, { y: '100%' }, { y: '0%', duration: 0.4, ease: 'power3.out' })
    
    return () => {
      if (window.lenis) window.lenis.start()
    }
  }, [])

  const close = () => {
    gsap.to(ref.current, { y: '100%', duration: 0.35, ease: 'power3.in', onComplete: onClose })
  }

  const zoomIn = () => setZoom(prev => Math.min(prev + 25, 200))
  const zoomOut = () => setZoom(prev => Math.max(prev - 25, 50))
  const resetZoom = () => setZoom(100)

  const hasImages = project.images && project.images.length > 0;

  return (
    <div ref={ref} style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', flexDirection: 'column',
      background: '#323639', transform: 'translateY(100%)',
    }}>
      <div style={{
        background: 'var(--clr-burgundy)', padding: '0.9rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)', zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '1.5rem', color: 'var(--clr-cream)', letterSpacing: '0.02em' }}>
            {project.name}
          </span>
          
          {/* Zoom Controls (only show if we have images) */}
          {hasImages && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '4px 12px', borderRadius: '20px' }}>
              <button onClick={zoomOut} data-hoverable="true" style={{ background: 'none', border: 'none', color: 'var(--clr-sand)', fontSize: '1.2rem', cursor: 'none' }}>-</button>
              <button onClick={resetZoom} data-hoverable="true" style={{ background: 'none', border: 'none', color: 'var(--clr-cream)', fontFamily: "'Space Mono', monospace", fontSize: '0.9rem', cursor: 'none', minWidth: '50px' }}>{zoom}%</button>
              <button onClick={zoomIn} data-hoverable="true" style={{ background: 'none', border: 'none', color: 'var(--clr-sand)', fontSize: '1.2rem', cursor: 'none' }}>+</button>
            </div>
          )}
        </div>

        <button ref={closeBtnRef} onClick={close} data-hoverable="true" style={{
          background: 'none', border: 'none', cursor: 'none',
          fontFamily: "var(--font-display)", fontSize: '1.1rem', color: 'var(--clr-sand)',
          letterSpacing: '0.05em'
        }}>
          ✕ CLOSE
        </button>
      </div>

      <div 
        data-lenis-prevent="true"
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          overflowX: 'auto', 
          WebkitOverflowScrolling: 'touch', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          padding: '24px' // Padding around the pages like a PDF viewer
        }}
      >
        {hasImages ? (
          <div style={{ 
            width: `${zoom}%`, 
            maxWidth: '1600px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '24px', // Distinct gap between PDF pages
            paddingBottom: '15vh',
            transition: 'width 0.3s cubic-bezier(0.25, 1, 0.5, 1)' // Smooth zoom transition
          }}>
            {project.images.map((img, i) => (
              <img 
                key={i} 
                src={img} 
                alt={`${project.name} presentation board ${i + 1}`} 
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  display: 'block',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)', // Paper shadow
                  backgroundColor: '#fff' // In case image has transparency
                }} 
                loading="lazy"
              />
            ))}
          </div>
        ) : (
          <iframe src={project.pdf} title={`${project.name} PDF`} style={{ width: '100%', height: '100%', border: 'none' }} />
        )}
      </div>
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
      className="gallery-card relative shrink-0 overflow-hidden flex flex-col justify-end bg-[var(--clr-burgundy)] shadow-[20px_0_50px_rgba(0,0,0,0.1)] w-[85vw] h-[65vh] md:w-[clamp(300px,65vw,900px)] md:h-[70vh]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(project)}
      data-hoverable="true"
      style={{
        cursor: 'none',
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
    // 200vh pause distance to absorb the "first scroll"
    const getPauseDistance = () => window.innerHeight * 2;

    const updateHeight = () => {
      if (containerRef.current && trackRef.current) {
        const trackWidth = trackRef.current.scrollWidth
        gsap.set(containerRef.current, { height: `calc(100vh + ${trackWidth}px + ${getPauseDistance()}px)` })
        ScrollTrigger.refresh()
      }
    }

    // Delay to allow browser to finish layout
    setTimeout(updateHeight, 150)
    window.addEventListener('resize', updateHeight)

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


      // Horizontal scroll pinning (Starts after the pause distance)
      gsap.to(trackRef.current, {
        x: () => -( (trackRef.current?.scrollWidth || window.innerWidth) - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: () => `top -${getPauseDistance()}px`,
          end: () => `+=${trackRef.current?.scrollWidth || window.innerWidth}`,
          scrub: 1,
          invalidateOnRefresh: true, // Recalculates on resize
        }
      })

    }, containerRef)

    return () => {
      window.removeEventListener('resize', updateHeight)
      ctx.revert()
    }
  }, [])

  return (
    <>
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
          className="horizontal-track flex items-center h-full w-fit relative z-10 gap-[5vw] px-[5vw] md:gap-[10vw] md:px-[15vw]"
        >
          {/* Header/Intro slide inside the track */}
          <div className="intro-slide shrink-0 w-[85vw] md:w-[30vw]">
            <h1 className="intro-title font-display font-bold text-[var(--clr-cream)] leading-none mb-6 text-[clamp(48px,15vw,80px)] md:text-[clamp(60px,8vw,120px)]">
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

      {/* Project Overlay */}
      {pdfProject && (
        <ProjectViewer 
          project={pdfProject} 
          onClose={() => setPdfProject(null)} 
        />
      )}
    </div>
    </>
  )
}
