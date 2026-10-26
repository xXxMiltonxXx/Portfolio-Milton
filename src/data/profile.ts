// Fuente única de verdad del portafolio: la usan las secciones de la página
// y el asistente de IA (/api/chat) como base de conocimiento.

export type Category = "ia" | "web" | "movil" | "backend" | "devops";

export interface Project {
  name: string;
  summary: string;
  highlights: string[];
  tags: string[];
  categories: Category[];
  year: string;
  featured?: boolean;
  repo?: string;
  live?: string;
  private?: boolean;
  image?: string;
  /** Imagen vertical (póster): se muestra completa sobre un fondo difuminado. */
  portrait?: boolean;
}

const GH = "https://github.com/xXxMiltonxXx";
const defineProjects = (projects: Project[]) => projects;

export const profile = {
  name: "Milton Angamarca",
  shortName: "Milton",
  initials: "MA",
  role: "Ingeniero de Software · Full Stack & IA",
  location: "Manta, Ecuador",
  availability: "Abierto a proyectos y colaboraciones",
  tagline:
    "Desarrollo productos con IA de punta a punta: agentes conversacionales, CRMs inteligentes, apps móviles de salud y plataformas web, desde la idea hasta producción.",
  heroWords: ["agentes de IA", "CRMs inteligentes", "apps móviles", "plataformas web", "comunidad tech"],
  photo: "/milton.jpg",
  photoFallback: "",
  links: {
    github: GH,
    linkedin: "https://www.linkedin.com/in/milton-angamarca",
  },

  stats: [
    { value: "70+", label: "Repositorios en GitHub" },
    { value: "3", label: "Idiomas · español, inglés e italiano" },
    { value: "24/7", label: "Agentes de IA atendiendo en IssA" },
    { value: "5+", label: "Años construyendo software" },
  ],

  about: [
    "Soy <strong>Milton Angamarca</strong>, ingeniero de software de <strong>Manta, Ecuador</strong>, formado en la <strong>Universidad Laica Eloy Alfaro de Manabí (ULEAM)</strong>. Me apasiona convertir problemas reales en productos que la gente usa todos los días.",
    "Hoy construyo <strong>IssA</strong>, un CRM con IA nativa para WhatsApp: agentes que leen la base de conocimiento de un negocio, responden, agendan y cierran ventas 24/7. Trabajo en todo el stack: React y Next.js en el frontend, FastAPI, LangGraph y Go en el backend, Flutter en móvil y Supabase/Postgres como base.",
    "Fuera del código me mueve la comunidad: creé y organicé <strong>Hacknarok</strong>, una hackathon en Manta con más de <strong>$3.000 en premios</strong>, e impartí cursos en la <strong>Comunidad Microsoft de la ULEAM</strong>.",
  ],

  pillars: [
    {
      title: "IA aplicada",
      text: "Agentes con LangGraph, RAG sobre documentos, visión por computadora y modelos on-device.",
    },
    {
      title: "Full stack moderno",
      text: "React, Next.js, Astro, Angular, FastAPI, Go y Node con Supabase/Postgres.",
    },
    {
      title: "Móvil multiplataforma",
      text: "Flutter con Clean Architecture y BLoC, más Kotlin + Jetpack Compose.",
    },
    {
      title: "Datos y sistemas empresariales",
      text: "Procesos ETL, ciencia de datos, concurrencia, procedimientos almacenados, réplicas de PostgreSQL, multitenancy y módulos contables.",
    },
    {
      title: "Del prototipo a producción",
      text: "Servidores VPS en Contabo con Nginx, Cloudflare, despliegues, crons, Docker, colas con Celery/Redis, CI/CD y Vercel.",
    },
  ],

  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Intermedio" },
    { name: "Italiano", level: "Intermedio" },
  ],

  experience: [
    {
      title: "Full Stack & AI Engineer",
      org: "IssA · issaa-ai.com",
      period: "Desde 2025",
      points: [
        "Desarrollo de un CRM con IA nativa para WhatsApp que responde, agenda citas y cierra ventas 24/7 para salud, sector público, retail, educación y B2B.",
        "Backend con FastAPI + LangGraph (migrado desde n8n): webhooks por conexión, flujo conversacional RAG, colas Celery/Redis e ingesta de PDF, Office, audio y OCR.",
        "Landing y portal de clientes en React/Vite multilenguaje (ES/EN/PT) con dashboard de métricas, conversaciones y noticias.",
      ],
      tags: ["Python", "FastAPI", "LangGraph", "OpenAI", "React", "Next.js", "Supabase", "Celery", "Redis", "Docker"],
    },
    {
      title: "Desarrollador del proyecto Coactiva",
      org: "Prototipo para el IESS · Manabí",
      period: "2026",
      points: [
        "Prototipo que digitaliza el ciclo completo del cobro coactivo: obligaciones en mora, glosas, notificaciones, expedientes y reportes.",
        "Next.js 16 con Server Actions, Supabase con RLS y firma electrónica de documentos PDF.",
      ],
      tags: ["Next.js", "React", "TypeScript", "Supabase", "Tailwind CSS"],
    },
    {
      title: "Líder de proyecto y desarrollador",
      org: "Sistema escolar Brighton",
      period: "Experiencia profesional",
      points: [
        "Dirigí el proyecto como líder técnico: planificación, decisiones de arquitectura y coordinación del equipo.",
        "Participé en la creación del sistema escolar y en la refactorización de módulos existentes para hacerlo más mantenible.",
        "Construido con Next.js, renderizado del lado del servidor (SSR) y SWR para la obtención y caché de datos.",
      ],
      tags: ["Next.js", "React", "TypeScript", "SWR"],
      link: "https://bebrighton.net/es/home-2/",
    },
    {
      title: "Desarrollador Full Stack Junior",
      org: "ZGames",
      period: "Experiencia profesional",
      points: [
        "Desarrollé Sistema Center, una plataforma que centraliza todos los movimientos de los empleados.",
        "Implementé roles y permisos, y el módulo contable con su lógica de debe y haber.",
        "Escribí procedimientos almacenados y lógica de negocio en base de datos.",
        "Trabajé en proyectos multitenant, procesos ETL, ciencia de datos y manejo de concurrencia.",
        "Frontend en Angular (versiones 15, 17 y 20) con manejo de estado global.",
        "Backend en Python sobre PostgreSQL con réplicas, gestión de servidores, despliegues y tareas programadas con cron.",
      ],
      tags: ["Angular", "TypeScript", "Python", "PostgreSQL", "Linux", "Docker"],
    },
    {
      title: "Creador y organizador",
      org: "Hacknarok 2024 · Manta",
      period: "Octubre a diciembre de 2024",
      points: [
        "Ideé y organicé una hackathon en Manta con más de $3.000 en premios, mentores por temática y rúbricas de evaluación.",
        "Construí la plataforma oficial: inscripción de equipos, temas y mentores, entrega de proyectos, calificación por jurados y recursos de formación.",
      ],
      tags: ["Angular", "Supabase", "Tailwind CSS", "Figma"],
    },
    {
      title: "Instructor y miembro",
      org: "Comunidad Microsoft · ULEAM",
      period: "2023 a 2025",
      points: [
        "Impartí un curso de TypeScript para estudiantes de la universidad.",
        "Diseñé pruebas técnicas para la selección de nuevos miembros de la comunidad.",
      ],
      tags: ["TypeScript", "JavaScript", "Node.js"],
    },
  ],

  projects: defineProjects([
    {
      name: "IssA",
      image: "/proyectos/issa-landing.webp",
      summary:
        "CRM con IA nativa para WhatsApp. Sus agentes leen el catálogo y los manuales de un negocio para responder, agendar y cobrar, mientras el panel centraliza cada lead, pago y ticket.",
      highlights: [
        "Demo conversacional pública con OpenAI y límites de uso",
        "Portal de clientes: agente, métricas, planes y conversaciones",
        "Landing multilenguaje con animaciones GSAP, Framer Motion y Three.js",
      ],
      tags: ["React", "Vite", "Tailwind CSS", "Supabase", "OpenAI", "WhatsApp API", "GSAP", "Three.js", "Framer Motion", "Docker"],
      categories: ["ia", "web"],
      year: "2025 a 2026",
      featured: true,
      live: "https://issaa-ai.com",
      private: true,
    },
    {
      name: "Motor de IA de IssA",
      image: "/proyectos/issa-crm.webp",
      live: "https://issaconnection.it.com/login",
      summary:
        "Backend que reemplazó los flujos de n8n por un grafo conversacional con LangGraph: genera webhooks únicos por conexión (YCloud), procesa mensajes con RAG sobre Postgres y ejecuta automatizaciones.",
      highlights: [
        "Workers Celery + Redis para webhooks, auto-etiquetado y automatizaciones",
        "Ingesta de PDF, Word, Excel, PowerPoint, audio y OCR para la base de conocimiento",
        "Voz con ElevenLabs, notificaciones push e integración con Google APIs",
      ],
      tags: ["Python", "FastAPI", "LangGraph", "LangChain", "OpenAI", "OpenRouter", "Celery", "Redis", "Supabase", "PostgreSQL", "ElevenLabs", "Docker"],
      categories: ["ia", "backend"],
      year: "2026",
      featured: true,
      private: true,
    },
    {
      name: "Salud Metabólica",
      image: "/proyectos/salud-metabolica.webp",
      live: "https://saludmetabolica-salud-landing.idpriz.easypanel.host/#apps",
      summary:
        "Plataforma de salud con app para pacientes, app para médicos y una API en Go. Un semáforo clínico prioriza pacientes y el médico puede llamarlos por video.",
      highlights: [
        "Reconocimiento de alimentos desde una foto en el propio dispositivo (SigLIP 2 / TFLite)",
        "Videollamadas médico–paciente con LiveKit",
        "API Go con arquitectura hexagonal sobre Supabase, monorepo con Melos",
      ],
      tags: ["Flutter", "Dart", "Go", "Supabase", "PostgreSQL", "LiveKit", "TensorFlow Lite", "Docker", "Contabo", "GitHub Actions"],
      categories: ["ia", "movil", "backend"],
      year: "2026",
      featured: true,
      private: true,
    },
    {
      name: "Hacknarok 2024",
      image: "/proyectos/hacknarok.webp",
      summary:
        "Plataforma oficial de la hackathon que creé en Manta: inscripción de equipos, temas con mentor asignado, entrega de proyectos y votación de jurados con puntaje ajustado por rúbrica.",
      highlights: [
        "Roles para participantes, mentores y jurados",
        "Calendario integrado con Google Calendar y material de formación",
        "Más de $3.000 en premios para los equipos",
      ],
      tags: ["Angular", "TypeScript", "Supabase", "Tailwind CSS", "Vercel"],
      categories: ["web"],
      year: "2024",
      featured: true,
      live: "https://hacknarok.vercel.app",
      private: true,
    },
    {
      name: "BioGuard",
      image: "/proyectos/bioguard.webp",
      portrait: true,
      featured: true,
      summary:
        "Tu rostro es la llave. Plataforma de autenticación biométrica que registra el rostro del usuario y le permite iniciar sesión con reconocimiento facial, sin contraseñas.",
      highlights: [
        "Detección y embeddings faciales con FaceNet (PyTorch) y OpenCV",
        "Registro de rostros y login biométrico que emite tokens JWT",
        "Caché de rostros en memoria para respuestas rápidas y almacenamiento en Supabase",
      ],
      tags: ["Python", "FastAPI", "PyTorch", "OpenCV", "Supabase", "Docker"],
      categories: ["ia", "backend"],
      year: "2026",
      private: true,
    },
    {
      name: "Invitación Valentina",
      image: "/proyectos/valentina.webp",
      summary:
        "Invitación web para una revelación de sexo, baby shower y cumpleaños: cuenta regresiva, itinerario, mapa del lugar y confirmación de asistencia por WhatsApp.",
      highlights: ["Diseño editorial con tipografía caligráfica", "Un solo archivo HTML, sin dependencias"],
      tags: ["JavaScript", "Vercel"],
      categories: ["web"],
      year: "2026",
      live: "https://valentina-baby.vercel.app",
      repo: `${GH}/Valentina-baby`,
    },
    {
      name: "Quill ULEAM",
      summary:
        "SaaS para subir un PDF y conversar con él usando IA, con respuestas en streaming. Presentado en la Casa Abierta de la ULEAM.",
      highlights: ["RAG con LangChain, OpenAI y Pinecone", "Planes gratis y Pro con Stripe, tRPC + Zod + Prisma"],
      tags: ["Next.js", "TypeScript", "LangChain", "OpenAI", "Pinecone", "tRPC", "Zod", "Prisma", "Stripe", "Tailwind CSS"],
      categories: ["ia", "web"],
      year: "2023",
      repo: `${GH}/ProyectoCasaAbierta23-2`,
    },
    {
      name: "Coactiva",
      summary:
        "Prototipo para digitalizar el cobro coactivo del IESS en Manabí: obligaciones, glosas, notificaciones, expedientes y firma electrónica.",
      highlights: ["Server Actions y RLS por rol", "Firma de PDFs con certificados .p12"],
      tags: ["Next.js", "React", "TypeScript", "Supabase", "PostgreSQL", "Tailwind CSS"],
      categories: ["web"],
      year: "2026",
      private: true,
    },
    {
      name: "Sistema escolar Brighton",
      image: "/proyectos/brighton.webp",
      summary:
        "Sistema de gestión escolar que lideré como jefe de proyecto: participé en su creación y en la refactorización de sus módulos.",
      highlights: [
        "Liderazgo técnico del equipo",
        "Creación de módulos nuevos y refactorización del código existente",
        "Next.js con SSR y SWR para obtención y caché de datos",
      ],
      tags: ["Next.js", "React", "TypeScript", "SWR"],
      categories: ["web"],
      year: "Líder de proyecto",
      live: "https://bebrighton.net/es/home-2/",
    },
    {
      name: "Sistema Center · ZGames",
      image: "/proyectos/zgames.webp",
      summary:
        "Plataforma que centraliza todos los movimientos de los empleados, con roles y permisos, contabilidad (debe y haber) y arquitectura multitenant.",
      highlights: [
        "Roles y permisos por usuario",
        "Módulo contable con asientos de debe y haber",
        "Procedimientos almacenados, procesos ETL y concurrencia",
        "Angular 15, 17 y 20 con estado global; PostgreSQL con réplicas",
      ],
      tags: ["Angular", "TypeScript", "Python", "PostgreSQL", "Linux"],
      categories: ["web", "backend"],
      year: "Full Stack Junior",
      private: true,
    },
    {
      name: "ULEAM Community Hub",
      summary:
        "App móvil para la comunidad universitaria: comunidades, red social, reservas con calendario, notificaciones y panel de administración.",
      highlights: ["Clean Architecture con BLoC, GetIt y fpdart", "Supabase con triggers para notificaciones"],
      tags: ["Flutter", "Dart", "BLoC", "Supabase", "PostgreSQL"],
      categories: ["movil"],
      year: "2026",
      private: true,
    },
    {
      name: "Tastyfood",
      image: "/proyectos/tastyfood.webp",
      summary:
        "Tienda en línea del centro gastronómico Tasty Food, con carrito, control de stock en tiempo real que evita sobreventas, facturas numeradas y códigos QR.",
      highlights: [
        "Panel administrativo TastyAdmin con inicio de sesión y modo oscuro",
        "Realtime y Storage de Supabase",
        "Next.js 15 y React 19",
      ],
      tags: ["Next.js", "React", "Supabase", "Vercel"],
      categories: ["web"],
      year: "2025",
      live: "https://tastyfood-admin-f8kv.vercel.app/signin",
      repo: `${GH}/Tastyfood`,
    },
    {
      name: "BridgeUleam",
      summary:
        "Red social estilo Threads para estudiantes de la ULEAM: hilos, feed, perfiles, búsqueda, notificaciones e imágenes. Hecha en Flutter y también en Kotlin nativo.",
      highlights: ["Firebase Auth, Firestore, Realtime DB y Storage", "Versión nativa con Jetpack Compose"],
      tags: ["Flutter", "Dart", "Kotlin", "Jetpack Compose", "Android", "Firebase"],
      categories: ["movil"],
      year: "2024 a 2025",
      repo: `${GH}/BridgeUleam`,
    },
    {
      name: "Laboratorio IoT",
      summary:
        "Simulaciones de comunicación IoT con MQTT, D2C, D2D, M2M y HTTP, con dashboard web y todo dockerizado.",
      highlights: ["Python + Flask + paho-mqtt", "Frontend en Astro, Docker Compose"],
      tags: ["Python", "MQTT", "Flask", "Astro", "Docker"],
      categories: ["backend", "devops"],
      year: "2025",
      repo: `${GH}/Emergentes`,
    },
    {
      name: "ArtConnect API",
      summary:
        "Backend de una red social para artistas: comunidades, foros, publicaciones, reacciones, productos y facturación.",
      highlights: ["Prisma + PostgreSQL", "Docker Compose"],
      tags: ["TypeScript", "Node.js", "Express", "Prisma", "PostgreSQL", "Docker"],
      categories: ["backend"],
      year: "2023",
      repo: `${GH}/ArtConnect_Back_end`,
    },
    {
      name: "Backups automatizados",
      summary:
        "Sistema de respaldo entre servidores Ubuntu con rsync, llaves SSH, cron y scripts de monitoreo y verificación.",
      highlights: ["Guía paso a paso de instalación", "Monitoreo y verificación de integridad"],
      tags: ["Bash", "Linux", "Ubuntu"],
      categories: ["devops"],
      year: "2025",
      repo: `${GH}/ServidoresBackup`,
    },
  ]),

  stack: [
    { group: "Inteligencia artificial", items: ["OpenAI", "Claude", "LangGraph", "LangChain", "Pinecone", "PyTorch", "OpenCV", "TensorFlow Lite", "Hugging Face", "ElevenLabs", "OpenRouter"] },
    { group: "Frontend", items: ["React", "Next.js", "Astro", "Angular", "TypeScript", "JavaScript", "Tailwind CSS", "Vite", "SWR", "GSAP", "Three.js", "Framer Motion"] },
    { group: "Backend", items: ["Python", "FastAPI", "Flask", "Go", "Node.js", "Express", "tRPC", "Prisma", "Celery", "Redis", "n8n"] },
    { group: "Móvil", items: ["Flutter", "Dart", "Kotlin", "Jetpack Compose", "Android", "Firebase"] },
    { group: "Datos e infraestructura", items: ["Supabase", "PostgreSQL", "MongoDB", "Docker", "Nginx", "Cloudflare", "Contabo", "Vercel", "Linux", "Ubuntu", "Bash", "Git", "GitHub Actions", "LiveKit", "MQTT", "Stripe"] },
  ],

  // Certificados de Udemy y Coursera: { title, issuer: "Udemy" | "Coursera", year, url }.
  // La sección se muestra sola en cuanto haya al menos uno.
  certifications: [
    {
      title: "JavaScript Moderno Guía Definitiva: Construye +20 Proyectos",
      issuer: "Udemy",
      instructor: "Juan Pablo De la torre Valdez",
      date: "Enero 2026",
      hours: "52.5 horas",
      url: "https://ude.my/UC-52b03c29-c292-48af-b79a-39e55caae35b",
      image: "/certificados/udemy-javascript-moderno.jpg",
    },
    {
      title: "Aprende JavaScript ES9, HTML, CSS3 y NodeJS desde cero",
      issuer: "Udemy",
      instructor: "Nicolas Schurmann",
      date: "Enero 2024",
      hours: "19 horas",
      url: "https://ude.my/UC-e55e9a05-2275-4449-a703-226f447a39cb",
      image: "/certificados/udemy-javascript-es9-node.jpg",
    },
  ] as { title: string; issuer: string; instructor?: string; date?: string; hours?: string; url?: string; image?: string }[],

  community: [
    {
      title: "Hacknarok 2024",
      kicker: "Creador · Organizador",
      text: "Hackathon en Manta con equipos de hasta 4 personas, mentores por temática, minitutoriales, rúbricas públicas y más de $3.000 en premios. La ULEAM difundió el evento en sus redes.",
      link: "https://hacknarok.vercel.app",
    },
    {
      title: "Comunidad Microsoft ULEAM",
      kicker: "Instructor",
      text: "Curso de TypeScript para estudiantes y diseño de pruebas técnicas para nuevos miembros.",
      link: `${GH}/TypeScriptCurso`,
    },
    {
      title: "Casa Abierta ULEAM",
      kicker: "Expositor",
      text: "Presenté Quill ULEAM, un SaaS de chat con PDFs impulsado por IA, en la feria de proyectos de la universidad.",
      link: `${GH}/ProyectoCasaAbierta23-2`,
    },
  ],
};

