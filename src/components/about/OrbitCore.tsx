import React, { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { DotNetIcon, CSharpIcon, DatabaseIcon, LaravelIcon, ReactIcon, ThreeJsIcon } from '../common/Icons';

export const DeveloperCoreVisual: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ px: 0, py: 0 });
  const isHoveredRef = useRef(false);
  const nodeElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const pulseLinesRef = useRef<(SVGLineElement | null)[]>([]);
  const angleRef = useRef(0);
  const speedRef = useRef((2 * Math.PI) / 22);

  // Exactly 6 cards with 60° equal spacing around the orbit
  const nodes = [
    { name: '.NET', baseAngle: 0, color: '#b794ff', icon: <DotNetIcon size={28} /> },
    { name: 'C#', baseAngle: 60, color: '#c184df', icon: <CSharpIcon size={28} /> },
    { name: 'React', baseAngle: 120, color: '#61dafb', icon: <ReactIcon size={28} /> },
    { name: 'Laravel', baseAngle: 180, color: '#ff283e', icon: <LaravelIcon size={28} /> },
    { name: 'Three.js', baseAngle: 240, color: '#e8e8ec', icon: <ThreeJsIcon size={28} /> },
    { name: 'SQL Server', baseAngle: 300, color: '#ff283e', icon: <DatabaseIcon size={28} /> },
  ];

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.pointerType === 'touch') return;
    const rect = containerRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ px, py });
  };

  const handlePointerEnter = () => {
    isHoveredRef.current = true;
  };

  const handlePointerLeave = () => {
    isHoveredRef.current = false;
    setTilt({ px: 0, py: 0 });
  };

  // Clockwise 3D Orbit Animation Loop (Runs via requestAnimationFrame at 60/120 FPS)
  useEffect(() => {
    let lastTime = performance.now();
    let rafId = 0;
    let isVisible = true;

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const normalSpeed = shouldReduceMotion ? 0 : (2 * Math.PI) / 22; // ~22 seconds per complete orbit
    const hoverSpeed = shouldReduceMotion ? 0 : (2 * Math.PI) / 46;  // Smoothly decelerates on hover without abrupt stop

    const animate = (time: number) => {
      if (!isVisible) {
        rafId = requestAnimationFrame(animate);
        return;
      }

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Smooth transition between normal and hover speed
      const targetSpeed = isHoveredRef.current ? hoverSpeed : normalSpeed;
      speedRef.current += (targetSpeed - speedRef.current) * 0.05;


      // Advance angle clockwise (positive increment)
      angleRef.current = (angleRef.current + speedRef.current * dt) % (2 * Math.PI);

      const isMobile = window.innerWidth <= 700;
      const radiusX = isMobile ? 36 : 39;
      const radiusY = isMobile ? 29 : 32;

      nodes.forEach((node, i) => {
        const el = nodeElementsRef.current[i];
        if (!el) return;

        // Clockwise angle: baseAngle + angleRef
        const nodeAngle = (node.baseAngle * Math.PI) / 180 + angleRef.current;
        const cosA = Math.cos(nodeAngle);
        const sinA = Math.sin(nodeAngle);

        // Position coordinates around the center (50%, 50%)
        const posX = 50 + cosA * radiusX;
        const posY = 50 + sinA * radiusY;

        // 3D Depth factor:
        // sinA > 0: front of orbit (closer, larger, brighter, in front of globe)
        // sinA < 0: back of orbit (further, smaller, dimmer, behind globe)
        const normZ = (sinA + 1) / 2; // 0 (back) to 1 (front)
        const scale = 0.85 + normZ * 0.23; // 0.85 to 1.08
        const opacity = 0.68 + normZ * 0.32; // 0.68 to 1.0
        const zIndex = sinA > 0 ? 25 : 4; // Globe is at zIndex 10
        const zDepth = sinA * 28;

        // Subtle vertical floating motion
        const floatY = Math.sin(time * 0.0025 + i * 1.05) * 3.5;

        el.style.left = `${posX}%`;
        el.style.top = `${posY}%`;
        // Card stays 100% upright and readable - no upside-down rotation
        el.style.transform = `translate3d(0, ${floatY}px, ${zDepth}px) scale(${scale})`;
        el.style.opacity = `${opacity}`;
        el.style.zIndex = `${zIndex}`;

        // Dynamic 3D depth shadow & ambient red glow
        if (normZ > 0.6) {
          el.style.boxShadow = `0 12px 26px -6px rgba(0, 0, 0, 0.9), 0 0 ${Math.round(10 + normZ * 14)}px rgba(229, 9, 20, ${0.25 + normZ * 0.25}), inset 0 1px 1px rgba(255, 255, 255, 0.12)`;
        } else {
          el.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.04)';
        }

        // Dynamically update connecting SVG laser line to track the node
        const line = pulseLinesRef.current[i];
        if (line) {
          const svgRadiusX = isMobile ? 144 : 156;
          const svgRadiusY = isMobile ? 116 : 128;
          const targetSvgX = 200 + cosA * svgRadiusX;
          const targetSvgY = 200 + sinA * svgRadiusY;
          line.setAttribute('x2', targetSvgX.toFixed(1));
          line.setAttribute('y2', targetSvgY.toFixed(1));
          line.setAttribute('opacity', `${0.1 + normZ * 0.2}`);
        }
      });

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [shouldReduceMotion]);


  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className="tech-core relative select-none will-change-transform"
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        transform: `rotateX(${-tilt.py * 10}deg) rotateY(${tilt.px * 12}deg)`,
        transition: 'transform 0.25s ease-out',
      }}
    >
      <svg className="core-globe" viewBox="0 0 400 400" aria-hidden="true" style={{ transformStyle: 'preserve-3d', zIndex: 10 }}>
        <defs>
          <radialGradient id="globe-shading" cx="68%" cy="25%" r="75%">
            <stop offset="0%" stopColor="#ff5368" />
            <stop offset=".2" stopColor="#a8082b" />
            <stop offset=".56" stopColor="#300513" />
            <stop offset="1" stopColor="#050409" />
          </radialGradient>
          <radialGradient id="core-haze">
            <stop stopColor="#ff103f" stopOpacity=".6" />
            <stop offset="1" stopColor="#ef1135" stopOpacity="0" />
          </radialGradient>
          <clipPath id="globe-clip">
            <circle cx="200" cy="200" r="91" />
          </clipPath>
        </defs>

        {/* Ambient Haze Glow */}
        <circle cx="200" cy="200" r="160" fill="url(#core-haze)" className="animate-pulse" style={{ animationDuration: '4s' }} />

        {/* Thin Glowing Orbit Path */}
        <ellipse
          cx="200"
          cy="200"
          rx="156"
          ry="128"
          fill="none"
          stroke="#E50914"
          strokeWidth="1.2"
          strokeDasharray="5 5"
          opacity="0.32"
          style={{ filter: 'drop-shadow(0 0 6px rgba(229,9,20,0.5))' }}
        />

        {/* Dynamic Connecting Lines from Center Globe to Orbiting Nodes */}
        {nodes.map((node, i) => (
          <line
            key={`line-${node.name}`}
            ref={(el) => (pulseLinesRef.current[i] = el)}
            x1="200"
            y1="200"
            x2="200"
            y2="200"
            stroke={node.color}
            strokeWidth="1"
            opacity="0.2"
            strokeDasharray="4 4"
          />
        ))}

        {/* Orbit Background Detail Rings */}
        <g className="core-orbit-lines" fill="none" stroke="#e92843">
          <circle cx="200" cy="200" r="119" opacity=".22" />
          <circle cx="200" cy="200" r="106" opacity=".35" strokeDasharray="40 6 3 14" />
          <ellipse cx="200" cy="200" rx="176" ry="65" transform="rotate(-25 200 200)" opacity=".45" />
          <ellipse cx="200" cy="200" rx="159" ry="82" transform="rotate(37 200 200)" opacity=".2" />
        </g>

        {/* Fixed Central Core Globe with 3D Depth */}
        <circle cx="200" cy="200" r="92" fill="url(#globe-shading)" stroke="#ff314d" strokeWidth="1.5" />
        <g clipPath="url(#globe-clip)">
          <g fill="none" stroke="#ff5e79" opacity=".23">
            <ellipse cx="200" cy="200" rx="45" ry="92" />
            <ellipse cx="200" cy="200" rx="75" ry="92" />
            <ellipse cx="200" cy="200" rx="92" ry="32" />
            <ellipse cx="200" cy="200" rx="92" ry="67" />
            <path d="M108 200H292M200 108V292" />
          </g>
          <g fill="#170812" stroke="#c32246" strokeWidth=".45">
            <path d="M127 144q9-11 17-10l5-8 14 2 8-7 12 5 5 9-9 4-3 9-12-1-3 9 5 5-10 5-4 12-7 1-4-10-8-5-3-13-7-2zM153 183l10 5 3 8 8 3 5-6 13 6 9 8-3 11-9 8-1 11-7 8-2 13-7 8-4-12 1-16-8-10-4-15-6-9zM210 129l9-6 11 2 1 8 8 2 3-4 14 4 5 10 9-1 13 11 1 13-10 4-3 8-12-3-6 12-8-7-2-9-7 2-5-8-8 4-8-5-6-1 1-8-8-2 6-8-2-7 8-1zM213 180l8-7 13 7 3 9 12 4-1 12-7 8-4 16-9 7-6-12-4-11-8-6-3-13zM251 211l7 1 3 8 9 2 2 5-7 2-5-5-8-4zM267 242l9-7 8 6 8 1 3 12-12 6-10-3-9 2-3-10z" />
          </g>
          <path d="M216 113a91 91 0 0 1 71 70" fill="none" stroke="#ff93a2" strokeWidth="4" opacity=".65" />
        </g>
      </svg>

      {/* Fixed Central AA Monogram */}
      <motion.div
        className="core-monogram pointer-events-none"
        animate={{
          scale: [1, 1.04, 1],
          filter: [
            'drop-shadow(0 0 12px rgba(255,26,54,0.7)) drop-shadow(0 0 26px rgba(255,16,44,0.4))',
            'drop-shadow(0 0 20px rgba(255,26,54,0.95)) drop-shadow(0 0 35px rgba(255,16,44,0.65))',
            'drop-shadow(0 0 12px rgba(255,26,54,0.7)) drop-shadow(0 0 26px rgba(255,16,44,0.4))',
          ],
        }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}

        style={{ transform: 'translate3d(-50%, -50%, 30px)', zIndex: 15 }}
      >
        AA
      </motion.div>

      {/* 6 Continuously Orbiting Tech Cards (Upright, Clockwise, Equal Spacing, 3D Depth) */}
      {nodes.map((node, index) => (
        <div
          key={node.name}
          ref={(el) => (nodeElementsRef.current[index] = el)}
          className="premium-card orbit-node cursor-pointer will-change-transform"
          style={{
            '--brand': node.color,
            transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
            position: 'absolute',
          } as React.CSSProperties}
        >
          {node.icon}
          <span>{node.name}</span>
        </div>
      ))}
    </div>
  );
};
