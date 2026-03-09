'use client';

import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useMotionValueEvent, animate, type MotionValue } from "framer-motion";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useLenis } from "@/hooks/useLenis";
import GlassNavBar, { SECTIONS } from "@/components/GlassNavBar";
import SocialButtons from "@/components/SocialButtons";
import AuroraBackground from "@/components/background/AuroraBackground";
import { GlassEffect, GlassFilter } from "@/components/ui/GlassEffect";

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

type Skill = { name: string; slug: string; localSrc?: string; keepColor?: boolean };

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
      { name: "Protobuf", slug: "protocolbuffers", localSrc: "/images/protobuf.svg" },
      { name: "Kafka", slug: "apachekafka" },
    ],
  },
];

const CATEGORY_COUNT = SKILL_CATEGORIES.length;

function SkillPill({
  name,
  slug,
  localSrc,
  keepColor,
  index,
  count,
  visible,
}: Skill & { index: number; count: number; visible: boolean }) {
  const [imgError, setImgError] = useState(false);
  const imgSrc = localSrc ?? `https://cdn.simpleicons.org/${slug}/ffffff`;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{
        duration: 0.3,
        delay: visible ? index * 0.045 : (count - 1 - index) * 0.03,
        ease: "easeOut",
      }}
    >
      <GlassEffect className="flex flex-col items-center gap-2 pt-3 pb-2.5 px-3 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.10)] w-[76px] cursor-default hover:bg-white/[0.05] transition-colors">
        {imgError ? (
          <span className="h-9 flex items-center text-white/70 text-[10px] font-bold uppercase tracking-wide text-center leading-tight">{name}</span>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imgSrc}
            alt={name}
            className={`w-9 h-9 object-contain${localSrc && !keepColor ? " brightness-0 invert" : ""}`}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
        <span className="text-white/75 text-[11px] font-medium text-center leading-tight">{name}</span>
      </GlassEffect>
    </motion.div>
  );
}

function SkillCategory({
  label,
  skills,
  categoryIndex,
  scrollProgress,
}: {
  label: string;
  skills: Skill[];
  categoryIndex: number;
  scrollProgress: MotionValue<number>;
}) {
  // Space 4 categories evenly from 0.12 → 0.88 of scroll progress
  const spacing = 0.88 / CATEGORY_COUNT;
  const threshold = 0.12 + categoryIndex * spacing;
  const fadeEnd = threshold + 0.08;

  const labelOpacity = useTransform(scrollProgress, [threshold, fadeEnd], [0, 1]);
  const labelY = useTransform(scrollProgress, [threshold, fadeEnd], [16, 0]);

  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollProgress, "change", (v) => {
    setVisible(v > threshold);
  });

  return (
    <div>
      <motion.div style={{ opacity: labelOpacity, y: labelY }} className="flex items-center gap-3 mb-3">
        <span className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-semibold whitespace-nowrap">
          {label}
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
      </motion.div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <SkillPill
            key={skill.name}
            {...skill}
            index={i}
            count={skills.length}
            visible={visible}
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
  tech: { name: string; slug: string; localSrc?: string }[];
  github?: string;
};

