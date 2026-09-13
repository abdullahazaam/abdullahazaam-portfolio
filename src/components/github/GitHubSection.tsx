import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, GitCommit, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { GithubIcon } from '../common/Icons';

export const GitHubSection: React.FC = () => {
  return (
    <section className="relative py-24 bg-[#050505] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E50914]/8 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl bg-[#0A0A0A]/95 border border-red-950/60 p-8 sm:p-12 backdrop-blur-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)] group hover:border-[#E50914]/60 transition-all duration-500"
        >
          {/* Crimson ambient backlight */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#E50914]/15 rounded-full blur-3xl pointer-events-none group-hover:bg-[#E50914]/25 transition-all duration-500" />
          <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#E50914] to-transparent" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111] border border-red-900/40 text-[#E50914] text-xs font-mono tracking-widest uppercase mb-4">
                <GithubIcon size={14} className="text-[#E50914]" />
                <span>Open Engineering &amp; Repositories</span>
              </div>

              <h2 className="font-syne font-extrabold text-3xl sm:text-4xl uppercase text-white tracking-tight leading-tight">
                Inspect The Source Code Behind The Systems.
              </h2>

              <p className="mt-4 font-space text-neutral-400 text-sm sm:text-base leading-relaxed">
                Explore real source code, architecture patterns, clean commit histories, and full-stack solutions across ASP.NET Core, Laravel, React, and Three.js on GitHub.
              </p>

              {/* Engineering Standards */}
              <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono text-neutral-300">
                <div className="flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-[#E50914]" />
                  <span>Structured Branches</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <GitCommit className="w-3.5 h-3.5 text-[#E50914]" />
                  <span>Atomic Commits</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E50914]" />
                  <span>Verified Repositories</span>
                </div>
              </div>
            </div>

            {/* Action CTA Button */}
            <div className="flex flex-col items-center gap-3">
              <a
                href="https://github.com/abdullahazaam"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#E50914] text-white font-space font-semibold text-sm uppercase tracking-wider overflow-hidden shadow-[0_0_30px_rgba(229,9,20,0.5)] hover:shadow-[0_0_50px_rgba(229,9,20,0.8)] hover:scale-105 active:scale-[0.98] transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <GithubIcon size={18} className="text-white" />
                <span>Visit @abdullahazaam</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <span className="font-mono text-[11px] text-neutral-500">
                github.com/abdullahazaam
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
