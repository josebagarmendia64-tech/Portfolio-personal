import { useState } from 'react';
import { ArrowRight, FileText, MapPin, User } from 'lucide-react';
import { CAREER_METRICS, PERSONAL_INFO } from '../data/cvData';

export function HeroSection() {
  const [portraitError, setPortraitError] = useState(false);
  const [officeError, setOfficeError] = useState(false);

  return (
    <section
      id="inicio"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-white pt-10 pb-14 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24 border-b border-slate-200"
    >
      {/* GSAP Floating Geometric Background Objects */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="gsap-float-slow absolute -top-12 right-[12%] h-56 w-56 rounded-full border border-slate-200/80" />
        <div className="gsap-float-reverse absolute top-28 right-[6%] h-24 w-24 rounded-2xl border border-[#2B5B84]/20 bg-slate-50/60" />
        <div className="gsap-float-slow absolute bottom-16 left-[4%] h-32 w-32 rounded-full border border-[#0B1F3A]/10" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Typographic Anchor */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="gsap-hero-stagger flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 mb-4">
              <span className="inline-flex items-center gap-1.5 text-[#0B1F3A] font-semibold">
                <MapPin className="h-3.5 w-3.5 text-[#2B5B84]" aria-hidden="true" />
                Ordizia (Gipuzkoa)
              </span>
              <span aria-hidden="true">·</span>
              <span className="italic">Currículum Vitae</span>
            </div>

            <h1
              id="hero-heading"
              className="gsap-hero-stagger text-balance font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0B1F3A] leading-[1.12]"
            >
              José María Garmendia Beguiristain{' '}
              <span className="block sm:inline font-semibold italic text-[#2B5B84]">
                (Joseba)
              </span>
            </h1>

            <p className="gsap-hero-stagger mt-4 text-lg sm:text-xl font-medium text-slate-700 leading-snug">
              {PERSONAL_INFO.headlineTitle}
            </p>

            <p className="gsap-hero-stagger mt-5 max-w-2xl text-base text-slate-600 leading-relaxed">
              Experiencia laboral como Contable en{' '}
              <em className="font-medium text-slate-800">
                Transportes Especiales Etxezarreta, S.L.
              </em>{' '}
              (1996–2018) y Oficial de 1.ª Administrativo en{' '}
              <em className="font-medium text-slate-800">LANDALAN, S.A.</em>{' '}
              (1991–1995), complementada con estudios de{' '}
              <em className="font-medium text-slate-800">
                Derecho Público en la UNED
              </em>{' '}
              (2019–2022), E.G.A., inglés y formación continua hasta 2026.
            </p>

            <div className="gsap-hero-stagger mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href="#contacto"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#0B1F3A] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#13315C] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B5B84]"
              >
                Enviar mensaje directo
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>

              <a
                href={PERSONAL_INFO.cvPdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-[#0B1F3A] hover:text-[#0B1F3A] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B5B84]"
              >
                <FileText className="h-4 w-4 text-[#2B5B84]" aria-hidden="true" />
                Ver CV original (PDF)
              </a>
            </div>
          </div>

          {/* Right Visual Composition: Full-Frame Bright Blue-Gray Office + Framed Portrait on Navy Wall */}
          <div className="lg:col-span-5 flex items-center">
            <div className="gsap-hero-visual relative w-full rounded-2xl border border-slate-200 bg-[#ECEFF2] p-3 flex flex-col justify-between">
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-[#CDD3D9]">
                {/* Wrapper carries parallax so the framed picture stays locked to the navy wall */}
                <div className="gsap-parallax-img relative h-full w-full">
                  {!officeError ? (
                    <img
                      src="/src/assets/images/hero_full_office_scene_1795632116006.jpg"
                      alt="Oficina moderna y luminosa en tonos azules y grises con un pequeño cuadro de retrato de Joseba centrado en la pared azul marino sobre el motivo floral"
                      referrerPolicy="no-referrer"
                      onError={() => setOfficeError(true)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#CDD3D9] to-[#E2E8F0]" />
                  )}

                  {/* Small framed portrait centered on the right navy blue wall above the floral vase */}
                  <div className="wall-framed-portrait absolute top-[32%] left-[84%] -translate-x-1/2 -translate-y-1/2 w-[11%] aspect-[4/5] rounded-[2px] bg-[#0F172A] p-[2px] sm:p-[2.5px] pointer-events-none">
                    <div className="h-full w-full bg-[#E8ECEF] p-[2.5px] sm:p-[3.5px] shadow-inner">
                      {!portraitError ? (
                        <img
                          src={PERSONAL_INFO.portraitPath}
                          alt="Retrato enmarcado de José María Garmendia Beguiristain (Joseba)"
                          referrerPolicy="no-referrer"
                          onError={() => setPortraitError(true)}
                          className="wall-framed-photo h-full w-full object-cover object-top"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#0B1F3A] text-white">
                          <User className="h-4 w-4" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Clean light-slate caption strip below image frame */}
              <div className="pt-3 px-2 pb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs">
                <span className="font-display font-semibold text-[#0B1F3A]">
                  José María Garmendia Beguiristain
                </span>
                <span className="italic text-[#2B5B84]">
                  Ordizia (Gipuzkoa)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Key Career Facts Strip */}
        <div className="mt-12 sm:mt-14 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {CAREER_METRICS.map((metric) => (
            <div key={metric.label} className="gsap-metric-item">
              <p className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1F3A] tabular-nums">
                {metric.value}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {metric.label}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">{metric.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
