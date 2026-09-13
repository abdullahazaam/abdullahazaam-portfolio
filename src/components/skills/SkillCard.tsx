import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

export function SkillCard({ tech, index, brandColor }: { tech: { name: string; role: string; icon: ReactNode }; index: number; brandColor: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const point = useRef({ x: 0, y: 0 });
  const canPoint = () => matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches;
  const speed = (rate: number) => ref.current?.querySelectorAll('.skill-orbit-motion').forEach(el => el.getAnimations().forEach(animation => animation.updatePlaybackRate(rate)));
  const reset = () => {
    cancelAnimationFrame(frame.current); frame.current = 0;
    const el = ref.current; if (!el) return;
    el.classList.remove('skill-engaged');
    ['--card-rx', '--card-ry'].forEach(name => el.style.setProperty(name, '0deg'));
    ['--rear-x', '--rear-y'].forEach(name => el.style.setProperty(name, '0px'));
    speed(1);
  };
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    media.addEventListener('change', reset); window.addEventListener('blur', reset);
    return () => { cancelAnimationFrame(frame.current); media.removeEventListener('change', reset); window.removeEventListener('blur', reset); };
  }, []);
  return <div ref={ref} className="skill-shell w-full relative flex items-center justify-center py-1" style={{ '--brand': brandColor, '--orbit-duration': `${30 + index % 5 * 3}s`, '--orbit-delay': `${-index * 2.7}s` } as CSSProperties}
    onPointerMove={event => {
      if (event.pointerType === 'touch' || !canPoint()) return;
      const el = ref.current!; const r = el.getBoundingClientRect();
      point.current = { x: Math.max(-.5, Math.min(.5, (event.clientX-r.left)/r.width-.5)), y: Math.max(-.5, Math.min(.5, (event.clientY-r.top)/r.height-.5)) };
      if (!el.classList.contains('skill-engaged')) { el.classList.add('skill-engaged'); speed(1.35); }
      if (frame.current) return;
      frame.current=requestAnimationFrame(() => {
        frame.current=0; const {x,y}=point.current; const strength=innerWidth<=768?3:6;
        el.style.setProperty('--card-rx', `${-y*strength}deg`); el.style.setProperty('--card-ry', `${x*strength}deg`);
        el.style.setProperty('--rear-x', `${-x*3}px`);el.style.setProperty('--rear-y', `${-y*3}px`);
        el.style.setProperty('--light-x', `${(x+.5)*100}%`);el.style.setProperty('--light-y', `${(y+.5)*100}%`);
      });
    }} onPointerLeave={reset} onPointerCancel={reset}>
    <div className="skill-orbital-system" aria-hidden="true">
      <div className="skill-rear-glass" />
      <div className="skill-orbit-halo" />
      <svg className="skill-orbit-track" viewBox="0 0 160 150" preserveAspectRatio="none">
        <rect className="skill-orbit-rail" x="2" y="2" width="156" height="146" rx="27" />
        <rect className="skill-orbit-primary skill-orbit-motion" pathLength="100" x="2" y="2" width="156" height="146" rx="27" />
        <rect className="skill-orbit-secondary skill-orbit-motion" pathLength="100" x="5" y="5" width="150" height="140" rx="35" />
        <rect className="skill-orbit-node skill-orbit-motion" pathLength="100" x="2" y="2" width="156" height="146" rx="27" />
        <rect className="skill-orbit-node skill-orbit-node-secondary skill-orbit-motion" pathLength="100" x="5" y="5" width="150" height="140" rx="35" />
      </svg>
      <div className="skill-arc-plane"><div className="skill-geometric-arc skill-orbit-motion" /></div>
    </div>
    <div className="premium-card skill-card skill-front group relative rounded-2xl bg-[#080709]/95 border border-neutral-900/90 p-4 sm:p-5 backdrop-blur-md hover:border-[#E50914]/70 hover:bg-[#0E0C0E] flex flex-col items-center text-center justify-between min-h-[140px] select-none z-10 w-full">
      <span className="skill-edge-window" aria-hidden="true"><span className="skill-edge-beam skill-orbit-motion" /></span>
      <div className="skill-icon w-12 h-12 rounded-xl bg-[#111013] border border-neutral-800 flex items-center justify-center shadow-inner">{tech.icon}</div>
      <div className="mt-3 w-full"><h3 className="font-heading font-semibold text-sm text-white">{tech.name}</h3><p className="font-sans text-[11px] text-neutral-400 mt-0.5 truncate font-medium">{tech.role}</p></div>
    </div>
  </div>;
}
