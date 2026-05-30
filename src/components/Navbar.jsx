import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { useMagnetic } from '../hooks/useMagnetic'

function NavLink({ to, children }) {
  const { pathname } = useLocation()
  const isActive = pathname === to
  const ref = useRef(null)
  const pathRef = useRef(null)
  useMagnetic(ref, 0.3)

  useEffect(() => {
    if (isActive && pathRef.current) {
      const length = pathRef.current.getTotalLength()
      gsap.fromTo(pathRef.current,
        { strokeDasharray: length, strokeDashoffset: length },
        { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out' }
      )
    }
  }, [isActive])

  return (
    <Link 
      to={to} 
      ref={ref} 
      data-hoverable="true" 
      className="nav-text"
      style={{ 
        position: 'relative', 
        display: 'inline-block', 
        textDecoration: 'none',
        fontFamily: "'Space Mono', monospace",
        fontSize: '16px',
        color: 'inherit'
      }} 
    >
      {children}
      {isActive && (
        <svg 
          style={{ position: 'absolute', bottom: -6, left: 0, width: '100%', height: 4, overflow: 'visible' }} 
          preserveAspectRatio="none"
        >
           <path 
             ref={pathRef} 
             d="M0,2 Q25,-2 50,2 T100,2" 
             fill="none" 
             stroke="currentColor" 
             strokeWidth="2" 
             vectorEffect="non-scaling-stroke"
           />
        </svg>
      )}
    </Link>
  )
}

export default function Navbar() {
  const { pathname } = useLocation()
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
  }, [pathname])

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
      <Link
        to="/"
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
          transformOrigin: 'center center'
        }}
      >
        ab.
      </Link>

      {/* Links */}
      <div className="nav-links" style={{ display: 'flex', gap: '1.5rem', pointerEvents: 'auto' }}>
        <NavLink to="/work">work</NavLink>
        <NavLink to="/poems">poems</NavLink>
      </div>
    </nav>
  )
}
