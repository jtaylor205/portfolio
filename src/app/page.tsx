'use client';

import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useLenis } from "@/hooks/useLenis";
import GlassNavBar, { SECTIONS } from "@/components/GlassNavBar";
import SocialButtons from "@/components/SocialButtons";
import ThreeBackground from "@/components/background/ThreeBackground";

type ScrollSectionProps = {
  id: string;
  children: React.ReactNode;
};

const ScrollSection = forwardRef<HTMLElement, ScrollSectionProps>(function ScrollSection({ id, children }, ref) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const setRef = (el: HTMLElement | null) => {
    sectionRef.current = el;
    if (ref) {
      if (typeof ref === "function") ref(el);
      else (ref as React.MutableRefObject<HTMLElement | null>).current = el;
    }
  };
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 0.5, 1], ["18vh", "0vh", "-18vh"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.97, 1, 0.97]);

  return (
    <section ref={setRef} id={id} className="relative min-h-screen">
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 flex items-center justify-center p-5"
      >
        {children}
      </motion.div>
    </section>
  );
});

const SKILLS = ["TypeScript", "React", "Next.js", "Node.js", "Python", "SQL"];

function SkillRevealChip({
  name,
  index,
  total,
  scrollProgress,
}: {
  name: string;
  index: number;
  total: number;
  scrollProgress: MotionValue<number>;
}) {
  const start = 0.06 + (index / total) * 0.78;
  const end = 0.06 + ((index + 1) / total) * 0.78;
  const progress = useTransform(scrollProgress, [start, end], [0, 1]);
  const y = useTransform(progress, [0, 1], [28, 0]);
  const opacity = useTransform(progress, [0, 1], [0, 1]);
  return (
    <motion.span
      style={{ opacity, y }}
      className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium"
    >
      {name}
    </motion.span>
  );
}

