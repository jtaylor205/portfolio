'use client';

import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { GlassEffect } from '@/components/ui/GlassEffect';
import { GlowingEffect } from '@/components/ui/GlowingEffect';
import { PROJECTS, type Project } from '@/data/projects';

// ─── Project card (desktop grid) ─────────────────────────────────────────────

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
      className="h-full flex flex-col cursor-pointer relative rounded-2xl"
      initial={{ opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.4,
        delay: visible ? index * 0.07 : (PROJECTS.length - 1 - index) * 0.07,
        ease: 'easeOut',
      }}
      onClick={onClick}
    >
      <GlowingEffect disabled={false} spread={45} inactiveZone={0.01} proximity={40} borderWidth={2} movementDuration={1.2} />
      <GlassEffect className="h-full rounded-2xl shadow-[0_8px_32px_rgba(15,23,42,0.3)] flex flex-col overflow-hidden transition-colors relative">
        {/* Accent bar */}
        <div className="h-1 w-full shrink-0" style={{ background: accent }} />

        <div className="p-3 sm:p-4 md:p-5 xl:p-7 flex flex-col flex-1 min-h-0">
          <div className="shrink-0 mb-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1">{category}</p>
            <h3 className="text-sm md:text-base lg:text-lg font-bold text-white leading-snug mb-1.5">{name}</h3>
            <p className="text-xs md:text-sm text-white/60 leading-relaxed line-clamp-2 md:line-clamp-3 lg:line-clamp-none">
              {description}
            </p>
          </div>

          <div className="flex-1" />

          <div className="flex flex-wrap gap-1.5 shrink-0">
            {tech.map(({ slug, name: techName, localSrc }) => (
              <GlassEffect key={slug} className="w-9 h-9 rounded-lg flex items-center justify-center">
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
              <img
                src="https://cdn.simpleicons.org/github/ffffff"
                alt="GitHub"
                className="w-4 h-4 object-contain opacity-50 group-hover:opacity-100 transition-opacity"
                loading="lazy"
              />
            </GlassEffect>
          </div>
        )}
      </GlassEffect>
    </motion.div>
  );
}

// ─── Project detail modal ─────────────────────────────────────────────────────

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <GlassEffect className="rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
          <div className="h-1 w-full shrink-0" style={{ background: project.accent }} />
          <div className="p-7">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1">{project.category}</p>
                <h3 className="text-2xl font-bold text-white leading-snug">{project.name}</h3>
              </div>
              <button
                onClick={onClose}
                className="ml-4 shrink-0 text-white/40 hover:text-white transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <p className="text-white/80 text-sm leading-relaxed mb-5">{project.description}</p>

            <div className="flex flex-wrap gap-2 mb-5">
              {project.tech.map(({ slug, name: techName, localSrc }) => (
                <GlassEffect key={slug} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={localSrc ?? `https://cdn.simpleicons.org/${slug}/ffffff`}
                    alt={techName}
                    className="w-4 h-4 object-contain"
                    loading="lazy"
                  />
                  <span className="text-xs text-white/70">{techName}</span>
                </GlassEffect>
              ))}
            </div>

            {project.github && (
              <GlassEffect
                as="a"
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://cdn.simpleicons.org/github/ffffff"
                  alt="GitHub"
                  className="w-4 h-4 object-contain"
                  loading="lazy"
                />
                View on GitHub
              </GlassEffect>
            )}
          </div>
        </GlassEffect>
      </motion.div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.12], [0, 1]);
  const titleY       = useTransform(scrollYProgress, [0, 0.12], [20, 0]);

  const [projectsVisible, setProjectsVisible] = useState(false);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setProjectsVisible(v > 0.35);
  });

  // Close modal on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedProject(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <div
        id="projects"
        ref={sectionRef}
        className="relative h-auto md:h-[400vh]"
      >
        {/* ── Mobile layout (no sticky scroll) ── */}
        <div className="md:hidden px-5 py-20 flex flex-col gap-4">
          <div className="flex justify-center mb-2">
            <GlassEffect className="px-7 py-2.5 rounded-full shadow-[0_4px_24px_rgba(15,23,42,0.3)]">
              <h2 className="text-2xl font-bold text-white">My Projects</h2>
            </GlassEffect>
          </div>
          {PROJECTS.map((project) => (
            <button
              key={project.name}
              type="button"
              onClick={() => setSelectedProject(project)}
              className="w-full text-left"
            >
              <GlassEffect className="w-full rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(15,23,42,0.3)]">
                <div className="h-1 w-full shrink-0" style={{ background: project.accent }} />
                <div className="p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1">{project.category}</p>
                  <h3 className="text-base font-bold text-white mb-1.5">{project.name}</h3>
                  <p className="text-xs text-white/60 leading-relaxed mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {project.tech.map(({ slug, name: techName, localSrc }) => (
                      <GlassEffect key={slug} className="w-8 h-8 rounded-lg flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={localSrc ?? `https://cdn.simpleicons.org/${slug}/ffffff`}
                          alt={techName}
                          className="w-4 h-4 object-contain"
                          loading="lazy"
                        />
                      </GlassEffect>
                    ))}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="ml-auto"
                      >
                        <GlassEffect className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/[0.08] transition-colors">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="https://cdn.simpleicons.org/github/ffffff"
                            alt="GitHub"
                            className="w-4 h-4 object-contain opacity-60"
                            loading="lazy"
                          />
                        </GlassEffect>
                      </a>
                    )}
                  </div>
                </div>
              </GlassEffect>
            </button>
          ))}
        </div>

        {/* ── Desktop sticky scroll layout ── */}
        <div className="hidden md:flex sticky top-0 h-screen flex-col items-center justify-center px-5 py-20">
          <div className="max-w-5xl w-full">
            <motion.div
              style={{ opacity: titleOpacity, y: titleY }}
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

      {/* Project detail modal – rendered outside section flow to avoid stacking-context issues */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
