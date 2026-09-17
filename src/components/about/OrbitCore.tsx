import React, { useRef, useEffect } from 'react';
import { DotNetIcon, CSharpIcon, DatabaseIcon, LaravelIcon, ReactIcon, ThreeJsIcon } from '../common/Icons';
import './developer-globe.css';

const nodes = [
  { name: '.NET', color: '#b794ff', icon: <DotNetIcon size={28} /> },
  { name: 'C#', color: '#c184df', icon: <CSharpIcon size={28} /> },
  { name: 'React', color: '#61dafb', icon: <ReactIcon size={28} /> },
  { name: 'Laravel', color: '#ff283e', icon: <LaravelIcon size={28} /> },
  { name: 'Three.js', color: '#e8e8ec', icon: <ThreeJsIcon size={28} /> },
  { name: 'SQL Server', color: '#ff283e', icon: <DatabaseIcon size={28} /> },
];

export const DeveloperCoreVisual: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frontCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const backCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const root=containerRef.current!,canvas=canvasRef.current!;
    let globe:ReturnType<typeof import('./HolographicEarth')['createEarth']>|undefined;
    let disposed=false;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const desktop=matchMedia('(min-width: 1025px) and (hover: hover) and (pointer: fine)');
    let frame=0,last=0,elapsed=0,visible=false,size=root.clientWidth;
    let targetX=0,targetY=0,x=0,y=0;
    let rx = size * (size < 350 ? 0.365 : 0.38);
    let ry = size * 0.355;
    const lastFront = [true, true, true, true, true, true];
    const lastOp = ['', '', '', '', '', ''];

    const updateRadius = () => {
      rx = size * (size < 350 ? 0.365 : 0.38);
      ry = size * 0.355;
    };

    const paint=(dt:number)=>{
      const blend=1-Math.exp(-dt*5);
      x+=(targetX-x)*blend;y+=(targetY-y)*blend;
      globe?.render(elapsed,x,y);
      const front = frontCardsRef.current;
      const back = backCardsRef.current;
      for (let i = 0; i < 6; i++) {
        const a = i * 1.047197551 + elapsed * 0.285599332; // i * PI/3 + elapsed * 2*PI/22
        const sinA = Math.sin(a);
        const isFront = sinA >= 0;
        if (lastFront[i] !== isFront) {
          if (isFront) {
            if (back[i]) back[i]!.style.visibility = 'hidden';
            if (front[i]) front[i]!.style.visibility = 'visible';
          } else {
            if (front[i]) front[i]!.style.visibility = 'hidden';
            if (back[i]) back[i]!.style.visibility = 'visible';
          }
          lastFront[i] = isFront;
        }
        const el = isFront ? front[i] : back[i];
        if (!el) continue;
        const depth = (sinA + 1) * 0.5;
        el.style.transform = `translate3d(${Math.cos(a)*rx}px,${sinA*ry}px,${sinA*20}px) scale(${0.84+depth*0.18})`;
        const op = (0.72 + depth * 0.28).toFixed(2);
        if (lastOp[i] !== op) {
          el.style.opacity = op;
          lastOp[i] = op;
        }
      }
    };
    const tick=(now:number)=>{frame=0;const dt=last?Math.min((now-last)/1000,.05):0;last=now;elapsed+=dt;paint(dt);if(visible&&!document.hidden&&!reduced.matches)frame=requestAnimationFrame(tick);};
    const sync=()=>{cancelAnimationFrame(frame);frame=0;last=0;root.dataset.paused=String(!visible||document.hidden||reduced.matches);if(reduced.matches){targetX=targetY=x=y=0;paint(0);}else if(visible&&!document.hidden)frame=requestAnimationFrame(tick);};
    const resize=new ResizeObserver(()=>{size=root.clientWidth;updateRadius();globe?.resize(size,!desktop.matches);paint(0);});resize.observe(root);
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{threshold:.01});observer.observe(root);
    const move=(e:PointerEvent)=>{if(!desktop.matches||reduced.matches||e.pointerType==='touch')return;const r=root.getBoundingClientRect();targetX=Math.max(-1,Math.min(1,(e.clientX-r.left)/r.width*2-1))*.06;targetY=Math.max(-1,Math.min(1,(e.clientY-r.top)/r.height*2-1))*.06;};
    const leave=()=>{targetX=targetY=0;};
    const mediaChange=()=>{leave();sync();};
    root.addEventListener('pointermove',move,{passive:true});root.addEventListener('pointerleave',leave);
    document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',mediaChange);desktop.addEventListener('change',mediaChange);
    paint(0);
    // Keep Three.js outside the critical page bundle. StrictMode/unmount cannot leak a renderer.
    import('./HolographicEarth').then(({createEarth})=>{
      if(disposed)return;
      try {globe=createEarth(canvas);globe.resize(size,!desktop.matches);paint(0);sync();}
      catch {root.dataset.fallback='true';}
    }).catch(()=>{if(!disposed)root.dataset.fallback='true';});
    return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();resize.disconnect();root.removeEventListener('pointermove',move);root.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',mediaChange);desktop.removeEventListener('change',mediaChange);globe?.dispose();};
  },[]);
  return <div ref={containerRef} className="tech-core developer-globe relative select-none">
    <div className="earth-atmosphere" aria-hidden="true" />
    <div className="earth-fallback" aria-hidden="true" />
    <div className="earth-uplight" aria-hidden="true" />
    <div className="orbit-layer orbit-layer-back" aria-hidden="true">
      {nodes.map((node,index)=><div key={`back-${node.name}`} ref={el=>{backCardsRef.current[index]=el;}} className="premium-card orbit-node" style={{'--brand':node.color, visibility:'hidden'} as React.CSSProperties}>
        {node.icon}<span>{node.name}</span>
      </div>)}
    </div>
    <canvas ref={canvasRef} className="earth-canvas" role="img" aria-label="Holographic Earth with illuminated coastlines and orbital networks" />
    <div className="orbit-layer orbit-layer-front">
      {nodes.map((node,index)=><div key={`front-${node.name}`} ref={el=>{frontCardsRef.current[index]=el;}} className="premium-card orbit-node" style={{'--brand':node.color} as React.CSSProperties}>
        {node.icon}<span>{node.name}</span>
      </div>)}
    </div>
  </div>;
};
