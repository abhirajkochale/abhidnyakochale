import { useEffect, useRef, useLayoutEffect } from 'react'
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
  const lenisRef = useRef(null)

  useEffect(() => {
    // Initialise Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    })
    lenisRef.current = lenis

    // Hook Lenis into GSAP's ticker so ScrollTrigger stays in sync
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    // Forward Lenis scroll events to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
    }
  }, [])

  return (
    <BrowserRouter>
      <CustomCursor />
      <Curtain />
      <Navbar />
      <Routes>
        <Route path="/"       element={<HomePage />} />
        <Route path="/work"   element={<WorkPage />} />
        <Route path="/poems"  element={<PoemsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
