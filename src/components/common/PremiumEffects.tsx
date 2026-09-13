import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Global Micro-Animations: Section Reveals, Card Cursor Lighting & Magnetic Buttons */
export function PremiumEffects() {
  useEffect(() => {
    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      ['about', 'skills', 'projects', 'journey', 'contact'].forEach((id, index) => {
        const section = document.getElementById(id);
        if (!section) return;

        // Section Heading Reveals
        gsap.fromTo(
          section.querySelectorAll('h2'),
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 82%', once: true },
          }
        );

        // Section Labels Clean Slide-and-Fade Reveal
        const labels = section.querySelectorAll('.font-mono.uppercase, [class*="tracking-widest"]');
        if (labels.length > 0) {
          gsap.fromTo(
            labels,
            { x: -16, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.65,
              ease: 'power2.out',
              scrollTrigger: { trigger: section, start: 'top 86%', once: true },
            }
          );
        }

        // Contact Cards Stagger
        if (id === 'contact') {
          gsap.fromTo(
            section.querySelectorAll('.premium-card'),
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.09,
              scrollTrigger: { trigger: section, start: 'top 68%', once: true },
            }
          );
        }

        // Subtle Section Shift
        gsap.to(section, {
          '--section-shift': `${index % 2 ? -40 : 40}px`,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
      });
    });

    // Pointer Lighting for general premium cards (excluding project and skill cards which have custom 3D handlers)
    media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      let activeCard: HTMLElement | null = null;
      let frame = 0;
      let x = 0;
      let y = 0;

      const resetCard = () => {
        if (activeCard) {
          activeCard.style.setProperty('--tilt-angle', '0deg');
          activeCard.classList.remove('is-lit');
        }
        activeCard = null;
      };

      // Magnetic hover on primary action buttons
      const handleButtonMagnetic = (event: PointerEvent) => {
        const btn = (event.target as Element).closest<HTMLElement>('.hero-primary, .hero-secondary, .header-cta, a[href="#projects"], a[href="#skills"]');
        if (!btn) return;

        const rect = btn.getBoundingClientRect();
        const offsetX = (event.clientX - (rect.left + rect.width / 2)) * 0.22;
        const offsetY = (event.clientY - (rect.top + rect.height / 2)) * 0.22;

        btn.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
        btn.style.transition = 'transform 0.1s ease-out';
      };

      const handleButtonLeave = (event: PointerEvent) => {
        const btn = (event.target as Element).closest<HTMLElement>('.hero-primary, .hero-secondary, .header-cta, a[href="#projects"], a[href="#skills"]');
        if (!btn) return;
        btn.style.transform = 'translate3d(0, 0, 0)';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      };

      const move = (event: PointerEvent) => {
        handleButtonMagnetic(event);

        const card = (event.target as Element).closest<HTMLElement>('.premium-card:not(.project-card):not(.skill-card)');
        if (card !== activeCard) {
          resetCard();
          activeCard = card;
        }
        if (!activeCard) return;

        x = event.clientX;
        y = event.clientY;

        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          if (!activeCard) return;
          const rect = activeCard.getBoundingClientRect();
          const px = (x - rect.left) / rect.width - 0.5;
          const py = (y - rect.top) / rect.height - 0.5;
          activeCard.style.setProperty('--light-x', `${x - rect.left}px`);
          activeCard.style.setProperty('--light-y', `${y - rect.top}px`);
          activeCard.style.setProperty('--tilt-axis', `${-py || 0.001} ${px} 0`);
          activeCard.style.setProperty('--tilt-angle', `${Math.min(Math.hypot(px, py) * 6, 3.5)}deg`);
          activeCard.classList.add('is-lit');
        });
      };

      const handlePointerOut = (event: PointerEvent) => {
        handleButtonLeave(event);
      };

      document.addEventListener('pointermove', move, { passive: true });
      document.addEventListener('pointerout', handlePointerOut, { passive: true });
      document.addEventListener('pointerleave', resetCard);
      window.addEventListener('blur', resetCard);

      return () => {
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerout', handlePointerOut);
        document.removeEventListener('pointerleave', resetCard);
        window.removeEventListener('blur', resetCard);
        cancelAnimationFrame(frame);
        resetCard();
      };
    });

    return () => media.revert();
  }, []);

  return null;
}
