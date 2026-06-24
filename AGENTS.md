# AGENTS.md

## Stack

Este proyecto es un portfolio personal construido con:

- Astro
- Tailwind CSS
- TypeScript
- Componentes `.astro`
- Datos de proyectos centralizados en `src/data/projects.ts`

La aplicación usa renderizado estático de Astro y rutas dinámicas para páginas de proyectos.

## Comandos Habituales

```bash
npm install
npm run dev
npm run build
npm run preview
```

- `npm install`: instala dependencias.
- `npm run dev`: levanta el servidor local de desarrollo.
- `npm run build`: ejecuta `astro check` y genera la build estática.
- `npm run preview`: previsualiza la build generada.

## Estructura Principal

- `src/pages`: páginas Astro.
  - `index.astro`: home del portfolio.
  - `projects/[slug].astro`: páginas individuales de proyectos.
- `src/components`: componentes reutilizables.
- `src/components/icons`: iconos locales en formato Astro/SVG.
- `src/layouts`: layout base.
- `src/data`: datos estructurados, especialmente proyectos.
- `public`: imágenes y assets servidos desde la raíz pública.

## Reglas De Diseño

- Mantener la estética actual del portfolio.
- No cambiar header, footer o layout general salvo petición explícita.
- Usar tarjetas, bordes, sombras y radios coherentes con lo existente.
- Mantener modo oscuro en cualquier componente nuevo o modificado.
- Evitar estilos visuales que rompan la línea actual.
- Priorizar layouts limpios, sobrios y profesionales.
- No introducir animaciones o efectos llamativos sin necesidad.

## Colores Y Estilo Visual

La paleta actual usa principalmente Tailwind:

- Fondos claros: `bg-gray-50`, `bg-white`, `bg-white/60`, `bg-gray-100`.
- Fondos oscuros: `dark:bg-gray-950`, `dark:bg-gray-900`, `dark:bg-gray-900/50`, `dark:bg-gray-800`.
- Texto claro: `text-gray-700`, `text-gray-800`, `text-gray-900`, `text-zinc-800/90`.
- Texto oscuro: `dark:text-gray-300`, `dark:text-gray-100`, `dark:text-white`, `dark:text-zinc-200/90`.
- Bordes: `border-gray-200`, `border-gray-300`, `dark:border-gray-800`, `dark:border-gray-700`.
- Acentos: `text-yellow-400`, `text-yellow-500`, `dark:text-yellow-100`, `bg-yellow-400`, `border-yellow-500`.
- Hover principal: `hover:bg-gray-900 hover:text-white`, `dark:hover:bg-gray-100 dark:hover:text-black`.
- Badge de disponibilidad: `bg-green-100`, `text-green-800`, con gradiente `#51E4B8` y `#21554E`.
- Fondo global: gradiente radial claro/oscuro definido en `src/layouts/Layout.astro`.

No inventar paletas nuevas. Si hace falta un color nuevo, debe justificar su uso y encajar con esta base.

## Tipografía

- Fuente principal: `Onest Variable`.
- Se importa en `src/layouts/Layout.astro` desde `@fontsource-variable/onest`.
- Se aplica globalmente en `html` con `"Onest Variable", system-ui, sans-serif`.

No cambiar la fuente salvo petición explícita.

## Responsive

Todo cambio debe pensarse para:

- móvil
- tablet
- escritorio

Reglas:

- Usar `flex-wrap` en badges, botones y grupos de enlaces.
- Evitar scroll horizontal.
- No usar anchos fijos que rompan móvil.
- Preferir `w-full`, `max-w-*`, `grid`, `flex-col`, `md:flex-row`.
- Las imágenes deben mantener proporción con `object-cover`, `object-top` o `h-auto` según contexto.
- Los textos largos no deben romper tarjetas ni botones.
- Si se afirma revisión responsive visual, debe haberse comprobado realmente en navegador.
- Si solo se revisó por código o build, indicarlo claramente.

## Proyectos

- Mantener los proyectos centralizados en `src/data/projects.ts`.
- No escribir proyectos directamente dentro de componentes.
- Cada proyecto debe tener, como mínimo:
  - `slug`
  - `title`
  - `shortDescription`
  - `description`
  - `technologies`
  - `mainTechnologies`
  - `image`
  - `demoUrl`
  - `githubUrl`
- Usar `demoUrl: null` si no existe una demo pública real.
- No usar URLs `localhost` como demo.
- Las páginas individuales se generan desde `src/pages/projects/[slug].astro`.

## Badges De Tecnologías

- Usar siempre `src/components/ProjectTechBadge.astro`.
- Mantener icono + color asociado a cada tecnología.
- Usar un mapa estático de clases Tailwind.
- No usar clases dinámicas tipo `bg-${color}`, `text-${color}` o `border-${color}`.
- Si falta un icono concreto, usar un icono genérico limpio sin romper el diseño.
- Añadir iconos locales en `src/components/icons` solo cuando aporte claridad y no requiera dependencias nuevas.

## Reglas De Código

- Mantener componentes pequeños y reutilizables.
- Evitar duplicación.
- Evitar código comentado antiguo o heredado del template.
- Evitar dependencias nuevas si no son necesarias.
- No tocar contenido no relacionado con la tarea.
- No borrar assets o componentes sin comprobar referencias por búsqueda global.
- Si hay duda sobre un archivo, marcarlo como "revisar manualmente" antes de eliminarlo.

## Verificación Obligatoria

Antes de cerrar cualquier cambio:

```bash
npm run build
```

Además, revisar:

- home: `http://localhost:4321/`
- proyecto principal: `http://localhost:4321/projects/skillmatch-ai`
- proyecto SocialMediaDashboard: `http://localhost:4321/projects/social-media-dashboard`

Comprobar también:

- que no aparecen referencias antiguas del template;
- que no se han añadido demos falsas o localhost;
- que el responsive fue revisado visualmente o indicar que solo fue revisado por código.

## Respuesta Esperada Tras Cada Cambio

Después de cada cambio, informar:

- archivos creados;
- archivos modificados;
- cambios realizados;
- resultado de `npm run build`;
- URLs que deben revisarse;
- riesgos o puntos pendientes.
