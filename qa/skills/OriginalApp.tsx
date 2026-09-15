import React from 'react';
import { MotionConfig } from 'framer-motion';
import { PremiumEffects } from '/src/components/common/PremiumEffects';
import { LenisScroll } from '/src/components/common/LenisScroll';
import { BackgroundAtmosphere } from '/src/components/common/BackgroundAtmosphere';
import { Navbar } from '/src/components/navbar/Navbar';
import { Hero } from '/src/components/hero/Hero';
import { About } from '/src/components/about/About';
import { Skills } from './OriginalSkills';
import { Projects } from '/src/components/projects/Projects';
import { Journey } from '/src/components/journey/Journey';
import { Contact } from '/src/components/contact/Contact';
import { Footer } from '/src/components/footer/Footer';

export const App: React.FC = () => {
  return (
    <MotionConfig reducedMotion="user"><LenisScroll>
      <div className="relative min-h-screen bg-[#050505] text-[#F5F5F5] selection:bg-[#E50914] selection:text-white overflow-x-clip">
        {/* Ambient Subtle Cursor Spotlight & Floating Atmosphere */}
        <PremiumEffects />
        <BackgroundAtmosphere />

        {/* Fixed Navigation */}
        <Navbar />

        {/* Core Content Flow */}
        <main className="relative z-10 flex flex-col">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Journey />
          <Contact />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </LenisScroll></MotionConfig>
  );
};

export default App;
