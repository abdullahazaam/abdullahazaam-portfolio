import React from 'react';
import { Mail, ArrowUp } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/Icons';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -75;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-[#030303] border-t border-neutral-900 pt-16 pb-12 overflow-hidden">
      {/* Subtle top crimson glow line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#E50914]/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-neutral-900/80">
          {/* Left: AA & ABDULLAH AZAAM */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3">
              <div className="brand-mark w-9 h-9 rounded-lg bg-[#0C0C0C] border border-red-900/40 flex items-center justify-center shadow-[0_0_12px_rgba(229,9,20,0.25)]">
                <span className="font-display font-extrabold text-sm text-white">AA</span>
              </div>
              <span className="font-heading font-bold text-base uppercase tracking-wider text-white">
                Abdullah Azaam
              </span>
            </div>
            <p className="mt-2 font-sans text-xs text-neutral-400">
              Full-Stack Developer &amp; Creative Web Developer
            </p>
          </div>

          {/* Center: Quick Links */}
          <nav className="flex items-center gap-6 text-xs font-sans tracking-wide text-neutral-400">
            <a
              href="#hero"
              onClick={(e) => scrollTo(e, 'hero')}
              className="hover:text-white transition-colors"
            >
              Home
            </a>
            <a
              href="#about"
              onClick={(e) => scrollTo(e, 'about')}
              className="hover:text-white transition-colors"
            >
              About
            </a>
            <a
              href="#projects"
              onClick={(e) => scrollTo(e, 'projects')}
              className="hover:text-white transition-colors"
            >
              Projects
            </a>
            <a
              href="#contact"
              onClick={(e) => scrollTo(e, 'contact')}
              className="hover:text-white transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Right: Social & Email Icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/abdullahazaam"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-[#0C0C0C] border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-[#E50914] transition-colors"
              aria-label="GitHub Profile"
            >
              <GithubIcon size={16} />
            </a>

            <a
              href="https://linkedin.com/in/abdullah-azaam-76975440a"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-[#0C0C0C] border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-[#E50914] transition-colors"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon size={16} />
            </a>

            <a
              href="mailto:abdullahazaam.dev@gmail.com"
              className="w-9 h-9 rounded-xl bg-[#0C0C0C] border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-[#E50914] transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>

            <button
              onClick={scrollToTop}
              className="w-9 h-9 rounded-xl bg-[#141414] border border-red-950 flex items-center justify-center text-[#E50914] hover:bg-[#E50914] hover:text-white transition-all ml-1"
              aria-label="Scroll back to top"
              title="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-8 text-center text-xs font-sans text-neutral-500">
          <p>&copy; 2026 Abdullah Azaam. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
