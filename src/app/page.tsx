'use client';

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "@/hooks/useLenis";
import GlassNavBar, { SECTIONS } from "@/components/GlassNavBar";
import SocialButtons from "@/components/SocialButtons";
import ThreeBackground from "@/components/background/ThreeBackground";

export default function Home() {
  const lenisRef = useLenis();
  const [activeId, setActiveId] = useState('home');
  const scrollTargetRef = useRef<string | null>(null);
  const scrollTargetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [chevronDirection, setChevronDirection] = useState<'down' | 'up'>('down');
  const lastScrollY = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = scrollTargetRef.current;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          if (target !== null) {
            if (id === target) {
              if (scrollTargetTimeoutRef.current) clearTimeout(scrollTargetTimeoutRef.current);
              scrollTargetTimeoutRef.current = null;
              scrollTargetRef.current = null;
              setActiveId(id);
            }
            break;
          }
          setActiveId(id);
          break;
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
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

  const handleNavSelect = (id: string) => {
    if (scrollTargetTimeoutRef.current) clearTimeout(scrollTargetTimeoutRef.current);
    scrollTargetRef.current = id;
    setActiveId(id);
    const el = document.getElementById(id);
    if (el && lenisRef.current) {
      lenisRef.current.scrollTo(el, { duration: 1, force: true });
    } else {
      el?.scrollIntoView({ behavior: 'smooth' });
    }
    scrollTargetTimeoutRef.current = setTimeout(() => {
      scrollTargetRef.current = null;
      scrollTargetTimeoutRef.current = null;
    }, 2000);
  };

  return (
    <div className="relative">
      <ThreeBackground />
      <GlassNavBar activeId={activeId} onSelect={handleNavSelect} />
      <SocialButtons />
      <section
        id="home"
        className="relative min-h-screen bg-gradient-to-br from-indigo-500/90 via-purple-500/90 to-purple-700/90 flex items-center justify-center p-5"
      >
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
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
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
      </section>

      {/* About Section */}
      <section id="about" className="relative min-h-screen bg-gradient-to-br from-purple-700/90 via-pink-500/90 to-red-500/90 flex items-center justify-center p-5">
        <div className="max-w-2xl p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6 text-center drop-shadow-lg">
            About Me
          </h2>
          <p className="text-white/90 text-lg mb-6 leading-relaxed">
            I'm a passionate developer who loves creating beautiful, interactive web experiences. 
            This portfolio showcases the power of modern web technologies including React, 
            Tailwind CSS, liquid glass effects, and smooth scrolling.
          </p>
          <p className="text-white/90 text-lg leading-relaxed">
            The combination of glassmorphism design and buttery smooth scrolling creates 
            an immersive user experience that feels both modern and elegant.
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative min-h-screen bg-gradient-to-br from-red-500/90 via-orange-500/90 to-yellow-500/90 flex items-center justify-center p-5">
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
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative min-h-screen bg-gradient-to-br from-yellow-500/90 via-green-500/90 to-blue-500/90 flex items-center justify-center p-5">
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
      </section>
    </div>
  );
}