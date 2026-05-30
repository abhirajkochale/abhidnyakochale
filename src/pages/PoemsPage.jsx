import { useEffect, useRef, useState, useMemo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMagnetic } from '../hooks/useMagnetic'

gsap.registerPlugin(ScrollTrigger)

const QUOTE_TEXT = "these poems are the traces of places, people and versions of myself i wish to preserve"

const BOOK_LINES = [
  "A collection of poems born in transit — written",
  "in waiting rooms, on night trains, in cities that",
  "never asked her name. This book is a cartography",
  "of feeling, where every poem is a room with its own light."
]

const POETRY_SPREADS = [
  {
    left: {
      title: "The Room Before",
      body: "There is always a room before the room\nwhere shoes are left in pairs,\nand something unnamed\nhangs on the door like a coat.\n\nI have lived in the room before\nlonger than the room itself."
    },
    right: {
      title: "Salt City",
      body: "The city does not miss you.\nIt just continues —\nits autorickshaws bleeding exhaust\ninto the evening,\nits mango sellers remembering\na different kind of sweet."
    }
  },
  {
    left: {
      title: "Cartography of Leaving",
      body: "I have mapped this exit\nin sixteen different lights —\nmorning-light, fluorescent,\nthe particular grey of a train window\ngoing somewhere with no name yet."
    },
    right: {
      title: "Archive",
      body: "Some mornings I open the drawer\nand find you there —\nnot a photograph, not a letter,\njust the weight of a thing\nthat was held once\nand knew it."
    }
  }
]

