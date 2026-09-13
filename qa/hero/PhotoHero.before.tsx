import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div id="hero" className="blueprint-hero">
      {/* Cinematic Studio Scene */}
      <div className="hero-scene-wrap">
        <img
          src="/seq-hero.png"
          alt="Abdullah Azaam - Full-Stack Developer at developer workstation"
          className="hero-scene-img"
          fetchPriority="high"
          decoding="async"
          width="2376"
          height="958"
        />

        {/* Interactive Clickable Overlays for Action Buttons */}
        <div className="hero-interactive-overlay">
          <a
            href="#projects"
            className="hero-btn-overlay hero-btn-projects"
            aria-label="View My Work"
            title="View My Work"
          />
          <a
            href="https://github.com/abdullahazaam"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-btn-overlay hero-btn-github"
            aria-label="GitHub Profile"
            title="GitHub Profile"
          />
        </div>

        {/* Accessible Semantic Content for SEO and Screen Readers */}
        <div className="sr-only">
          <p>FULL-STACK DEVELOPER</p>
          <h1>Abdullah Azaam</h1>
          <p>
            Building scalable web applications and immersive digital experiences.
          </p>
          <div>
            <span>5+ Major Projects</span>
            <span>15+ Technologies</span>
            <span>Always Learning</span>
          </div>
        </div>
      </div>
    </div>
  );
};