const PROJECTS: Project[] = [
  {
    name: "HTTP Capture & Replay",
    category: "Developer Tools",
    description: "A local reverse proxy that intercepts HTTP(S) traffic, redacts sensitive data at capture time, and replays full multi-request sessions.",
    accent: "linear-gradient(90deg, #38bdf8, #6366f1)",
    tech: [
      { name: "Go", slug: "go" },
      { name: "Next.js", slug: "nextdotjs" },
      { name: "TypeScript", slug: "typescript" },
      { name: "SQLite", slug: "sqlite" },
    ],
    github: "https://github.com/alexfisher03/shigawire-dev",
  },
  {
    name: "Solace",
    category: "Mobile App / AI",
    description: "An AI-powered wellness companion that delivers personalized mental health support, mood tracking, and journaling.",
    accent: "linear-gradient(90deg, #a855f7, #ec4899)",
    tech: [
      { name: "React Native", slug: "react" },
      { name: "JavaScript", slug: "javascript" },
      { name: "Firebase", slug: "firebase" },
      { name: "Gemini", slug: "googlegemini" },
    ],
    github: "https://github.com/jtaylor205/Solace",
  },
  {
    name: "Interview Coach",
    category: "Web Development / AI",
    description: "A LeetCode-style platform for behavioral interview prep — record answers, get AI feedback, and build structured outlines.",
    accent: "linear-gradient(90deg, #6366f1, #a855f7)",
    tech: [
      { name: "React", slug: "react" },
      { name: "TypeScript", slug: "typescript" },
      { name: "Vite", slug: "vite" },
      { name: "Tailwind CSS", slug: "tailwindcss" },
      { name: "Gemini", slug: "googlegemini" },
    ],
    github: "https://github.com/jtaylor205/interview-practice",
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
    github: "https://github.com/jtaylor205/food-fridge",
  },
  {
    name: "Chess Analysis",
    category: "Data & Algorithms",
    description: "A meta-analysis tool that processes large tournament datasets to evaluate opening strategies, player performance, and competitive match statistics.",
    accent: "linear-gradient(90deg, #93c5fd, #6ee7b7)",
    tech: [
      { name: "Python", slug: "python" },
    ],
    github: "https://github.com/jtaylor205/Chess-Analysis",
  },
  {
    name: "File System",
    category: "Operating Systems",
    description: "A userspace filesystem daemon using the FUSE API, designed to read from and write to WAD files.",
    accent: "linear-gradient(90deg, #ef4444, #f97316)",
    tech: [
      { name: "C", slug: "c" },
      { name: "C++", slug: "cplusplus" },
      { name: "Linux", slug: "linux" },
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
  onClick,
}: Project & { index: number; visible: boolean; onClick: () => void }) {
  return (
    <motion.div
      className="h-full flex flex-col cursor-pointer"
      initial={{ opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.4, delay: visible ? index * 0.07 : (PROJECTS.length - 1 - index) * 0.07, ease: "easeOut" }}
      onClick={onClick}
    >
      <GlassEffect className="h-full rounded-2xl shadow-[0_8px_32px_rgba(15,23,42,0.3)] flex flex-col overflow-hidden hover:bg-white/[0.04] transition-colors relative">
      {/* Accent bar */}
      <div className="h-1 w-full shrink-0" style={{ background: accent }} />

      <div className="p-4 md:p-5 xl:p-7 flex flex-col flex-1 min-h-0">
        <div className="shrink-0 mb-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1">{category}</p>
          <h3 className="text-sm md:text-base lg:text-lg font-bold text-white leading-snug mb-1.5">{name}</h3>
          <p className="text-xs md:text-sm text-white/60 leading-relaxed line-clamp-2 md:line-clamp-3 lg:line-clamp-none">{description}</p>
        </div>

        <div className="flex-1" />

        <div className="flex flex-wrap gap-1.5 shrink-0">
          {tech.map(({ slug, name: techName, localSrc }) => (
            <GlassEffect
              key={slug}
              className="w-9 h-9 rounded-lg flex items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={localSrc ?? `https://cdn.simpleicons.org/${slug}/ffffff`}
                alt={techName}
                className="w-5 h-5 object-contain"
                loading="lazy"
                onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none'; }}
              />
            </GlassEffect>
          ))}
        </div>

      </div>

      {github && (
        <div className="absolute bottom-3 right-3" onClick={(e) => e.stopPropagation()}>
          <GlassEffect
            as="a"
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/[0.08] transition-colors"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://cdn.simpleicons.org/github/ffffff" alt="GitHub" className="w-4 h-4 object-contain opacity-50 group-hover:opacity-100 transition-opacity" loading="lazy" />
          </GlassEffect>
        </div>
      )}
      </GlassEffect>
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
  const contentOpacity = useMotionValue(1);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // About: Apple-style sticky scroll-reveal – card → photos → timeline
  const { scrollYProgress: aboutProgress } = useScroll({
    target: aboutSectionRef,
    offset: ["start start", "end end"],
  });
  const cardOpacity = useTransform(aboutProgress, [0, 0.10], [0, 1]);
  const cardY = useTransform(aboutProgress, [0, 0.10], [28, 0]);
  // Per-photo scroll reveals, spaced ~10% apart: back-left → back-center → back-right → front
  const photoOpacity1 = useTransform(aboutProgress, [0.16, 0.24], [0, 1]);
  const photoY1      = useTransform(aboutProgress, [0.16, 0.24], [20, 0]);
  const photoOpacity2 = useTransform(aboutProgress, [0.26, 0.34], [0, 1]);
  const photoY2      = useTransform(aboutProgress, [0.26, 0.34], [20, 0]);
  const photoOpacity3 = useTransform(aboutProgress, [0.36, 0.44], [0, 1]);
  const photoY3      = useTransform(aboutProgress, [0.36, 0.44], [20, 0]);
  const photoOpacity0 = useTransform(aboutProgress, [0.46, 0.54], [0, 1]);
  const photoY0      = useTransform(aboutProgress, [0.46, 0.54], [20, 0]);
  const photoOpacities = [photoOpacity0, photoOpacity1, photoOpacity2, photoOpacity3];
  const photoScrollYs  = [photoY0, photoY1, photoY2, photoY3];
  const [timelineVisible, setTimelineVisible] = useState(false);
  useMotionValueEvent(aboutProgress, "change", (v) => {
    setTimelineVisible(v > 0.63);
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

  // Responsive photo fan: track viewport width to scale the fan spread
  const [windowWidth, setWindowWidth] = useState(1280);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scale fan spread linearly from 0.6× at 1024px to 1.0× at 1280px+
  const fanScale = Math.min(1, Math.max(0.6, (windowWidth - 1024) / 256 * 0.4 + 0.6));
  const photoFanTransforms = [
    { scale: 1.08, x: Math.round(-70 * fanScale),  y: Math.round(36 * fanScale),  rotate: 0 },
    { scale: 0.96, x: Math.round(-260 * fanScale), y: Math.round(-18 * fanScale), rotate: -24 },
    { scale: 0.94, x: Math.round(-70 * fanScale),  y: Math.round(-82 * fanScale), rotate: 0 },
    { scale: 0.96, x: Math.round(120 * fanScale),  y: Math.round(-18 * fanScale), rotate: 24 },
  ];

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
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedProject(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
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
      <GlassFilter />
      <AuroraBackground />
      <GlassNavBar activeId={activeId} onSelect={handleNavSelect} />
      <SocialButtons />
      <motion.div style={{ opacity: contentOpacity }}>
      {/* Home: full-screen – name and chips animate in on load */}
      <div
        id="home"
        ref={homeSectionRef}
        className="relative h-screen flex items-center justify-center p-5"
      >
          <div className="flex flex-col items-center gap-6 text-center">
            {/* Name – stacked wipe-up reveal with underline */}
            <h1
              className="flex flex-col items-center leading-none text-center"
              style={{ fontFamily: 'var(--font-outfit), system-ui' }}
            >
              {/* First name */}
              <div className="overflow-hidden">
                <motion.span
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-[0.12em] uppercase text-white"
                >
                  Jaedon
                </motion.span>
              </div>

              {/* Last name + animated underline */}
              <div className="relative mt-1 sm:mt-2">
                <div className="overflow-hidden">
                  <motion.span
                    initial={{ y: "105%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.75, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-[0.12em] uppercase text-white"
                  >
                    Taylor
                  </motion.span>
                </div>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.65, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: "left", background: "linear-gradient(to right, rgba(255,255,255,0.55) 60%, transparent 100%)" }}
                  className="absolute -bottom-2 sm:-bottom-3 left-0 right-0 h-[3px] rounded-full"
                />
              </div>
            </h1>

            {/* Subtitle chips – time-based reveal after name finishes */}
            <div className="flex flex-col items-center gap-3">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.7, ease: "easeOut" }}
              >
                <GlassEffect className="px-5 py-2 rounded-full text-sm sm:text-base text-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                  University of Florida Student
                </GlassEffect>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.05, ease: "easeOut" }}
              >
                <GlassEffect className="px-5 py-2 rounded-full text-sm sm:text-base text-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                  Incoming Software Engineer @ Datadog
                </GlassEffect>
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 2.6 }}
          >
            <div className="flex flex-col items-center gap-3">
              {/* Mouse outline */}
              <motion.div
                className="w-6 h-10 rounded-full border border-white/30 flex justify-center pt-2 relative overflow-hidden"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Scrolling dot */}
                <motion.div
                  className="w-0.5 h-2.5 rounded-full"
                  style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0))' }}
                  animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
              <span className="text-[10px] font-medium tracking-[0.28em] uppercase text-white/35">Scroll</span>
            </div>
          </motion.div>
      </div>

      {/* About: Apple-style sticky block – scroll through section, line then UF → Baron → Datadog reveal */}
      <div
        id="about"
        ref={aboutSectionRef}
        className="relative"
        style={{ height: "500vh" }}
      >
        <div className="sticky top-0 h-screen flex items-center justify-center p-5">
          <div className="max-w-6xl xl:max-w-7xl w-full grid gap-10 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.8fr)] items-center" style={{ transform: `translateX(${Math.round(70 * fanScale)}px)` }}>
          {/* Photo stack of four — left column, scroll-driven reveal */}
          <div className="relative -ml-4 md:-ml-20 flex justify-start">
            <div className="relative w-full max-w-md aspect-[4/5]">
              {slotImages.map((imageKey, slotIndex) => {
                const isFront = slotIndex === 0;

                const zIndexBySlot = [40, 20, 15, 10] as const;
                const { scale, x, y, rotate } = photoFanTransforms[slotIndex];

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
            className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_auto] gap-8 xl:gap-10 min-w-0 w-full"
          >
            {/* Copy card — height drives timeline column */}
            <GlassEffect className="relative z-50 w-full p-6 xl:p-10 2xl:p-12 rounded-3xl shadow-[0_18px_60px_rgba(15,23,42,0.7)]">
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

            {/* Timeline: line from UF to Datadog only; items revealed by scroll progress */}
            <div className="w-full max-w-sm h-full">
              <div className="relative flex flex-col justify-between h-full py-6">
                {/* Vertical line — grows down after UF is in place, shrinks on exit */}
                <motion.div
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={timelineVisible
                    ? { scaleY: 1, opacity: 1 }
                    : { scaleY: 0, opacity: 0 }
                  }
                  transition={{
                    duration: timelineVisible ? 0.5 : 0.18,
                    delay: timelineVisible ? 0.32 : 0,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  style={{ transformOrigin: "top" }}
                  className="absolute left-7 top-[3.5rem] bottom-[3.5rem] w-px bg-gradient-to-b from-white/40 via-white/25 to-white/20"
                  aria-hidden
                />

                {/* UF — enters first, exits last */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={timelineVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, delay: timelineVisible ? 0 : 0.20, ease: "easeOut" }}
                  className="relative z-10 flex flex-row items-center gap-4"
                >
                  <GlassEffect className="w-14 h-14 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex items-center justify-center shrink-0 overflow-hidden">
                    <Image
                      src="/images/uf-block.svg"
                      alt="University of Florida"
                      width={48}
                      height={48}
                      className="w-10 h-10 object-contain"
                      sizes="56px"
                    />
                  </GlassEffect>
                  <div>
                    <p className="font-semibold text-white">University<br />of Florida</p>
                    <p className="text-sm text-white/60">Computer Science</p>
                  </div>
                </motion.div>

                {/* Baron — enters second, exits second */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={timelineVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, delay: timelineVisible ? 0.14 : 0.10, ease: "easeOut" }}
                  className="relative z-10 flex flex-row items-center gap-4"
                >
                  <GlassEffect className="w-14 h-14 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex items-center justify-center shrink-0 overflow-hidden">
                    <Image
                      src="/images/baron.svg"
                      alt="Baron Technologies"
                      width={48}
                      height={48}
                      className="w-10 h-10 object-contain"
                      sizes="56px"
                    />
                  </GlassEffect>
                  <div>
                    <p className="font-semibold text-white">Baron Technologies</p>
                    <p className="text-sm text-white/60">Software Engineer</p>
                  </div>
                </motion.div>

                {/* Datadog — enters last, exits first */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={timelineVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, delay: timelineVisible ? 0.28 : 0, ease: "easeOut" }}
                  className="relative z-10 flex flex-row items-center gap-4"
                >
                  <GlassEffect className="w-14 h-14 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex items-center justify-center shrink-0 overflow-hidden p-1.5">
                    <span className="block w-full h-full text-[#774AA4]">
                      <span className="block w-full h-full bg-current [mask-image:url('/images/datadog.svg')] [mask-size:contain] [mask-position:center] [mask-repeat:no-repeat]" />
                    </span>
                  </GlassEffect>
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

      {/* Skills Section */}
      {/* Skills: Apple-style sticky block – scroll "through" the section, content stays fixed and items reveal */}
      <div
        id="skills"
        ref={skillsSectionRef}
        className="relative"
        style={{ height: "520vh" }}
      >
        <div className="sticky top-0 h-screen flex items-center justify-center p-5">
          <div className="max-w-3xl w-full">
            <motion.div
              style={{ opacity: skillsTitleOpacity, y: skillsTitleY }}
              className="flex justify-center mb-10"
            >
              <GlassEffect className="px-7 py-2.5 rounded-full shadow-[0_4px_24px_rgba(15,23,42,0.3)]">
                <h2 className="text-2xl font-bold text-white">My Skills</h2>
              </GlassEffect>
            </motion.div>
            <div className="flex flex-col gap-6">
              {SKILL_CATEGORIES.map(({ label, skills }, catIdx) => (
                  <SkillCategory
                    key={label}
                    label={label}
                    skills={skills}
                    categoryIndex={catIdx}
                    scrollProgress={skillsProgress}
                  />
              ))}
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
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-5 py-20">
          <div className="max-w-5xl w-full">
            <motion.div
              style={{ opacity: projectsTitleOpacity, y: projectsTitleY }}
              className="flex justify-center mb-6 shrink-0"
            >
              <GlassEffect className="px-7 py-2.5 rounded-full shadow-[0_4px_24px_rgba(15,23,42,0.3)]">
                <h2 className="text-2xl font-bold text-white">My Projects</h2>
              </GlassEffect>
            </motion.div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr h-[clamp(480px,68vh,700px)]">
              {PROJECTS.map((project, i) => (
                <ProjectCard
                  key={project.name}
                  {...project}
                  index={i}
                  visible={projectsVisible}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <section id="contact" className="relative min-h-screen flex items-center justify-center p-5">
        <GlassEffect className="max-w-md p-8 text-center rounded-2xl">
          <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">
            Get In Touch
          </h2>
          <p className="text-white/90 text-lg mb-8 leading-relaxed">
            Have an idea, a question, or just want to connect? I&apos;d love to hear from you.
          </p>
          <div className="flex items-center justify-center gap-3">
            <GlassEffect
              as="a"
              href="mailto:jaedonataylor@gmail.com"
              className="px-6 py-3 text-base rounded-xl text-white hover:bg-white/[0.05] transition-all"
            >
              Contact Me
            </GlassEffect>
            <GlassEffect
              as="a"
              href="/resume.pdf"
              download="JaedonTaylor_Resume.pdf"
              className="flex items-center gap-2 px-6 py-3 text-base rounded-xl text-white hover:bg-white/[0.05] transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="8" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="8" y1="17" x2="16" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Resume
            </GlassEffect>
          </div>
        </GlassEffect>
      </section>
      </motion.div>

      {/* Project modal overlay */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <GlassEffect className="rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
                <div className="h-1 w-full shrink-0" style={{ background: selectedProject.accent }} />
                <div className="p-7">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1">{selectedProject.category}</p>
                      <h3 className="text-2xl font-bold text-white leading-snug">{selectedProject.name}</h3>
                    </div>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="ml-4 shrink-0 text-white/40 hover:text-white transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed mb-5">{selectedProject.description}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {selectedProject.tech.map(({ slug, name: techName, localSrc }) => (
                      <GlassEffect key={slug} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={localSrc ?? `https://cdn.simpleicons.org/${slug}/ffffff`} alt={techName} className="w-4 h-4 object-contain" loading="lazy" />
                        <span className="text-xs text-white/70">{techName}</span>
                      </GlassEffect>
                    ))}
                  </div>
                  {selectedProject.github && (
                    <GlassEffect
                      as="a"
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="https://cdn.simpleicons.org/github/ffffff" alt="GitHub" className="w-4 h-4 object-contain" loading="lazy" />
                      View on GitHub
                    </GlassEffect>
                  )}
                </div>
              </GlassEffect>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