function StickerButton({ text, originalRotation, bgColor }) {
  const stickerRef = useRef(null)
  useMagnetic(stickerRef, 0.4)

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
        fontFamily: "var(--font-display)",
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

function PoetryBook() {
  const [currentSpread, setCurrentSpread] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState('forward')
  const [nextSpread, setNextSpread] = useState(1)
  const [hasInteracted, setHasInteracted] = useState(false)
  const flipPageRef = useRef(null)
  const bookContainerRef = useRef(null)

  const [touchStart, setTouchStart] = useState(0)
  const [mobileIndex, setMobileIndex] = useState(0)
  const mobileCardRef = useRef(null)

  const mobileContent = [
    POETRY_SPREADS[0].left,
    POETRY_SPREADS[0].right,
    POETRY_SPREADS[1].left,
    POETRY_SPREADS[1].right
  ]

  function flipForward() {
    if (isFlipping || currentSpread >= POETRY_SPREADS.length - 1) return;
    setHasInteracted(true);
    setIsFlipping(true);
    setFlipDirection('forward');
    setNextSpread(currentSpread + 1);
    
    gsap.fromTo(flipPageRef.current,
      { rotateY: 0 },
      {
        rotateY: -180,
        duration: 0.75,
        ease: 'power2.inOut',
        onComplete: () => {
          setCurrentSpread(prev => prev + 1);
          gsap.set(flipPageRef.current, { rotateY: 0 }); // reset instantly
          setIsFlipping(false);
        }
      }
    );
  }

  function flipBackward() {
    if (isFlipping || currentSpread <= 0) return;
    setHasInteracted(true);
    setIsFlipping(true);
    setFlipDirection('backward');
    setNextSpread(currentSpread - 1);
    
    gsap.fromTo(flipPageRef.current,
      { rotateY: -180 },
      {
        rotateY: 0,
        duration: 0.75,
        ease: 'power2.inOut',
        onComplete: () => {
          setCurrentSpread(prev => prev - 1);
          gsap.set(flipPageRef.current, { rotateY: 0 });
          setIsFlipping(false);
        }
      }
    );
  }

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX)
  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX
    if (touchStart - touchEnd > 50 && mobileIndex < 3) {
      gsap.fromTo(mobileCardRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      setMobileIndex(p => p + 1)
    } else if (touchStart - touchEnd < -50 && mobileIndex > 0) {
      gsap.fromTo(mobileCardRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      setMobileIndex(p => p - 1)
    }
  }

  const frontContent = flipDirection === 'forward' ? POETRY_SPREADS[currentSpread].right : POETRY_SPREADS[nextSpread].right;
  const backContent = flipDirection === 'forward' ? POETRY_SPREADS[nextSpread].left : POETRY_SPREADS[currentSpread].left;

  return (
    <>
      <style>
        {`
          .book-paper {
            background-color: #F5EDD8;
            background-image: repeating-linear-gradient(45deg, rgba(0,0,0,0.015) 0px, transparent 2px);
          }
          .book-paper-back {
            background-color: #F2E8D4;
            background-image: repeating-linear-gradient(45deg, rgba(0,0,0,0.015) 0px, transparent 2px);
          }
          .book-text {
            font-family: 'Cormorant Garamond', serif;
            font-size: 16px;
            color: var(--clr-ink);
            line-height: 1.95;
            padding: 40px 36px;
          }
          .book-title {
            font-weight: 700;
            font-size: 20px;
            margin-bottom: 24px;
          }
          .desktop-book { display: block; }
          .mobile-book { display: none; }
          @media (max-width: 768px) {
            .desktop-book { display: none; }
            .mobile-book { display: flex; }
          }
        `}
      </style>

      {/* DESKTOP 3D BOOK */}
      <div 
        className="desktop-book"
        ref={bookContainerRef}
        onMouseEnter={() => gsap.to('.book-hint', { opacity: 0.6, duration: 0.2 })}
        onMouseLeave={() => gsap.to('.book-hint', { opacity: 0.35, duration: 0.2 })}
        style={{
          position: 'relative',
          width: 'clamp(600px, 80vw, 860px)',
          height: 'clamp(380px, 50vh, 520px)',
          margin: '0 auto',
          perspective: '1200px',
        }}
      >
        {/* BASE LEFT PAGE */}
        <div 
          onClick={flipBackward}
          style={{
            position: 'absolute', left: 0, top: 0, width: '50%', height: '100%',
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.08)',
            cursor: 'w-resize',
            zIndex: 1
          }}
          className="book-paper"
        >
          <div className="book-text">
            <div className="book-title">{POETRY_SPREADS[currentSpread].left.title}</div>
            <div style={{ whiteSpace: 'pre-line' }}>{POETRY_SPREADS[currentSpread].left.body}</div>
          </div>
          <div className="book-hint" style={{ position: 'absolute', bottom: '16px', left: '20px', pointerEvents: 'none', opacity: 0.35, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{fontFamily:"'Space Mono', monospace", fontSize:'9px', color:'#1C1009', letterSpacing:'0.1em'}}>← prev</span>
          </div>
          <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', opacity: 0.4, fontSize: '9px', fontFamily: "'Space Mono', monospace", pointerEvents: 'none' }}>
            {currentSpread * 2 + 1}
          </div>
        </div>

        {/* BASE RIGHT PAGE */}
        <div 
          onClick={flipForward}
          style={{
            position: 'absolute', right: 0, top: 0, width: '50%', height: '100%',
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.08)',
            cursor: 'e-resize',
            zIndex: 1
          }}
          className="book-paper"
        >
          <div className="book-text">
            <div className="book-title">{POETRY_SPREADS[currentSpread].right.title}</div>
            <div style={{ whiteSpace: 'pre-line' }}>{POETRY_SPREADS[currentSpread].right.body}</div>
          </div>
          <div className="book-hint" style={{ position: 'absolute', bottom: '16px', right: '20px', pointerEvents: 'none', opacity: 0.35, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{fontFamily:"'Space Mono', monospace", fontSize:'9px', color:'#1C1009', letterSpacing:'0.1em'}}>next →</span>
          </div>
          <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', opacity: 0.4, fontSize: '9px', fontFamily: "'Space Mono', monospace", pointerEvents: 'none' }}>
            {currentSpread * 2 + 2}
          </div>
        </div>

        {/* SPINE LINE */}
        <div style={{
          position: 'absolute', left: '50%', top: 0, bottom: 0, width: '4px',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0.02) 50%, rgba(0,0,0,0.1))',
          zIndex: 2, pointerEvents: 'none'
        }} />

        {/* FLIPPING PAGE (ANIMATION LAYER) */}
        <div
          ref={flipPageRef}
          style={{
            position: 'absolute', right: 0, top: 0, width: '50%', height: '100%',
            transformStyle: 'preserve-3d',
            transformOrigin: 'left center',
            zIndex: 3, pointerEvents: 'none'
          }}
        >
          {/* FRONT FACE (matches right page) */}
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.08)' }} className="book-paper">
            <div className="book-text">
              <div className="book-title">{frontContent.title}</div>
              <div style={{ whiteSpace: 'pre-line' }}>{frontContent.body}</div>
            </div>
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to right, rgba(0,0,0,0) 60%, rgba(0,0,0,0.25) 100%)' }} />
          </div>

          {/* BACK FACE (matches left page, rotated 180deg) */}
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.08)' }} className="book-paper-back">
            <div className="book-text">
              <div className="book-title">{backContent.title}</div>
              <div style={{ whiteSpace: 'pre-line' }}>{backContent.body}</div>
            </div>
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to right, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 40%)' }} />
          </div>
        </div>
      </div>

      {/* MOBILE SIMPLE SWIPE CARD */}
      <div 
        className="mobile-book"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          width: '100%', maxWidth: '400px', margin: '0 auto',
          flexDirection: 'column', gap: '20px'
        }}
      >
        <div ref={mobileCardRef} className="book-paper" style={{ padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', minHeight: '380px' }}>
          <div className="book-text" style={{ padding: 0 }}>
            <div className="book-title">{mobileContent[mobileIndex].title}</div>
            <div style={{ whiteSpace: 'pre-line' }}>{mobileContent[mobileIndex].body}</div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i === mobileIndex ? 'var(--clr-burgundy)' : 'rgba(255,255,255,0.2)' }} />
          ))}
        </div>
      </div>

      <p style={{
        fontFamily: "'Space Mono', monospace", 
        fontSize: '10px', 
        color: 'rgba(240,235,225,0.35)', 
        marginTop: '24px', 
        letterSpacing: '0.12em', 
        textTransform: 'uppercase',
        textAlign: 'center',
        opacity: hasInteracted ? 0 : 1,
        transition: 'opacity 0.6s ease'
      }}>
        click left or right to turn pages
      </p>
    </>
  )
}

