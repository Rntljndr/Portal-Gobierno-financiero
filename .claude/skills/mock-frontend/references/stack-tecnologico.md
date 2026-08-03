# Stack Tecnológico por Defecto

## Contenido
- Estilos y variantes
- Design tokens (dos capas, no tres)
- Colores de acento para data-viz/KPIs
- Primitivas de UI
- Ruteo
- Alias de rutas
- i18n
- Tamaño máximo de archivo y función
- Explícitamente diferido

Estas son las respuestas a las preguntas que normalmente se harían al iniciar un proyecto. Trátalas como default — aplícalas sin repreguntar. Si el proyecto tiene una restricción real que entra en conflicto con alguna (un requisito de estilos distinto, un router ya instalado y en uso, etc.), adopta la restricción existente y avísale a la persona en una frase simple qué cambia para ella — la decisión técnica la tomas tú, nunca se la trasladas.

## Estilos y variantes

Tailwind CSS (v4, `@theme` CSS-first, plugin `@tailwindcss/vite`) + `class-variance-authority` (CVA) para variantes de componentes + `clsx` y `tailwind-merge` combinados en un solo helper `cn()` en `shared/lib/utils.ts`:
```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```
Los componentes nunca mezclan `className` a mano — siempre a través de `cn()`.

## Design tokens (dos capas, no tres)

1. **Primitiva** — paleta/escala cruda, definida en `@theme` (ej. `--color-blue-600`, `--color-red-600`).
2. **Semántica** — alias con significado en `:root`, re-expuestos vía `@theme inline` para que se conviertan en utilidades de Tailwind (`bg-background`, `text-foreground`, `bg-primary`, `bg-muted`, `bg-destructive`, `bg-success`, `bg-warning`, `border-border`, `ring-ring`). Los componentes solo consumen clases semánticas, nunca valores crudos de la paleta.

Un **subgrupo semántico específico de una superficie** es legítimo cuando una región de la UI es visualmente distinta del resto de la app — ej. un sidebar oscuro necesita sus propios tokens `sidebar` / `sidebar-foreground` / `sidebar-border` / `sidebar-accent` en vez de reusar los tokens de la UI clara o hardcodear valores de slate.

Las diferencias de variante a nivel de componente (el hover de un botón, la variante de un badge) son variantes de CVA, no una tercera capa de tokens — no inventar variables CSS por componente para cosas que CVA ya expresa.

No confundir el color de marca literal de un producto con el color de acción `primary` de la UI si en el material fuente son en realidad cosas distintas (ej. el rojo de marca de un producto usado solo en acentos/flourishes de headers vs. el azul realmente usado en botones/links) — dales tokens semánticos separados (`brand` vs `primary`) en vez de fusionarlos.

## Colores de acento para data-viz/KPIs

Las tarjetas de KPI y los acentos de gráficos suelen necesitar una paleta más amplia y arbitraria que la que dan los tokens semánticos, y ahí el color no carga significado de UI (solo distingue una métrica de otra). Se mantiene como una constante TS simple, no como un token:
```ts
// shared/constants/chart-colors.ts (colores de ejemplo — reemplazar por los de la marca)
export const chartColors = { indigo: '#6366f1', emerald: '#10b981', amber: '#f59e0b', sky: '#0ea5e9', violet: '#8b5cf6' } as const
```

## Primitivas de UI

Primitivas headless de Radix UI por debajo (accesibilidad — foco, teclado, ARIA — resuelta gratis), con estilos de Tailwind + CVA encima (el patrón de shadcn/ui). Instalar el paquete de Radix de cada primitiva recién cuando se va a construir esa primitiva específica, no por adelantado.

## Ruteo

`react-router` (no el paquete legacy `react-router-dom`), **modo data**: `createBrowserRouter` desde `react-router`, `RouterProvider` desde `react-router/dom`. SPA puro — sin server rendering, sin modo framework.

## Alias de rutas

`@/` → `./src/*`, configurado en dos lugares:
- `vite.config.ts`: `resolve.alias` usando `fileURLToPath(new URL('./src', import.meta.url))`
- `tsconfig.app.json`: `"paths": { "@/*": ["./src/*"] }` — **sin `baseUrl`**, está deprecado bajo `moduleResolution: "bundler"` en TypeScript 6 y no hace falta para que `paths` resuelva.

## i18n

Listo desde el día uno aunque haya un solo idioma — todo string visible al usuario pasa por `useTranslation()`/`t(key)` desde el inicio, respaldado por un diccionario plano tipado por idioma en `i18n/locales/`. Agregar un segundo idioma después es puramente aditivo (un archivo de locale más); nunca requiere tocar los call sites. No usar una librería pesada de i18n hasta que exista un segundo idioma real que lanzar.

## Tamaño máximo de archivo y función

Ningún archivo debería crecer sin límite — es el deterioro típico de los proyectos legacy que se usan como referencia (páginas de más de 1000 líneas). Se enforce con oxlint, no solo con disciplina:
```json
// .oxlintrc.json
{
  "ignorePatterns": ["input/**"],
  "rules": {
    "max-lines": ["error", { "max": 200, "skipBlankLines": true, "skipComments": true }],
    "max-lines-per-function": ["error", { "max": 80, "skipBlankLines": true, "skipComments": true }]
  }
}
```
`ignorePatterns` excluye cualquier proyecto de referencia bajo `input/` — no es código propio, no se lintea ni se le exige este límite.

Cuando `pnpm lint` marca una función/página que se pasó del límite, la corrección es partirla, no subir el número:
- Una página que creció de más → extraer piezas a `pages/<x>/components/` (ej. una tabla completa a su propio archivo)
- Un componente de `shared/layout` que creció de más → separar en archivos hermanos dentro de la misma carpeta (ej. `topbar.tsx` pasa a componer `topbar-unit-switcher.tsx`, `topbar-notifications.tsx`, `topbar-profile-menu.tsx`), cada uno dueño de su propio estado si lo necesita

## Explícitamente diferido

- **Storybook**: no por defecto — mantener el setup liviano; los componentes se ven en las páginas que los usan. Reconsiderar solo si el equipo pide explícitamente desarrollo/QA de componentes aislado.
- **Backend/auth/persistencia**: fuera de alcance por definición — esto es un mock de diseño+frontend. Los fixtures de `data/` son todo el "backend".
