'use client';

import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValue, useMotionValueEvent, animate, type MotionValue } from "framer-motion";
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

type Skill = { name: string; slug: string; localSrc?: string };

const SKILL_CATEGORIES: { label: string; skills: Skill[] }[] = [
  {
    label: "Languages",
    skills: [
      { name: "Python", slug: "python" },
      { name: "JavaScript", slug: "javascript" },
      { name: "TypeScript", slug: "typescript" },
      { name: "C", slug: "c" },
      { name: "C++", slug: "cplusplus" },
      { name: "Go", slug: "go" },
      { name: "Swift", slug: "swift" },
    ],
  },
  {
    label: "Data & Infrastructure",
    skills: [
      { name: "PostgreSQL", slug: "postgresql" },
      { name: "MySQL", slug: "mysql" },
      { name: "Redis", slug: "redis" },
      { name: "Cassandra", slug: "apachecassandra" },
      { name: "Kubernetes", slug: "kubernetes" },
      { name: "Docker", slug: "docker" },
      { name: "Git", slug: "git" },
    ],
  },
  {
    label: "Frontend",
    skills: [
      { name: "React", slug: "react" },
      { name: "Next.js", slug: "nextdotjs" },
      { name: "Tailwind", slug: "tailwindcss" },
      { name: "HTML", slug: "html5" },
      { name: "CSS", slug: "css" },
    ],
  },
  {
    label: "Backend & APIs",
    skills: [
      { name: "Node.js", slug: "nodedotjs" },
      { name: "gRPC", slug: "grpc", localSrc: "/images/grpc.svg" },
      { name: "Protobuf", slug: "protocolbuffers" },
      { name: "Kafka", slug: "apachekafka" },
    ],
  },
];

const TOTAL_SKILLS = SKILL_CATEGORIES.reduce((sum, c) => sum + c.skills.length, 0);

function SkillPill({
  name,
  slug,
  localSrc,
  globalIndex,
  scrollProgress,
}: Skill & { globalIndex: number; scrollProgress: MotionValue<number> }) {
  const [imgError, setImgError] = useState(false);
  const imgSrc = localSrc ?? `https://cdn.simpleicons.org/${slug}/ffffff`;
  const start = 0.12 + (globalIndex / TOTAL_SKILLS) * 0.60;
  const end = start + (1 / TOTAL_SKILLS) * 0.60;
  const opacity = useTransform(scrollProgress, [start, end], [0, 1]);
  const y = useTransform(scrollProgress, [start, end], [16, 0]);
  return (
    <motion.div
      style={{ opacity, y }}
      whileHover={{ backgroundColor: "rgba(255,255,255,0.18)" }}
      transition={{ duration: 0.15 }}
      className="flex flex-col items-center gap-2 pt-3 pb-2.5 px-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-[0_4px_16px_rgba(0,0,0,0.10)] w-[76px] cursor-default"
    >
      {imgError ? (
        <span className="h-9 flex items-center text-white/70 text-[10px] font-bold uppercase tracking-wide text-center leading-tight">{name}</span>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={imgSrc}
          alt={name}
          className={`w-9 h-9 object-contain${localSrc ? " brightness-0 invert" : ""}`}
          loading="lazy"
          onError={() => setImgError(true)}
        />
      )}
      <span className="text-white/75 text-[11px] font-medium text-center leading-tight">{name}</span>
    </motion.div>
  );
}

