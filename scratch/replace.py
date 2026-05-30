import sys
import re

with open('src/pages/PoemsPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_book = """function PoetryBook() {
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
            padding: 40px 36px;
          }
          .book-title {
            font-weight: 700;
            font-size: 20px;
            margin-bottom: 24px;
          }
          
          .flipbook-container {
            position: relative;
            width: clamp(600px, 80vw, 860px);
            height: clamp(380px, 50vh, 520px);
            margin: 0 auto;
            perspective: 2500px;
          }
          .flip-page {
            position: absolute;
            top: 0;
            right: 0;
            width: 50%;
            height: 100%;
            transform-origin: left center;
            transform-style: preserve-3d;
            z-index: 2;
          }
          .fixed-page-left {
            position: absolute; left: 0; top: 0; width: 50%; height: 100%; z-index: 1;
            box-shadow: inset -10px 0 20px rgba(0,0,0,0.05);
          }
          .fixed-page-right {
            position: absolute; right: 0; top: 0; width: 50%; height: 100%; z-index: 1;
            box-shadow: inset 10px 0 20px rgba(0,0,0,0.05);
          }
          .page-face {
            position: absolute; inset: 0;
            backface-visibility: hidden;
            box-shadow: inset 0 0 30px rgba(0,0,0,0.08);
          }
          .page-face.back {
            transform: rotateY(180deg);
          }
          
          .desktop-only { display: block; }
          .mobile-only { display: none; }
          
          @media (max-width: 768px) {
            .desktop-only { display: none; }
            .mobile-only { display: flex; flex-direction: column; gap: 32px; }
          }
        `}
      </style>

      {/* DESKTOP 3D BOOK */}
      <div className="flipbook-container desktop-only">
        {/* Fixed Left Page: Spread 0 Left (Cover) */}
        <div className="fixed-page-left book-paper">
          <div className="book-text" style={{ padding: 0, height: '100%' }}>
            <div style={{ width: '100%', height: '100%', backgroundImage: 'url(/book_cover.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.9 }} />
          </div>
        </div>
        
        {/* Fixed Right Page: Spread 2 Right (Endnote) */}
        <div className="fixed-page-right book-paper">
          <div className="book-text">
            <div className="book-title">{POETRY_SPREADS[2].right.title}</div>
            <div style={{ whiteSpace: 'pre-line' }}>{POETRY_SPREADS[2].right.body}</div>
          </div>
        </div>

        {/* Flip 2 (Bottom layer): Front is Spread 1 Right, Back is Spread 2 Left */}
        <div className="flip-page flip-page-1 book-paper" style={{ zIndex: 2 }}>
          <div className="page-face front book-paper">
            <div className="book-text">
              <div className="book-title">{POETRY_SPREADS[1].right.title}</div>
              <div style={{ whiteSpace: 'pre-line' }}>{POETRY_SPREADS[1].right.body}</div>
            </div>
          </div>
          <div className="page-face back book-paper">
            <div className="book-text">
              <div className="book-title">{POETRY_SPREADS[2].left.title}</div>
              <div style={{ whiteSpace: 'pre-line' }}>{POETRY_SPREADS[2].left.body}</div>
            </div>
          </div>
        </div>

        {/* Flip 1 (Top layer): Front is Spread 0 Right, Back is Spread 1 Left */}
        <div className="flip-page flip-page-0 book-paper" style={{ zIndex: 3 }}>
          <div className="page-face front book-paper">
            <div className="book-text">
              <div className="book-title">{POETRY_SPREADS[0].right.title}</div>
              <div style={{ whiteSpace: 'pre-line' }}>{POETRY_SPREADS[0].right.body}</div>
            </div>
          </div>
          <div className="page-face back book-paper">
            <div className="book-text">
              <div className="book-title">{POETRY_SPREADS[1].left.title}</div>
              <div style={{ whiteSpace: 'pre-line' }}>{POETRY_SPREADS[1].left.body}</div>
            </div>
          </div>
        </div>
        
        {/* SPINE LINE */}
        <div style={{
          position: 'absolute', left: '50%', top: 0, bottom: 0, width: '4px',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0.02) 50%, rgba(0,0,0,0.1))',
          zIndex: 10
        }} />
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
        Keep scrolling to read
      </p>

      {/* MOBILE BOOK */}
      <div className="mobile-only" style={{ width: '100%' }}>
         {[
           POETRY_SPREADS[0].left, POETRY_SPREADS[0].right,
           POETRY_SPREADS[1].left, POETRY_SPREADS[1].right,
           POETRY_SPREADS[2].left, POETRY_SPREADS[2].right
         ].map((page, i) => (
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
"""

start_idx = content.find('function PoetryBook() {')
end_idx = content.find('export default function PoemsPage() {')

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + new_book + content[end_idx:]
    with open('src/pages/PoemsPage.jsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("SUCCESS")
else:
    print("FAILED TO FIND INDICES")
