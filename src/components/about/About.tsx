import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, CheckCircle2, ArrowRight } from 'lucide-react';
import { DeveloperCoreVisual } from './OrbitCore';

export const About: React.FC = () => {
  const identityChips = [
    { label: 'Problem Solver', icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#E50914]" /> },
    { label: 'Quick Learner', icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#E50914]" /> },
    { label: 'Always Exploring', icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#E50914]" /> },
  ];

  const scrollToSkills = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('skills');
    if (element) {
      const yOffset = -75;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section id="about" className="relative py-24 sm:py-32 bg-[#030303] overflow-hidden border-t border-red-950/20">
      {/* Subtle Red Atmospheric Background Field */}
      <div className="absolute top-1/2 -left-48 w-[650px] h-[650px] bg-[#1A0000]/40 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[450px] h-[450px] bg-[#120000]/30 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* ===================================================
              LEFT: Animated 3D Tech Core & Globe (5 Columns)
             =================================================== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 flex items-center justify-center"
          >
            <DeveloperCoreVisual />
          </motion.div>

          {/* ===================================================
              RIGHT: Clean Story, CTA & Chips (7 Columns)
             =================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-7 flex flex-col justify-center text-left"
          >
            {/* Section Label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0C0C0C] border border-red-900/40 text-[#E50914] text-xs font-mono uppercase tracking-widest mb-4 w-max">
              <Terminal className="w-3.5 h-3.5" />
              <span>ABOUT ME</span>
            </div>

            {/* Natural Sentence Cased Headline */}
            <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-[1.15]">
              Passionate developer,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] to-[#FF4444]">
                focused on real solutions.
              </span>
            </h2>

            {/* Readable Narrative matching full-structure.png */}
            <div className="mt-6 space-y-4 font-sans text-neutral-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              <p>
                I&apos;m Abdullah Azaam, a full-stack developer who enjoys building modern web applications, working with backend systems, databases, and creating interactive frontend experiences.
              </p>
              <p className="text-neutral-400">
                I focus on writing clean code, solving real problems, and continuously improving my skills across <span className="text-white font-medium">C#, ASP.NET Core, Laravel, SQL Server, React, and Three.js</span>.
              </p>
            </div>

            {/* More About Me Button (Matching Blueprint) */}
            <div className="mt-8">
              <a
                href="#skills"
                onClick={scrollToSkills}
                className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#E50914] text-white font-sans font-semibold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(229,9,20,0.35)] hover:shadow-[0_0_30px_rgba(229,9,20,0.65)] hover:bg-[#ff1e2b] transition-all active:scale-[0.98]"
              >
                <span>More About Me</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* Concise Identity Chips Row */}
            <div className="mt-8 pt-6 border-t border-neutral-900/80 flex flex-wrap items-center gap-3">
              {identityChips.map((chip) => (
                <div
                  key={chip.label}
                  className="premium-card inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0E0E0E] border border-red-950 text-xs font-sans font-medium text-neutral-200 hover:border-red-900/50 transition-colors"
                >
                  {chip.icon}
                  <span>{chip.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