function SkillCategory({
  label,
  skills,
  startIndex,
  scrollProgress,
}: {
  label: string;
  skills: Skill[];
  startIndex: number;
  scrollProgress: MotionValue<number>;
}) {
  const labelStart = 0.12 + (startIndex / TOTAL_SKILLS) * 0.60;
  const labelEnd = labelStart + (1 / TOTAL_SKILLS) * 0.60;
  const labelOpacity = useTransform(scrollProgress, [labelStart, labelEnd], [0, 1]);
  const labelY = useTransform(scrollProgress, [labelStart, labelEnd], [16, 0]);
  return (
    <div>
      <motion.div style={{ opacity: labelOpacity, y: labelY }} className="flex items-center gap-3 mb-3">
        <span className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-semibold whitespace-nowrap">
          {label}
        </span>
        <div className="flex-1 h-px bg-white/10" />
      </motion.div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <SkillPill
            key={skill.name}
            {...skill}
            globalIndex={startIndex + i}
            scrollProgress={scrollProgress}
          />
        ))}
      </div>
    </div>
  );
}

type Project = {
  name: string;
  category: string;
  description: string;
  accent: string;
  tech: { name: string; slug: string }[];
  github?: string;
};

const PROJECTS: Project[] = [
  {
    name: "HTTP Capture & Replay",
    category: "Developer Tools",
    description: "A local reverse proxy that intercepts HTTP(S) traffic, redacts sensitive data at capture time, and replays full multi-request sessions via a web UI.",
    accent: "linear-gradient(90deg, #38bdf8, #6366f1)",
    tech: [
      { name: "Go", slug: "go" },
      { name: "Next.js", slug: "nextdotjs" },
      { name: "TypeScript", slug: "typescript" },
      { name: "SQLite", slug: "sqlite" },
    ],
  },
  {
    name: "Solace",
    category: "Mobile App / AI",
    description: "An AI-powered wellness companion that delivers personalized mental health support, mood tracking, and guided exercises using Google Gemini.",
    accent: "linear-gradient(90deg, #a855f7, #ec4899)",
    tech: [
      { name: "React Native", slug: "react" },
      { name: "JavaScript", slug: "javascript" },
      { name: "Firebase", slug: "firebase" },
      { name: "Gemini", slug: "googlegemini" },
    ],
    github: "#",
  },
  {
    name: "Food Fridge",
    category: "Mobile App",
    description: "An iOS app that tracks fridge inventory, flags expiring items, and suggests recipes based on what you already have.",
    accent: "linear-gradient(90deg, #22c55e, #14b8a6)",
    tech: [
      { name: "Swift", slug: "swift" },
      { name: "Firebase", slug: "firebase" },
    ],
    github: "#",
  },
  {
    name: "Phone Guru",
    category: "Web Development / AI",
    description: "An AI web tool that recommends the right smartphone for any user through a conversational interface powered by OpenAI.",
    accent: "linear-gradient(90deg, #f97316, #eab308)",
    tech: [
      { name: "Python", slug: "python" },
      { name: "HTML", slug: "html5" },
      { name: "CSS", slug: "css" },
      { name: "JavaScript", slug: "javascript" },
      { name: "OpenAI", slug: "chatgpt" },
    ],
    github: "#",
  },
  {
    name: "File System",
    category: "Operating Systems",
    description: "A Unix-style file system built from scratch in C, supporting hierarchical directories, file permissions, and persistent on-disk storage.",
    accent: "linear-gradient(90deg, #ef4444, #f97316)",
    tech: [
      { name: "C", slug: "c" },
      { name: "C++", slug: "cplusplus" },
      { name: "Linux", slug: "linux" },
    ],
    github: "#",
  },
  {
    name: "Stock Market Analyzer",
    category: "Data Analysis",
    description: "A Python tool that processes historical market data to surface trends, correlations, and potential trading signals across multiple tickers.",
    accent: "linear-gradient(90deg, #eab308, #84cc16)",
    tech: [
      { name: "Python", slug: "python" },
    ],
  },
];

