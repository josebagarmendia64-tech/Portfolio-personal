import { EXPERIENCES } from '../data/cvData';

export function ExperienceSection() {
  return (
    <section
      id="experiencia"
      aria-labelledby="experiencia-heading"
      className="bg-white py-16 sm:py-20 lg:py-24 border-b border-slate-200"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wide text-[#2B5B84] mb-2">
            Trayectoria Acreditada
          </p>
          <h2
            id="experiencia-heading"
            className="gsap-reveal text-balance font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1F3A]"
          >
            Experiencia{' '}
            <span className="italic font-semibold text-[#2B5B84]">Laboral</span>
          </h2>
          <p className="gsap-reveal mt-3 text-base text-slate-600 leading-relaxed">
            Puestos desempeñados según relación cronológica del currículum vitae.
          </p>
        </div>

        <ol className="mt-10 space-y-5">
          {EXPERIENCES.map((exp, index) => (
            <li key={exp.id} className="gsap-timeline-card">
              <article className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 transition-colors hover:border-slate-300">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 items-baseline">
                  <div className="md:col-span-4">
                    <p className="text-xs font-semibold text-[#2B5B84] tabular-nums">
                      0{index + 1}. {exp.period}
                    </p>
                    <p className="mt-1 text-sm text-slate-500 italic">
                      {exp.location}
                    </p>
                  </div>

                  <div className="md:col-span-8">
                    <h3 className="font-display text-lg sm:text-xl font-bold text-[#0B1F3A]">
                      {exp.role}{' '}
                      <span className="font-medium text-slate-600">
                        — {exp.company}
                      </span>
                    </h3>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
