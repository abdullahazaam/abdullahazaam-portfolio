import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Compass, Code2, Database, Layers, Rocket, Lightbulb } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
  const sectionRef = useRef<HTMLDivElement>(null);
  const mobileLineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  // GSAP scaleX timeline draw — progress tied to scroll position
  useEffect(() => {
    if (!sectionRef.current || !lineRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(mobileLineRef.current, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: mobileLineRef.current?.parentElement, start: 'top 70%', end: 'bottom 70%', scrub: 0.6 } });
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            end: "bottom 60%",
            scrub: 1.2,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative py-28 bg-[#030303] overflow-hidden border-t border-red-950/20"
    >
      {/* Background atmosphere */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[700px] h-[700px] bg-[#1A0000]/28 rounded-full blur-[170px] pointer-events-none" />

      <div className="journey-landscape" aria-hidden="true" />

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

        {/* DESKTOP horizontal timeline */}
        <div className="journey-desktop hidden md:block relative pt-4 pb-4">
          {/* GSAP scrub line — scaleX driven by ScrollTrigger */}
          <div
            ref={lineRef}
            className="absolute top-10 left-12 right-12 h-[2px] bg-gradient-to-r from-[#780000] via-[#E50914] to-[#E50914] shadow-[0_0_14px_rgba(229,9,20,0.7)] z-0 origin-left"
            style={{ transformOrigin: "left center" }}
          />

          <div className="grid grid-cols-5 gap-4 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: 0.15 + index * 0.12, ease: "easeOut" }}
                className="flex flex-col items-center text-center group"
              >
                {/* Node */}
                <motion.div
                  whileInView={{ scale: [0.6, 1.25, 1] }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.25 + index * 0.12 }}
                  className="w-10 h-10 rounded-full bg-[#0A0A0A] border-2 border-[#E50914] flex items-center justify-center shadow-[0_0_20px_rgba(229,9,20,0.8)] group-hover:scale-110 group-hover:shadow-[0_0_28px_rgba(229,9,20,1)] transition-all mb-6 cursor-default"
                >
                  {[<Code2 key="code" />, <Database key="db" />, <Layers key="layers" />, <Rocket key="rocket" />, <Lightbulb key="idea" />][index]}
                </motion.div>

                <span className="font-sans text-xs text-neutral-400 font-medium mb-1">{step.stage}</span>
                <h3 className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-[#E50914] transition-colors">
                  {step.title}
                </h3>
                <p className="font-sans text-xs text-neutral-400 mt-1 max-w-[150px]">{step.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* MOBILE vertical timeline */}
        <div className="journey-mobile md:hidden relative pl-6 sm:pl-8">
          <div ref={mobileLineRef} style={{ transformOrigin: "top center" }} className="absolute top-4 bottom-4 left-3 sm:left-4 w-[2px] bg-gradient-to-b from-[#780000] via-[#E50914] to-[#780000] opacity-80 shadow-[0_0_10px_rgba(229,9,20,0.5)]" />
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="relative flex items-start gap-4"
              >
                <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-[#0A0A0A] border-2 border-[#E50914] flex items-center justify-center shadow-[0_0_12px_rgba(229,9,20,0.6)]">
                  <span className="w-2 h-2 rounded-full bg-[#E50914]" />
                </div>
                <div className="premium-card flex-1 p-4 rounded-2xl bg-[#0A0A0A]/90 border border-neutral-900">
                  <span className="font-sans text-xs text-neutral-400 font-medium block mb-0.5">{step.stage}</span>
                  <h3 className="font-heading font-bold text-base text-white">{step.title}</h3>
                  <p className="mt-1 font-sans text-xs text-neutral-400">{step.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
