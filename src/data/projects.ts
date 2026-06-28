export interface Project {
  slug: string
  title: string
  shortDescription: string
  description: string
  problem?: string
  goal?: string
  technologies: string[]
  mainTechnologies: string[]
  features: string[]
  technicalHighlights: string[]
  learned?: string
  deployment?: string[]
  image?: string
  demoUrl: string | null
  githubUrl: string | null
  showGithubAlongsideDemo?: boolean
}

export const projects: Project[] = [
  {
    slug: "skillmatch-ai",
    title: "SkillMatch AI",
    shortDescription:
      "Aplicación web que analiza un CV en PDF, detecta el perfil profesional y ordena ofertas tecnológicas por compatibilidad explicable.",
    description:
      "SkillMatch AI es una aplicación web para orientar la búsqueda laboral a partir del análisis de un CV. Extrae información profesional del documento, construye un perfil estructurado, busca ofertas tecnológicas relacionadas y calcula un ranking de compatibilidad combinando reglas de skills y similitud semántica. El resultado no solo ordena las ofertas, también explica qué coincide con el perfil y qué habilidades faltan.",
    problem:
      "Buscar empleo obliga a comparar manualmente el contenido de un CV con descripciones de ofertas muy heterogéneas. Muchos portales priorizan por palabras clave o criterios poco transparentes, sin explicar por qué una oferta encaja con una persona candidata.",
    goal:
      "Reducir el tiempo de revisión de ofertas y hacer visible el criterio usado en el ranking, ayudando a la persona candidata a entender qué oportunidades encajan mejor con su perfil sin sustituir su decisión final.",
    technologies: [
      "Angular 20",
      "TypeScript",
      "SCSS",
      "FastAPI",
      "Python",
      "SQLAlchemy",
      "Alembic",
      "PostgreSQL 16",
      "pgvector",
      "sentence-transformers",
      "spaCy",
      "PyMuPDF",
      "Docker Compose",
      "Nginx",
    ],
    mainTechnologies: ["Angular", "FastAPI", "PostgreSQL", "pgvector", "Docker"],
    features: [
      "Registro, login, logout y restauración de sesión.",
      "Verificación de email y recuperación de contraseña.",
      "Subida y procesamiento defensivo de CV en PDF.",
      "Construcción de perfil profesional estructurado.",
      "Detección de skills, experiencia, idiomas, formación y tipo de perfil.",
      "Búsqueda asíncrona de ofertas por perfil.",
      "Ranking de recomendaciones paginado y explicado.",
      "Guardado, descarte y marcado de ofertas como postuladas.",
      "Análisis de CV en PDF dentro del flujo de la aplicación.",
      "Configuración Docker separada para desarrollo y producción.",
    ],
    technicalHighlights: [
      "Matching híbrido con 65% reglas de skills y 35% similitud semántica.",
      "Embeddings de 384 dimensiones almacenados en PostgreSQL con pgvector.",
      "Validación defensiva de PDF con extensión, MIME, cabecera real, tamaño, páginas y texto mínimo extraíble.",
      "Sesiones opacas con cookie HttpOnly en lugar de tokens en localStorage.",
      "Contraseñas con Argon2id y migración automática desde bcrypt.",
      "Worker separado para emails con payload cifrado mediante Fernet y reintentos escalonados.",
      "Rate limiting persistente en PostgreSQL para flujos sensibles.",
      "OpenAPI disponible en desarrollo y deshabilitado en producción.",
    ],
    learned:
      "El proyecto demuestra cómo combinar reglas explícitas y embeddings para crear recomendaciones interpretables. También refuerza la importancia de normalizar skills antes de comparar perfiles, persistir la versión del algoritmo y separar responsabilidades entre autenticación, procesamiento de CV, importación de ofertas, matching y correo.",
    deployment: [
      "SkillMatch AI está desplegado en un VPS Ubuntu con Docker, Nginx y HTTPS. La arquitectura separa frontend, backend, base de datos, worker de email y datos persistentes, manteniendo los servicios internos aislados y exponiendo públicamente solo el acceso web mediante reverse proxy.",
      "El despliegue se automatiza con GitHub Actions mediante un pipeline CI/CD que valida backend y frontend, construye imágenes, actualiza la aplicación en el servidor, ejecuta migraciones, realiza backups previos y comprueba el estado mediante health checks.",
    ],
    image: "/projects/skillmatch-ai/landing-desktop.png",
    demoUrl: "https://skillmatch.jabejarano.tech/",
    githubUrl: "https://github.com/JABejaranoVela/SkillMatch-AI",
    showGithubAlongsideDemo: true,
  },
  {
    slug: "social-media-dashboard",
    title: "Social Media Dashboard",
    shortDescription:
      "Dashboard analítico para explorar la relación entre uso de redes sociales y métricas de salud mental con filtros, KPIs y gráficas interactivas.",
    description:
      "Dashboard analítico en producción para explorar, a partir de datos de encuesta, la relación entre uso de redes sociales y métricas de salud mental con KPIs, gráficas interactivas y filtros avanzados. Backend en Java/Spring Boot con API REST, autenticación JWT y persistencia relacional, aplicando control de acceso y operaciones CRUD aisladas por usuario.",
    problem:
      "El análisis de datos de encuestas puede resultar poco accesible si no se presenta con filtros, métricas claras y visualizaciones interactivas.",
    goal:
      "Construir una aplicación desacoplada que permita consultar datos, aplicar filtros y visualizar indicadores desde una interfaz web conectada a una API REST.",
    technologies: ["Spring Boot", "Vue", "Java", "MySQL", "JPA/Hibernate", "JWT"],
    mainTechnologies: ["Spring Boot", "Vue", "Java", "MySQL"],
    features: [
      "KPIs y gráficas interactivas.",
      "Filtros avanzados sobre datos de encuesta.",
      "API REST con autenticación JWT.",
      "Operaciones CRUD aisladas por usuario.",
      "Frontend desplegado en Netlify, backend en Render y base de datos en TiDB Cloud.",
    ],
    technicalHighlights: [
      "Arquitectura desacoplada entre SPA, API REST y base de datos.",
      "Control de acceso aplicado a datos asociados a cada usuario.",
    ],
    learned:
      "El proyecto demuestra capacidad para integrar frontend, backend, autenticación y persistencia relacional en una aplicación desplegada por capas.",
    image: "/projects/socialMediaDashboard.png",
    demoUrl: "https://jabejaranosocialmediadashboard.netlify.app/",
    githubUrl: "https://github.com/JABejaranoVela/SocialMediaDashboard",
    showGithubAlongsideDemo: true,
  },
]
