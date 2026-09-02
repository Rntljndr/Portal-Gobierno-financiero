---
name: mock-frontend
description: Usar cuando se pide crear o continuar un mock/prototipo navegable de frontend puro (sin backend real) de la UI de un producto, especialmente portando desde una fuente de referencia — código legacy, un export de HTML, o un archivo de diseño. También cuando se pide implementar los hallazgos de una auditoría generada por el skill ui-audit (carpeta ui-audits/) sobre un mock construido con este skill. La persona que lo pide suele ser de perfil diseño, con poco o nada de conocimiento de código.
---

# Mock de Frontend

## Resumen

Proceso guiado de 5 pasos obligatorios más los pasos 6 y 7, opcionales, junto a una arquitectura de referencia, para construir un SPA mock de diseño+frontend (React + Vite, sin backend). Carga este skill una sola vez y aplica sus decisiones sin volver a derivarlas ni repreguntarlas.

**Quién lo pide:** una persona de diseño con escaso conocimiento de código. Tú ejecutas el 100% de lo técnico; ella decide solo sobre producto y prioridades visuales.

## Cómo trabajar con la persona

- **Todo lo técnico lo resuelves tú.** Nunca le pidas correr comandos, leer errores, ni decidir sobre librerías o carpetas — para eso están los defaults de este skill. Si algo falla, lo depuras tú y reportas solo el resultado.
- **Anuncia cada paso antes de ejecutarlo**, en una frase simple y sin jerga: qué vas a hacer y qué va a poder ver al terminar.
- **Cada paso cierra con un checkpoint visible** — algo que se puede abrir en el navegador. En los pasos donde aún no hay nada que ver, dilo explícitamente ("todavía no se ve nada, es normal en esta etapa").
- **Las únicas preguntas que haces son de producto/diseño** (qué pantalla portar primero, si un color es de marca o de acción), planteadas como opciones concretas en lenguaje de producto, nunca como preguntas técnicas.

## Los 7 pasos (el 6 y el 7 son opcionales)

| Paso | Qué se hace | Checkpoint (qué ve la persona) | Detalle |
|---|---|---|---|
| **1. Crear el proyecto base** | Scaffold de Vite, no interactivo, protegiendo `.claude/` e `input/` del borrado | Nada visual aún — avisarlo | [paso_1-4.md](references/paso_1-4.md) |
| **2. Hoja en blanco** | Borrar el contenido demo del template | Nada visual aún | [paso_1-4.md](references/paso_1-4.md) |
| **3. Arquitectura + stack** | Árbol de carpetas, tokens, router, i18n | Página vacía sirviendo en el navegador | [arquitectura-de-carpetas.md](references/arquitectura-de-carpetas.md) + [stack-tecnologico.md](references/stack-tecnologico.md) |
| **4. Gate de sala limpia** | Verificar typecheck + build + dev server ANTES de abrir la referencia | Confirmación de que la base funciona | [paso_1-4.md](references/paso_1-4.md) |
| **5. Portar el contenido** | Tiers 0→3, pantalla por pantalla, con feedback visual entre unidades | Cada pantalla nueva, en el navegador | [paso_5.md](references/paso_5.md) |
| **6. Implementar auditorías** *(opcional)* | Usar el skill `ui-audit` (instalándolo si falta) y luego implementar los hallazgos que produjo — el análisis es de esa skill, nunca de esta | Cada mejora aplicada, en el navegador | [paso_6.md](references/paso_6.md) |
| **7. Export standalone para publicar** *(opcional)* | Generar, a pedido, un `.html` autocontenido o un `.zip` listos para subir a una plataforma de publicación de prototipos (ej. Gamma) — salida aparte, no altera el proyecto de desarrollo | El archivo exportado, verificado con doble clic sin servidor | [paso_7.md](references/paso_7.md) |

Proyectos que ya se armaron con este skill entran directo al paso 5 (o al 6, si el 5 está completo y existe una carpeta `ui-audits/`); el progreso se lee del propio repo (páginas ya portadas vs. inventario de la referencia), no de la memoria. El paso 7 se ofrece, nunca se asume, y solo tiene sentido con el paso 5 completo.

## Reglas duras

1. **Sala limpia:** no abrir el proyecto de referencia hasta que el paso 4 pase. Después del gate se usa como fuente de contenido y como evidencia de uso (conteos de reuso del paso 5), pero su estructura de carpetas y su stack nunca se copian.
2. **Dirección de dependencias entre carpetas:** las reglas "nunca" de [arquitectura-de-carpetas.md](references/arquitectura-de-carpetas.md) son límites duros, no defaults.
3. **Defaults del stack sin repreguntar:** [stack-tecnologico.md](references/stack-tecnologico.md) responde las preguntas de arranque. Si una restricción real del proyecto choca con un default, decides tú el desvío y lo avisas en lenguaje simple — nunca le trasladas la decisión técnica a la persona.
4. **El paso 6 implementa, nunca analiza:** todo análisis de auditoría es del skill `ui-audit` — qué revisa y cómo lo decide esa skill, no esta. mock-frontend solo la usa (instalándola si falta, ver [paso_6.md](references/paso_6.md)) y consume lo que produce; nunca la sustituye con análisis propio, ni siquiera parcial. Y el paso 6 solo arranca con el paso 5 al 100%.
5. **El scaffold del paso 1 nunca corre sin proteger `.claude/` e `input/` primero:** `--overwrite` borra todo el directorio salvo `.git`, incluida la carpeta donde vive este skill y el material de referencia de la persona — ver el bloque de protección en [paso_1-4.md](references/paso_1-4.md).
6. **El paso 7 nunca modifica el proyecto de desarrollo:** config de build, script y verificación son aparte (`vite.config.export.ts`, no `vite.config.ts`); el router del proyecto en desarrollo sigue siendo `createBrowserRouter` siempre.

## Qué garantiza esta arquitectura

- **Consistencia visual** — tokens semánticos + CVA impiden colores/espaciados fuera de la paleta aprobada
- **Accesibilidad** — Radix resuelve foco, teclado y ARIA por primitiva
- **Rebranding/dark mode barato** — cambiar de marca es tocar solo `tokens.css`
- **Contrato de datos estable** — `data/` simula la API futura; conectar backend real después no toca la UI
- **Onboarding** — la tabla de carpetas y reglas funciona como documentación viva para gente nueva
