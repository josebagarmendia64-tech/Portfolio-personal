import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, ChevronLeft, ChevronRight, GripHorizontal } from 'lucide-react';
import {
  DIGITAL_LEARNING_GOALS,
  EXTENSION_COURSES,
  OTHER_COURSES,
  type CourseCategory,
  type ExtensionCourse,
} from '../data/cvData';

gsap.registerPlugin(Draggable, InertiaPlugin, ScrollTrigger);

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

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const draggableRef = useRef<Draggable | null>(null);
  const maxDragRef = useRef(0);
  const stepRef = useRef(340);

  const [sliderProgress, setSliderProgress] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);

  const filteredCourses = useMemo(() => {
    return EXTENSION_COURSES.filter((course) => {
      const catMatch =
        selectedCategory === 'Todos' || course.category === selectedCategory;
      const yearMatch =
        selectedYear === 'Todos' || course.academicYear === selectedYear;
      return catMatch && yearMatch;
    });
  }, [selectedCategory, selectedYear]);

  const syncSliderUI = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const currentX = Number(gsap.getProperty(track, 'x')) || 0;
    const minX = maxDragRef.current;

    setIsScrollable(minX < -4);
    setCanScrollPrev(currentX < -4);
    setCanScrollNext(currentX > minX + 4);
    setSliderProgress(
      minX < 0 ? Math.min(1, Math.max(0, Math.abs(currentX) / Math.abs(minX))) : 0,
    );
  }, []);

  const updateBounds = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const maxDrag = Math.min(0, viewport.clientWidth - track.scrollWidth);
    maxDragRef.current = maxDrag;

    const firstCard = track.firstElementChild as HTMLElement | null;
    stepRef.current = firstCard ? firstCard.offsetWidth + 16 : 340;

    const currentX = Number(gsap.getProperty(track, 'x')) || 0;
    if (currentX < maxDrag) {
      gsap.set(track, { x: maxDrag });
    } else if (currentX > 0) {
      gsap.set(track, { x: 0 });
    }

    if (draggableRef.current) {
      draggableRef.current.applyBounds({ minX: maxDrag, maxX: 0 });
      draggableRef.current.update(true);
    }

    syncSliderUI();
  }, [syncSliderUI]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;

    if (!viewport || !track || filteredCourses.length === 0) {
      draggableRef.current?.kill();
      draggableRef.current = null;
      setIsScrollable(false);
      setCanScrollPrev(false);
      setCanScrollNext(false);
      setSliderProgress(0);
      ScrollTrigger.refresh();
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    gsap.killTweensOf(track);
    gsap.set(track, { x: 0 });

    const maxDrag = Math.min(0, viewport.clientWidth - track.scrollWidth);
    maxDragRef.current = maxDrag;
    const firstCard = track.firstElementChild as HTMLElement | null;
    stepRef.current = firstCard ? firstCard.offsetWidth + 16 : 340;

    const [instance] = Draggable.create(track, {
      type: 'x',
      bounds: { minX: maxDrag, maxX: 0 },
      inertia: !prefersReducedMotion,
      edgeResistance: 0.72,
      dragResistance: 0.04,
      throwResistance: 1600,
      overshootTolerance: 0.35,
      maxDuration: 1.2,
      minDuration: 0.3,
      cursor: maxDrag < -4 ? 'grab' : 'default',
      activeCursor: maxDrag < -4 ? 'grabbing' : 'default',
      allowNativeTouchScrolling: true,
      lockAxis: true,
      snap: (endValue) => {
        const min = maxDragRef.current;
        const step = stepRef.current;
        if (min >= 0) return 0;
        if (endValue <= min + step * 0.35) return min;
        const snapped = Math.round(endValue / step) * step;
        return Math.max(min, Math.min(0, snapped));
      },
      onDrag: syncSliderUI,
      onThrowUpdate: syncSliderUI,
      onThrowComplete: syncSliderUI,
    });

    draggableRef.current = instance;
    syncSliderUI();
    ScrollTrigger.refresh();

    const resizeObserver = new ResizeObserver(() => {
      updateBounds();
    });
    resizeObserver.observe(viewport);

    return () => {
      resizeObserver.disconnect();
      gsap.killTweensOf(track);
      instance.kill();
      if (draggableRef.current === instance) {
        draggableRef.current = null;
      }
    };
  }, [filteredCourses, syncSliderUI, updateBounds]);

  const slideBy = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const currentX = Number(gsap.getProperty(track, 'x')) || 0;
    const minX = maxDragRef.current;
    const rawTarget = currentX - direction * stepRef.current;
    const snappedTarget =
      rawTarget <= minX + stepRef.current * 0.35
        ? minX
        : Math.max(minX, Math.min(0, Math.round(rawTarget / stepRef.current) * stepRef.current));

    gsap.killTweensOf(track);
    gsap.to(track, {
      x: snappedTarget,
      duration: prefersReducedMotion ? 0 : 0.65,
      ease: 'power3.out',
      onUpdate: () => {
        draggableRef.current?.update();
        syncSliderUI();
      },
      onComplete: () => {
        draggableRef.current?.update();
        syncSliderUI();
      },
    });
  };

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

        {/* Interactive Filter Controls + GSAP Draggable & Inertia Slider */}
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

          {/* Slider Header: Count + Drag Hint + Prev/Next Controls */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
              <p className="tabular-nums">
                Mostrando {filteredCourses.length} de {EXTENSION_COURSES.length} cursos
                de extensión universitaria.
              </p>
              {isScrollable && (
                <span className="inline-flex items-center gap-1.5 text-[#2B5B84] font-medium">
                  <GripHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                  Arrastra con inercia o usa las flechas
                </span>
              )}
            </div>

            {isScrollable && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => slideBy(-1)}
                  disabled={!canScrollPrev}
                  aria-label="Deslizar cursos anteriores"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-[#0B1F3A] transition-colors hover:border-[#0B1F3A] hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B5B84]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => slideBy(1)}
                  disabled={!canScrollNext}
                  aria-label="Deslizar cursos siguientes"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-[#0B1F3A] transition-colors hover:border-[#0B1F3A] hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B5B84]"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

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
            <div className="mt-4">
              <div
                ref={viewportRef}
                role="region"
                aria-label="Carrusel interactivo de cursos de extensión universitaria UNED"
                className="relative overflow-hidden py-1 select-none"
              >
                <ul
                  ref={trackRef}
                  className="flex items-stretch gap-4 w-max will-change-transform"
                >
                  {filteredCourses.map((course) => (
                    <li
                      key={course.id}
                      className="w-[280px] sm:w-[320px] lg:w-[352px] shrink-0 rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors hover:border-[#2B5B84]/50"
                    >
                      <div>
                        <p className="text-xs text-slate-500 tabular-nums">
                          <span className="font-semibold text-[#2B5B84]">
                            {course.academicYear}
                          </span>{' '}
                          <span aria-hidden="true">·</span>{' '}
                          <span>{course.category}</span>
                        </p>
                        <h3 className="mt-2 font-display text-sm sm:text-base font-semibold text-[#0B1F3A] leading-snug">
                          {course.title}
                        </h3>
                      </div>
                      <p className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 tabular-nums italic">
                        {course.dates}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {isScrollable && (
                <div
                  aria-hidden="true"
                  className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
                >
                  <div
                    className="h-full rounded-full bg-[#2B5B84] transition-[width] duration-150 ease-out"
                    style={{ width: `${Math.max(12, Math.round(sliderProgress * 100))}%` }}
                  />
                </div>
              )}
            </div>
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
                    </span>
                    {course.provider ? (
                      <>
                        {' '}
                        <span aria-hidden="true">·</span>{' '}
                        <span className="font-medium text-slate-700">
                          {course.provider}
                        </span>
                      </>
                    ) : null}
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
