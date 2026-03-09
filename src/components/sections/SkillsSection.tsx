'use client';

import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion';
import { useRef, useState } from 'react';
import { GlassEffect } from '@/components/ui/GlassEffect';
import { SKILL_CATEGORIES, type Skill } from '@/data/skills';

const CATEGORY_COUNT = SKILL_CATEGORIES.length;

// ─── Skill pill ───────────────────────────────────────────────────────────────

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
        ease: 'easeOut',
      }}
    >
      <GlassEffect className="flex flex-col items-center gap-2 pt-3 pb-2.5 px-3 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.10)] w-[68px] sm:w-[76px] cursor-default hover:bg-white/[0.05] transition-colors">
        {imgError ? (
          <span className="h-9 flex items-center text-white/70 text-[10px] font-bold uppercase tracking-wide text-center leading-tight">
            {name}
          </span>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imgSrc}
            alt={name}
            className={`w-9 h-9 object-contain${localSrc && !keepColor ? ' brightness-0 invert' : ''}`}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
        <span className="text-white/75 text-[11px] font-medium text-center leading-tight">{name}</span>
      </GlassEffect>
    </motion.div>
  );
}

// ─── Skill category row ───────────────────────────────────────────────────────

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
  const spacing   = 0.88 / CATEGORY_COUNT;
  const threshold = 0.12 + categoryIndex * spacing;
  const fadeEnd   = threshold + 0.08;

  const labelOpacity = useTransform(scrollProgress, [threshold, fadeEnd], [0, 1]);
  const labelY       = useTransform(scrollProgress, [threshold, fadeEnd], [16, 0]);

  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollProgress, 'change', (v) => {
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

// ─── Section ──────────────────────────────────────────────────────────────────

export default function SkillsSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.12], [0, 1]);
  const titleY       = useTransform(scrollYProgress, [0, 0.12], [20, 0]);

  return (
    <div
      id="skills"
      ref={sectionRef}
      className="relative h-auto md:h-[520vh]"
    >
      {/* ── Mobile layout (no sticky scroll) ── */}
      <div className="md:hidden px-5 py-20 flex flex-col gap-2">
        <div className="flex justify-center mb-6">
          <GlassEffect className="px-7 py-2.5 rounded-full shadow-[0_4px_24px_rgba(15,23,42,0.3)]">
            <h2 className="text-2xl font-bold text-white">My Skills</h2>
          </GlassEffect>
        </div>
        <div className="flex flex-col gap-6">
          {SKILL_CATEGORIES.map(({ label, skills }) => (
            <div key={label}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-semibold whitespace-nowrap">
                  {label}
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map(({ name, slug, localSrc, keepColor }) => (
                  <GlassEffect key={name} className="flex flex-col items-center gap-2 pt-3 pb-2.5 px-3 rounded-xl w-[68px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={localSrc ?? `https://cdn.simpleicons.org/${slug}/ffffff`}
                      alt={name}
                      className={`w-9 h-9 object-contain${localSrc && !keepColor ? ' brightness-0 invert' : ''}`}
                      loading="lazy"
                    />
                    <span className="text-white/75 text-[11px] font-medium text-center leading-tight">{name}</span>
                  </GlassEffect>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Desktop sticky scroll layout ── */}
      <div className="hidden md:flex sticky top-0 h-screen items-center justify-center p-5">
        <div className="max-w-3xl w-full">
          <motion.div
            style={{ opacity: titleOpacity, y: titleY }}
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
                scrollProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
