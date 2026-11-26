import { useState, useMemo } from 'react';
import { BookOpen } from 'lucide-react';
import {
  DIGITAL_LEARNING_GOALS,
  EXTENSION_COURSES,
  OTHER_COURSES,
  type CourseCategory,
  type ExtensionCourse,
} from '../data/cvData';

const CATEGORIES: CourseCategory[] = [
  'Todos',
  'Tecnología e IA',
  'Protocolo y Comunicación',
  'Gestión y Finanzas',
  'Fotografía',
];

const YEARS: Array<'Todos' | ExtensionCourse['academicYear']> = [
  'Todos',
  '2025–2026',
  '2024–2025',
  '2023–2024',
  '2022–2023',
  '2021–2022',
];

export function ExtensionCoursesSection() {
  const [selectedCategory, setSelectedCategory] =
    useState<CourseCategory>('Todos');
  const [selectedYear, setSelectedYear] = useState<
    'Todos' | ExtensionCourse['academicYear']
  >('Todos');
  const [campusError, setCampusError] = useState(false);

  const filteredCourses = useMemo(() => {
    return EXTENSION_COURSES.filter((course) => {
      const catMatch =
        selectedCategory === 'Todos' || course.category === selectedCategory;
      const yearMatch =
        selectedYear === 'Todos' || course.academicYear === selectedYear;
      return catMatch && yearMatch;
    });
  }, [selectedCategory, selectedYear]);

  return (
    <section
      id="extension"
      aria-labelledby="extension-heading"
      className="bg-white py-16 sm:py-20 lg:py-24 border-b border-slate-200"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Top Row: Heading + Study/Tech Editorial Image & Digital Learning Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <p className="text-xs font-semibold tracking-wide text-[#2B5B84] mb-2">
              Formación Continua
            </p>
            <h2
              id="extension-heading"
              className="gsap-reveal text-balance font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1F3A]"
            >
              Cursos de Extensión Universitaria —{' '}
              <span className="italic font-semibold text-[#2B5B84]">
                UNED (2021–2026)
              </span>
            </h2>
            <p className="gsap-reveal mt-3 text-base text-slate-600 leading-relaxed">
              Relación completa de los {EXTENSION_COURSES.length} cursos y
              conferencias realizados en el periodo 2021-2026.
            </p>

            {/* Digital Learning Goals from Presentation Document */}
            <div className="gsap-reveal mt-6 rounded-xl border border-slate-200 bg-[#F8FAFC] p-5 sm:p-6">
              <h3 className="font-display text-base font-semibold text-[#0B1F3A]">
                Áreas digitales en profundización
              </h3>
              <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-slate-700">
                {DIGITAL_LEARNING_GOALS.map((goal) => (
                  <li key={goal} className="flex items-start gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2B5B84]"
                    />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5 flex items-stretch">
            <div className="gsap-reveal w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] p-3 flex flex-col justify-between">
              <div className="relative flex-1 overflow-hidden rounded-xl bg-slate-200 min-h-[260px]">
                {!campusError ? (
                  <img
                    src="/src/assets/images/digital_formation_campus_1795521587573.jpg"
                    alt="Mesa de estudio con libros jurídicos, ordenador portátil y cámara fotográfica"
                    referrerPolicy="no-referrer"
                    onError={() => setCampusError(true)}
                    className="gsap-parallax-img h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[260px] w-full flex-col items-center justify-center bg-[#0B1F3A] p-6 text-white">
                    <BookOpen className="h-10 w-10 mb-3 text-slate-300" aria-hidden="true" />
                    <p className="font-display text-sm font-medium">
                      UNED · Extensión Universitaria
                    </p>
                  </div>
                )}
              </div>
              <div className="pt-3 px-2 pb-1 flex items-center justify-between text-xs text-slate-500">
                <span>Lectura, tecnología y fotografía</span>
                <span className="italic text-[#2B5B84] tabular-nums">
                  {EXTENSION_COURSES.length} cursos (2021–2026)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Filter Controls */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div
              role="group"
              aria-label="Filtrar cursos por temática"
              className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg"
            >
              {CATEGORIES.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`min-h-[36px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B5B84] ${
                      active
                        ? 'bg-[#0B1F3A] text-white shadow-sm'
                        : 'text-slate-700 hover:text-[#0B1F3A] hover:bg-white/70'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label
                htmlFor="course-year-filter"
                className="text-xs font-semibold text-slate-600 whitespace-nowrap"
              >
                Curso académico:
              </label>
              <select
                id="course-year-filter"
                value={selectedYear}
                onChange={(e) =>
                  setSelectedYear(
                    e.target.value as 'Todos' | ExtensionCourse['academicYear'],
                  )
                }
                className="min-h-[40px] rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 tabular-nums focus:border-[#2B5B84] focus:outline-none focus:ring-2 focus:ring-[#2B5B84]/20"
              >
                {YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year === 'Todos' ? 'Todos los cursos (2021–2026)' : year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500 tabular-nums">
            Mostrando {filteredCourses.length} de {EXTENSION_COURSES.length} cursos
            de extensión universitaria.
          </p>

          {filteredCourses.length === 0 ? (
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-sm font-medium text-slate-700">
                No hay cursos que coincidan con esa combinación de temática y año
                académico.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('Todos');
                  setSelectedYear('Todos');
                }}
                className="mt-3 inline-flex min-h-[40px] items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-[#0B1F3A] hover:border-[#0B1F3A]"
              >
                Restablecer filtros
              </button>
            </div>
          ) : (
            <ul className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map((course) => (
                <li
                  key={course.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 flex flex-col justify-between transition-colors hover:border-slate-300"
                >
                  <div>
                    <p className="text-xs text-slate-500 tabular-nums">
                      <span className="font-semibold text-[#2B5B84]">
                        {course.academicYear}
                      </span>{' '}
                      <span aria-hidden="true">·</span>{' '}
                      <span>{course.category}</span>
                    </p>
                    <h3 className="mt-2 font-display text-sm font-semibold text-[#0B1F3A] leading-snug">
                      {course.title}
                    </h3>
                  </div>
                  <p className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 tabular-nums italic">
                    {course.dates}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Otros cursos */}
        <div className="mt-14 pt-10 border-t border-slate-200">
          <div className="max-w-2xl">
            <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#0B1F3A]">
              Otros{' '}
              <span className="italic font-semibold text-[#2B5B84]">
                cursos
              </span>
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Formación complementaria adicional fuera del programa de Extensión
              Universitaria de la UNED.
            </p>
          </div>

          <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {OTHER_COURSES.map((course) => (
              <li
                key={course.id}
                className="gsap-reveal rounded-xl border border-slate-200 bg-[#F8FAFC] p-5 sm:p-6 flex flex-col justify-between transition-colors hover:border-slate-300"
              >
                <div>
                  <p className="text-xs text-slate-500 tabular-nums">
                    <span className="font-semibold text-[#2B5B84]">
                      {course.year}
                    </span>{' '}
                    <span aria-hidden="true">·</span>{' '}
                    <span className="font-medium text-slate-700">
                      {course.provider}
                    </span>
                  </p>
                  <h4 className="mt-2 font-display text-sm sm:text-base font-bold text-[#0B1F3A] leading-snug">
                    {course.title}
                  </h4>
                </div>
                <p className="mt-4 pt-3 border-t border-slate-200/80 text-xs text-slate-600 tabular-nums italic">
                  {course.dates}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
