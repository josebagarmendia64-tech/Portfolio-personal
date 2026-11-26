import { PERSONAL_INFO } from '../data/cvData';

export function Footer() {
  return (
    <footer className="bg-[#0B1F3A] text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="font-display text-base font-bold text-white">
              {PERSONAL_INFO.fullName}{' '}
              <span className="italic font-medium text-slate-300">(Joseba)</span>
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {PERSONAL_INFO.address} · {PERSONAL_INFO.postalCity}
            </p>
          </div>

          <nav
            aria-label="Navegación del pie de página"
            className="flex flex-wrap items-center gap-5 text-xs font-medium text-slate-300"
          >
            <a href="#inicio" className="hover:text-white transition-colors">
              Inicio
            </a>
            <a href="#perfil" className="hover:text-white transition-colors">
              Perfil
            </a>
            <a href="#experiencia" className="hover:text-white transition-colors">
              Experiencia
            </a>
            <a href="#formacion" className="hover:text-white transition-colors">
              Formación
            </a>
            <a href="#extension" className="hover:text-white transition-colors">
              Cursos UNED
            </a>
            <a href="#contacto" className="hover:text-white transition-colors">
              Contacto
            </a>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-400">
          <p className="tabular-nums">
            © {new Date().getFullYear()} {PERSONAL_INFO.fullName}. Todos los
            derechos reservados.
          </p>
          <p className="italic">
            Currículum vitae profesional · Ordizia, Gipuzkoa
          </p>
        </div>
      </div>
    </footer>
  );
}
