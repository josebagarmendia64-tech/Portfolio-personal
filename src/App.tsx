import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProfileSection } from './components/ProfileSection';
import { ExperienceSection } from './components/ExperienceSection';
import { EducationSection } from './components/EducationSection';
import { ExtensionCoursesSection } from './components/ExtensionCoursesSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, InertiaPlugin);

export default function App() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const hash = anchor.getAttribute('href');
      if (!hash || hash === '#') return;

      const destination = document.querySelector(hash);
      if (!destination) return;

      event.preventDefault();
      const smoother = ScrollSmoother.get();
      if (smoother && !prefersReducedMotion) {
        smoother.scrollTo(destination, true, 'top 64px');
      } else {
        destination.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      }
    };

    document.addEventListener('click', handleAnchorClick);

    if (prefersReducedMotion) {
      return () => {
        document.removeEventListener('click', handleAnchorClick);
      };
    }

    const ctx = gsap.context(() => {
      // 0. GSAP ScrollSmoother with inertia
      ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.4,
        smoothTouch: 0.25,
        effects: true,
      });

      // 1. Scroll progress bar synced to smooth content scroll
      gsap.to('#scroll-progress-bar', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '#smooth-content',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.25,
        },
      });

      // 2. Hero staggered entrance (compositor properties only)
      gsap.from('.gsap-hero-stagger', {
        y: 20,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });

      gsap.from('.gsap-hero-visual', {
        y: 24,
        opacity: 0,
        duration: 0.8,
        delay: 0.15,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });

      // 3. Continuous subtle floating motion on geometric decorative objects
      gsap.to('.gsap-float-slow', {
        y: -14,
        rotation: 4,
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to('.gsap-float-reverse', {
        y: 12,
        x: -8,
        rotation: -6,
        duration: 5.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to('.gsap-float-portrait', {
        y: -4,
        duration: 3.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // 4. Scroll-triggered section reveals
      gsap.utils.toArray<HTMLElement>('.gsap-reveal').forEach((el) => {
        gsap.from(el, {
          y: 24,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        });
      });

      // 5. Experience timeline cards scroll entrance
      gsap.utils.toArray<HTMLElement>('.gsap-timeline-card').forEach((card, i) => {
        gsap.from(card, {
          y: 28,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.06,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            once: true,
          },
        });
      });

      // 6. Subtle scroll parallax on corporate photography frames
      gsap.utils.toArray<HTMLElement>('.gsap-parallax-img').forEach((img) => {
        gsap.fromTo(
          img,
          { scale: 1.08, yPercent: -4 },
          {
            scale: 1.08,
            yPercent: 4,
            ease: 'none',
            scrollTrigger: {
              trigger: img,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      });
    }, mainRef);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen flex flex-col bg-white text-slate-800">
      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-[#0B1F3A] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Saltar al contenido principal
      </a>

      <Header />

      <div id="smooth-wrapper" className="flex-1">
        <div id="smooth-content" className="pt-14 md:pt-16">
          <main id="contenido-principal">
            <HeroSection />
            <ProfileSection />
            <ExperienceSection />
            <EducationSection />
            <ExtensionCoursesSection />
            <ContactSection />
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}