function ProjectCard({
  name,
  category,
  description,
  accent,
  tech,
  github,
  index,
  visible,
}: Project & { index: number; visible: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.4, delay: visible ? index * 0.07 : (PROJECTS.length - 1 - index) * 0.07, ease: "easeOut" }}
      className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(15,23,42,0.3)] flex flex-col overflow-hidden min-h-[220px]"
    >
      {/* Accent bar */}
      <div className="h-1 w-full shrink-0" style={{ background: accent }} />

      <div className="p-7 flex flex-col gap-3 flex-1">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1">{category}</p>
          <h3 className="text-lg font-bold text-white leading-snug mb-2">{name}</h3>
          <p className="text-sm text-white/60 leading-relaxed">{description}</p>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {tech.map(({ slug, name: techName }) => (
            <div
              key={slug}
              className="w-9 h-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://cdn.simpleicons.org/${slug}/ffffff`}
                alt={techName}
                className="w-5 h-5 object-contain"
                loading="lazy"
                onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none'; }}
              />
            </div>
          ))}
        </div>

        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-[11px] text-white/70 hover:bg-white/20 hover:text-white transition-colors"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://cdn.simpleicons.org/github/ffffff" alt="GitHub" className="w-3.5 h-3.5 object-contain" loading="lazy" />
            GitHub
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function Home() {
  const lenisRef = useLenis();
  const homeSectionRef = useRef<HTMLDivElement | null>(null);
  const aboutSectionRef = useRef<HTMLDivElement | null>(null);
  const skillsSectionRef = useRef<HTMLDivElement | null>(null);
  const projectsSectionRef = useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = useState('home');
  const scrollTargetRef = useRef<string | null>(null);
  const scrollTargetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [chevronDirection, setChevronDirection] = useState<'down' | 'up'>('down');
  const contentOpacity = useMotionValue(1);
  const lastScrollY = useRef(0);

  // Home: sticky scroll-reveal – name mounts immediately, chips reveal on scroll
  const { scrollYProgress: homeProgress } = useScroll({
    target: homeSectionRef,
    offset: ["start start", "end end"],
  });
  const chip1Opacity = useTransform(homeProgress, [0.10, 0.25], [0, 1]);
  const chip1Y = useTransform(homeProgress, [0.10, 0.25], [20, 0]);
  const chip2Opacity = useTransform(homeProgress, [0.38, 0.53], [0, 1]);
  const chip2Y = useTransform(homeProgress, [0.38, 0.53], [20, 0]);

  // About: Apple-style sticky scroll-reveal – card → photos → timeline
  const { scrollYProgress: aboutProgress } = useScroll({
    target: aboutSectionRef,
    offset: ["start start", "end end"],
  });
  const cardOpacity = useTransform(aboutProgress, [0, 0.12], [0, 1]);
  const cardY = useTransform(aboutProgress, [0, 0.12], [28, 0]);
  // Per-photo scroll reveals: back-left → back-center → back-right → front
  const photoOpacity1 = useTransform(aboutProgress, [0.15, 0.22], [0, 1]);
  const photoY1      = useTransform(aboutProgress, [0.15, 0.22], [20, 0]);
  const photoOpacity2 = useTransform(aboutProgress, [0.20, 0.27], [0, 1]);
  const photoY2      = useTransform(aboutProgress, [0.20, 0.27], [20, 0]);
  const photoOpacity3 = useTransform(aboutProgress, [0.25, 0.32], [0, 1]);
  const photoY3      = useTransform(aboutProgress, [0.25, 0.32], [20, 0]);
  const photoOpacity0 = useTransform(aboutProgress, [0.30, 0.37], [0, 1]);
  const photoY0      = useTransform(aboutProgress, [0.30, 0.37], [20, 0]);
  const photoOpacities = [photoOpacity0, photoOpacity1, photoOpacity2, photoOpacity3];
  const photoScrollYs  = [photoY0, photoY1, photoY2, photoY3];
  const lineOpacity = useTransform(aboutProgress, [0.3, 0.4], [0, 1]);
  const lineScaleY = useTransform(aboutProgress, [0.3, 0.4], [0, 1]);
  const [timelineVisible, setTimelineVisible] = useState(false);
  useMotionValueEvent(aboutProgress, "change", (v) => {
    setTimelineVisible(v > 0.38);
  });

  // Skills: sticky scroll-reveal (Apple-style) – section "stops" and items pop in as you scroll
  const { scrollYProgress: skillsProgress } = useScroll({
    target: skillsSectionRef,
    offset: ["start start", "end end"],
  });
  const skillsTitleOpacity = useTransform(skillsProgress, [0, 0.12], [0, 1]);
  const skillsTitleY = useTransform(skillsProgress, [0, 0.12], [20, 0]);

  // Projects: sticky scroll — cards cascade in once user scrolls ~20% into section
  const { scrollYProgress: projectsProgress } = useScroll({
    target: projectsSectionRef,
    offset: ["start start", "end end"],
  });
  const projectsTitleOpacity = useTransform(projectsProgress, [0, 0.12], [0, 1]);
  const projectsTitleY = useTransform(projectsProgress, [0, 0.12], [20, 0]);
  const [projectsVisible, setProjectsVisible] = useState(false);
  useMotionValueEvent(projectsProgress, "change", (v) => {
    setProjectsVisible(v > 0.35);
  });

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
    const isStickyReveal = id === "about" || id === "skills" || id === "projects";
    const targetScrollY = id === "home"
      ? 0
      : isStickyReveal
        ? sectionTop + sectionHeight - viewportHeight
        : sectionTop + sectionHeight / 2 - viewportHeight / 2;
    const target = Math.max(0, targetScrollY);
    // Fade out → instant jump → fade in
    animate(contentOpacity, 0, { duration: 0.15, ease: "easeIn" }).then(() => {
      if (document.scrollingElement) {
        (document.scrollingElement as HTMLElement).scrollTop = target;
      }
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, { immediate: true });
      }
      animate(contentOpacity, 1, { duration: 0.35, ease: "easeOut" });
    });
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
      <motion.div style={{ opacity: contentOpacity }}>
      {/* Home: Apple-style sticky block – name mounts immediately, chips reveal on scroll */}
      <div
        id="home"
        ref={homeSectionRef}
        className="relative"
        style={{ height: "320vh" }}
      >
        <div className="relative sticky top-0 h-screen flex items-center justify-center p-5">
          <div className="flex flex-col items-center gap-6 text-center">
            {/* Name – mounts on load */}
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

            {/* Glassy subtitle chips – scroll-driven reveal */}
            <div className="flex flex-col items-center gap-3">
              <motion.div
                className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/25 text-sm sm:text-base text-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                style={{ opacity: chip1Opacity, y: chip1Y }}
              >
                University of Florida Student
              </motion.div>

              <motion.div
                className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/25 text-sm sm:text-base text-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                style={{ opacity: chip2Opacity, y: chip2Y }}
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
        </div>
      </div>

      {/* About: Apple-style sticky block – scroll through section, line then UF → Baron → Datadog reveal */}
      <div
        id="about"
        ref={aboutSectionRef}
        className="relative"
        style={{ height: "400vh" }}
      >
        <div className="sticky top-0 h-screen flex items-center justify-center p-5">
          <div className="max-w-6xl w-full grid gap-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.65fr)] items-center">
          {/* Photo stack of four — left column, scroll-driven reveal */}
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

                return (
                  <motion.div
                    key={`reveal-${slotIndex}`}
                    style={{
                      opacity: photoOpacities[slotIndex],
                      y: photoScrollYs[slotIndex],
                      position: "absolute",
                      inset: 0,
                      zIndex: zIndexBySlot[slotIndex],
                      overflow: "visible",
                      pointerEvents: "none",
                    }}
                  >
                    <motion.div
                      key={`slot-${slotIndex}`}
                      animate={{ scale, x, y, rotate }}
                      whileHover={hover}
                      transition={{
                        type: "spring",
                        stiffness: 230,
                        damping: 26,
                        delay: 0.06 * slotIndex,
                      }}
                      className="absolute top-1/2 left-1/2 w-[82%] aspect-[4/5] -translate-x-1/2 -translate-y-1/2 rounded-3xl overflow-hidden border border-white/20 bg-black/25 shadow-[0_22px_80px_rgba(15,23,42,0.85)] cursor-pointer"
                      style={{ pointerEvents: "auto" }}
                      onClick={handleClick}
                    >
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
                Building systems that scale, and software that lasts.
              </h2>
              <p className="text-white/90 text-base md:text-lg leading-relaxed md:leading-relaxed">
                I&apos;m a Computer Science student at the University of Florida and an incoming Software Engineer
                at Datadog. I gravitate toward backend and distributed systems work, building software that has
                to hold up when things get complicated. I&apos;ve worked across the stack and pick up whatever
                the problem needs. I care about writing code that&apos;s correct, fast, and built to last.
              </p>
            </div>

            {/* Timeline: line from UF to Datadog only; items revealed by scroll progress */}
            <div className="w-full max-w-sm h-full">
              <div className="relative flex flex-col justify-between h-full py-6">
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
                  initial={{ opacity: 0, x: -20 }}
                  animate={timelineVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, delay: timelineVisible ? 0 : 0.24, ease: "easeOut" }}
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
                  initial={{ opacity: 0, x: -20 }}
                  animate={timelineVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, delay: 0.12, ease: "easeOut" }}
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
                  initial={{ opacity: 0, x: -20 }}
                  animate={timelineVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, delay: timelineVisible ? 0.24 : 0, ease: "easeOut" }}
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
      {/* Skills: Apple-style sticky block – scroll "through" the section, content stays fixed and items reveal */}
      <div
        id="skills"
        ref={skillsSectionRef}
        className="relative"
        style={{ height: "500vh" }}
      >
        <div className="sticky top-0 h-screen flex items-center justify-center p-5">
          <div className="max-w-3xl w-full">
            <motion.div
              style={{ opacity: skillsTitleOpacity, y: skillsTitleY }}
              className="flex justify-center mb-10"
            >
              <div className="px-7 py-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_4px_24px_rgba(15,23,42,0.3)]">
                <h2 className="text-2xl font-bold text-white">My Skills</h2>
              </div>
            </motion.div>
            <div className="flex flex-col gap-6">
              {SKILL_CATEGORIES.map(({ label, skills }, catIdx) => {
                const startIndex = SKILL_CATEGORIES.slice(0, catIdx).reduce((sum, c) => sum + c.skills.length, 0);
                return (
                  <SkillCategory
                    key={label}
                    label={label}
                    skills={skills}
                    startIndex={startIndex}
                    scrollProgress={skillsProgress}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div
        id="projects"
        ref={projectsSectionRef}
        className="relative"
        style={{ height: "400vh" }}
      >
        <div className="sticky top-0 h-screen flex items-center justify-center p-5">
          <div className="max-w-5xl w-full">
            <motion.div
              style={{ opacity: projectsTitleOpacity, y: projectsTitleY }}
              className="flex justify-center mb-10"
            >
              <div className="px-7 py-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_4px_24px_rgba(15,23,42,0.3)]">
                <h2 className="text-2xl font-bold text-white">My Projects</h2>
              </div>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {PROJECTS.map((project, i) => (
                <ProjectCard
                  key={project.name}
                  {...project}
                  index={i}
                  visible={projectsVisible}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <ScrollSection id="contact">
        <div className="max-w-md p-8 text-center bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">
            Get In Touch
          </h2>
          <p className="text-white/90 text-lg mb-8 leading-relaxed">
            Ready to work together? Let&apos;s create something amazing!
          </p>
          <button className="px-6 py-3 text-base bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 text-white hover:bg-white/30 transition-all">
            Contact Me
          </button>
        </div>
      </ScrollSection>
      </motion.div>
    </div>
  );
}
