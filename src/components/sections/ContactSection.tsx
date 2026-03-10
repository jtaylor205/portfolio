'use client';

import { GlassEffect } from '@/components/ui/GlassEffect';
import { GlowingEffect } from '@/components/ui/GlowingEffect';
import { Magnetic } from '@/components/ui/Magnetic';

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative min-h-screen flex items-center justify-center p-5"
    >
      <GlassEffect className="max-w-xl p-8 text-center rounded-2xl relative">
        <GlowingEffect disabled={false} spread={70} inactiveZone={0.1} proximity={60} borderWidth={2} movementDuration={1.5} />
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 drop-shadow-lg">
          Get In Touch
        </h2>
        <p className="text-white/90 text-base sm:text-lg mb-8 leading-relaxed">
          Open to new opportunities, interesting problems, and good conversations.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Magnetic intensity={0.5} range={80}>
            <GlassEffect
              as="a"
              href="mailto:jaedonataylor@gmail.com"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 text-sm sm:text-base rounded-xl text-white hover:bg-white/[0.05] transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Email Me
            </GlassEffect>
          </Magnetic>
          <Magnetic intensity={0.5} range={80}>
            <GlassEffect
              as="a"
              href="https://www.linkedin.com/in/jaedon-taylor/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 text-sm sm:text-base rounded-xl text-white hover:bg-white/[0.05] transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </GlassEffect>
          </Magnetic>
          <Magnetic intensity={0.5} range={80}>
            <GlassEffect
              as="a"
              href="/JaedonTaylor_Resume.pdf"
              download="JaedonTaylor_Resume.pdf"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 text-sm sm:text-base rounded-xl text-white hover:bg-white/[0.05] transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="8" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="8" y1="17" x2="16" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Resume
            </GlassEffect>
          </Magnetic>
        </div>
      </GlassEffect>
    </section>
  );
}
