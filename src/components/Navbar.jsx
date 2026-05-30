import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem 2.5rem',
        zIndex: 100,
        pointerEvents: 'none',   // let the page receive events through
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          fontFamily: "'Caveat', cursive",
          fontSize: '1.75rem',
          fontWeight: 700,
          color: 'var(--clr-cream)',
          textDecoration: 'none',
          pointerEvents: 'auto',
          letterSpacing: '-0.01em',
          lineHeight: 1,
        }}
        className="hoverable"
      >
        ab.
      </Link>

      {/* Links */}
      <div style={{ display: 'flex', gap: '2rem', pointerEvents: 'auto' }}>
        <Link
          to="/work"
          className={`nav-link hoverable${pathname === '/work' ? ' nav-link--active' : ''}`}
        >
          work
        </Link>
        <Link
          to="/poems"
          className={`nav-link hoverable${pathname === '/poems' ? ' nav-link--active' : ''}`}
        >
          poems
        </Link>
      </div>
    </nav>
  )
}
