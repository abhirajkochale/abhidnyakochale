import sys

with open('src/pages/PoemsPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import if not present
if "import HTMLFlipBook from 'react-pageflip'" not in content:
    content = "import HTMLFlipBook from 'react-pageflip'\n" + content

new_book = """const Page = React.forwardRef((props, ref) => {
  return (
    <div className="page" ref={ref}>
      <div className="page-content book-paper" style={{ width: '100%', height: '100%', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)' }}>
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
      </div>
    </div>
  );
});

function PoetryBook({ bookRef }) {
  const pages = [
    POETRY_SPREADS[0].left, POETRY_SPREADS[0].right,
    POETRY_SPREADS[1].left, POETRY_SPREADS[1].right,
    POETRY_SPREADS[2].left, POETRY_SPREADS[2].right
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
          width={450} 
          height={600} 
          size="stretch"
          minWidth={300}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1200}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          ref={bookRef}
          className="my-flip-book"
          style={{ margin: '0 auto' }}
        >
          {pages.map((page, index) => (
            <Page key={index} pageData={page} />
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
"""

start_idx = content.find('function PoetryBook() {')
end_idx = content.find('export default function PoemsPage() {')

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + new_book + content[end_idx:]
    with open('src/pages/PoemsPage.jsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("PoetryBook REPLACED")
else:
    print("FAILED TO FIND BOUNDS")
