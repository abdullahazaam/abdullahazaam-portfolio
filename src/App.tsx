import React, { lazy, Suspense, useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { PremiumEffects } from './components/common/PremiumEffects';
import { LenisScroll } from './components/common/LenisScroll';
import { BackgroundAtmosphere } from './components/common/BackgroundAtmosphere';
import { Navbar } from './components/navbar/Navbar';
import { Hero } from './components/hero/Hero';

// Code-split below-the-fold sections
const About = lazy(() => import('./components/about/About').then(m => ({ default: m.About })));
const Skills = lazy(() => import('./components/skills/Skills').then(m => ({ default: m.Skills })));
const Projects = lazy(() => import('./components/projects/Projects').then(m => ({ default: m.Projects })));
const Journey = lazy(() => import('./components/journey/Journey').then(m => ({ default: m.Journey })));
const Contact = lazy(() => import('./components/contact/Contact').then(m => ({ default: m.Contact })));
const Footer = lazy(() => import('./components/footer/Footer').then(m => ({ default: m.Footer })));

// Zero-CLS placeholder matching reserved desktop section heights
const SectionFallback: React.FC<{ id?: string }> = ({ id }) => (
  <div id={id} className="w-full min-h-[calc(100vh-72px)] min-h-[calc(100svh-72px)] opacity-0 pointer-events-none" aria-hidden="true" />
);

export const App: React.FC = () => {
  useEffect(() => {
    // Preload below-fold sections as soon as critical render completes
    const preloadBelowFold = () => {
      import('./components/about/About');
      import('./components/skills/Skills');
      import('./components/projects/Projects');
      import('./components/journey/Journey');
      import('./components/contact/Contact');
      import('./components/footer/Footer');
    };

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(preloadBelowFold, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    } else {
      const timer = setTimeout(preloadBelowFold, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <MotionConfig reducedMotion="user"><LenisScroll>
      <div className="relative min-h-screen bg-[#050505] text-[#F5F5F5] selection:bg-[#E50914] selection:text-white overflow-x-clip">
        {/* Ambient Subtle Cursor Spotlight & Floating Atmosphere */}
        <PremiumEffects />
        <BackgroundAtmosphere />

        {/* Fixed Navigation */}
        <Navbar />

        {/* Core Content Flow: Hero loads synchronously, below-fold streams seamlessly */}
        <main className="relative z-10 flex flex-col">
          <Hero />
          <Suspense fallback={<SectionFallback id="about" />}>
            <About />
          </Suspense>
          <Suspense fallback={<SectionFallback id="skills" />}>
            <Skills />
          </Suspense>
          <Suspense fallback={<SectionFallback id="projects" />}>
            <Projects />
          </Suspense>
          <Suspense fallback={<SectionFallback id="journey" />}>
            <Journey />
          </Suspense>
          <Suspense fallback={<SectionFallback id="contact" />}>
            <Contact />
          </Suspense>
        </main>

        {/* Footer */}
        <Suspense fallback={<div className="h-28 opacity-0" aria-hidden="true" />}>
          <Footer />
        </Suspense>
      </div>
    </LenisScroll></MotionConfig>
  );
};

export default App;
