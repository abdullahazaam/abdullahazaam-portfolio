import React from 'react';
import { Compass } from 'lucide-react';
import { JourneyRoute } from './JourneyRoute';
import { SectionDepth } from '../contact/SectionDepth';
import './section-upgrades.css';

interface TimelineStep {
  stage: string;
  title: string;
  subtitle: string;
}

const steps: TimelineStep[] = [
  { stage: "Started", title: "Web Development", subtitle: "HTML, CSS, JavaScript" },
  { stage: "Worked with", title: "PHP & Laravel", subtitle: "Built real applications" },
  { stage: "Moved to", title: "ASP.NET Core", subtitle: "Database-driven apps" },
  { stage: "Exploring", title: "3D & Modern Web", subtitle: "React, Three.js, GSAP" },
  { stage: "Future", title: "Keep Learning", subtitle: "Building bigger solutions" },
];

export const Journey: React.FC = () => {
  return (
    <section
      
      id="journey"
      className="journey-upgraded relative py-28 bg-[#030303] overflow-hidden border-t border-red-950/20"
    >
      {/* Background atmosphere */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[700px] h-[700px] bg-[#1A0000]/28 rounded-full blur-[170px] pointer-events-none" />

      <div className="journey-landscape" aria-hidden="true" />
      <SectionDepth />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
        {/* Split header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0C0C0C] border border-red-900/40 text-[#E50914] text-xs font-mono tracking-widest uppercase mb-4">
              <Compass className="w-3.5 h-3.5" />
              <span>MY JOURNEY</span>
            </div>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
              A continuous{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] to-[#FF4444]">
                learning journey.
              </span>
            </h2>
          </div>
          <p className="font-sans text-neutral-400 text-sm sm:text-base max-w-md md:text-right">
            Exploring technologies, building real projects and constantly improving my skills.
          </p>
        </div>

        <JourneyRoute steps={steps} />
      </div>
    </section>
  );
};
