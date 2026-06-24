
# Portfolio de Jose Antonio Bejarano Vela

Portfolio personal desarrollado para presentar mi perfil técnico, experiencia y proyectos como desarrollador backend junior con orientación a Data Science e IA aplicada.

El proyecto está construido con Astro 4.4.5, Tailwind CSS 3.4.1 y TypeScript 5.3.3. Usa componentes `.astro`, generación estática, datos de proyectos centralizados y rutas dinámicas para páginas individuales de proyectos.

## Problema que resuelve

Este portfolio resuelve la necesidad de presentar de forma clara, profesional y centralizada:

- Perfil técnico.
- Experiencia.
- Proyectos principales.
- Stack tecnológico.
- Enlaces a GitHub, demos reales y páginas de detalle.
- Evolución profesional hacia backend, datos e IA aplicada.

No está planteado como una simple plantilla visual, sino como una herramienta profesional para procesos de selección técnica y presentación de proyectos. La web permite explicar qué se ha construido, con qué tecnologías y qué decisiones técnicas hay detrás de cada proyecto.

## Objetivos del proyecto

- Mostrar el perfil profesional de forma clara y actualizada.
- Destacar proyectos relevantes como SkillMatch AI y SocialMediaDashboard.
- Separar contenido y presentación para facilitar el mantenimiento.
- Facilitar la navegación a páginas individuales de proyectos.
- Mantener una base escalable para añadir nuevos proyectos.
- Cuidar responsive, modo oscuro y consistencia visual.

## Datos o contenido usado

Este proyecto no trabaja con datasets ni modelos de machine learning propios. El contenido usado corresponde a información profesional y material del portfolio:

- Información profesional del CV.
- Proyectos reales del perfil.
- Tecnologías asociadas a cada proyecto.
- Enlaces a GitHub y demos solo cuando existen.
- Imágenes y capturas guardadas en `public`.
- Datos estructurados en `src/data/projects.ts`.
- Metadatos SEO de la página principal.

El portfolio:

- No usa backend propio.
- No usa base de datos.
- No usa datos sensibles.
- Genera contenido estático mantenible desde archivos del proyecto.

## Decisiones técnicas tomadas

### Astro como framework principal

Se usa Astro por su rendimiento, generación estática y simplicidad para construir portfolios técnicos. También permite organizar la interfaz mediante componentes `.astro` reutilizables.

### Tailwind CSS

Tailwind CSS se usa para mantener estilos consistentes, responsive, modo oscuro, tarjetas, badges y layouts adaptativos sin crear una capa CSS compleja.

### TypeScript

TypeScript se usa para tipar los datos de proyectos y reducir errores al reutilizar la misma información en la home y en las páginas individuales.

### Datos centralizados en `src/data/projects.ts`

Los proyectos están definidos en un único archivo de datos. Esto evita duplicación, facilita actualizar contenido y permite reutilizar los mismos datos en la sección de proyectos y en `/projects/{slug}`.

### Rutas dinámicas en Astro

Las páginas individuales de proyectos se generan con `src/pages/projects/[slug].astro`. Esta estructura permite añadir nuevos proyectos sin duplicar páginas manualmente.

### Badges de tecnologías

Los badges se gestionan con `ProjectTechBadge.astro`. Cada tecnología puede tener icono y color asociado mediante un mapa estático de clases Tailwind. Esto evita clases dinámicas tipo `bg-${color}`, que Tailwind no detecta de forma fiable.

### Responsive

El diseño está preparado para móvil, tablet y escritorio. Se usan estrategias como `flex-wrap` en badges y botones, contenedores con ancho máximo, imágenes proporcionales y layouts adaptativos para evitar scroll horizontal.

### Limpieza y mantenibilidad

Se han eliminado componentes y assets que no se usaban, y se ha creado `AGENTS.md` como guía técnica y visual para mantener coherencia en futuras iteraciones. También se corrigió un warning CSS relacionado con el uso de `@apply` dentro de `keyframes` en `Header.astro`.

## Estructura del proyecto

```text
src/
  components/
  components/icons/
  data/
  layouts/
  pages/
public/
AGENTS.md
astro.config.mjs
tailwind.config.mjs
package.json
```

