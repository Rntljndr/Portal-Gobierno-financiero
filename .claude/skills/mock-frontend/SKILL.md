---
name: mock-frontend
description: Usar cuando se pide crear o continuar un mock/prototipo navegable de frontend puro (sin backend real) de la UI de un producto, especialmente portando desde una fuente de referencia — código legacy, un export de HTML, o un archivo de diseño. La persona que lo pide suele ser de perfil diseño, con poco o nada de conocimiento de código.
---

# Mock de Frontend

## Resumen

Proceso guiado de 5 pasos, más una arquitectura de referencia, para construir un SPA mock de diseño+frontend (React + Vite, sin backend). Carga este skill una sola vez y aplica sus decisiones sin volver a derivarlas ni repreguntarlas.

**Quién lo pide:** una persona de diseño con escaso conocimiento de código. Tú ejecutas el 100% de lo técnico; ella decide solo sobre producto y prioridades visuales.

## Cómo trabajar con la persona

- **Todo lo técnico lo resuelves tú.** Nunca le pidas correr comandos, leer errores, ni decidir sobre librerías o carpetas — para eso están los defaults de este skill. Si algo falla, lo depuras tú y reportas solo el resultado.
- **Anuncia cada paso antes de ejecutarlo**, en una frase simple y sin jerga: qué vas a hacer y qué va a poder ver al terminar.
- **Cada paso cierra con un checkpoint visible** — algo que se puede abrir en el navegador. En los pasos donde aún no hay nada que ver, dilo explícitamente ("todavía no se ve nada, es normal en esta etapa").
- **Las únicas preguntas que haces son de producto/diseño** (qué pantalla portar primero, si un color es de marca o de acción), planteadas como opciones concretas en lenguaje de producto, nunca como preguntas técnicas.

## Los 5 pasos

| Paso | Qué se hace | Checkpoint (qué ve la persona) | Detalle |
|---|---|---|---|
| **1. Crear el proyecto base** | Scaffold de Vite, no interactivo | Nada visual aún — avisarlo | [pasos-1-a-4-arranque.md](references/pasos-1-a-4-arranque.md) |
| **2. Hoja en blanco** | Borrar el contenido demo del template | Nada visual aún | [pasos-1-a-4-arranque.md](references/pasos-1-a-4-arranque.md) |
| **3. Arquitectura + stack** | Árbol de carpetas, tokens, router, i18n | Página vacía sirviendo en el navegador | [arquitectura-de-carpetas.md](references/arquitectura-de-carpetas.md) + [stack-tecnologico.md](references/stack-tecnologico.md) |
| **4. Gate de sala limpia** | Verificar typecheck + build + dev server ANTES de abrir la referencia | Confirmación de que la base funciona | [pasos-1-a-4-arranque.md](references/pasos-1-a-4-arranque.md) |
| **5. Portar el contenido** | Tiers 0→3, pantalla por pantalla, con feedback visual entre unidades | Cada pantalla nueva, en el navegador | [paso-5-portar-contenido.md](references/paso-5-portar-contenido.md) |

Proyectos que ya se armaron con este skill entran directo al paso 5; el progreso se lee del propio repo (páginas ya portadas vs. inventario de la referencia), no de la memoria.

## Reglas duras

1. **Sala limpia:** no abrir el proyecto de referencia hasta que el paso 4 pase. Después del gate se usa como fuente de contenido y como evidencia de uso (conteos de reuso del paso 5), pero su estructura de carpetas y su stack nunca se copian.
2. **Dirección de dependencias entre carpetas:** las reglas "nunca" de [arquitectura-de-carpetas.md](references/arquitectura-de-carpetas.md) son límites duros, no defaults.
3. **Defaults del stack sin repreguntar:** [stack-tecnologico.md](references/stack-tecnologico.md) responde las preguntas de arranque. Si una restricción real del proyecto choca con un default, decides tú el desvío y lo avisas en lenguaje simple — nunca le trasladas la decisión técnica a la persona.

## Qué garantiza esta arquitectura

- **Consistencia visual** — tokens semánticos + CVA impiden colores/espaciados fuera de la paleta aprobada
- **Accesibilidad** — Radix resuelve foco, teclado y ARIA por primitiva
- **Rebranding/dark mode barato** — cambiar de marca es tocar solo `tokens.css`
- **Contrato de datos estable** — `data/` simula la API futura; conectar backend real después no toca la UI
- **Onboarding** — la tabla de carpetas y reglas funciona como documentación viva para gente nueva
