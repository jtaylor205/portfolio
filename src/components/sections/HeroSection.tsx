'use client';

import { motion } from 'framer-motion';
import { GlassEffect } from '@/components/ui/GlassEffect';

export default function HeroSection() {
  return (
    <div
      id="home"
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
              initial={{ y: '105%' }}
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
                initial={{ y: '105%' }}
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
              style={{
                transformOrigin: 'left',
                background: 'linear-gradient(to right, rgba(255,255,255,0.55) 60%, transparent 100%)',
              }}
              className="absolute -bottom-2 sm:-bottom-3 left-0 right-0 h-[3px] rounded-full"
            />
          </div>
        </h1>

        {/* Subtitle chips – time-based reveal after name finishes */}
        <div className="flex flex-col items-center gap-3">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.7, ease: 'easeOut' }}
          >
            <GlassEffect className="px-5 py-2 rounded-full text-sm sm:text-base text-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
              University of Florida Student
            </GlassEffect>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.05, ease: 'easeOut' }}
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
        transition={{ duration: 1, ease: 'easeOut', delay: 2.6 }}
      >
        <div className="flex flex-col items-center gap-3">
          {/* Mouse outline */}
          <motion.div
            className="w-6 h-10 rounded-full border border-white/30 flex justify-center pt-2 relative overflow-hidden"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Scrolling dot */}
            <motion.div
              className="w-0.5 h-2.5 rounded-full"
              style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0))' }}
              animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
          <span className="text-[10px] font-medium tracking-[0.28em] uppercase text-white/35">Scroll</span>
        </div>
      </motion.div>
    </div>
  );
}
