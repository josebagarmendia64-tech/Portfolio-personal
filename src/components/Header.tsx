import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { BrandMark } from './BrandMark';

const NAV_LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#perfil', label: 'Perfil' },
  { href: '#experiencia', label: 'Experiencia' },
  { href: '#formacion', label: 'Formación' },
  { href: '#extension', label: 'Cursos UNED' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200'
          : 'bg-white border-b border-slate-200/80'
      }`}
    >
      {/* GSAP Scroll Progress Bar */}
      <div
        id="scroll-progress-bar"
        aria-hidden="true"
        className="h-[2px] w-full origin-left scale-x-0 bg-[#2B5B84]"
      />

      <div className="mx-auto flex h-14 md:h-16 max-w-6xl items-center justify-between gap-4 md:gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-line Brand Wordmark + Corporate JG Symbol */}
        <a
          href="#inicio"
          className="inline-flex items-center gap-2.5 font-display text-base sm:text-lg font-bold tracking-tight text-[#0B1F3A] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2B5B84]"
        >
          <BrandMark className="h-8 w-8 sm:h-9 sm:w-9" />
          <span>
            Joseba <span className="font-medium italic text-[#2B5B84]">Garmendia</span>
          </span>
        </a>

        {/* Zone 2: Clean single-line navigation links */}
        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 text-slate-600 hover:text-[#0B1F3A] transition-colors whitespace-nowrap shrink-0 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-[#2B5B84] after:transition-all after:duration-200 hover:after:w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2B5B84]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="#contacto"
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[#0B1F3A] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#13315C] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B5B84]"
          >
            Contactar
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            className="inline-flex md:hidden h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-[#0B1F3A] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B5B84]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <nav
          id="mobile-navigation-drawer"
          aria-label="Menú móvil"
          className="md:hidden border-t border-slate-200 bg-white px-4 py-4 shadow-sm"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={handleLinkClick}
                  className="flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#0B1F3A]"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="#contacto"
                onClick={handleLinkClick}
                className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[#0B1F3A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#13315C]"
              >
                Contactar directamente
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