- `src/pages`: páginas Astro de la aplicación, incluida la home y las rutas dinámicas de proyectos.
- `src/components`: componentes reutilizables del portfolio.
- `src/components/icons`: iconos locales usados en navegación, secciones y badges.
- `src/data`: datos estructurados del proyecto, especialmente `projects.ts`.
- `src/layouts`: layout base con metadatos, tipografía, fondo global, header y footer.
- `public`: imágenes, capturas y assets públicos.
- `AGENTS.md`: guía de reglas técnicas y visuales para futuros cambios.
- `astro.config.mjs`: configuración de Astro e integraciones.
- `tailwind.config.mjs`: configuración de Tailwind CSS y modo oscuro.
- `package.json`: scripts y dependencias del proyecto.

## Funcionalidades principales

- Página principal del portfolio.
- Hero con presentación profesional.
- Sección Sobre mí.
- Experiencia técnica.
- Sección de proyectos.
- Páginas individuales de proyectos.
- Badges visuales de tecnologías.
- Enlaces a GitHub.
- Enlaces a demo solo cuando existen.
- Modo oscuro.
- Diseño responsive.
- Metadata SEO en la página principal.
- Generación de `robots.txt` mediante `astro-robots-txt`.

## Proyectos destacados

### SkillMatch AI

Plataforma para analizar CVs en PDF, construir un perfil profesional y calcular compatibilidad con ofertas tecnológicas mediante reglas de skills y similitud semántica.

Tecnologías principales:

- Angular
- FastAPI
- PostgreSQL
- pgvector
- Docker

Enlaces:

- Página interna: `/projects/skillmatch-ai`
- GitHub: `https://github.com/JABejaranoVela/SkillMatch-AI`

SkillMatch AI no tiene demo pública configurada en el portfolio.

### SocialMediaDashboard

Dashboard analítico full stack para explorar datos de encuesta sobre uso de redes sociales y métricas de salud mental. Incluye API REST, autenticación JWT, operaciones CRUD aisladas por usuario y despliegue por capas.

Tecnologías principales:

- Spring Boot
- Vue
- Java
- MySQL

Enlaces:

- Página interna: `/projects/social-media-dashboard`
- GitHub: `https://github.com/JABejaranoVela/SocialMediaDashboard`
- Demo: `https://jabejaranosocialmediadashboard.netlify.app/`

## Instalación y uso local

Instalar dependencias:

```bash
npm install
```

Levantar el servidor de desarrollo:

```bash
npm run dev
```

Normalmente la web estará disponible en:

```text
http://localhost:4321/
```

## Build de producción

Validar el proyecto y generar la salida estática:

```bash
npm run build
```

Previsualizar la build generada:

```bash
npm run preview
```

El comando `npm run build` ejecuta `astro check` y después genera la build estática en `dist/`.

## Verificación

Verificación realizada mediante build:

```bash
npm run build
```

Rutas recomendadas para revisar:

- `http://localhost:4321/`
- `http://localhost:4321/projects/skillmatch-ai`
- `http://localhost:4321/projects/social-media-dashboard`

## Conclusiones y aprendizajes

Separar datos y componentes mejora la mantenibilidad del portfolio, especialmente cuando la misma información se muestra en la home y en páginas individuales.

Un portfolio técnico no debería limitarse a mostrar proyectos visualmente. También debe explicar qué problema resuelve cada proyecto, qué decisiones técnicas se tomaron y qué demuestra a nivel profesional.

Las páginas individuales permiten justificar mejor el trabajo realizado y dar contexto a proyectos más completos como SkillMatch AI o SocialMediaDashboard.

Centralizar proyectos en `src/data/projects.ts` facilita escalar la web, añadir nuevos proyectos y mantener consistencia entre secciones.

Cuidar responsive, consistencia visual y documentación mejora la presentación profesional ante equipos técnicos. Además, `AGENTS.md` ayuda a mantener una línea clara de diseño y código en futuras iteraciones.

## Próximas mejoras

- Añadir más capturas de proyectos.
- Añadir versión en inglés.
- Mejorar accesibilidad.
- Añadir checklist responsive.
- Desplegar proyectos sin demo pública cuando estén preparados.
- Añadir analítica ligera respetando privacidad.
