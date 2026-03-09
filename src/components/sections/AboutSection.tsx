'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { GlassEffect } from '@/components/ui/GlassEffect';
import { GlowingEffect } from '@/components/ui/GlowingEffect';

type SlotKey = 'one' | 'two' | 'three' | 'four';

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Scroll progress drives card, photo, and timeline reveals
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const cardOpacity = useTransform(scrollYProgress, [0, 0.10], [0, 1]);
  const cardY       = useTransform(scrollYProgress, [0, 0.10], [28, 0]);

  // Per-photo scroll reveals, spaced ~10% apart: back-left → back-center → back-right → front
  const photoOpacity1 = useTransform(scrollYProgress, [0.16, 0.24], [0, 1]);
  const photoY1       = useTransform(scrollYProgress, [0.16, 0.24], [20, 0]);
  const photoOpacity2 = useTransform(scrollYProgress, [0.26, 0.34], [0, 1]);
  const photoY2       = useTransform(scrollYProgress, [0.26, 0.34], [20, 0]);
  const photoOpacity3 = useTransform(scrollYProgress, [0.36, 0.44], [0, 1]);
  const photoY3       = useTransform(scrollYProgress, [0.36, 0.44], [20, 0]);
  const photoOpacity0 = useTransform(scrollYProgress, [0.46, 0.54], [0, 1]);
  const photoY0       = useTransform(scrollYProgress, [0.46, 0.54], [20, 0]);

  const photoOpacities = [photoOpacity0, photoOpacity1, photoOpacity2, photoOpacity3];
  const photoScrollYs  = [photoY0, photoY1, photoY2, photoY3];

  const [timelineVisible, setTimelineVisible] = useState(false);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setTimelineVisible(v > 0.63);
  });

  // Responsive photo fan: track viewport width to scale the fan spread
  const [windowWidth, setWindowWidth] = useState(1280);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scale fan spread linearly from 0.6× at 1024px to 1.0× at 1280px+
  const fanScale = Math.min(1, Math.max(0.6, ((windowWidth - 1024) / 256) * 0.4 + 0.6));
  const photoFanTransforms = [
    { scale: 1.08, x: Math.round(-70 * fanScale),  y: Math.round(36 * fanScale),  rotate: 0  },
    { scale: 0.96, x: Math.round(-260 * fanScale), y: Math.round(-18 * fanScale), rotate: -24 },
    { scale: 0.94, x: Math.round(-70 * fanScale),  y: Math.round(-82 * fanScale), rotate: 0  },
    { scale: 0.96, x: Math.round(120 * fanScale),  y: Math.round(-18 * fanScale), rotate: 24 },
  ];

  const [slotImages, setSlotImages] = useState<SlotKey[]>(['one', 'two', 'three', 'four']);

  return (
    <div
      id="about"
      ref={sectionRef}
      className="relative h-auto md:h-[500vh]"
    >
      {/* ── Mobile layout (no sticky scroll) ── */}
      <div className="md:hidden px-5 py-20 flex flex-col gap-6">
        <GlassEffect className="relative w-full p-6 rounded-3xl shadow-[0_18px_60px_rgba(15,23,42,0.7)]">
          <p className="text-xs uppercase tracking-[0.26em] text-white/60 mb-3">Hello, I&apos;m Jaedon</p>
          <h2 className="text-2xl font-bold text-white mb-4 leading-snug">
            Building systems that scale, and software that lasts.
          </h2>
          <p className="text-white/80 text-sm leading-relaxed">
            I&apos;m a Computer Science student at the University of Florida and an incoming Software Engineer
            at Datadog. I gravitate toward backend and distributed systems work, building software that has
            to hold up when things get complicated. I&apos;ve worked across the stack and pick up whatever
            the problem needs. I care about writing code that&apos;s correct, fast, and built to last.
          </p>
        </GlassEffect>

        {/* Mobile timeline */}
        <div className="flex flex-col gap-4 px-1">
          {[
            { src: '/images/uf-block.svg', alt: 'University of Florida', title: 'University of Florida', sub: 'Computer Science' },
            { src: '/images/baron.svg',    alt: 'Baron Technologies',    title: 'Baron Technologies',    sub: 'Software Engineer' },
          ].map(({ src, alt, title, sub }) => (
            <div key={title} className="flex items-center gap-4">
              <GlassEffect className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={alt} className="w-8 h-8 object-contain" />
              </GlassEffect>
              <div>
                <p className="font-semibold text-white text-sm">{title}</p>
                <p className="text-xs text-white/60">{sub}</p>
              </div>
            </div>
          ))}
          {/* Datadog uses CSS mask approach for branded colour */}
          <div className="flex items-center gap-4">
            <GlassEffect className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden p-1.5">
              <span className="block w-full h-full text-[#774AA4]">
                <span className="block w-full h-full bg-current [mask-image:url('/images/datadog.svg')] [mask-size:contain] [mask-position:center] [mask-repeat:no-repeat]" />
              </span>
            </GlassEffect>
            <div>
              <p className="font-semibold text-white text-sm">Datadog</p>
              <p className="text-xs text-white/60">Software Engineer</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Desktop sticky scroll layout ── */}
      <div className="hidden md:flex sticky top-0 h-screen items-center justify-center p-5">
        <div
          className="max-w-6xl xl:max-w-7xl w-full grid gap-6 md:gap-10 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.8fr)] items-center"
          style={{ transform: windowWidth < 768 ? 'none' : `translateX(${Math.round(70 * fanScale)}px)` }}
        >
          {/* Photo fan – left column */}
          <div className="relative -ml-4 md:-ml-20 hidden md:flex justify-start">
            <div className="relative w-full max-w-md aspect-[4/5]">
              {slotImages.map((imageKey, slotIndex) => {
                const isFront = slotIndex === 0;
                const zIndexBySlot = [40, 20, 15, 10] as const;
                const { scale, x, y, rotate } = photoFanTransforms[slotIndex];
                const hover = isFront ? undefined : { scale: scale + 0.14 };

                const handlePhotoClick = () => {
                  if (slotIndex === 0) return;
                  setSlotImages((prev) => {
                    const next = [...prev] as SlotKey[];
                    const tmp = next[0];
                    next[0] = next[slotIndex];
                    next[slotIndex] = tmp;
                    return next;
                  });
                };

                return (
                  <motion.div
                    key={`reveal-${slotIndex}`}
                    style={{
                      opacity: photoOpacities[slotIndex],
                      y: photoScrollYs[slotIndex],
                      position: 'absolute',
                      inset: 0,
                      zIndex: zIndexBySlot[slotIndex],
                      overflow: 'visible',
                      pointerEvents: 'none',
                    }}
                  >
                    <motion.div
                      key={`slot-${slotIndex}`}
                      animate={{ scale, x, y, rotate }}
                      whileHover={hover}
                      transition={{ type: 'spring', stiffness: 230, damping: 26, delay: 0.06 * slotIndex }}
                      className="absolute top-1/2 left-1/2 w-[82%] aspect-[4/5] -translate-x-1/2 -translate-y-1/2 rounded-3xl overflow-hidden border border-white/20 bg-black/25 shadow-[0_22px_80px_rgba(15,23,42,0.85)] cursor-pointer"
                      style={{ pointerEvents: 'auto' }}
                      onClick={handlePhotoClick}
                    >
                      <motion.div
                        key={imageKey}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="w-full h-full"
                      >
                        {imageKey === 'one' && (
                          <Image src="/images/jaedon1.jpg" alt="Jaedon main portrait" fill className="object-cover" sizes="(min-width: 1024px) 320px, 70vw" priority={false} />
                        )}
                        {imageKey === 'two' && (
                          <Image src="/images/jaedon2.jpeg" alt="Jaedon speaking" fill className="object-cover" sizes="(min-width: 1024px) 300px, 65vw" priority={false} />
                        )}
                        {imageKey === 'three' && (
                          <Image src="/images/jaedon3.jpeg" alt="Jaedon portrait 2" fill className="object-cover" sizes="(min-width: 1024px) 280px, 65vw" priority={false} />
                        )}
                        {imageKey === 'four' && (
                          <Image src="/images/jaedon4.jpeg" alt="Jaedon candid" fill className="object-cover" sizes="(min-width: 1024px) 280px, 65vw" priority={false} />
                        )}
                      </motion.div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right column: bio card + timeline */}
          <motion.div
            style={{ opacity: cardOpacity, y: cardY }}
            className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_auto] gap-8 xl:gap-10 min-w-0 w-full"
          >
            {/* Bio card */}
            <GlassEffect className="relative z-50 w-full p-6 xl:p-10 2xl:p-12 rounded-3xl shadow-[0_18px_60px_rgba(15,23,42,0.7)]">
              <GlowingEffect disabled={false} spread={60} inactiveZone={0.3} proximity={60} borderWidth={2} movementDuration={1.5} />
              <p className="text-xs md:text-sm uppercase tracking-[0.26em] text-white/60 mb-4">
                Hello, I&apos;m Jaedon
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 md:mb-6 leading-tight md:leading-snug">
                Building systems that scale, and software that lasts.
              </h2>
              <p className="text-white/90 text-base md:text-lg leading-relaxed md:leading-relaxed">
                I&apos;m a Computer Science student at the University of Florida and an incoming Software Engineer
                at Datadog. I gravitate toward backend and distributed systems work, building software that has
                to hold up when things get complicated. I&apos;ve worked across the stack and pick up whatever
                the problem needs. I care about writing code that&apos;s correct, fast, and built to last.
              </p>
            </GlassEffect>

            {/* Timeline */}
            <div className="w-full max-w-sm h-full">
              <div className="relative flex flex-col justify-between h-full py-6">
                {/* Vertical connector line */}
                <motion.div
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={timelineVisible ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
                  transition={{
                    duration: timelineVisible ? 0.5 : 0.18,
                    delay: timelineVisible ? 0.32 : 0,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  style={{ transformOrigin: 'top' }}
                  className="absolute left-7 top-[3.5rem] bottom-[3.5rem] w-px bg-gradient-to-b from-white/40 via-white/25 to-white/20"
                  aria-hidden
                />

                {/* University of Florida */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={timelineVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, delay: timelineVisible ? 0 : 0.20, ease: 'easeOut' }}
                  className="relative z-10 flex flex-row items-center gap-4"
                >
                  <div className="relative rounded-2xl shrink-0">
                    <GlowingEffect disabled={false} spread={60} inactiveZone={0} proximity={70} borderWidth={2} movementDuration={1.2} />
                    <GlassEffect className="w-14 h-14 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex items-center justify-center overflow-hidden">
                      <Image src="/images/uf-block.svg" alt="University of Florida" width={48} height={48} className="w-10 h-10 object-contain" sizes="56px" />
                    </GlassEffect>
                  </div>
                  <div>
                    <p className="font-semibold text-white">University<br />of Florida</p>
                    <p className="text-sm text-white/60">Computer Science</p>
                  </div>
                </motion.div>

                {/* Baron Technologies */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={timelineVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, delay: timelineVisible ? 0.14 : 0.10, ease: 'easeOut' }}
                  className="relative z-10 flex flex-row items-center gap-4"
                >
                  <div className="relative rounded-2xl shrink-0">
                    <GlowingEffect disabled={false} spread={60} inactiveZone={0} proximity={70} borderWidth={2} movementDuration={1.2} />
                    <GlassEffect className="w-14 h-14 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex items-center justify-center overflow-hidden">
                      <Image src="/images/baron.svg" alt="Baron Technologies" width={48} height={48} className="w-10 h-10 object-contain" sizes="56px" />
                    </GlassEffect>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Baron Technologies</p>
                    <p className="text-sm text-white/60">Software Engineer</p>
                  </div>
                </motion.div>

                {/* Datadog */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={timelineVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, delay: timelineVisible ? 0.28 : 0, ease: 'easeOut' }}
                  className="relative z-10 flex flex-row items-center gap-4"
                >
                  <div className="relative rounded-2xl shrink-0">
                    <GlowingEffect disabled={false} spread={60} inactiveZone={0} proximity={70} borderWidth={2} movementDuration={1.2} />
                    <GlassEffect className="w-14 h-14 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex items-center justify-center overflow-hidden p-1.5">
                      <span className="block w-full h-full text-[#774AA4]">
                        <span className="block w-full h-full bg-current [mask-image:url('/images/datadog.svg')] [mask-size:contain] [mask-position:center] [mask-repeat:no-repeat]" />
                      </span>
                    </GlassEffect>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Datadog</p>
                    <p className="text-sm text-white/60">Software Engineer</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
