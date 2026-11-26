import { useState } from 'react';
import { Briefcase } from 'lucide-react';
import {
  ASSOCIATIONS,
  ASSOCIATIONS_NOTE,
  PROFILE_NARRATIVE,
} from '../data/cvData';

export function ProfileSection() {
  const [deskError, setDeskError] = useState(false);

  return (
    <section
      id="perfil"
      aria-labelledby="perfil-heading"
      className="bg-[#F8FAFC] py-16 sm:py-20 lg:py-24 border-b border-slate-200"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          {/* Narrative & Associations */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <p className="text-xs font-semibold tracking-wide text-[#2B5B84] mb-2">
              Presentación Personal
            </p>
            <h2
              id="perfil-heading"
              className="gsap-reveal text-balance font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1F3A]"
            >
              Perfil Personal y{' '}
              <span className="italic font-semibold text-[#2B5B84]">
                Participación Asociativa
              </span>
            </h2>

            <div className="gsap-reveal mt-6 space-y-4 text-base text-slate-700 leading-relaxed">
              <p>{PROFILE_NARRATIVE.intro}</p>
              <p>{PROFILE_NARRATIVE.resilience}</p>
            </div>

            {/* Active Non-Profit Association */}
            <div className="mt-10 pt-8 border-t border-slate-200">
              <h3 className="font-display text-lg font-semibold text-[#0B1F3A]">
                Colaboración con asociación sin ánimo de lucro
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed mb-5">
                {ASSOCIATIONS_NOTE}
              </p>
              <div className="grid grid-cols-1 max-w-md gap-5">
                {ASSOCIATIONS.map((assoc) => (
                  <article
                    key={assoc.acronym}
                    className="gsap-reveal rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300"
                  >
                    <p className="text-xs font-semibold text-[#0B1F3A]">
                      {assoc.acronym}
                    </p>
                    <h4 className="mt-1.5 font-display text-sm font-semibold text-slate-900">
                      {assoc.fullName}
                    </h4>
                    <p className="mt-2 text-xs text-[#2B5B84] italic">
                      {assoc.roleNote}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          {/* Right Editorial Corporate Photo */}
          <div className="lg:col-span-5 flex items-stretch">
            <div className="gsap-reveal w-full rounded-2xl border border-slate-200 bg-white p-3 flex flex-col justify-between">
              <div className="relative flex-1 overflow-hidden rounded-xl bg-slate-200 min-h-[280px]">
                {!deskError ? (
                  <img
                    src="/src/assets/images/experience_accounting_desk_1795521586541.jpg"
                    alt="Mesa de trabajo contable y administrativa"
                    referrerPolicy="no-referrer"
                    onError={() => setDeskError(true)}
                    className="gsap-parallax-img h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[280px] w-full flex-col items-center justify-center bg-[#0B1F3A] p-6 text-white">
                    <Briefcase className="h-10 w-10 mb-3 text-slate-300" aria-hidden="true" />
                    <p className="font-display text-sm font-medium">
                      Administración y Contabilidad
                    </p>
                  </div>
                )}
              </div>
              <div className="pt-3 px-2 pb-1 flex items-center justify-between text-xs text-slate-500">
                <span>Contabilidad y administración</span>
                <span className="italic text-[#2B5B84]">Ordizia · Gipuzkoa</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
