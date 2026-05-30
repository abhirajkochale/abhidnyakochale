import { useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Navbar from './components/Navbar'
import CustomCursor from './components/CustomCursor'
import HomePage from './pages/HomePage'
import WorkPage from './pages/WorkPage'
import PoemsPage from './pages/PoemsPage'

gsap.registerPlugin(ScrollTrigger)

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
      <Navbar />
      <Routes>
        <Route path="/"       element={<HomePage />} />
        <Route path="/work"   element={<WorkPage />} />
        <Route path="/poems"  element={<PoemsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
