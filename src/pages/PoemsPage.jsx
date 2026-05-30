import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const QUOTE_TEXT = "these poems are the traces of places, people and versions of myself i wish to preserve"

const BOOK_LINES = [
  "A collection of poems born in transit — written",
  "in waiting rooms, on night trains, in cities that",
  "never asked her name. This book is a cartography",
  "of feeling, where every poem is a room with its own light."
]

function StickerButton({ text, originalRotation, bgColor }) {
  const stickerRef = useRef(null)

  const handleMouseEnter = () => {
    gsap.to(stickerRef.current, { rotation: 0, scale: 1.05, boxShadow: '4px 6px 16px rgba(0,0,0,0.3)', duration: 0.25 })
  }

  const handleMouseLeave = () => {
    const rot = parseFloat(stickerRef.current.dataset.rotation)
    gsap.to(stickerRef.current, { rotation: rot, scale: 1, boxShadow: '2px 3px 8px rgba(0,0,0,0.2)', duration: 0.25 })
  }

  return (
    <div
      ref={stickerRef}
      data-rotation={originalRotation}
      data-hoverable="true"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => window.open('#', '_blank')}
      style={{
        background: bgColor,
        display: 'inline-block',
        padding: '10px 20px',
        fontFamily: "'Caveat', cursive",
        fontWeight: 700,
        fontSize: '18px',
        color: 'var(--clr-burgundy)',
        border: '2px solid rgba(107,26,42,0.3)',
        boxShadow: '2px 3px 8px rgba(0,0,0,0.2)',
        cursor: 'none',
        pointerEvents: 'auto',
        transform: `rotate(${originalRotation}deg)`,
      }}
    >
      {text}
    </div>
  )
}

