import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export const BackgroundAtmosphere: React.FC = () => {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.to(root.current, { '--atmosphere-y': '-110px', ease: 'none', scrollTrigger: { trigger: 'main', start: 'top top', end: 'bottom bottom', scrub: 1 } });
    });
    return () => media.revert();
  }, []);
  return <div ref={root} className="crimson-atmosphere" aria-hidden="true">
    <div className="atmosphere-haze haze-one" /><div className="atmosphere-haze haze-two" />
    <div className="atmosphere-grid" /><div className="atmosphere-streak" />
    <svg className="atmosphere-network" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
      <defs><radialGradient id="network-dot"><stop stopColor="#ff5b6f" /><stop offset=".25" stopColor="#f71331" stopOpacity=".65" /><stop offset="1" stopColor="#e50914" stopOpacity="0" /></radialGradient></defs>
      {Array.from({ length: 42 }, (_, i) => {
        const x = ((i * 173 + 31) % 1500) - 30, y = ((i * 263 + 51) % 980) - 40;
        return <g key={i}>
          {[1, 5, 9].map(step => { const j = (i + step) % 42, tx = ((j * 173 + 31) % 1500) - 30, ty = ((j * 263 + 51) % 980) - 40; return Math.hypot(x-tx,y-ty) < 430 ? <path key={step} d={`M${x} ${y}L${tx} ${ty}`} stroke="#f51d3a" strokeWidth={i % 4 === 0 ? .9 : .55} opacity={i % 4 === 0 ? .32 : .14} /> : null; })}
          <circle cx={x} cy={y} r={i % 4 === 0 ? 17 : 5} fill="url(#network-dot)" /><circle cx={x} cy={y} r="1.1" fill="#ff3d56" opacity=".7" />
        </g>;
      })}
    </svg>
    {Array.from({ length: 24 }, (_, i) => <i className="atmosphere-particle" key={i} style={{ left: `${(i * 41.7) % 100}%`, top: `${(i * 23.3) % 100}%`, animationDelay: `${-i * 1.7}s`, animationDuration: `${17 + i % 7}s`, opacity: 0.15 + (i % 4) * 0.08 } as React.CSSProperties} />)}
  </div>;
};
