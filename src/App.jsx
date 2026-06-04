import { useEffect, useRef, useLayoutEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Navbar from './components/Navbar'
import CustomCursor from './components/CustomCursor'
import HomePage from './pages/HomePage'
import WorkPage from './pages/WorkPage'
import PoemsPage from './pages/PoemsPage'

gsap.registerPlugin(ScrollTrigger)



function PageTransition({ children }) {
  const elRef = useRef(null)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(elRef.current, 
        { opacity: 0, y: 16 }, 
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', clearProps: 'transform' }
      )
    }, elRef)
    return () => ctx.revert()
  }, [])
  return <div ref={elRef}>{children}</div>
}

// ScrollToTop removed as it's no longer needed for a single page.

function GlobalGrain() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none', opacity: 0.035,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundSize: '180px 180px',
    }} />
  )
}


export default function App() {
  const fillRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    window.lenis = lenis;

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
      window.lenis = null;
      gsap.ticker.remove(lenis.raf)
    }
  }, [])

  return (
    <>
      <CustomCursor />
      <GlobalGrain />
      <Navbar />
      
      {/* Scroll Progress Indicator */}
      <div style={{ position: 'fixed', left: 0, top: 0, width: 2, height: '100vh', background: 'rgba(240,235,225,0.1)', zIndex: 200, pointerEvents: 'none' }} />
      <div ref={fillRef} style={{ position: 'fixed', left: 0, top: 0, width: 2, height: '0%', background: '#F0EBE1', zIndex: 201, pointerEvents: 'none' }} />
      
      <main>
        <section id="home">
          <PageTransition>
            <HomePage />
          </PageTransition>
        </section>
        
        <section id="work">
          <WorkPage />
        </section>

        <section id="poems">
          <PoemsPage />
        </section>
      </main>
    </>
  )
}