export default function PoemsPage() {
  const [stars, setStars] = useState([])
  const pageRef = useRef(null)
  
  // Section 1 refs
  const pinTriggerRef = useRef(null)
  const pinContentRef = useRef(null)
  const starfieldRef = useRef(null)
  
  // Section 2 refs
  const bookSectionRef = useRef(null)
  const bookCoverRef = useRef(null)
  const bookTextColRef = useRef(null)
  
  // Element refs
  const wordsWrapRef = useRef(null)
  const authorRef = useRef(null)

  // Generate stars on mount
  useEffect(() => {
    const newStars = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      size: Math.random() > 0.7 ? 2 : 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      baseOpacity: Math.random() * 0.6 + 0.1,
      duration: Math.random() * 3 + 2, // 2s - 5s
      delay: Math.random() * 5,
    }))
    setStars(newStars)
  }, [])

  // Animations (Entry & Scroll)
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. ENTRY ANIMATION (runs on mount)
      const words = wordsWrapRef.current?.querySelectorAll('.word')
      if (words && words.length > 0) {
        const tl = gsap.timeline()
        tl.fromTo(words, 
          { opacity: 0, y: 12 }, 
          { opacity: 1, y: 0, stagger: 0.04, duration: 0.8, ease: 'power2.out' }
        )
        tl.fromTo(authorRef.current,
          { opacity: 0, scale: 0.85 },
          { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' },
          `+=${0.3}` // Wait 0.3s after words finish
        )
      }

      // 2. SCROLL BLUR-OUT ANIMATION
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinTriggerRef.current,
          start: 'top top',
          end: '+=100%', // Scrolls for 100vh while pinned
          scrub: 1,
          pin: true,
        }
      })

      // Starfield fades out slightly faster (ends at 80% of scrub)
      scrollTl.to(starfieldRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'none'
      }, 0)

      // Text blurs and fades out
      scrollTl.fromTo(pinContentRef.current,
        { filter: 'blur(0px)', opacity: 1 },
        { filter: 'blur(14px)', opacity: 0, duration: 1, ease: 'none' },
        0
      )

      // 3. BOOK SECTION BACKGROUND COLOR AND ENTRY
      if (bookSectionRef.current) {
        ScrollTrigger.create({
          trigger: bookSectionRef.current,
          start: 'top 60%',
          onEnter: () => gsap.to(pageRef.current, { backgroundColor: '#EDE0C8', duration: 0.8, ease: 'none' }),
          onLeaveBack: () => gsap.to(pageRef.current, { backgroundColor: '#110608', duration: 0.8, ease: 'none' })
        })

        gsap.fromTo(bookCoverRef.current,
          { x: 80, opacity: 0 },
          { 
            x: 0, opacity: 1, duration: 0.7, ease: 'power2.out',
            scrollTrigger: {
              trigger: bookSectionRef.current,
              start: 'top 70%'
            }
          }
        )

        gsap.fromTo(bookTextColRef.current,
          { x: -50, opacity: 0 },
          { 
            x: 0, opacity: 1, duration: 0.7, ease: 'power2.out',
            scrollTrigger: {
              trigger: bookSectionRef.current,
              start: 'top 70%'
            }
          }
        )

        const lines = bookTextColRef.current.querySelectorAll('.reveal-inner')
        if (lines.length > 0) {
          gsap.fromTo(lines,
            { y: '100%' },
            {
              y: '0%', duration: 0.7, stagger: 0.08, ease: 'power2.out',
              scrollTrigger: {
                trigger: bookSectionRef.current,
                start: 'top 75%'
              }
            }
          )
        }
      }

    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={pageRef} style={{ background: '#110608', color: 'var(--clr-cream)' }}>
      {/* Dynamic Keyframes for Twinkle */}
      <style>
        {`
          @keyframes twinkle {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.8; }
          }
        `}
      </style>

      {/* ── SECTION 1: PINNED INTRO ── */}
      {/* 
        This is the trigger element. It needs to be tall enough to allow pinning. 
        Because GSAP pins the trigger itself (if no pinType or pin spacing specified),
        it will automatically add padding. 
        We use height: '100vh' for the trigger. GSAP will hold it for 100vh of scroll.
      */}
      <div 
        ref={pinTriggerRef}
        style={{ 
          height: '100vh', 
          width: '100%', 
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {/* Starfield Layer (Behind everything) */}
        <div 
          ref={starfieldRef}
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0
          }}
        >
          {stars.map((star) => (
            <div
              key={star.id}
              style={{
                position: 'absolute',
                top: `${star.top}%`,
                left: `${star.left}%`,
                width: star.size,
                height: star.size,
                background: '#fff',
                borderRadius: '50%',
                opacity: star.baseOpacity,
                animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`
              }}
            />
          ))}
        </div>

        {/* Text Content Layer */}
        <div 
          ref={pinContentRef}
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 2rem'
          }}
        >
          <p 
            ref={wordsWrapRef}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(18px, 2.2vw, 26px)',
              color: 'var(--clr-cream)',
              maxWidth: 560,
              textAlign: 'center',
              lineHeight: 2,
              margin: 0
            }}
          >
            {QUOTE_TEXT.split(' ').map((word, i) => (
              <span 
                key={i} 
                className="word" 
                style={{ display: 'inline-block', opacity: 0, marginRight: '0.25em' }}
              >
                {word}
              </span>
            ))}
          </p>

          <p 
            ref={authorRef}
            style={{
              fontFamily: "'Caveat', cursive",
              fontWeight: 700,
              fontSize: '32px',
              color: 'var(--clr-sand)',
              marginTop: '1rem',
              opacity: 0
            }}
          >
            ~ab
          </p>
        </div>
      </div>

      {/* ── SECTION 2: BOOK SECTION ── */}
      <div 
        id="book-section" 
        ref={bookSectionRef}
        style={{ 
          minHeight: '100vh', 
          paddingBottom: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: '1100px',
          padding: '80px 40px',
          display: 'grid',
          gridTemplateColumns: '42% 58%',
          alignItems: 'center',
          gap: '40px'
        }}>
          {/* LEFT COLUMN: Book Cover & Stickers */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div 
              ref={bookCoverRef}
              style={{
                width: '300px',
                height: '420px',
                backgroundColor: '#C9B99A',
                transform: 'perspective(800px) rotateY(8deg)',
                filter: 'drop-shadow(8px 12px 40px rgba(0,0,0,0.5))',
                position: 'relative',
                marginBottom: '40px'
              }}
            >
              {/* Fake spine shadow */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, bottom: 0,
                width: '12px',
                background: 'linear-gradient(to right, rgba(0,0,0,0.4), transparent)',
                pointerEvents: 'none'
              }} />
            </div>

            <div style={{ display: 'flex', gap: '20px', pointerEvents: 'none' }}>
              <div style={{ pointerEvents: 'auto' }}>
                <StickerButton text="Buy on Bookleaf ↗" originalRotation="-1.5" bgColor="var(--clr-paper)" />
              </div>
              <div style={{ pointerEvents: 'auto' }}>
                <StickerButton text="Buy on Amazon ↗" originalRotation="1" bgColor="var(--clr-sand)" />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Text Content */}
          <div ref={bookTextColRef}>
            <h2 style={{
              fontFamily: "'Caveat', cursive",
              fontWeight: 700,
              fontSize: 'clamp(36px, 4.5vw, 56px)',
              color: 'var(--clr-burgundy)',
              marginBottom: '32px',
              marginTop: 0
            }}>
              About The Book
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {BOOK_LINES.map((line, i) => (
                <div key={i} style={{ overflow: 'hidden' }}>
                  <div 
                    className="reveal-inner" 
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '14px',
                      color: 'var(--clr-ink)',
                      lineHeight: 2.2,
                      transform: 'translateY(100%)'
                    }}
                  >
                    {line}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
