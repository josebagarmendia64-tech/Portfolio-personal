import { EDUCATION_ITEMS } from '../data/cvData';

export function EducationSection() {
  const universitaria = EDUCATION_ITEMS.filter(
    (item) => item.category === 'universitaria',
  );
  const reglada = EDUCATION_ITEMS.filter((item) => item.category === 'reglada');
  const complementaria = EDUCATION_ITEMS.filter(
    (item) => item.category === 'complementaria',
  );

  return (
    <section
      id="formacion"
      aria-labelledby="formacion-heading"
      className="bg-[#F8FAFC] py-16 sm:py-20 lg:py-24 border-b border-slate-200"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wide text-[#2B5B84] mb-2">
            Titulación y Estudios
          </p>
          <h2
            id="formacion-heading"
            className="gsap-reveal text-balance font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1F3A]"
          >
            Formación Académica y{' '}
            <span className="italic font-semibold text-[#2B5B84]">
              Complementaria
            </span>
          </h2>
          <p className="gsap-reveal mt-3 text-base text-slate-600 leading-relaxed">
            Estudios reglados, formación complementaria y estudios universitarios
            en la UNED.
          </p>
        </div>

        {/* Formación universitaria y actualización (2019–2026) */}
        <div className="mt-10">
          <h3 className="font-display text-base font-semibold text-[#0B1F3A] mb-4">
            01. Formación universitaria y actualización (2019–2026)
          </h3>
          {universitaria.map((item) => (
            <article
              key={item.id}
              className="gsap-reveal rounded-xl border border-[#0B1F3A]/15 bg-[#0B1F3A] p-6 sm:p-7 text-white"
            >
              <p className="text-xs font-medium text-slate-300 tabular-nums">
                {item.institution}
                {item.period ? ` · ${item.period}` : ''}
              </p>
              <h4 className="mt-2 font-display text-lg sm:text-xl font-bold text-white">
                {item.title}
              </h4>
            </article>
          ))}
        </div>

        {/* Two-Column Breakdown: Reglada vs Complementaria */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="font-display text-base font-semibold text-[#0B1F3A] mb-4">
              02. Estudios reglados
            </h3>
            <ul className="space-y-4">
              {reglada.map((item) => (
                <li
                  key={item.id}
                  className="gsap-reveal rounded-xl border border-slate-200 bg-white p-5"
                >
                  {item.period && (
                    <p className="text-xs font-medium text-[#2B5B84] tabular-nums mb-1">
                      {item.period}
                    </p>
                  )}
                  <h4 className="font-display text-base font-semibold text-[#0B1F3A]">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-sm text-slate-600">{item.institution}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base font-semibold text-[#0B1F3A] mb-4">
              03. Formación complementaria (1990–2014)
            </h3>
            <ul className="space-y-4">
              {complementaria.map((item) => (
                <li
                  key={item.id}
                  className="gsap-reveal rounded-xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h4 className="font-display text-base font-semibold text-[#0B1F3A]">
                      {item.title}
                    </h4>
                    {item.period && (
                      <span className="text-xs font-semibold text-[#2B5B84] tabular-nums shrink-0">
                        {item.period}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{item.institution}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
