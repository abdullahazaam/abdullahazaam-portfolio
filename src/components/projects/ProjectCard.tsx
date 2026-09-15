import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { GithubIcon } from '../common/Icons';
import { CleanProject } from '../../data/projects';

interface ProjectCardProps {
  project: CleanProject;
  index: number;
  prominent?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, prominent = false }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const coordsRef = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const frameRef = useRef(0);

  const primaryUrl = project.liveUrl || project.githubUrl;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch' || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) - 0.5;
    const py = (y / rect.height) - 0.5;
    coordsRef.current = { x, y, px, py };

    if (frameRef.current) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;
      const el = cardRef.current;
      if (!el) return;
      const { x: curX, y: curY, px: curPx, py: curPy } = coordsRef.current;
      el.style.setProperty('--card-rx', `${-curPy * 9}deg`);
      el.style.setProperty('--card-ry', `${curPx * 9}deg`);
      el.style.setProperty('--spot-x', `${curX}px`);
      el.style.setProperty('--spot-y', `${curY}px`);
      el.style.setProperty('--preview-x', `${curPx * 10}px`);
      el.style.setProperty('--preview-y', `${curPy * 8}px`);
    });
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    setIsHovered(true);
  };
  const handlePointerLeave = () => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
    setIsHovered(false);
    const el = cardRef.current;
    if (el) {
      el.style.setProperty('--card-rx', '0deg');
      el.style.setProperty('--card-ry', '0deg');
      el.style.setProperty('--preview-x', '0px');
      el.style.setProperty('--preview-y', '0px');
    }
  };


  // Whole card click handler (respects child button/link clicks)
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) return;
    if (primaryUrl) {
      window.open(primaryUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div style={{ perspective: '1100px' }} className="w-full">
      <motion.div
        ref={cardRef}
        onClick={handleCardClick}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        initial={{ opacity: 0, y: 35, rotateX: 8, rotateY: index % 2 === 0 ? -3 : 3 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.65, delay: index * 0.08, ease: 'easeOut' }}
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered
            ? 'rotateX(var(--card-rx, 0deg)) rotateY(var(--card-ry, 0deg)) translateY(-8px) translateZ(18px)'
            : 'rotateX(0deg) rotateY(0deg) translateY(0px) translateZ(0px)',
          transition: isHovered
            ? 'transform 0.12s ease-out, box-shadow 0.25s ease, border-color 0.25s ease'
            : 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease',
          boxShadow: isHovered
            ? '0 28px 55px -14px rgba(0, 0, 0, 0.95), 0 0 34px rgba(229, 9, 20, 0.45), inset 0 1px 1.5px rgba(255, 255, 255, 0.16)'
            : '0 10px 30px rgba(0, 0, 0, 0.75), 0 0 18px rgba(229, 9, 20, 0.14), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
        }}
        className={`premium-card project-card ${prominent ? 'featured-card' : ''} group relative rounded-2xl bg-[#09080A]/95 border flex flex-col justify-between overflow-hidden cursor-pointer select-none ${
          isHovered
            ? 'border-[#E50914]'
            : prominent
            ? 'border-red-800/60 p-5 sm:p-6'
            : 'border-red-950/40 p-5 sm:p-6'
        }`}
      >
        {/* Continuous 360° Perimeter Border Beam Highlight */}
        <div
          className="absolute -inset-[120%] pointer-events-none z-0 will-change-transform"
          style={{
            background: isHovered
              ? 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 270deg, rgba(229,9,20,0.6) 310deg, #ff1a38 340deg, #ff7084 355deg, #ff1a38 360deg)'
              : 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 285deg, rgba(229,9,20,0.35) 320deg, #E50914 345deg, transparent 360deg)',
            animation: `border-beam-spin ${isHovered ? '4.5s' : '9.5s'} linear infinite`,
          }}
          aria-hidden="true"
        />

        {/* Dark Obsidian Glass Card Body - Inset by 1.5px to reveal perimeter beam */}
        <div
          className="absolute inset-[1.5px] rounded-[11px] bg-[#09080A]/95 backdrop-blur-md pointer-events-none z-0"
          aria-hidden="true"
        />

        {/* Precision Cyber Tech Corner Brackets in Crimson with Active Glow */}
        <span
          className={`absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-[#E50914] transition-all duration-300 pointer-events-none z-30 ${
            isHovered
              ? 'opacity-100 scale-110 shadow-[0_0_8px_#E50914]'
              : 'opacity-70 shadow-[0_0_4px_rgba(229,9,20,0.4)]'
          }`}
        />
        <span
          className={`absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-[#E50914] transition-all duration-300 pointer-events-none z-30 ${
            isHovered
              ? 'opacity-100 scale-110 shadow-[0_0_8px_#E50914]'
              : 'opacity-70 shadow-[0_0_4px_rgba(229,9,20,0.4)]'
          }`}
        />
        <span
          className={`absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-[#E50914] transition-all duration-300 pointer-events-none z-30 ${
            isHovered
              ? 'opacity-100 scale-110 shadow-[0_0_8px_#E50914]'
              : 'opacity-70 shadow-[0_0_4px_rgba(229,9,20,0.4)]'
          }`}
        />
        <span
          className={`absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-[#E50914] transition-all duration-300 pointer-events-none z-30 ${
            isHovered
              ? 'opacity-100 scale-110 shadow-[0_0_8px_#E50914]'
              : 'opacity-70 shadow-[0_0_4px_rgba(229,9,20,0.4)]'
          }`}
        />

        {/* Dynamic Cursor-Follow Red Spotlight & Ambient Glow */}
        <div
          className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-500"
          style={{
            background: isHovered
              ? `radial-gradient(320px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(229, 9, 20, 0.25), transparent 70%)`
              : `radial-gradient(240px circle at 85% 15%, rgba(229, 9, 20, 0.08), transparent 65%)`,
          }}
          aria-hidden="true"
        />

        {/* Animated Red Border Glow Highlight */}
        <div
          className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#E50914] to-transparent transition-opacity duration-300 z-20 ${
            isHovered ? 'opacity-100' : 'opacity-60'
          }`}
          aria-hidden="true"
        />

        <div className="relative z-10" style={{ transform: 'translateZ(10px)' }}>
          {/* Screenshot / High-Tech Preview Window with Parallax Shift */}
          <div
            className="project-preview-wrap mb-4 transition-transform duration-300"
            style={{
              transform: isHovered
                ? `translate3d(var(--preview-x, 0px), var(--preview-y, 0px), 26px)`
                : 'translate3d(0, 0, 0)',
              transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
            }}
          >
            <div className="project-preview relative w-full aspect-[16/9] bg-[#070707] rounded-xl overflow-hidden border border-neutral-800/80 group-hover:border-red-900/70 transition-colors flex flex-col shadow-inner">
              {/* Application Window Titlebar */}
              <div className="h-6 sm:h-7 bg-[#0E0E10] border-b border-neutral-800/70 px-2.5 sm:px-3 flex items-center justify-between flex-shrink-0 z-10">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E50914] shadow-[0_0_6px_#E50914]" />
                  <span className="w-2 h-2 rounded-full bg-neutral-700" />
                  <span className="w-2 h-2 rounded-full bg-neutral-700" />
                </div>
                <span className="font-mono text-[9px] sm:text-[10px] text-neutral-400 uppercase tracking-widest truncate max-w-[150px] group-hover:text-white transition-colors">
                  {project.title}
                </span>
                <span className={`w-1.5 h-1.5 rounded-full bg-[#E50914] ${isHovered ? 'animate-ping' : 'animate-pulse'}`} />
              </div>

              {/* Screen Visual — Screenshot with gentle hover zoom and glass scanline */}
              <div className="relative flex-1 min-h-0 overflow-hidden bg-[#050505]">
                {project.imageUrl ? (
                  <picture>
                    <source srcSet={project.imageUrl.replace(/\.(png|jpg)$/i, '.webp')} type="image/webp" />
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      width={1280}
                      height={720}
                      className="w-full h-full object-contain object-top transition-all duration-500 group-hover:scale-[1.05]"
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#0C0C0C]">
                    <span className="font-mono text-xs text-neutral-500">{project.title}</span>
                  </div>
                )}

                {/* Animated Futuristic Glass Scanline */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                  <div
                    className="w-full h-8 bg-gradient-to-b from-transparent via-white/15 to-transparent pointer-events-none"
                    style={{
                      animation: 'scanline-sweep 5s linear infinite',
                    }}
                  />
                </div>

                {/* Diagonal Glass Sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none" />

                {/* Ambient Dark Gradient Vignette for Seamless Card Blend */}
                <div className="preview-shade absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/15 to-transparent pointer-events-none" />
                <div className="absolute inset-0 border border-red-500/0 group-hover:border-red-600/40 transition-colors pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Project Title (Natural Case) */}
          <h3 className="font-heading font-bold text-lg sm:text-xl text-white group-hover:text-[#E50914] transition-colors flex items-center justify-between">
            <span className="truncate pr-2">{project.title}</span>
            <ArrowRight className="w-4 h-4 text-neutral-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:text-[#E50914] transition-all duration-300 flex-shrink-0" />
          </h3>

          {/* Tech Stack Pills with subtle glow */}
          <div
            className="flex flex-wrap gap-1.5 mt-2 transition-transform duration-300"
            style={{ transform: isHovered ? 'translateZ(14px)' : 'translateZ(0)' }}
          >
            {project.tags.map((tag) => (
              <span
                key={tag}
                className={`px-2 py-0.5 rounded font-sans text-[10px] font-medium transition-all duration-300 ${
                  isHovered
                    ? 'bg-[#1C0A0E] border border-red-600/40 text-white shadow-[0_0_8px_rgba(229,9,20,0.25)]'
                    : 'bg-[#121214] border border-neutral-800/80 text-neutral-300'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Short Description */}
          <p className="mt-2.5 font-sans text-xs text-neutral-300 leading-relaxed line-clamp-3">
            {project.shortDescription}
          </p>
        </div>

        {/* Footer: Elevated Action Buttons */}
        <div
          className="mt-4 pt-3 border-t border-neutral-900/90 flex items-center gap-2 relative z-20"
          style={{ transform: isHovered ? 'translateZ(18px)' : 'translateZ(0)' }}
        >
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`View ${project.title} live demonstration`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#E50914] text-white font-sans font-semibold text-[11px] uppercase tracking-wider shadow-[0_0_16px_rgba(229,9,20,0.4)] hover:shadow-[0_0_26px_rgba(229,9,20,0.75)] hover:bg-[#ff1e2b] transition-all active:scale-[0.98] group/btn"
            >
              <span>Live Demo</span>
              <ExternalLink className="w-3 h-3 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </a>
          ) : (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`View ${project.title} repository on GitHub`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#E50914] text-white font-sans font-semibold text-[11px] uppercase tracking-wider shadow-[0_0_16px_rgba(229,9,20,0.4)] hover:shadow-[0_0_26px_rgba(229,9,20,0.75)] hover:bg-[#ff1e2b] transition-all active:scale-[0.98] group/btn"
            >
              <span>View Repo</span>
              <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </a>
          )}

          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label={`View ${project.title} source code on GitHub`}
            className="inline-flex items-center justify-center p-2 rounded-lg bg-[#111113] text-neutral-300 border border-neutral-800/90 hover:border-red-600/70 hover:text-white hover:bg-[#18181c] hover:shadow-[0_0_14px_rgba(229,9,20,0.35)] transition-all"
          >
            <GithubIcon size={15} className="text-[#E50914]" />
          </a>
        </div>

      </motion.div>
    </div>
  );
};