export default function PoemsPage() {
  const stars = useMemo(() => 
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() > 0.7 ? 2 : 1,
      baseOpacity: Math.random() * 0.5 + 0.1,
      duration: Math.random() * 3 + 2, // 2s - 5s
      delay: Math.random() * 5,
    })), []
  )
  const pageRef = useRef(null)
  
  // Section 1 refs
  const pinTriggerRef = useRef(null)
  const pinContentRef = useRef(null)
  const starfieldRef = useRef(null)
  
  // Section 2 refs
  const bookSectionRef = useRef(null)
  const bookCoverRef = useRef(null)
  const bookTextColRef = useRef(null)
  
  // Section 3 refs
  const poetrySectionRef = useRef(null)
  const poemsTitleRef = useRef(null)
  
  // Element refs
  const wordsWrapRef = useRef(null)
  const authorRef = useRef(null)

  // Animations (Scroll)
  useEffect(() => {
    const ctx = gsap.context(() => {

      // ENTRANCE: stagger words in on load
      gsap.fromTo('.poem-word',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.045, ease: 'power2.out', delay: 0.2 }
      )

      // SCROLL BLUR-OUT (only blur, no opacity conflict)
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinTriggerRef.current,
          start: 'top top',
          end: '+=45%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        }
      })

      // Starfield fades out
      scrollTl.to(starfieldRef.current, {
        opacity: 0, duration: 0.8, ease: 'none'
      }, 0)
      // Text blurs on scroll only (no opacity conflict)
      scrollTl.to(pinContentRef.current, {
        filter: 'blur(18px)', duration: 1, ease: 'none'
      }, 0)

      // BOOK SECTION ENTRY
      if (bookSectionRef.current) {
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

      // SECTION 3 ANIMATIONS
      if (poetrySectionRef.current) {
        gsap.to(poemsTitleRef.current, {
          scale: 0.5,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: poetrySectionRef.current,
            start: 'top bottom',
            end: 'top center',
            scrub: true
          }
        })
        
        gsap.fromTo('.poetry-book-wrapper', 
          { opacity: 0, y: 50 },
          { 
            opacity: 1, y: 0, 
            ease: 'power2.out',
            scrollTrigger: {
              trigger: poetrySectionRef.current,
              start: 'top center',
              end: 'center center',
              scrub: true
            }
          }
        )
      }

    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={pageRef} style={{ background: '#110608', color: 'var(--clr-cream)' }}>
      <style>
        {`
          @keyframes twinkle {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.8; }
          }
        `}
      </style>

      {/* ── SECTION 1: PINNED INTRO ── */}
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

        <div 
          ref={pinContentRef}
          id="poems-intro"
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 40px', // Massive padding prevents blur clipping
            willChange: 'filter, opacity',
            transform: 'translateZ(0)',
          }}
        >
          <p 
            ref={wordsWrapRef}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(18px, 4vw, 24px)',
              color: 'var(--clr-cream)',
              maxWidth: '90vw',
              textAlign: 'center',
              lineHeight: 2,
              margin: '0 auto'
            }}
          >
            {QUOTE_TEXT.split(' ').map((word, i) => (
              <span 
                key={i} 
                className="poem-word" 
                style={{ display: 'inline-block', marginRight: '0.25em' }}
              >
                {word}
              </span>
            ))}
          </p>

          <p 
            ref={authorRef}
            className="poem-word"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: '48px',
              color: 'var(--clr-sand)',
              marginTop: '1.5rem',
              letterSpacing: '0.04em',
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
        data-theme="light"
        style={{ 
          minHeight: '100vh', 
          paddingBottom: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: 'var(--clr-cream)',
          color: 'var(--clr-ink)',
        }}
      >
        <div className="about-book-layout" style={{
          width: '100%',
          maxWidth: '1100px',
          padding: '80px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '40px'
        }}>
          {/* LEFT COLUMN: Book Cover & Stickers */}
          <div className="book-cover-col" style={{ width: '42%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div 
              className="book-cover"
              ref={bookCoverRef}
              onMouseEnter={() => gsap.to(bookCoverRef.current, { rotateY: 4, duration: 0.4, ease: 'power2.out' })}
              onMouseLeave={() => gsap.to(bookCoverRef.current, { rotateY: 10, duration: 0.4, ease: 'power2.out' })}
              style={{
                width: '300px',
                height: '420px',
                backgroundColor: '#C9B99A',
                transform: 'perspective(700px) rotateY(10deg)',
                transformStyle: 'preserve-3d',
                boxShadow: '-8px 8px 32px rgba(0,0,0,0.45), inset -4px 0 12px rgba(0,0,0,0.3)',
                transition: 'transform 0.4s ease',
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
          <div className="book-text-col" ref={bookTextColRef} style={{ width: '58%', paddingLeft: 40 }}>
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

      {/* ── SECTION 3: INTERACTIVE POETRY BOOK ── */}
      <div 
        ref={poetrySectionRef}
        style={{
          position: 'relative',
          minHeight: '100vh',
          background: '#0D0407',
          padding: '120px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'hidden'
        }}
      >
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)'
        }} />
        
        <div style={{textAlign:'center', marginBottom:'48px'}}>
          <h2 ref={poemsTitleRef} style={{
            fontFamily: "'Caveat', cursive",
            fontSize: 'clamp(48px, 8vw, 96px)',
            color: '#F0EBE1',
            lineHeight: 1,
            opacity: 0.9,
            margin: 0,
            position: 'relative',
            zIndex: 2
          }}>
            poems.
          </h2>
        </div>

        <div className="poetry-book-wrapper" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
          <PoetryBook />
        </div>
      </div>

    </div>
  )
}
