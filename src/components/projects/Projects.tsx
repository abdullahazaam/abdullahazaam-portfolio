import React from 'react';
import { projects } from '../../data/projects';
import { ProjectCard } from './ProjectCard';
import { Code2, ArrowRight } from 'lucide-react';

export const Projects: React.FC = () => {

  return (
    <section id="projects" className="relative py-28 bg-[#030303] overflow-hidden border-t border-red-950/20">
      {/* Deep Red Atmosphere Behind Featured Projects */}
      <div className="absolute top-1/4 -right-40 w-[650px] h-[650px] bg-[#260000]/40 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-[650px] h-[650px] bg-[#1A0000]/30 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
        {/* Split Header matching full-structure.png */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0C0C0C] border border-red-900/40 text-[#E50914] text-xs font-mono tracking-widest uppercase mb-4">
              <Code2 className="w-3.5 h-3.5" />
              <span>FEATURED PROJECTS</span>
            </div>

            <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
              Real projects.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] to-[#FF4444]">
                Real impact.
              </span>
            </h2>
          </div>

          <a
            href="https://github.com/abdullahazaam?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0C0C0C] border border-neutral-800 text-neutral-300 hover:text-white hover:border-[#E50914] text-xs font-sans font-semibold uppercase tracking-wider transition-all w-max shadow-sm"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E50914] transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              prominent={project.featured}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
