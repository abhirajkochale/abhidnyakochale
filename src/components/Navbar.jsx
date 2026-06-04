import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useMagnetic } from '../hooks/useMagnetic'

function NavLink({ to, onClick, children }) {
  const ref = useRef(null)
  useMagnetic(ref, 0.3)

  return (
    <a 
      href={to}
      onClick={(e) => {
        e.preventDefault();
        window.lenis?.start();
        onClick(to);
      }}
      ref={ref} 
      data-hoverable="true" 
      className="nav-text"
      style={{ 
        position: 'relative', 
        display: 'inline-block', 
        textDecoration: 'none',
        fontFamily: "'Space Mono', monospace",
        fontSize: '16px',
        color: 'inherit',
        cursor: 'none'
      }} 
    >
      {children}
    </a>
  )
}

export default function Navbar() {
  const logoRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      let isAnyIntersecting = false
      entries.forEach(entry => {
        if (entry.isIntersecting) isAnyIntersecting = true
      })
      if (isAnyIntersecting) {
        gsap.to('.nav-text', { color: '#1C1009', duration: 0.3 })
      } else {
        gsap.to('.nav-text', { color: '#F0EBE1', duration: 0.3 })
      }
    }, { rootMargin: '-20% 0px -80% 0px' })

    const timeout = setTimeout(() => {
      document.querySelectorAll('[data-theme="light"]').forEach(el => observer.observe(el))
    }, 500)

    return () => {
      clearTimeout(timeout)
      observer.disconnect()
    }
  }, [])

  const handleLogoEnter = () => gsap.to(logoRef.current, { rotation: -4, duration: 0.3, ease: 'back.out(2)' })
  const handleLogoLeave = () => gsap.to(logoRef.current, { rotation: 0, duration: 0.3, ease: 'power2.out' })

  return (
    <nav
      className="nav-text nav-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem 2.5rem',
        zIndex: 1000,
        pointerEvents: 'none',
        color: '#F0EBE1'
      }}
    >
      {/* Logo */}
      <a
        href="#home"
        onClick={(e) => {
          e.preventDefault();
          window.lenis?.start();
          window.lenis?.scrollTo('#home');
        }}
        ref={logoRef}
        onMouseEnter={handleLogoEnter}
        onMouseLeave={handleLogoLeave}
        data-hoverable="true"
        className="nav-text"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: '22px',
          fontWeight: 700,
          color: 'inherit',
          textDecoration: 'none',
          pointerEvents: 'auto',
          letterSpacing: '-0.01em',
          lineHeight: 1,
          display: 'inline-block',
          transformOrigin: 'center center',
          cursor: 'none'
        }}
      >
        ab.
      </a>

      {/* Links */}
      <div className="nav-links" style={{ display: 'flex', gap: '1.5rem', pointerEvents: 'auto' }}>
        <NavLink to="#work" onClick={(to) => window.lenis?.scrollTo(to)}>work</NavLink>
        <NavLink to="#poems" onClick={(to) => window.lenis?.scrollTo(to)}>poems</NavLink>
      </div>
    </nav>
  )
}
