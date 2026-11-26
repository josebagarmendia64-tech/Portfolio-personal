export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
}

export interface EducationItem {
  id: string;
  title: string;
  institution: string;
  period?: string;
  category: 'universitaria' | 'reglada' | 'complementaria';
}

export type CourseCategory =
  | 'Todos'
  | 'Tecnología e IA'
  | 'Protocolo y Comunicación'
  | 'Gestión y Finanzas'
  | 'Fotografía';

export interface ExtensionCourse {
  id: string;
  title: string;
  dates: string;
  academicYear: '2021–2022' | '2022–2023' | '2023–2024' | '2024–2025' | '2025–2026';
  category: Exclude<CourseCategory, 'Todos'>;
}

export interface AssociationRole {
  acronym: string;
  fullName: string;
  roleNote: string;
}

export const PERSONAL_INFO = {
  fullName: 'José María Garmendia Beguiristain',
  shortName: 'Joseba',
  headlineTitle: 'Contable · Oficial de 1.ª Administrativo · Estudiante UNED',
  address: 'Samperio Kalea, 1 – 2.º A',
  postalCity: '20240 Ordizia (Gipuzkoa)',
  phoneDisplay: '677 017 647',
  phoneHref: 'tel:+34677017647',
  email: 'joseba.garmendia64@gmail.com',
  emailHref: 'mailto:joseba.garmendia64@gmail.com',
  portraitPath: '/assets/joseba-portrait.jpg',
  cvPdfPath: '/assets/aistudio/Curriculum_Jose_Maria_Garmendia_A4_completo_f2f35fda.pdf',
};

export const CAREER_METRICS = [
  {
    value: '1991–2018',
    label: 'Experiencia administrativa y contable',
    detail: 'LANDALAN, S.A. y Transportes Especiales Etxezarreta, S.L.',
  },
  {
    value: '2019–2022',
    label: 'UNED · Derecho Público',
    detail: 'Grado en Ciencias Jurídicas de las AA. PP. (1.º–2.º)',
  },
  {
    value: '30',
    label: 'Cursos de Extensión UNED',
    detail: 'Realizados entre 2021 y 2026',
  },
  {
    value: 'E.G.A. · B7-8',
    label: 'Idiomas acreditados',
    detail: 'Euskera (1987) e Inglés en ELDUAIEN (2008–2009)',
  },
];

export const PROFILE_NARRATIVE = {
  intro:
    'Soy Joseba, de Ordizia (Gipuzkoa). Mi situación actual es la de pensionista por incapacidad permanente total para la profesión de contable, con posibilidad de acceder al mercado laboral para desempeñar funciones de menor responsabilidad: administrativo, auxiliar administrativo y similares.',
  resilience:
    'Gusto de cultivar aficiones como la lectura y la fotografía, manteniendo viva la curiosidad y el empeño por ampliar y actualizar mis conocimientos informáticos.',
};

export const ASSOCIATIONS: AssociationRole[] = [
  {
    acronym: 'AGIAC',
    fullName: 'Asociación de pacientes anticoagulados de Euskadi',
    roleNote: 'Asociación sin ánimo de lucro',
  },
];

export const ASSOCIATIONS_NOTE =
  'Colaboro con la asociación sin ánimo de lucro AGIAC, vinculada con mis patologías.';

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'etxezarreta',
    role: 'Contable',
    company: 'Transportes Especiales Etxezarreta, S.L.',
    location: 'Hernani',
    period: '14/11/1996 – 21/06/2018',
  },
  {
    id: 'landalan',
    role: 'Oficial de 1.ª Administrativo',
    company: 'LANDALAN, S.A.',
    location: 'Andoain',
    period: '19/08/1991 – 18/02/1995',
  },
  {
    id: 'natacion',
    role: 'Profesor de natación y socorrista',
    company: 'Trabajos de temporada',
    location: 'Durante la etapa de estudiante',
    period: 'Veranos',
  },
];

