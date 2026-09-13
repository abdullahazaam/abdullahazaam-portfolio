import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: 'Home', href: '#hero' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Journey', href: '#journey' },
  { name: 'Contact', href: '#contact' },
];

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 25) {
        setActiveSection('contact');
        return;
      }
      if (window.scrollY < 120) {
        setActiveSection('hero');
        return;
      }

      const sections = ['about', 'skills', 'projects', 'journey', 'contact'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom > 160) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard escape key listener for mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace('#', '');
    setActiveSection(id);
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setMobileMenuOpen(false);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -72;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };


  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'py-3.5 bg-[#050505]/85 backdrop-blur-lg border-b border-red-950/40 shadow-[0_10px_30px_rgba(0,0,0,0.85)]'
          : 'py-5 bg-transparent border-b border-white/[0.04]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 flex items-center justify-between">
        {/* Left: AA Logo & ABDULLAH AZAAM */}
        <a
          href="#hero"
          onClick={(e) => scrollToSection(e, '#hero')}
          className="group flex items-center gap-3.5 focus:outline-none"
          aria-label="Abdullah Azaam Portfolio Home"
        >
          <div className="brand-mark relative w-9 h-9 rounded-lg bg-[#0C0C0C] border border-red-900/40 flex items-center justify-center transition-all duration-300 group-hover:border-[#E50914] group-hover:shadow-[0_0_18px_rgba(229,9,20,0.4)]">
            <span className="font-syne font-extrabold text-sm tracking-widest text-[#F5F5F5] group-hover:text-white">
              AA
            </span>
            <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#E50914] to-transparent" />
          </div>

          <div className="flex flex-col">
            <span className="brand-name font-syne font-bold text-sm tracking-wider uppercase text-white group-hover:text-[#E50914] transition-colors">
              Abdullah Azaam
            </span>
            <span className="brand-subtitle font-space text-[10px] tracking-widest uppercase text-neutral-400">
              Full-Stack Developer
            </span>
          </div>
        </a>

        {/* Center/Right: Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 lg:gap-2 px-3 py-1.5 rounded-full bg-[#0A0A0A]/80 border border-white/[0.06] backdrop-blur-md">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.replace('#', '');
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={`relative px-4 py-1.5 text-xs font-space font-medium uppercase tracking-wider transition-all duration-200 rounded-full ${
                  isActive
                    ? 'text-white bg-[#141414] border border-red-600/40 shadow-[0_0_14px_rgba(229,9,20,0.25)]'
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {item.name}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#E50914]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Far Right: Let's Talk Button */}
        <div className="hidden sm:flex items-center">
          <a
            href="#contact"
            onClick={(e) => scrollToSection(e, '#contact')}
            className="header-cta group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0E0E0E] text-xs font-space font-semibold uppercase tracking-wider text-white border border-red-900/50 overflow-hidden transition-all duration-300 hover:border-[#E50914] hover:shadow-[0_0_20px_rgba(229,9,20,0.35)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E50914]/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-pulse" />
            <span>Let's Talk</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#0C0C0C] border border-red-950/60 text-neutral-300 hover:text-white hover:border-[#E50914] focus:outline-none transition-all"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        id="mobile-navigation-menu"
        aria-hidden={!mobileMenuOpen}
        className={`lg:hidden fixed inset-x-0 top-[62px] p-4 transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto visible'
            : 'opacity-0 -translate-y-4 pointer-events-none invisible'
        }`}
      >

        <div className="rounded-2xl bg-[#080808]/95 backdrop-blur-xl border border-red-900/30 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.95)] flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.replace('#', '');
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-space uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'bg-[#121212] text-white border border-red-600/30'
                    : 'text-neutral-400 hover:text-white hover:bg-[#121212]/50'
                }`}
              >
                <span>{item.name}</span>
                {isActive && <div className="w-2 h-2 rounded-full bg-[#E50914] shadow-[0_0_8px_#E50914]" />}
              </a>
            );
          })}

          <div className="pt-3 border-t border-neutral-800/80 mt-2">
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, '#contact')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#E50914] text-white text-xs font-space font-semibold uppercase tracking-wider shadow-[0_0_20px_rgba(229,9,20,0.5)] active:scale-[0.98] transition-transform"
            >
              <span>Let's Talk</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