export default function Home() {
  const lenisRef = useLenis();
  const aboutSectionRef = useRef<HTMLDivElement | null>(null);
  const skillsSectionRef = useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = useState('home');
  const scrollTargetRef = useRef<string | null>(null);
  const scrollTargetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [chevronDirection, setChevronDirection] = useState<'down' | 'up'>('down');
  const lastScrollY = useRef(0);

  // About: Apple-style sticky scroll-reveal – card, then line, then UF → Baron → Datadog
  const { scrollYProgress: aboutProgress } = useScroll({
    target: aboutSectionRef,
    offset: ["start start", "end end"],
  });
  const cardOpacity = useTransform(aboutProgress, [0, 0.12], [0, 1]);
  const cardY = useTransform(aboutProgress, [0, 0.12], [28, 0]);
  const lineOpacity = useTransform(aboutProgress, [0.1, 0.22], [0, 1]);
  const lineScaleY = useTransform(aboutProgress, [0.1, 0.22], [0, 1]);
  const ufOpacity = useTransform(aboutProgress, [0.2, 0.38], [0, 1]);
  const ufX = useTransform(aboutProgress, [0.2, 0.38], [-20, 0]);
  const baronOpacity = useTransform(aboutProgress, [0.36, 0.54], [0, 1]);
  const baronX = useTransform(aboutProgress, [0.36, 0.54], [-20, 0]);
  const datadogOpacity = useTransform(aboutProgress, [0.52, 0.7], [0, 1]);
  const datadogX = useTransform(aboutProgress, [0.52, 0.7], [-20, 0]);

  // Skills: sticky scroll-reveal (Apple-style) – section “stops” and items pop in as you scroll
  const { scrollYProgress: skillsProgress } = useScroll({
    target: skillsSectionRef,
    offset: ["start start", "end end"],
  });
  const skillsTitleOpacity = useTransform(skillsProgress, [0, 0.12], [0, 1]);
  const skillsTitleY = useTransform(skillsProgress, [0, 0.12], [20, 0]);


  const [slotImages, setSlotImages] = useState<Array<'one' | 'two' | 'three' | 'four'>>([
    'one',   // front
    'two',   // back-left
    'three', // back-center
    'four',  // back-right
  ]);

  // Active section = section that contains the viewport center (forward order, last match wins so About wins over Home when overlapping)
  useEffect(() => {
    const updateActiveFromScroll = () => {
      const viewportCenter = window.scrollY + window.innerHeight / 2;
      let active: string | null = null;
      for (let i = 0; i < SECTIONS.length; i++) {
        const el = document.getElementById(SECTIONS[i].id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const height = el.offsetHeight;
        if (viewportCenter >= top && viewportCenter < top + height) {
          active = SECTIONS[i].id;
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

    window.addEventListener("scroll", onScroll, { passive: true });
    updateActiveFromScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        setChevronDirection('down');
      } else if (currentScrollY < lastScrollY.current) {
        setChevronDirection('up');
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent browser from restoring a random scroll position on refresh
  // and always start at the top.
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
    // Sticky scroll-reveal sections: scroll to end so content is fully revealed
    const isStickyReveal = id === "about" || id === "skills";
    const targetScrollY = isStickyReveal
      ? sectionTop + sectionHeight - viewportHeight
      : sectionTop + sectionHeight / 2 - viewportHeight / 2;
    // Smooth scroll when using nav; effective progress keeps About/Skills at “full” as we pass through (no reveal/undo animations)
    if (lenisRef.current) {
      lenisRef.current.scrollTo(Math.max(0, targetScrollY), { immediate: true });
    } else {
      window.scrollTo({ top: Math.max(0, targetScrollY) });
    }
    scrollTargetTimeoutRef.current = setTimeout(() => {
      scrollTargetRef.current = null;
      scrollTargetTimeoutRef.current = null;
    }, 2000);
  };

  return (
    <div className="relative min-h-screen">
      <ThreeBackground />
      <GlassNavBar activeId={activeId} onSelect={handleNavSelect} />
      <SocialButtons />
      <ScrollSection id="home">
        <div className="relative flex flex-col items-center gap-6 text-center">
          {/* Name – Monument Extended stub (you can wire the real font later) */}
          <motion.h1
            className="text-7xl sm:text-8xl md:text-9xl font-extrabold tracking-[0.05em] uppercase text-white drop-shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
            style={{
              fontFamily: 'var(--font-monument-wide), var(--font-poppins), system-ui',
            }}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            Jaedon&nbsp;Taylor
          </motion.h1>

          {/* Glassy subtitle chips */}
          <div className="flex flex-col items-center gap-3">
            <motion.div
              className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/25 text-sm sm:text-base text-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
            >
              University of Florida Student
            </motion.div>

            <motion.div
              className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/25 text-sm sm:text-base text-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.6 }}
            >
              Incoming Software Engineer @ Datadog
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator – floating chevrons */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
        >
          <div className="flex flex-col items-center -space-y-2">
            {/* Top chevron - more opaque */}
            <motion.svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white"
              animate={{
                y: [0, 2, 4, 2, 0],
                opacity: chevronDirection === 'down' ? [1, 0.8, 0.6, 0.8, 1] : [0.6, 0.8, 1, 0.8, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: chevronDirection === 'down' ? 0.3 : 0,
              }}
              key={`top-${chevronDirection}`}
            >
              <path
                d="M7 10L12 15L17 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
            {/* Bottom chevron - more transparent */}
            <motion.svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white"
              animate={{
                y: [0, 2, 4, 2, 0],
                opacity: chevronDirection === 'down' ? [0.4, 0.28, 0.15, 0.28, 0.4] : [0.15, 0.28, 0.4, 0.28, 0.15],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: chevronDirection === 'down' ? 0 : 0.3,
              }}
              key={`bottom-${chevronDirection}`}
            >
              <path
                d="M7 10L12 15L17 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </div>
        </motion.div>
      </ScrollSection>

      {/* About: Apple-style sticky block – scroll through section, line then UF → Baron → Datadog reveal */}
      <div
        id="about"
        ref={aboutSectionRef}
        className="relative"
        style={{ height: "400vh" }}
      >
        <div className="sticky top-0 h-screen flex items-center justify-center p-5">
          <div className="max-w-6xl w-full grid gap-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.65fr)] items-center">
          {/* Photo stack of four — left column, original space */}
          <div className="relative -ml-4 md:-ml-20 flex justify-start">
            <div className="relative w-full max-w-md aspect-[4/5]">
              {slotImages.map((imageKey, slotIndex) => {
                const isFront = slotIndex === 0;

                const baseTransforms = [
                  { scale: 1.08, x: -70, y: 36, rotate: 0 },           // front (slightly larger)
                  { scale: 0.96, x: -260, y: -18, rotate: -24 },       // left – wide fan but closer
                  { scale: 0.94, x: -70, y: -82, rotate: 0 },          // center – a bit lower
                  { scale: 0.96, x: 120, y: -18, rotate: 24 },         // right – wide fan but closer
                ] as const;

                const zIndexBySlot = [40, 20, 15, 10] as const;
                const { scale, x, y, rotate } = baseTransforms[slotIndex];

                const hover = isFront
                  ? undefined
                  : { scale: scale + 0.14 };

                const handleClick = () => {
                  if (slotIndex === 0) return;
                  setSlotImages((prev) => {
                    const next = [...prev] as typeof prev;
                    const tmp = next[0];
                    next[0] = next[slotIndex];
                    next[slotIndex] = tmp;
                    return next;
                  });
                };

                const commonProps = {
                  initial: { opacity: 0, y: y + 20 },
                  whileInView: { opacity: 1 },
                  animate: { scale, x, y, rotate },
                  whileHover: hover,
                  viewport: { once: true, amount: 0.4 },
                  transition: {
                    stiffness: 230,
                    damping: 26,
                    delay: 0.06 * slotIndex,
                  },
                  style: { zIndex: zIndexBySlot[slotIndex] },
                  className:
                    "absolute top-1/2 left-1/2 w-[82%] aspect-[4/5] -translate-x-1/2 -translate-y-1/2 rounded-3xl overflow-hidden border border-white/20 bg-black/25 shadow-[0_22px_80px_rgba(15,23,42,0.85)] cursor-pointer",
                  onClick: handleClick,
                };

                return (
                  <motion.div key={`slot-${slotIndex}`} {...commonProps}>
                    <motion.div
                      key={imageKey}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="w-full h-full"
                    >
                      {imageKey === 'one' && (
                        <Image
                          src="/images/jaedon1.jpg"
                          alt="Jaedon main portrait"
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 320px, 70vw"
                          priority={false}
                        />
                      )}
                      {imageKey === 'two' && (
                        <Image
                          src="/images/jaedon2.jpeg"
                          alt="Jaedon speaking"
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 300px, 65vw"
                          priority={false}
                        />
                      )}
                      {imageKey === 'three' && (
                        <Image
                          src="/images/jaedon3.jpeg"
                          alt="Jaedon portrait 2"
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 280px, 65vw"
                          priority={false}
                        />
                      )}
                      {imageKey === 'four' && (
                        <Image
                          src="/images/jaedon4.jpeg"
                          alt="Jaedon candid"
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 280px, 65vw"
                          priority={false}
                        />
                      )}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right column: card + timeline — scroll-driven (Lenis) so they appear as section lands */}
          <motion.div
            style={{ opacity: cardOpacity, y: cardY }}
            className="grid grid-cols-1 md:grid-cols-[minmax(38rem,1fr)_auto] gap-8 md:gap-10 min-w-0 w-full md:pl-16"
          >
            {/* Copy card — height drives timeline column */}
            <div className="relative z-50 w-full max-w-xl lg:max-w-3xl p-6 md:p-9 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-[0_18px_60px_rgba(15,23,42,0.7)]">
              <p className="text-xs md:text-sm uppercase tracking-[0.26em] text-white/60 mb-4">
                Hello, I&apos;m Jaedon
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 md:mb-6 drop-shadow-lg leading-tight md:leading-snug">
                Building experiences that actually feel good to use.
              </h2>
              <p className="text-white/90 text-base md:text-lg leading-relaxed md:leading-relaxed">
                I&apos;m an undergraduate Computer Science student at the University of Florida and an incoming
                Software Engineer at Datadog. I care a lot about the intersection of product, design, and
                engineering—shaping ideas into interfaces that feel intuitive, responsive, and a little bit
                memorable.
              </p>
            </div>

            {/* Timeline: line from UF to Datadog only; items revealed by scroll progress */}
            <div className="w-full max-w-sm">
              <div className="relative flex flex-col gap-10 py-6">
                {/* Vertical line — reveals first (grows down), then timeline items */}
                <motion.div
                  style={{
                    opacity: lineOpacity,
                    scaleY: lineScaleY,
                    transformOrigin: "top",
                  }}
                  className="absolute left-7 top-[3.5rem] bottom-[3.5rem] w-px bg-gradient-to-b from-white/40 via-white/25 to-white/20"
                  aria-hidden
                />

                {/* UF */}
                <motion.div
                  style={{ opacity: ufOpacity, x: ufX }}
                  className="relative z-10 flex flex-row items-center gap-4 group"
                >
                  <div className="relative w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.2)] flex items-center justify-center shrink-0 overflow-hidden transition-all duration-200 group-hover:bg-white/30 group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.16)]">
                    {/* Default: UF block in white (mask) */}
                    <span className="absolute inset-0 flex items-center justify-center text-white transition-opacity duration-200 group-hover:opacity-0">
                      <span className="block w-10 h-10 bg-current [mask-image:url('/images/uf-block.svg')] [mask-size:contain] [mask-position:center] [mask-repeat:no-repeat]" />
                    </span>
                    {/* Hover: original blue UF SVG */}
                    <Image
                      src="/images/uf-block.svg"
                      alt="University of Florida"
                      width={48}
                      height={48}
                      className="absolute inset-0 w-10 h-10 object-contain m-auto opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none"
                      sizes="56px"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-white">University<br />of Florida</p>
                    <p className="text-sm text-white/60">Computer Science</p>
                  </div>
                </motion.div>

                {/* Baron */}
                <motion.div
                  style={{ opacity: baronOpacity, x: baronX }}
                  className="relative z-10 flex flex-row items-center gap-4 group"
                >
                  <div className="relative w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.2)] flex items-center justify-center shrink-0 overflow-hidden transition-all duration-200 group-hover:bg-white/30 group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.16)]">
                    {/* Default: isometric Rubik's cube (SVG you provided) */}
                    <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 group-hover:opacity-0">
                      <Image
                        src="/images/rubiks-cube-isometric.svg"
                        alt=""
                        width={40}
                        height={40}
                        className="w-10 h-10 object-contain"
                        sizes="40px"
                      />
                    </span>
                    {/* Hover: Baron logo (filled SVG) */}
                    <Image
                      src="/images/baron.svg"
                      alt="Baron Technologies"
                      width={48}
                      height={48}
                      className="absolute inset-0 w-10 h-10 object-contain m-auto opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none"
                      sizes="56px"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Baron Technologies</p>
                    <p className="text-sm text-white/60">Software Engineer</p>
                  </div>
                </motion.div>

                {/* Datadog */}
                <motion.div
                  style={{ opacity: datadogOpacity, x: datadogX }}
                  className="relative z-10 flex flex-row items-center gap-4 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.2)] flex items-center justify-center shrink-0 overflow-hidden transition-all duration-200 group-hover:bg-white/30 group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.16)] p-1.5">
                    <span className="block w-full h-full text-white/90 transition-colors duration-200 group-hover:text-[#774AA4]">
                      <span className="block w-full h-full bg-current [mask-image:url('/images/datadog.svg')] [mask-size:contain] [mask-position:center] [mask-repeat:no-repeat]" />
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Datadog</p>
                    <p className="text-sm text-white/60">Incoming SWE</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
        </div>
      </div>

      {/* Skills Section */}
      {/* Skills: Apple-style sticky block – scroll “through” the section, content stays fixed and items reveal */}
      <div
        id="skills"
        ref={skillsSectionRef}
        className="relative"
        style={{ height: "400vh" }}
      >
        <div className="sticky top-0 h-screen flex items-center justify-center p-5">
          <div className="max-w-4xl w-full">
            <motion.h2
              style={{ opacity: skillsTitleOpacity, y: skillsTitleY }}
              className="text-3xl font-bold text-white mb-12 text-center drop-shadow-lg"
            >
              Skills
            </motion.h2>
            <div className="flex flex-wrap justify-center gap-3">
              {SKILLS.map((name, i) => (
                <SkillRevealChip
                  key={name}
                  name={name}
                  index={i}
                  total={SKILLS.length}
                  scrollProgress={skillsProgress}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <ScrollSection id="projects">
        <div className="max-w-4xl w-full">
          <h2 className="text-3xl font-bold text-white mb-12 text-center drop-shadow-lg">
            My Projects
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Project One</h3>
              <p className="text-white/90 mb-4">
                A beautiful web application built with React and modern design principles.
              </p>
              <button className="px-4 py-2 text-sm bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 text-white hover:bg-white/30 transition-all">
                View Project
              </button>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Project Two</h3>
              <p className="text-white/90 mb-4">
                An innovative solution combining cutting-edge technology with user-centered design.
              </p>
              <button className="px-4 py-2 text-sm bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 text-white hover:bg-white/30 transition-all">
                View Project
              </button>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* Contact Section */}
      <ScrollSection id="contact">
        <div className="max-w-md p-8 text-center bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">
            Get In Touch
          </h2>
          <p className="text-white/90 text-lg mb-8 leading-relaxed">
            Ready to work together? Let's create something amazing!
          </p>
          <button className="px-6 py-3 text-base bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 text-white hover:bg-white/30 transition-all">
            Contact Me
          </button>
        </div>
      </ScrollSection>
    </div>
  );
}