export const EDUCATION_ITEMS: EducationItem[] = [
  // Formación universitaria y actualización (2019–2026)
  {
    id: 'uned-derecho',
    title:
      'UNED: Grado en Ciencias Jurídicas de las Administraciones Públicas (Derecho Público), 1.º–2.º',
    institution: 'UNED',
    period: '2019–2022',
    category: 'universitaria',
  },
  // Estudios reglados
  {
    id: 'ega',
    title: 'E.G.A. (Euskararen Gaitasun Agiria)',
    institution: 'Acreditación de Euskera',
    period: '1987',
    category: 'reglada',
  },
  {
    id: 'medicina-teologia',
    title: 'Estudios de Medicina (1.º–3.º) y Teología y Pastoral',
    institution:
      'UPV-CUA (Vitoria-Gasteiz) · Seminario (Donostia–San Sebastián)',
    category: 'reglada',
  },
  {
    id: 'bup-cou-egb',
    title: 'E.G.B.; BUP y COU; Selectividad',
    institution:
      'La Salle (Beasain) · Escolapios (Tolosa) · Gipuzkoa',
    category: 'reglada',
  },
  // Formación complementaria (1990–2014)
  {
    id: 'itc-2014',
    title: 'Contabilidad y Fiscalidad para Sociedades',
    institution: 'ITC',
    period: '2014',
    category: 'complementaria',
  },
  {
    id: 'elduaien-2008',
    title: 'Inglés (B7-8)',
    institution: 'ELDUAIEN',
    period: '2008–2009',
    category: 'complementaria',
  },
  {
    id: 'windows-1996',
    title: 'Windows 3.1',
    institution: 'GU-VI',
    period: '1996',
    category: 'complementaria',
  },
  {
    id: 'cei-1995',
    title: 'Curso Administrativo-Contable Informático',
    institution: 'CEI',
    period: '1995',
    category: 'complementaria',
  },
  {
    id: 'ceac-1990',
    title: 'Jefe de Ventas',
    institution: 'CEAC',
    period: '1990',
    category: 'complementaria',
  },
];

