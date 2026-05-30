import { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Navbar from './components/Navbar'
import CustomCursor from './components/CustomCursor'
import HomePage from './pages/HomePage'
import WorkPage from './pages/WorkPage'
import PoemsPage from './pages/PoemsPage'

gsap.registerPlugin(ScrollTrigger)

function LoadingScreen({ onComplete }) {
  const containerRef = useRef(null)
  const pathRef = useRef(null)
  const progressRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, { 
            yPercent: -100, 
            duration: 0.6, 
            ease: 'power2.in',
            onComplete
          })
        }
      })

      // Draw SVG text
      const pathLength = pathRef.current.getTotalLength()
      gsap.set(pathRef.current, { strokeDasharray: pathLength, strokeDashoffset: pathLength, fill: 'transparent' })
      
      tl.to(pathRef.current, { strokeDashoffset: 0, duration: 1.0, ease: 'power2.inOut' }, 0)
      tl.to(progressRef.current, { width: '100%', duration: 1.0, ease: 'power2.inOut' }, 0)
      tl.to(pathRef.current, { fill: '#F0EBE1', duration: 0.3 }, 1.0)

    }, containerRef)
    return () => ctx.revert()
  }, [onComplete])

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: '#3D0E18',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center'
      }}
    >
      <svg width="120" height="80" viewBox="0 0 120 80">
        <path 
          ref={pathRef}
          d="M 30,50 Q 30,30 50,30 Q 70,30 70,50 Q 70,70 50,70 Q 30,70 30,50 M 70,20 L 70,70 Q 70,80 85,75 M 85,50 Q 85,30 105,30 Q 125,30 125,50 Q 125,70 105,70 Q 85,70 85,50 M 125,20 L 125,70"
          stroke="#F0EBE1"
          strokeWidth="2"
          fill="none"
        />
      </svg>
      <div style={{ width: 120, height: 1, background: 'rgba(240,235,225,0.2)', marginTop: 20 }}>
        <div ref={progressRef} style={{ width: '0%', height: '100%', background: '#F0EBE1' }} />
      </div>
    </div>
  )
}

function PageTransition({ children }) {
  const elRef = useRef(null)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(elRef.current, 
        { opacity: 0, y: 16 }, 
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
      )
    }, elRef)
    return () => ctx.revert()
  }, [])
  return <div ref={elRef}>{children}</div>
}

function GlobalGrain() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none', opacity: 0.035,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundSize: '180px 180px',
    }} />
  )
}

function Curtain() {
  const location = useLocation()
  const curtainRef = useRef(null)
  const isInitial = useRef(true)

  useLayoutEffect(() => {
    if (isInitial.current) {
      isInitial.current = false
      return
    }

    if (location.pathname === '/poems') {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline()
        tl.fromTo(curtainRef.current,
          { x: '-100%' },
          { x: '0%', duration: 0.4, ease: 'power2.in' }
        )
        tl.to(curtainRef.current,
          { x: '100%', duration: 0.4, ease: 'power2.out' }
        )
      })
      return () => ctx.revert()
    }
  }, [location.pathname])

  return (
    <div
      ref={curtainRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        background: '#6B1A2A',
        transform: 'translateX(-100%)',
        pointerEvents: 'none'
      }}
    />
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const fillRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)
    lenis.on('scroll', ScrollTrigger.update)

    // Scroll Progress
    lenis.on('scroll', ({ progress }) => {
      if (fillRef.current) {
        gsap.set(fillRef.current, { height: progress * 100 + 'vh' })
      }
    })

    document.fonts.ready.then(() => {
      ScrollTrigger.refresh()
    })

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
    }
  }, [])

  return (
    <BrowserRouter>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <CustomCursor />
      <Curtain />
      <GlobalGrain />
      <Navbar />
      
      {/* Scroll Progress Indicator */}
      <div style={{ position: 'fixed', left: 0, top: 0, width: 2, height: '100vh', background: 'rgba(240,235,225,0.1)', zIndex: 200, pointerEvents: 'none' }} />
      <div ref={fillRef} style={{ position: 'fixed', left: 0, top: 0, width: 2, height: '0%', background: '#F0EBE1', zIndex: 201, pointerEvents: 'none' }} />
      
      <Routes>
        <Route path="/"       element={<PageTransition key="/"><HomePage /></PageTransition>} />
        <Route path="/work"   element={<PageTransition key="/work"><WorkPage /></PageTransition>} />
        <Route path="/poems"  element={<PageTransition key="/poems"><PoemsPage /></PageTransition>} />
      </Routes>
    </BrowserRouter>
  )
}
