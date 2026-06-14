import { useEffect } from 'react'
import gsap from 'gsap'

export function useMagnetic(ref, strength = 0.35) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    
    // Create quickTo instances for smooth animation
    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });
    
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      
      xTo((e.clientX - cx) * strength);
      yTo((e.clientY - cy) * strength);
    };
    
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };
    
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [ref, strength]);
}
