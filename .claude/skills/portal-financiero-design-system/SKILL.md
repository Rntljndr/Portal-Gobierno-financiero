---
name: portal-financiero-design-system
description: >-
  Sistema de diseño oficial del Portal Financiero / Portal de Gobierno Financiero (SIP/PMO)
  de Cencosud, extraído del archivo Penpot fuente. USAR SIEMPRE que se genere, revise o
  corrija código de UI (HTML, CSS, React, prototipos, dashboards, portales) para el Portal
  Financiero, SIP/PMO, gobierno financiero, o cualquier vista relacionada — aunque el usuario
  no mencione "sistema de diseño". También usar para handoff diseño→desarrollo, auditorías de
  consistencia visual, QA de UI contra el diseño original, creación de nuevos componentes o
  vistas, y para responder preguntas sobre colores, tipografía, botones, tags, tablas o
  cualquier componente del portal. Si el usuario pide "un botón", "una tabla", "una card" o
  cualquier pieza de UI en este contexto, este skill define exactamente cómo debe verse.
---

# Sistema de Diseño — Portal Financiero • SIP/PMO (Cencosud)

Este skill existe para eliminar las inconsistencias del handoff diseño → desarrollo. El problema típico: cada vista implementa botones, tags e inputs distintos porque el desarrollador "aproxima" los valores. Aquí están los valores exactos del archivo Penpot fuente. **No se aproxima nada: se copia.**

## Regla de oro

1. **Nunca inventar valores.** Todo color, radio, padding, tamaño de fuente y sombra ya existe como token o spec de componente. Si un valor no está aquí, buscar en `references/` antes de improvisar.
2. **Consumir tokens semánticos, no hex sueltos.** En CSS usar las variables de `assets/tokens.css` (prefijo `--pf-`). Un hex hardcodeado en el código es un bug de consistencia.
3. **Un solo sistema de botones** (ver sección Botones — hay variantes legacy en el archivo que NO deben usarse).

## Fundamentos innegociables

| Aspecto | Valor canónico |
|---|---|
| Tipografía | **Montserrat**, siempre. Base 16px |
| Color de marca / acción | `#0047B0` (blue.700) — hover `#003685` (blue.800) |
| Fondo base de página | `#F8FAFC` — superficies `#FFFFFF` |
| Radios | sm 4 / **md 8 (default)** / lg 12 / xl 16 / full 999 |
| Espaciado | escala 0, 2, 4, 8, 12, 16, 24, 32 px |
| Bordes | 1px default, 2px thick. Color default `rgba(6,20,148,0.10)` |
| Sombra estándar | `box-shadow: 0 2px 15px -3px #0006` (Shadow-M) |
| Texto primario | `#2F2F2F` — secundario `#455B85` — muted `#8A90A2` — disabled `#B0B7C9` |

## Botones — LA fuente de verdad (punto crítico de inconsistencia)

Existen exactamente **3 variantes canónicas** (Primary, Secondary, Tertiary), todas con: **Montserrat 14px weight 500, radius 8, padding 12px, gap icono-texto 8px, altura 41px, iconos 16×16**.

| Variante | Estado | Fondo | Borde | Texto/Icono |
|---|---|---|---|---|
| Primary | Default | `#0047B0` | — | `#FFFFFF` |
| Primary | Hover | `#003685` | — | `#FFFFFF` |
| Primary | Disabled | `#EDEDED` | — | `#8A90A2` |
| Secondary | Default | `#FFFFFF` | `#B6CCF7` 1px | `#0047B0` |
| Secondary | Hover | `#F0F6FF` | `#B6CCF7` 1px | `#0047B0` |
| Secondary | Disabled | `#EDEDED` | `#8A90A2` 1px | `#8A90A2` |
| Tertiary | Default | `#FFFFFF` (o transparente) | — | `#0047B0` |
| Tertiary | Hover | `#FFFFFF` | — | `#061494` |
| Tertiary | Disabled | `#FFFFFF` | — | `#8A90A2` |

CSS de referencia:

