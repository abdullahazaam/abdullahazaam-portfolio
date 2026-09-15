import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SkillCard } from './SkillCard';
import './skill-cards.css';
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
} from '../common/Icons';

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

export const Skills: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>('.skill-shell'));
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      let revealed = false;
      gsap.set(cards, { opacity: 0, y: 17, z: -20, rotateX: 7 });
      const observer = new IntersectionObserver(([entry]) => {
        cards.forEach(card => card.toggleAttribute('data-orbit-paused', !entry.isIntersecting));
        if (!entry.isIntersecting || revealed) return;
        revealed = true;
        const columns = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
        gsap.to(cards, { opacity: 1, y: 0, z: 0, rotateX: 0, duration: .65, ease: 'power3.out', stagger: index => Math.floor(index / columns) * .18 + (index % columns) * .04, clearProps: 'transform,opacity' });
      }, { rootMargin: '0px 0px -6% 0px', threshold: .05 });
      observer.observe(grid);
      return () => { observer.disconnect(); gsap.killTweensOf(cards); gsap.set(cards, { clearProps: 'transform,opacity' }); cards.forEach(card => card.removeAttribute('data-orbit-paused')); };
    });
    return () => media.revert();
  }, []);
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
        <div className="skills-grid" ref={gridRef}>
          {technologies.map((tech, index) => (
            <SkillCard key={tech.name} tech={tech} index={index} brandColor={brandColors[index % brandColors.length]} />
          ))}
        </div>
      </div>
    </section>
  );
};
