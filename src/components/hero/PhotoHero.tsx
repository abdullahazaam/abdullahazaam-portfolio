import { useLayoutEffect, useRef } from 'react';
import { ArrowRight, Infinity as InfinityIcon } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './hero-room.css';
import { GithubIcon } from '../common/Icons';

gsap.registerPlugin(ScrollTrigger);
const visual = '/seq-hero.png';
export const Hero = () => {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const hero = root.current;
    const header = document.querySelector('header');
    if (!hero || !header) return;
    const measure = () => hero.style.setProperty('--hero-nav-height', header.getBoundingClientRect().height + 'px');
    measure();
    const size = new ResizeObserver(measure); size.observe(header);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const model = { scroll: 0, x: 0, y: 0 };
      let targetX = 0, targetY = 0;
      const fine = matchMedia('(hover: hover) and (pointer: fine)');
      let visible = true;
      const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; hero.toggleAttribute('data-hero-paused', !visible); });
      visibility.observe(hero);
      const move = (event: PointerEvent) => {
        if (!fine.matches || event.pointerType === 'touch') return;
        const r = hero.getBoundingClientRect();
        targetX = (event.clientX-r.left)/r.width-.5;
        targetY = (event.clientY-r.top)/r.height-.5;
      };
      const reset = () => { targetX = 0; targetY = 0; };
      const render = (_time: number, delta: number) => {
        if (!visible) return;
        const blend = 1-Math.exp(-Math.min(delta,64)/180);
        model.x += (targetX-model.x)*blend; model.y += (targetY-model.y)*blend;
        const small = hero.clientWidth <= 900;
        const amplitude = small ? .35 : 1;
        const set = (name: string,value: number) => hero.style.setProperty(name, value + 'px');
        set('--wall-x', model.x * 8 * amplitude); set('--wall-y',model.y * 5 * amplitude-model.scroll*10);
        set('--halo-x',-model.x*12*amplitude); set('--halo-y',model.y*8*amplitude+model.scroll*16);
        set('--monitor-x',model.x*1.3*amplitude); set('--monitor-y',model.y*.7*amplitude-model.scroll*1.2);
        set('--desk-x',model.x*2.5*amplitude); set('--desk-y',model.y*1.2*amplitude-model.scroll*2.5);
        set('--copy-y',-model.scroll*(small?8:18));
        hero.style.setProperty('--copy-opacity',String(1-model.scroll*.15));
        hero.style.setProperty('--room-camera',String(model.scroll*.018));
        hero.style.setProperty('--room-yaw',String(model.x*.7*amplitude)+'deg');
      };
      const tween = gsap.to(model,{scroll:1,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.8}});
      gsap.ticker.add(render); hero.addEventListener('pointermove',move,{passive:true});hero.addEventListener('pointerleave',reset);window.addEventListener('blur',reset);
      return () => {
        tween.scrollTrigger?.kill();tween.kill();gsap.ticker.remove(render);visibility.disconnect();hero.removeAttribute('data-hero-paused');
        hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',reset);window.removeEventListener('blur',reset);
        ['--wall-x','--wall-y','--halo-x','--halo-y','--monitor-x','--monitor-y','--desk-x','--desk-y','--copy-y','--copy-opacity','--room-camera','--room-yaw'].forEach(name=>hero.style.removeProperty(name));
      };
    });
    return () => {size.disconnect();media.revert();};
  }, []);
  return <div id="hero" className="blueprint-hero" ref={root}>
    <div className="hero-room" aria-hidden="true">
      <div className="hero-room-wall"><svg className="hero-wall-extension" viewBox="900 125 1476 65" preserveAspectRatio="none"><image href={visual} width="2376" height="958"/></svg></div>
      <div className="hero-room-floor"/><div className="hero-room-halo"/>
      <div className="hero-light-sweep"/>
      <div className="hero-room-dust">{Array.from({length:10},(_,i)=><i key={i} style={{left:(36+i*6.1)+'%',top:(14+(i*17)%73)+'%',animationDelay:(-i*2.3)+'s'}}/>)}</div>
    </div>
    <div className="hero-workstation">
      <div className="hero-approved-plane">
        <img className="hero-approved-base" src={visual} alt="Abdullah Azaam - Full-Stack Developer at developer workstation" width="2376" height="958" fetchPriority="high" decoding="async" />
        <img className="hero-monitor-depth" src={visual} alt="" aria-hidden="true" width="2376" height="958" />
        <img className="hero-monitor-depth hero-monitor-depth-right" src={visual} alt="" aria-hidden="true" width="2376" height="958" />
        <img className="hero-desk-depth" src={visual} alt="" aria-hidden="true" width="2376" height="958" />
      </div>
    </div>
    <div className="hero-room-copy">
      <p className="hero-room-eyebrow">FULL-STACK DEVELOPER</p>
      <h1><span>Abdullah </span><span>Azaam</span></h1>
      <p className="hero-room-description">Building scalable web applications and immersive digital experiences.</p>
      <div className="hero-room-actions">
        <a href="#projects" aria-label="View My Work" title="View My Work">View My Work <ArrowRight size={15}/></a>
        <a href="https://github.com/abdullahazaam" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" title="GitHub Profile"><GithubIcon size={15}/> GitHub</a>
      </div>
      <div className="hero-room-stats">
        <div><strong>5+</strong><span>Major Projects</span></div>
        <div><strong>15+</strong><span>Technologies</span></div>
        <div><strong aria-hidden="true"><InfinityIcon size={29}/></strong><span>Always Learning</span></div>
      </div>
    </div>
  </div>;
};
