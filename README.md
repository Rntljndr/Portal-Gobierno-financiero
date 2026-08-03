# Portal Gobierno Financiero — Mock de Frontend

Mock de diseño/frontend (sin backend) del Portal Gobierno Financiero, construido con React + Vite + TypeScript + Tailwind CSS.

## Pantallas

- Inicio
- Ejercicios (Mis Servicios, Drivers, Centros de costo, Banderas, Configuraciones)
- Reportería (filtros, Tablón, Consolidado en Destino USD)
- Reales
- Forecast
- Notificaciones
- Reportes
- Asistente IA (widget flotante global)

## Stack

- React 19 + Vite + TypeScript
- Tailwind CSS v4 (tokens de diseño en `src/shared/styles`)
- Radix UI (popover, dialog, slot) + class-variance-authority
- react-router v8 (modo data)

## Desarrollo

```bash
pnpm install
pnpm run dev
```

## Build

```bash
pnpm run build              # build estándar (dist/)
pnpm run build:singlefile   # HTML único autocontenido (dist-singlefile/), útil para compartir el prototipo
```

## Estructura

Arquitectura tipo Bulletproof React: `app/`, `pages/<pantalla>/components`, `shared/{ui,layout,hooks,lib,types,constants,styles}`, `data/` (fixtures que simulan la futura API).
