import { useEffect } from 'react';
import Lenis from 'lenis';
import Snap from 'lenis/snap';
import { SECTIONS } from '@/components/GlassNavBar';

export const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
    });

    const snap = new Snap(lenis, {
      type: 'mandatory', 
      duration: 0.9,
      debounce: 100,
    });

    const unsubs: (() => void)[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) unsubs.push(snap.addElement(el, { align: 'start' }));
    });

    return () => {
      unsubs.forEach((u) => u());
      snap.destroy();
      lenis.destroy();
    };
  }, []);
};
