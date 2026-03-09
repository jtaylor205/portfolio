'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimate } from 'framer-motion';

const SECTIONS = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Work', id: 'skills' },
  { label: 'Contact', id: 'contact' },
] as const;

interface GlassNavBarProps {
  activeId: string;
  onSelect: (id: string) => void;
}

export default function GlassNavBar({ activeId, onSelect }: GlassNavBarProps) {
  const navRef = useRef<HTMLElement>(null);
  const pillContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number } | null>(null);
  const [animatingToId, setAnimatingToId] = useState<string | null>(null);
  const animationIdRef = useRef<string | null>(null);
  const [scope, animate] = useAnimate();

  const updatePillPosition = (id: string) => {
    const container = pillContainerRef.current;
    const tab = tabRefs.current[id];
    if (!container || !tab) return;
    const containerRect = container.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    setPillStyle({
      left: tabRect.left - containerRect.left,
      width: tabRect.width,
    });
  };

  useEffect(() => {
    updatePillPosition(activeId);
  }, [activeId]);

  useEffect(() => {
    const container = pillContainerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => updatePillPosition(activeId));
    ro.observe(container);
    return () => ro.disconnect();
  }, [activeId]);

  const handleClick = async (id: string) => {
    if (id === activeId) return;
    const container = pillContainerRef.current;
    const nextTab = tabRefs.current[id];
    if (!container || !nextTab) {
      onSelect(id);
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const toRect = nextTab.getBoundingClientRect();
    const toLeft = toRect.left - containerRect.left;
    const toWidth = toRect.width;

    onSelect(id);
    animationIdRef.current = id;
    setAnimatingToId(id);

    const pill = scope.current?.querySelector('[data-pill]');
    if (!pill) {
      animationIdRef.current = null;
      setAnimatingToId(null);
      return;
    }

    await animate(pill, { scale: 1.15 }, { duration: 0.12, ease: [0.4, 0, 0.2, 1] });
    if (animationIdRef.current !== id) return;
    setPillStyle({ left: toLeft, width: toWidth });
    await new Promise((r) => setTimeout(r, 280));
    if (animationIdRef.current !== id) return;
    await animate(pill, { scale: 1 }, { duration: 0.12, ease: [0.4, 0, 0.2, 1] });
    if (animationIdRef.current === id) setAnimatingToId(null);
    animationIdRef.current = null;
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-4 sm:top-6 left-1/2 z-50 -translate-x-1/2
        flex items-center gap-0.5 sm:gap-1 p-1 sm:p-1.5 rounded-4xl"
    >
      {/* Frosted glass background */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          borderRadius: 'inherit',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          background: 'rgba(255,255,255,0.10)',
          pointerEvents: 'none',
        }}
      />
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          borderRadius: 'inherit',
          border: '1px solid rgba(255,255,255,0.20)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.28)',
          pointerEvents: 'none',
        }}
      />
      <div
        ref={(el) => {
          pillContainerRef.current = el;
          (scope as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }}
        className="relative flex items-center"
      >
        {pillStyle && (
          <motion.span
            data-pill
            className="absolute top-0 rounded-4xl bg-white/25 border border-white/20"
            style={{ height: '100%', transformOrigin: 'center center' }}
            animate={{
              left: pillStyle.left,
              width: pillStyle.width,
            }}
            initial={false}
            transition={{
              type: 'tween',
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
          />
        )}
        {SECTIONS.map(({ label, id }) => (
          <button
            key={id}
            ref={(el) => {
              tabRefs.current[id] = el;
            }}
            type="button"
            onClick={() => handleClick(id)}
            className={`relative px-3 py-1.5 sm:px-5 sm:py-2.5 text-sm sm:text-base rounded-4xl text-white/90 font-medium
              transition-colors duration-300
              ${animatingToId === id ? '' : 'hover:text-white hover:bg-white/10'}`}
          >
            <span className="relative z-10">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export { SECTIONS };
