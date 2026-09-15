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
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const root=containerRef.current!,canvas=canvasRef.current!;
    let globe:ReturnType<typeof import('./HolographicEarth')['createEarth']>|undefined;
    let disposed=false;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const desktop=matchMedia('(min-width: 1025px) and (hover: hover) and (pointer: fine)');
    let frame=0,last=0,elapsed=0,visible=false,size=root.clientWidth;
    let targetX=0,targetY=0,x=0,y=0;
    const paint=(dt:number)=>{
      const blend=1-Math.exp(-dt*5);
      x+=(targetX-x)*blend;y+=(targetY-y)*blend;
      globe?.render(elapsed,x,y);
      cardsRef.current.forEach((el,i)=>{
        if(!el)return;
        const a=i*Math.PI/3+elapsed*Math.PI*2/22;
        const depth=(Math.sin(a)+1)/2;
        const rx=size*(size<350?.365:.38),ry=size*.355;
        el.style.transform=`translate3d(${Math.cos(a)*rx}px,${Math.sin(a)*ry}px,${Math.sin(a)*20}px) scale(${.84+depth*.18})`;
        el.style.opacity=String(.72+depth*.28);
        el.style.zIndex=Math.sin(a)>0?'12':'4';
      });
    };
    let loading = false;
    const loadEarth = () => {
      if (loading || globe || disposed) return;
      loading = true;
      import('./HolographicEarth').then(({createEarth})=>{
        if(disposed)return;
        try {globe=createEarth(canvas);globe.resize(size,!desktop.matches);paint(0);sync();}
        catch {root.dataset.fallback='true';}
      }).catch(()=>{if(!disposed)root.dataset.fallback='true';});
    };

    const tick=(now:number)=>{frame=0;const dt=last?Math.min((now-last)/1000,.05):0;last=now;elapsed+=dt;paint(dt);if(visible&&!document.hidden&&!reduced.matches)frame=requestAnimationFrame(tick);};
    const sync=()=>{cancelAnimationFrame(frame);frame=0;last=0;root.dataset.paused=String(!visible||document.hidden||reduced.matches);if(reduced.matches){targetX=targetY=x=y=0;paint(0);}else if(visible&&!document.hidden)frame=requestAnimationFrame(tick);};
    const resize=new ResizeObserver(()=>{size=root.clientWidth;globe?.resize(size,!desktop.matches);paint(0);});resize.observe(root);
    const observer=new IntersectionObserver(([entry])=>{
      visible=entry.isIntersecting;
      if (visible) loadEarth();
      sync();
    },{rootMargin:'400px 0px',threshold:.01});
    observer.observe(root);
    const move=(e:PointerEvent)=>{if(!desktop.matches||reduced.matches||e.pointerType==='touch')return;const r=root.getBoundingClientRect();targetX=Math.max(-1,Math.min(1,(e.clientX-r.left)/r.width*2-1))*.06;targetY=Math.max(-1,Math.min(1,(e.clientY-r.top)/r.height*2-1))*.06;};
    const leave=()=>{targetX=targetY=0;};
    const mediaChange=()=>{leave();sync();};
    root.addEventListener('pointermove',move,{passive:true});root.addEventListener('pointerleave',leave);
    document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',mediaChange);desktop.addEventListener('change',mediaChange);
    paint(0);

    let idleId: number | undefined;
    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(loadEarth, { timeout: 3500 });
    }

    return()=>{
      disposed=true;
      if (idleId && typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idleId);
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      root.removeEventListener('pointermove',move);
      root.removeEventListener('pointerleave',leave);
      document.removeEventListener('visibilitychange',sync);
      reduced.removeEventListener('change',mediaChange);
      desktop.removeEventListener('change',mediaChange);
      globe?.dispose();
    };
  },[]);
  return <div ref={containerRef} className="tech-core developer-globe relative select-none">
    <div className="earth-atmosphere" aria-hidden="true" />
    <div className="earth-fallback" aria-hidden="true" />
    <div className="earth-uplight" aria-hidden="true" />
    <canvas ref={canvasRef} className="earth-canvas" role="img" aria-label="Holographic Earth with illuminated coastlines and orbital networks" />
    {nodes.map((node,index)=><div key={node.name} ref={el=>{cardsRef.current[index]=el;}} className="premium-card orbit-node" style={{'--brand':node.color} as React.CSSProperties}>
      {node.icon}<span>{node.name}</span>
    </div>)}
  </div>;
};