export type Profile = typeof profile;

/** Texto plano con todo el perfil, usado como contexto del asistente de IA. */
export function profileAsContext(): string {
  const p = profile;
  const strip = (s: string) => s.replace(/<[^>]+>/g, "");
  return [
    `Nombre: ${p.name}. Rol: ${p.role}. Ubicación: ${p.location}.`,
    `Resumen: ${p.tagline}`,
    `Sobre mí: ${p.about.map(strip).join(" ")}`,
    "Experiencia:",
    ...p.experience.map((e) => `- ${e.title} en ${e.org} (${e.period}): ${e.points.join(" ")} Tecnologías: ${e.tags.join(", ")}.`),
    "Proyectos:",
    ...p.projects.map(
      (pr) =>
        `- ${pr.name} (${pr.year}): ${pr.summary} ${pr.highlights.join(". ")}. Stack: ${pr.tags.join(", ")}.` +
        (pr.live ? ` Demo: ${pr.live}.` : "") +
        (pr.repo ? ` Código: ${pr.repo}.` : pr.private ? " Código privado." : ""),
    ),
    `Idiomas: ${p.languages.map((l) => `${l.name} (${l.level})`).join(", ")}.`,
    "Stack:",
    ...p.stack.map((s) => `- ${s.group}: ${s.items.join(", ")}`),
    "Comunidad:",
    ...p.community.map((c) => `- ${c.title} (${c.kicker}): ${c.text}`),
    ...(p.certifications.length
      ? ["Certificaciones:", ...p.certifications.map((c) => `- ${c.title} (${c.issuer}${c.date ? `, ${c.date}` : ""}${c.hours ? `, ${c.hours}` : ""}${c.instructor ? `, instructor ${c.instructor}` : ""})`)]
      : []),
    `Contacto: GitHub ${p.links.github}, LinkedIn ${p.links.linkedin}.`,
  ].join("\n");
}
