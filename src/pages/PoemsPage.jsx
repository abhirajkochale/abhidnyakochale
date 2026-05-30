import HTMLFlipBook from 'react-pageflip'
import { useEffect, useRef, useState, useMemo, forwardRef } from 'react'
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
      isCover: true,
    },
    right: {
      title: "The Room Before",
      body: "There is always a room before the room\nwhere shoes are left in pairs,\nand something unnamed\nhangs on the door like a coat.\n\nI have lived in the room before\nlonger than the room itself."
    }
  },
  {
    left: {
      title: "Salt City",
      body: "The city does not miss you.\nIt just continues —\nits autorickshaws bleeding exhaust\ninto the evening,\nits mango sellers remembering\na different kind of sweet."
    },
    right: {
      title: "Cartography of Leaving",
      body: "I have mapped this exit\nin sixteen different lights —\nmorning-light, fluorescent,\nthe particular grey of a train window\ngoing somewhere with no name yet."
    }
  },
  {
    left: {
      title: "Archive",
      body: "Some mornings I open the drawer\nand find you there —\nnot a photograph, not a letter,\njust the weight of a thing\nthat was held once\nand knew it."
    },
    right: {
      title: "Endnote",
      body: "Thank you for reading."
    }
  }
]

function StickerButton({ text, originalRotation, bgColor, link }) {
  const stickerRef = useRef(null)
  useMagnetic(stickerRef, 0.4)

  const handleMouseEnter = () => {
    gsap.to(stickerRef.current, { rotation: 0, scale: 1.05, boxShadow: '4px 6px 12px rgba(0,0,0,0.3)', duration: 0.25 })
  }

  const handleMouseLeave = () => {
    const rot = parseFloat(originalRotation)
    gsap.to(stickerRef.current, { rotation: rot, scale: 1, boxShadow: '2px 3px 8px rgba(0,0,0,0.2)', duration: 0.25 })
  }

  return (
    <div
      ref={stickerRef}
      data-rotation={originalRotation}
      data-hoverable="true"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => { if (link) window.open(link, '_blank') }}
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

const Page = forwardRef((props, ref) => {
  const isLeft = props.index % 2 === 0;
  const spineShadow = isLeft 
    ? 'inset -40px 0 50px -20px rgba(0,0,0,0.25)' 
    : 'inset 40px 0 50px -20px rgba(0,0,0,0.25)';

  return (
    <div className="page" ref={ref} data-density="soft">
      <div className="page-content book-paper" style={{ width: '100%', height: '100%', boxShadow: spineShadow }}>
        {!props.pageData.isBlank && (
          <div className="book-text" style={{ padding: props.pageData.isCover ? 0 : '40px 36px', height: '100%' }}>
            {props.pageData.isCover ? (
              <div style={{ width: '100%', height: '100%', backgroundImage: 'url(/book_cover.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            ) : (
              <>
                <div className="book-title">{props.pageData.title}</div>
                <div style={{ whiteSpace: 'pre-line' }}>{props.pageData.body}</div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

function PoetryBook({ bookRef }) {
  const pages = [
    { title: 'blank', body: '', isCover: false, isBlank: true },
    POETRY_SPREADS[0].left, POETRY_SPREADS[0].right,
    POETRY_SPREADS[1].left, POETRY_SPREADS[1].right,
    POETRY_SPREADS[2].left, POETRY_SPREADS[2].right,
    { title: 'blank', body: '', isCover: false, isBlank: true }
  ];

  return (
    <>
      <style>
        {`
          .book-paper {
            background-color: #F5EDD8;
            background-image: repeating-linear-gradient(45deg, rgba(0,0,0,0.015) 0px, transparent 2px);
          }
          .book-text {
            font-family: 'Cormorant Garamond', serif;
            font-size: 16px;
            color: var(--clr-ink);
            line-height: 1.95;
          }
          .book-title {
            font-weight: 700;
            font-size: 20px;
            margin-bottom: 24px;
          }
          .desktop-only { display: flex; justify-content: center; }
          .mobile-only { display: none; }
          
          @media (max-width: 768px) {
            .desktop-only { display: none; }
            .mobile-only { display: flex; flex-direction: column; gap: 32px; }
          }
          
          /* Override stf styles if necessary */
          .stf__wrapper {
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          }
        `}
      </style>

      {/* DESKTOP 3D BOOK */}
      <div className="desktop-only" style={{ width: '100%' }}>
        <HTMLFlipBook 
          width={320} 
          height={450} 
          size="stretch"
          minWidth={250}
          maxWidth={600}
          minHeight={350}
          maxHeight={800}
          maxShadowOpacity={0.5}
          showCover={false}
          mobileScrollSupport={true}
          ref={bookRef}
          className="my-flip-book"
          style={{ margin: '0 auto' }}
        >
          {pages.map((page, index) => (
            <Page key={index} index={index} pageData={page} />
          ))}
        </HTMLFlipBook>
      </div>

      <p className="scroll-hint desktop-only" style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: '10px',
        color: 'rgba(240,235,225,0.35)',
        marginTop: '24px',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        textAlign: 'center',
      }}>
        Keep scrolling, or grab the corners to turn pages
      </p>

      {/* MOBILE BOOK */}
      <div className="mobile-only" style={{ width: '100%' }}>
         {pages.map((page, i) => (
           <div key={i} className="book-paper mobile-page-reveal" style={{ width: '100%', minHeight: '380px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
              <div className="book-text" style={{ padding: page.isCover ? 0 : '10px', height: '100%' }}>
                {page.isCover ? (
                  <div style={{ width: '100%', height: '100%', minHeight: '380px', backgroundImage: 'url(/book_cover.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                ) : (
                  <>
                    <div className="book-title">{page.title}</div>
                    <div style={{ whiteSpace: 'pre-line' }}>{page.body}</div>
                  </>
                )}
              </div>
           </div>
         ))}
      </div>
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
  const bookRef = useRef(null)
  const targetPageRef = useRef(0)

  // Element refs
  const wordsWrapRef = useRef(null)
  const authorRef = useRef(null)

  // Animations (Scroll)
  useEffect(() => {
    let syncFlipFn = null;
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
          { y: 100, rotateY: 30, opacity: 0.5 },
          {
            y: 0, rotateY: 10, opacity: 1, ease: 'none',
            scrollTrigger: {
              trigger: bookSectionRef.current,
              start: 'top 85%',
              end: 'center center',
              scrub: 1
            }
          }
        )

        gsap.fromTo(bookTextColRef.current,
          { y: 120, opacity: 0.5 },
          {
            y: 0, opacity: 1, ease: 'none',
            scrollTrigger: {
              trigger: bookSectionRef.current,
              start: 'top 80%',
              end: 'center center',
              scrub: 1
            }
          }
        )
      }

      // SECTION 3 ANIMATIONS
      if (poetrySectionRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: poetrySectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            onUpdate: (self) => {
              try {
                if (bookRef.current && typeof bookRef.current.pageFlip === 'function') {
                  // 8 pages total (indices 0 to 7) -> 4 spreads
                  let targetPage = 0;
                  if (self.progress > 0.75) targetPage = 6;
                  else if (self.progress > 0.5) targetPage = 4;
                  else if (self.progress > 0.25) targetPage = 2;
                  else targetPage = 0;
                  
                  targetPageRef.current = targetPage;
                }
              } catch(e) {
                console.error("onUpdate error:", e);
              }
            }
          }
        })
        
        // Hint disappears, but keep the title visible
        tl.to('.scroll-hint', { opacity: 0, duration: 0.2 }, 0)
        
        // Safe flipping loop to prevent animation overlap crashes
        syncFlipFn = () => {
           try {
              if (bookRef.current && typeof bookRef.current.pageFlip === 'function') {
                 const book = bookRef.current.pageFlip();
                 if (book && typeof book.getState === 'function') {
                   // Only trigger a new flip if the book is resting and we're not on the target page
                   if (book.getState() === 'read' && book.getCurrentPageIndex() !== targetPageRef.current) {
                      // Double check if page exists to avoid index out of bounds
                      if (targetPageRef.current >= 0 && targetPageRef.current < 8) {
                        book.flip(targetPageRef.current);
                      }
                   }
                 }
              }
           } catch(e) {
              console.error("syncFlip error:", e);
           }
        };
        gsap.ticker.add(syncFlipFn);
      }

    }, pageRef)

    return () => {
      ctx.revert();
      if (syncFlipFn) gsap.ticker.remove(syncFlipFn);
    }
  }, [])

  return (
    <div ref={pageRef} style={{ background: 'var(--clr-burgundy)', color: 'var(--clr-cream)' }}>
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
          background: 'var(--clr-paper)',
          color: 'var(--clr-burgundy)',
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
                backgroundImage: 'url(/book_cover.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
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
                <StickerButton
                  text="Buy on Bookleaf ↗"
                  originalRotation="-1.5"
                  bgColor="var(--clr-paper)"
                  link="https://ebooks.bookleafpub.com/product-page/for-the-hope-of-it-all"
                />
              </div>
              <div style={{ pointerEvents: 'auto' }}>
                <StickerButton
                  text="Buy on Amazon ↗"
                  originalRotation="1"
                  bgColor="var(--clr-sand)"
                  link="https://www.amazon.in/hope-almosts-maybes-everything-between/dp/9375107892/ref=sr_1_1?crid=Q7ERWC5IT9GW&dib=eyJ2IjoiMSJ9.Mx6gKkYyiEKT8-ihrFOPeofoautSpe_NkFPSbCIL974exjT7RGKR2owVbc9ZX0dqH95xwTEjReG92AD6WvkXl3CASrJYtVdMrrPH3f6rnGrPs2-UxdG5oEt9UMqJ0qJ-I7xx-cgdI7vrrAuV6ZWUG80LZnq8GtmwDB3eqENJzY6gcfGAikykqkdiTQXnsajR8rs2sVqZgGkb9YH_pQn_WjDT2nfyEkwpEwXVNOed-vg.m3aTsu3iStkSUQgakvWK7Hs6N05MvaMH9U6LyDRb1MQ&dib_tag=se&keywords=for+the+hope+of+it+all&qid=1780174140&sprefix=for+the+hope+of+it+%2Caps%2C308&sr=8-1"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Text Content */}
          <div className="book-text-col" ref={bookTextColRef} style={{ width: '58%', paddingLeft: 40 }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: 'clamp(32px, 4vw, 42px)',
              color: 'var(--clr-burgundy)',
              marginBottom: '12px',
              marginTop: 0
            }}>
              For the hope of it all
            </h2>

            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', color: 'var(--clr-burgundy)', opacity: 0.8, marginBottom: '40px' }}>
              <strong>Author's Name:</strong> Abhidnya Kochale
            </div>

            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '14px',
              color: 'var(--clr-burgundy)',
              lineHeight: 1.8,
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              <div>
                <strong>About the Author:</strong> Abhidnya Kochale is an architecture student who writes from the heart. What started as simple journaling slowly turned into poetry her way of making sense of heavy thoughts and unspoken emotions. This book is her first step into sharing her words with the world. Through her writing, Abhidnya hopes to connect with fellow sensitive souls and gently remind them that feeling deeply is not a weakness, but something to be held with care.
              </div>

              <div>
                This poetry collection began as a quiet refuge, a place to write when emotions felt overwhelming and words were the only release. Through verses shaped by longing, hope, vulnerability, and reflection, the poems trace an intimate emotional journey. Each piece holds space for feeling deeply, pausing without guilt, and embracing sensitivity as strength. Written gently and honestly, this book is for anyone who has ever needed reassurance that it's okay to feel, to wait, and to heal at their own pace.
              </div>

              <div>
                <strong>Book ISBN:</strong> 9789375107897
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 3: INTERACTIVE POETRY BOOK ── */}
      {/* ── SECTION 3: INTERACTIVE POETRY BOOK ── */}
      <div
        ref={poetrySectionRef}
        className="poetry-section-wrapper"
        style={{
          position: 'relative',
          background: 'var(--clr-burgundy)',
        }}
      >
        <style>
          {`
            .poetry-sticky-inner {
              position: relative;
              min-height: 100vh;
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 120px 40px;
              overflow: hidden;
            }
            @media (min-width: 769px) {
              .poetry-section-wrapper {
                height: 300vh;
              }
              .poetry-sticky-inner {
                position: sticky;
                top: 0;
                height: 100vh;
              }
            }
          `}
        </style>

        <div className="poetry-sticky-inner">
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)'
          }} />

          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
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
            <PoetryBook bookRef={bookRef} />
          </div>
        </div>
      </div>

    </div>
  )
}
