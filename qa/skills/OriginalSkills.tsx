import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import {
  CSharpIcon,
  DotNetIcon,
  DatabaseIcon,
  PhpIcon,
  LaravelIcon,
  ReactIcon,
  TypeScriptIcon,
  JavaScriptIcon,
  ThreeJsIcon,
  GsapIcon,
  Html5Icon,
  Css3Icon,
  BootstrapIcon,
  TailwindIcon,
  GitIcon,
  GithubIcon,
} from '../../src/components/common/Icons';

interface TechItem {
  name: string;
  role: string;
  icon: React.ReactNode;
}

const technologies: TechItem[] = [
  { name: 'C#', role: 'Language', icon: <CSharpIcon size={24} className="text-[#E50914]" /> },
  { name: 'ASP.NET Core', role: 'Backend', icon: <DotNetIcon size={24} className="text-[#E50914]" /> },
  { name: 'Entity Framework', role: 'ORM', icon: <DatabaseIcon size={24} className="text-[#E50914]" /> },
  { name: 'SQL Server', role: 'RDBMS', icon: <DatabaseIcon size={24} className="text-[#E50914]" /> },
  { name: 'PHP', role: 'Backend', icon: <PhpIcon size={24} className="text-[#E50914]" /> },
  { name: 'Laravel', role: 'MVC Framework', icon: <LaravelIcon size={24} className="text-[#E50914]" /> },
  { name: 'MySQL', role: 'Database', icon: <DatabaseIcon size={24} className="text-[#E50914]" /> },
  { name: 'React', role: 'Frontend', icon: <ReactIcon size={24} className="text-[#E50914]" /> },
  { name: 'TypeScript', role: 'Typed JS', icon: <TypeScriptIcon size={24} className="text-[#E50914]" /> },
  { name: 'JavaScript', role: 'Core Language', icon: <JavaScriptIcon size={24} className="text-[#E50914]" /> },
  { name: 'Three.js', role: '3D WebGL', icon: <ThreeJsIcon size={24} className="text-[#E50914]" /> },
  { name: 'GSAP', role: 'Motion & Scroll', icon: <GsapIcon size={24} className="text-[#E50914]" /> },
  { name: 'HTML5', role: 'Structure', icon: <Html5Icon size={24} className="text-[#E50914]" /> },
  { name: 'CSS3', role: 'Styles & Layouts', icon: <Css3Icon size={24} className="text-[#E50914]" /> },
  { name: 'Bootstrap', role: 'Components', icon: <BootstrapIcon size={24} className="text-[#E50914]" /> },
  { name: 'Tailwind CSS', role: 'Modern UI', icon: <TailwindIcon size={24} className="text-[#E50914]" /> },
  { name: 'Git', role: 'Version Control', icon: <GitIcon size={24} className="text-[#E50914]" /> },
  { name: 'GitHub', role: 'Workflow & CI/CD', icon: <GithubIcon size={24} className="text-[#E50914]" /> },
];

const brandColors = [
  '#bd85e1', '#a883e9', '#aba4b7', '#eb6476', '#ad92cf', '#ff303b',
  '#eab543', '#61dafb', '#409de8', '#f6d73b', '#e7e7ec', '#a5d92d',
  '#f35b35', '#4b86f5', '#b877e8', '#36b9d7', '#f2634a', '#e6e3ec'
];

