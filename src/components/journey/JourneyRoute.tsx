import { useEffect, useRef } from 'react';
import { Code2, Database, Layers, Rocket, Lightbulb } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const icons = [Code2, Database, Layers, Rocket, Lightbulb];
const route = 'M 100 86 C 190 86 210 208 300 208 S 410 86 500 86 S 610 208 700 208 S 810 86 900 86';
export function JourneyRoute({ steps }: { steps: { stage: string; title: string; subtitle: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.route-progress', { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top 85%', end: 'bottom 65%', scrub: .8 } });
      gsap.fromTo('.route-milestone', { opacity: 0, y: 18 }, { opacity: 1, y: 0, stagger: .1, duration: .7, scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true } });
    }, ref);
    return () => ctx.revert();
  }, []);
  return <div className="journey-route" ref={ref}>
    <svg className="route-svg" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true">
      <path className="route-shadow" d={route} />
      <path className="route-track" d={route} />
      <path className="route-progress" pathLength="1" strokeDasharray="1" d={route} />
      <path className="route-energy" pathLength="100" d={route} />
    </svg>
    <svg className="route-mobile-svg" viewBox="0 0 40 500" preserveAspectRatio="none" aria-hidden="true">
      <path className="route-track" d="M20 35 C-5 85 45 85 20 135 S-5 185 20 235 S45 285 20 335 S-5 385 20 435 L20 475" />
      <path className="route-energy" pathLength="100" d="M20 35 C-5 85 45 85 20 135 S-5 185 20 235 S45 285 20 335 S-5 385 20 435 L20 475" />
    </svg>
    <div className="route-stages">
      {steps.map((step, index) => { const Icon = icons[index]; return <article className="route-milestone" key={step.title} style={{ '--stage': index } as React.CSSProperties}>
        <div className="route-node premium-card">
          <div className="route-icon"><Icon size={23} strokeWidth={1.5} /></div>
          <div className="route-copy"><span>{step.stage}</span><h3>{step.title}</h3><p>{step.subtitle}</p></div>
        </div>
      </article>; })}
    </div>
  </div>;
}
