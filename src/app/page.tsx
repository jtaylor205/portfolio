'use client';

import { motion, useMotionValue, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useLenis } from '@/hooks/useLenis';
import GlassNavBar, { SECTIONS } from '@/components/GlassNavBar';
import SocialButtons from '@/components/SocialButtons';
import AuroraBackground from '@/components/background/AuroraBackground';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ContactSection from '@/components/sections/ContactSection';

export default function Home() {
  const lenisRef = useLenis();
  const [activeId, setActiveId] = useState('home');
  const scrollTargetRef = useRef<string | null>(null);
  const scrollTargetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentOpacity = useMotionValue(1);

  // Active section detection via viewport center
  useEffect(() => {
    const updateActiveFromScroll = () => {
      const viewportCenter = window.scrollY + window.innerHeight / 2;
      let active: string | null = null;
      const allIds = [...SECTIONS.map(s => s.id), 'projects'];
      for (const id of allIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const height = el.offsetHeight;
        if (viewportCenter >= top && viewportCenter < top + height) {
          active = id === 'projects' ? 'skills' : id;
        }
      }
      if (active !== null) setActiveId(active);
    };

    const raf = { current: 0 };
    const onScroll = () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        updateActiveFromScroll();
        raf.current = 0;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateActiveFromScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  // Prevent browser scroll restoration on refresh — always start at top
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [lenisRef]);

  const handleNavSelect = (id: string) => {
    if (scrollTargetTimeoutRef.current) clearTimeout(scrollTargetTimeoutRef.current);
    scrollTargetRef.current = id;
    setActiveId(id);
    const el = document.getElementById(id);
    if (!el) return;
    const sectionTop = el.getBoundingClientRect().top + window.scrollY;
    const sectionHeight = el.offsetHeight;
    const viewportHeight = window.innerHeight;
    // Sticky scroll-reveal sections: scroll to their end so content is fully revealed
    const isStickyReveal = id === 'about' || id === 'skills' || id === 'projects';
    const targetScrollY = id === 'home'
      ? 0
      : isStickyReveal
        ? sectionTop + sectionHeight - viewportHeight
        : sectionTop + sectionHeight / 2 - viewportHeight / 2;
    const target = Math.max(0, targetScrollY);
    // Fade out → instant jump → fade in
    animate(contentOpacity, 0, { duration: 0.15, ease: 'easeIn' }).then(() => {
      if (document.scrollingElement) {
        (document.scrollingElement as HTMLElement).scrollTop = target;
      }
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, { immediate: true });
      }
      animate(contentOpacity, 1, { duration: 0.35, ease: 'easeOut' });
    });
    scrollTargetTimeoutRef.current = setTimeout(() => {
      scrollTargetRef.current = null;
      scrollTargetTimeoutRef.current = null;
    }, 2000);
  };

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <GlassNavBar activeId={activeId} onSelect={handleNavSelect} />
      <SocialButtons />
      <motion.div style={{ opacity: contentOpacity }}>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </motion.div>
    </div>
  );
}