// 3D Tilt Card Component with Interactive Cursor Tilt & Floating Variation
const SkillCard: React.FC<{ tech: TechItem; index: number }> = ({ tech, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [coords, setCoords] = useState({ px: 0, py: 0 });

  const brandColor = brandColors[index % brandColors.length];

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setCoords({ px, py });
  };

  const handlePointerEnter = () => setIsHovered(true);
  const handlePointerLeave = () => {
    setIsHovered(false);
    setCoords({ px: 0, py: 0 });
  };

  const rotateX = isHovered ? -coords.py * 12 : 0;
  const rotateY = isHovered ? coords.px * 12 : 0;
  const liftY = isHovered ? -6 : 0;
  const liftZ = isHovered ? 16 : 0;

  return (
    <div style={{ perspective: '900px' }} className="w-full relative flex items-center justify-center py-1">
      {/* Always-On Rear Rotating Outlined Cyber Frame (18-25s rotation) */}
      <div
        className="absolute pointer-events-none z-0 flex items-center justify-center will-change-transform"
        style={{
          width: 'calc(100% + 14px)',
          height: 'calc(100% + 14px)',
          maxWidth: '150px',
          maxHeight: '150px',
        }}
        aria-hidden="true"
      >
        <div
          className="w-full h-full rounded-2xl border transition-all duration-300 relative will-change-transform"
          style={{
            borderColor: isHovered ? 'rgba(229, 9, 20, 0.75)' : 'rgba(229, 9, 20, 0.3)',
            boxShadow: isHovered
              ? '0 0 24px rgba(229, 9, 20, 0.45), inset 0 0 10px rgba(229, 9, 20, 0.2)'
              : '0 0 12px rgba(229, 9, 20, 0.16)',
            animation: `cyber-rotate ${isHovered ? '9s' : '22s'} linear infinite`,
          }}
        >
          {/* Inner dashed cyber line */}
          <div className="absolute inset-1.5 rounded-xl border border-dashed border-red-500/20" />

          {/* 4 Glowing Corner Nodes */}
          <span className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-[#E50914] shadow-[0_0_8px_#E50914]" />
          <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_6px_#E50914]" />
          <span className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-[#E50914] shadow-[0_0_8px_#E50914]" />
          <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_6px_#E50914]" />
        </div>
      </div>

      {/* Front Card - Stays Upright, Stable & Ultra-Readable */}
      <motion.div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        initial={{ opacity: 0, y: 28, rotateX: 12 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, delay: index * 0.035, ease: 'easeOut' }}
        animate={{
          y: isHovered ? liftY : [0, -3.5, 0],
        }}
        // @ts-expect-error framer-motion transition prop
        transition2={{
          y: isHovered ? { duration: 0.15 } : { duration: 3.5 + (index % 4) * 0.5, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${liftY}px) translateZ(${liftZ}px)`,
          transition: isHovered
            ? 'transform 0.12s ease-out, box-shadow 0.25s ease, border-color 0.25s ease'
            : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease',
          boxShadow: isHovered
            ? `0 16px 36px -8px rgba(0, 0, 0, 0.95), 0 0 22px rgba(229, 9, 20, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.14)`
            : '0 4px 15px rgba(0, 0, 0, 0.65), 0 0 10px rgba(229, 9, 20, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.04)',
          '--brand': brandColor,
        } as React.CSSProperties}
        className="premium-card skill-card group relative rounded-2xl bg-[#080709]/95 border border-neutral-900/90 p-4 sm:p-5 backdrop-blur-md hover:border-[#E50914]/70 hover:bg-[#0E0C0E] flex flex-col items-center text-center justify-between min-h-[140px] overflow-hidden cursor-pointer select-none z-10 w-full"
      >
        {/* Subtle Front Corner Brackets */}
        <span className={`absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-[#E50914] transition-opacity duration-300 pointer-events-none z-20 ${isHovered ? 'opacity-90' : 'opacity-40'}`} />
        <span className={`absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-[#E50914] transition-opacity duration-300 pointer-events-none z-20 ${isHovered ? 'opacity-90' : 'opacity-40'}`} />
        <span className={`absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-[#E50914] transition-opacity duration-300 pointer-events-none z-20 ${isHovered ? 'opacity-90' : 'opacity-40'}`} />
        <span className={`absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-[#E50914] transition-opacity duration-300 pointer-events-none z-20 ${isHovered ? 'opacity-90' : 'opacity-40'}`} />

        {/* Animated Border Glow Highlight */}
        <div
          className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#E50914] to-transparent transition-opacity duration-300 z-10 ${
            isHovered ? 'opacity-100' : 'opacity-45'
          }`}
          aria-hidden="true"
        />

        {/* Tech Icon with Independent Tilt & 3D Pop */}
        <div
          className="w-12 h-12 rounded-xl bg-[#111013] border border-neutral-800 flex items-center justify-center transition-all duration-300 group-hover:border-red-900/80 shadow-inner"
          style={{
            transform: isHovered
              ? `translate3d(${coords.px * 8}px, ${coords.py * 6}px, 24px) rotate(${coords.px * 10}deg) scale(1.12)`
              : 'translate3d(0, 0, 0) rotate(0deg) scale(1)',
            boxShadow: isHovered ? `0 0 18px ${brandColor}60` : 'none',
          }}
        >
          {tech.icon}
        </div>

        {/* Name & Role */}
        <div
          className="mt-3 w-full transition-transform duration-300"
          style={{ transform: isHovered ? 'translateZ(12px)' : 'translateZ(0)' }}
        >
          <h3 className="font-heading font-semibold text-sm text-white group-hover:text-white transition-colors">
            {tech.name}
          </h3>
          <p className="font-sans text-[11px] text-neutral-400 mt-0.5 truncate font-medium group-hover:text-neutral-300 transition-colors">
            {tech.role}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export const Skills: React.FC = () => {
  return (
    <section id="skills" className="relative py-12 md:py-16 overflow-hidden border-t border-red-950/25">
      {/* Layer 1: Slow Red Radial Glow Drifting Behind Grid */}
      <div
        className="skills-ambient-glow absolute pointer-events-none rounded-full"
        style={{
          width: '780px',
          height: '540px',
          top: '50%',
          left: '50%',
          background: 'radial-gradient(circle, rgba(229, 9, 20, 0.2) 0%, rgba(120, 0, 10, 0.1) 45%, transparent 75%)',
          filter: 'blur(130px)',
          animation: 'crimson-glow-drift 18s ease-in-out infinite alternate',
        }}
        aria-hidden="true"
      />

      {/* Layer 2: Faint Technical Grid */}
      <div
        className="skills-tech-grid absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgba(229, 9, 20, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(229, 9, 20, 0.04) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          maskImage: 'radial-gradient(ellipse 75% 65% at 50% 50%, black 25%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 50% 50%, black 25%, transparent 85%)',
        }}
        aria-hidden="true"
      />

      {/* Layer 3: Thin Animated Red Circuit / Data Lines */}
      <svg
        className="skills-circuits absolute inset-0 w-full h-full pointer-events-none opacity-25"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="circuit-grad-skills" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E50914" stopOpacity="0" />
            <stop offset="50%" stopColor="#E50914" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#E50914" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Horizontal & Branching Technical Traces */}
        <path
          d="M 0 140 H 320 L 380 200 H 840 L 900 260 H 1800"
          fill="none"
          stroke="url(#circuit-grad-skills)"
          strokeWidth="1"
          strokeDasharray="8 14"
          style={{ animation: 'circuit-flow 24s linear infinite' }}
        />
        <path
          d="M 1800 360 H 1220 L 1160 300 H 640 L 580 240 H 0"
          fill="none"
          stroke="url(#circuit-grad-skills)"
          strokeWidth="1"
          strokeDasharray="6 12"
          style={{ animation: 'circuit-flow-rev 28s linear infinite' }}
        />
        {/* Cardinal tech node dots */}
        <circle cx="380" cy="200" r="2.5" fill="#E50914" opacity="0.8" />
        <circle cx="840" cy="200" r="2.5" fill="#E50914" opacity="0.8" />
        <circle cx="1160" cy="300" r="2.5" fill="#E50914" opacity="0.8" />
        <circle cx="640" cy="300" r="2.5" fill="#E50914" opacity="0.8" />
      </svg>

      {/* Layer 4: Sparse Subtle Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${1.5 + (i % 2.5)}px`,
              height: `${1.5 + (i % 2.5)}px`,
              left: `${15 + ((i * 12.5) % 75)}%`,
              top: `${20 + ((i * 14.8) % 65)}%`,
              background: i % 2 === 0 ? '#E50914' : 'rgba(255, 255, 255, 0.65)',
              boxShadow: i % 2 === 0 ? '0 0 8px #E50914' : 'none',
              opacity: 0.2 + (i % 3) * 0.15,
              animation: `pulse ${4 + (i % 3)}s ease-in-out ${i * 0.6}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Layer 5: Soft Moving Light Streak */}
      <div
        className="absolute top-[35%] left-[-10%] w-[550px] h-[1px] pointer-events-none opacity-20"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(229, 9, 20, 0.7), transparent)',
          transform: 'rotate(-15deg)',
          boxShadow: '0 0 15px 2px rgba(229, 9, 20, 0.25)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10 w-full my-auto">
        {/* Split Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0C0C0C] border border-red-900/40 text-[#E50914] text-xs font-mono tracking-widest uppercase mb-4">
              <Layers className="w-3.5 h-3.5" />
              <span>TECH STACK</span>
            </div>

            <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
              Technologies I{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] to-[#FF4444]">
                work with.
              </span>
            </h2>
          </div>

          <p className="font-sans text-neutral-400 text-sm sm:text-base max-w-md md:text-right">
            Tools and technologies I use to build modern and powerful web applications.
          </p>
        </div>

        {/* 3D Interactive Responsive Grid */}
        <div className="skills-grid">
          {technologies.map((tech, index) => (
            <SkillCard key={tech.name} tech={tech} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