export const EXTENSION_COURSES: ExtensionCourse[] = [
  // 2025–2026
  {
    id: 'c-25-4',
    title:
      '(Des)Cortesía Verbal y Retórica de la Argumentación: estrategias lingüísticas y persuasivas en el discurso',
    dates: '10/12/2025–12/12/2025',
    academicYear: '2025–2026',
    category: 'Protocolo y Comunicación',
  },
  {
    id: 'c-25-3',
    title: 'Fotografía: El Ojo y la Cámara: cómo mirar',
    dates: '03/11/2025–24/11/2025',
    academicYear: '2025–2026',
    category: 'Fotografía',
  },
  {
    id: 'c-25-2',
    title: 'Educación Financiera para la Vida Cotidiana',
    dates: '10/10/2025–28/11/2025',
    academicYear: '2025–2026',
    category: 'Gestión y Finanzas',
  },
  {
    id: 'c-25-1',
    title: 'Técnicas de Imagen y Estilismo Personal',
    dates: '22/09/2025–01/10/2025',
    academicYear: '2025–2026',
    category: 'Protocolo y Comunicación',
  },
  // 2024–2025
  {
    id: 'c-24-13',
    title: 'Curso práctico en Administrador de Fincas',
    dates: '07/04/2025–28/05/2025',
    academicYear: '2024–2025',
    category: 'Gestión y Finanzas',
  },
  {
    id: 'c-24-12',
    title: 'Gobernanza de Innovación Democrática y Cambios Transformadores',
    dates: '12/03/2025–11/06/2025',
    academicYear: '2024–2025',
    category: 'Gestión y Finanzas',
  },
  {
    id: 'c-24-11',
    title: 'Excel Intermedio',
    dates: '11/03/2025–20/03/2025',
    academicYear: '2024–2025',
    category: 'Tecnología e IA',
  },
  {
    id: 'c-24-10',
    title: 'Seminario de Economía Social',
    dates: '28/02/2025',
    academicYear: '2024–2025',
    category: 'Gestión y Finanzas',
  },
  {
    id: 'c-24-9',
    title: 'Contabilidad 2025 2CT',
    dates: '20/02/2025–15/05/2025',
    academicYear: '2024–2025',
    category: 'Gestión y Finanzas',
  },
  {
    id: 'c-24-8',
    title: 'Introducción al Protocolo Social',
    dates: '13/02/2025–06/03/2025',
    academicYear: '2024–2025',
    category: 'Protocolo y Comunicación',
  },
  {
    id: 'c-24-7',
    title: 'Introducción a Excel',
    dates: '11/02/2025–20/02/2025',
    academicYear: '2024–2025',
    category: 'Tecnología e IA',
  },
  {
    id: 'c-24-6',
    title: 'Protocolo para tu día a día',
    dates: '13/01/2025–28/04/2025',
    academicYear: '2024–2025',
    category: 'Protocolo y Comunicación',
  },
  {
    id: 'c-24-5',
    title: 'Fotografía: Composición Fotográfica',
    dates: '28/11/2024–27/03/2025',
    academicYear: '2024–2025',
    category: 'Fotografía',
  },
  {
    id: 'c-24-4',
    title: 'Protocolo Oficial',
    dates: '05/11/2024–28/01/2025',
    academicYear: '2024–2025',
    category: 'Protocolo y Comunicación',
  },
  {
    id: 'c-24-3',
    title: 'Introducción a Word',
    dates: '05/11/2024–07/11/2024',
    academicYear: '2024–2025',
    category: 'Tecnología e IA',
  },
  {
    id: 'c-24-2',
    title: 'Introducción a la IA Generativa',
    dates: '07/10/2024–25/11/2024',
    academicYear: '2024–2025',
    category: 'Tecnología e IA',
  },
  {
    id: 'c-24-1',
    title:
      'Democracia en la Era de la IA: examen acerca de la política tecnológica',
    dates: '12/09/2024–13/09/2024',
    academicYear: '2024–2025',
    category: 'Tecnología e IA',
  },
  // 2023–2024
  {
    id: 'c-23-11',
    title: 'Windows 11',
    dates: '19/04/2024–31/05/2024',
    academicYear: '2023–2024',
    category: 'Tecnología e IA',
  },
  {
    id: 'c-23-10',
    title: 'Análisis lingüísticos de la Comunicación en las Redes Sociales',
    dates: '12/03/2024–30/04/2024',
    academicYear: '2023–2024',
    category: 'Protocolo y Comunicación',
  },
  {
    id: 'c-23-9',
    title: 'Estatuto de la persona en la Era Digital: Derechos y Garantías',
    dates: '04/03/2024–15/04/2024',
    academicYear: '2023–2024',
    category: 'Tecnología e IA',
  },
  {
    id: 'c-23-8',
    title: 'Sácale más partido a tu smartphone Android',
    dates: '01/03/2024–12/04/2024',
    academicYear: '2023–2024',
    category: 'Tecnología e IA',
  },
  {
    id: 'c-23-7',
    title: 'Conferencia: Adicciones y riesgos en Internet',
    dates: '28/02/2024',
    academicYear: '2023–2024',
    category: 'Tecnología e IA',
  },
  {
    id: 'c-23-6',
    title: 'Entiende tu smartphone Android',
    dates: '19/01/2024–16/02/2024',
    academicYear: '2023–2024',
    category: 'Tecnología e IA',
  },
  {
    id: 'c-23-5',
    title: 'Introducción a PowerPoint',
    dates: '09/01/2024–11/01/2024',
    academicYear: '2023–2024',
    category: 'Tecnología e IA',
  },
  {
    id: 'c-23-4',
    title: 'Conferencia: Inteligencia Artificial, ¿Qué es y para qué sirve?',
    dates: '30/11/2023',
    academicYear: '2023–2024',
    category: 'Tecnología e IA',
  },
  {
    id: 'c-23-3',
    title: 'Trámites por Internet',
    dates: '28/11/2023–14/12/2023',
    academicYear: '2023–2024',
    category: 'Tecnología e IA',
  },
  {
    id: 'c-23-2',
    title: 'Fotografía: Módulos I, II y III',
    dates: '2023–2024',
    academicYear: '2023–2024',
    category: 'Fotografía',
  },
  {
    id: 'c-23-1',
    title: 'Competencias digitales básicas actuales',
    dates: '19/09/2023–23/11/2023',
    academicYear: '2023–2024',
    category: 'Tecnología e IA',
  },
  // 2022–2023
  {
    id: 'c-22-1',
    title: 'Le Ética Pública',
    dates: 'abril de 2022',
    academicYear: '2022–2023',
    category: 'Gestión y Finanzas',
  },
  // 2021–2022
  {
    id: 'c-21-1',
    title: 'Hablar en Público. Saber comunicar',
    dates: '21/01/2021–08/04/2021',
    academicYear: '2021–2022',
    category: 'Protocolo y Comunicación',
  },
];

export interface OtherCourse {
  id: string;
  provider: string;
  title: string;
  dates: string;
  year: string;
}

export const OTHER_COURSES: OtherCourse[] = [
  {
    id: 'adecco-seim-2026',
    provider: 'ADECCO - SEIM',
    title: 'CURSO DE ALFABETIZACIÓN DIGITAL',
    dates: '20/10/2026 al 26/11/2026',
    year: '2026',
  },
];

export const DIGITAL_LEARNING_GOALS = [
  'Word, Excel y PowerPoint',
  'Diseño gráfico básico: Canva',
  'Acrobat Reader (Adobe)',
  'Uso habitual de herramientas de Inteligencia Artificial',
  'Gestiones digitales relacionadas con la búsqueda de trabajo',
  'Redes Sociales: Facebook, Instagram, X, TikTok y WhatsApp',
  'Gestión eficiente del correo electrónico',
  'Digitalización del archivo físico de documentos personales',
];