```css
.btn { font-family: Montserrat, sans-serif; font-size: 14px; font-weight: 500;
  border-radius: var(--pf-radius-md); padding: 12px; display: inline-flex;
  align-items: center; gap: 8px; height: 41px; border: none; cursor: pointer; }
.btn-primary { background: var(--pf-action-primary-bg); color: #fff; }
.btn-primary:hover { background: var(--pf-action-primary-bg-hover); }
.btn-secondary { background: #fff; color: var(--pf-text-brand);
  border: 1px solid var(--pf-action-secondary-border); }
.btn-secondary:hover { background: var(--pf-bg-surface-hover); }
.btn-tertiary { background: transparent; color: var(--pf-text-brand); }
.btn:disabled { background: var(--pf-bg-neutral); color: var(--pf-text-muted); }
```

⚠️ **Variantes PROHIBIDAS**: en el archivo Penpot existen componentes legacy `Button / * / Size=LG|MD` con **DM Sans y `#2563eb`** (azul genérico de Tailwind). Son restos de una importación y NO son parte del sistema. Si aparecen en una vista, es un error a corregir. Detectores de código no-conforme: `DM Sans`, `#2563eb`, `#3b82f6`, `#f1f5f9` como disabled, padding 12/24.

## Estados y feedback (tags, badges, alerts)

Semáforo semántico único para estados de iniciativas/proyectos:

| Estado | bg | border | texto | dot |
|---|---|---|---|---|
| Aprobado / success | `#ECFDF3` | `#ABEFC6` | `#067647` | `#10B981` |
| En curso / info | `#EFF4FF` | `#B6CCF7` | `#0047B0` | `#0047B0` |
| Desviado / warning | `#FFFBEB` | `#FCD34D` | `#B45309` | `#F59E0B` |
| Error | `#FEE8E8` | `#FCA5A5` | `#B42318` | `#B42318` |
| Cerrado | `#F1F5F9` | — | `#455B85` | — |

Tags: radius full (999), texto 12px Medium, padding horizontal 8–10px.

## Colores de gráficos (charts financieros)

OPEX `#0047B0` · CAPEX `#F97316` · Servicios `#10B981` · Licencias `#8B5CF6` · Track de barras `#EEF1FB` · Warning `#F59E0B→#FBBF24`.

## Sidebar (navegación)

Gradiente `#0047B0 → #003685`. Item activo `#1E47B8`; hover `rgba(255,255,255,0.08)`; texto item `rgba(255,255,255,0.75)`, activo `#FFFFFF`; label de sección `rgba(255,255,255,0.45)`; divisores `rgba(255,255,255,0.10)`.

## Tablas

Bordes de tabla `#F1F3F8` (fuerte: `#E4EAF6`). Headers: 12px Medium `#455B85`. Celdas: 14px Regular `#2F2F2F`. Cifras financieras: alineadas a la derecha; positivo `#067647`, negativo `#B42318`, muted `#8A90A2`.

## Flujo de trabajo al generar o revisar UI

1. **Antes de escribir código**: leer `references/components.md` para el componente en cuestión (specs exactas de las 53 familias: inputs, selects, modals, KPI cards, progress bars, tabs, etc.).
2. **Incluir `assets/tokens.css`** en el proyecto y consumir variables `--pf-*`.
3. **Al revisar código existente (auditoría/QA)**, buscar red flags: fuentes ≠ Montserrat, hex que no están en `references/tokens.md`, radios ≠ {4,8,12,16,999}, paddings fuera de la escala de espaciado, botones con especificaciones distintas entre vistas.
4. **Al terminar**, correr el checklist de handoff:
   - [ ] Cero hex hardcodeados (todo vía `--pf-*`)
   - [ ] Una sola definición de `.btn-*` reutilizada en todas las vistas
   - [ ] Tipografía 100% Montserrat con tamaños de la escala
   - [ ] Estados (success/info/warning/error) usan la tabla de feedback, no colores ad-hoc
   - [ ] Radius y espaciado dentro de las escalas
   - [ ] Sin rastros del sistema legacy (DM Sans / #2563eb)

## Referencias del skill

- `references/tokens.md` — todos los tokens (primitivos + semánticos) con valores resueltos. Leer cuando se necesite un color/valor que no esté en este documento.
- `references/components.md` — especificaciones automáticas de las 53 familias de componentes (tamaño, fill, borde, radius, padding, gap, tipografía por variante). Leer SIEMPRE antes de implementar un componente concreto.
- `assets/tokens.css` — variables CSS listas para copiar al proyecto.
