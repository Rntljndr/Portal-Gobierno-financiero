# Arranque del Proyecto (Pasos 1 a 4)

Solo para proyectos nuevos. Un proyecto ya armado con este skill entra directo al paso 5 ([paso_5.md](paso_5.md)).

## Paso 1 — Crear el proyecto base (scaffold)

Generar un proyecto simple y funcional usando el flag no interactivo del propio framework en vez de responder prompts a mano — mantiene el paso scripteable y repetible.

**Antes de correrlo, proteger lo que ya existe en el directorio.** `--overwrite` es lo que permite que el scaffold corra sin preguntar cuando el directorio no está vacío, pero lo hace borrando TODO su contenido salvo `.git` (así lo implementa `create-vite`) — incluida `.claude/skills/`, donde vive este mismo skill, e `input/`, el material de referencia que aportó la persona. Sacar esas dos carpetas del camino antes de scaffoldear y devolverlas después, en el mismo bloque:
```bash
mkdir -p /tmp/mock-frontend-setup
[ -d .claude ] && mv .claude /tmp/mock-frontend-setup/
[ -d input ] && mv input /tmp/mock-frontend-setup/

pnpm create vite . --template react-ts --overwrite --no-interactive

[ -d /tmp/mock-frontend-setup/.claude ] && mv /tmp/mock-frontend-setup/.claude .
[ -d /tmp/mock-frontend-setup/input ] && mv /tmp/mock-frontend-setup/input .
rm -rf /tmp/mock-frontend-setup
```

**Checkpoint:** el proyecto existe, `.claude/` e `input/` siguen en su lugar, y `pnpm install` termina sin errores. Nada visual aún — avisarle a la persona que es normal.

## Paso 2 — Hoja en blanco

Borrar el contenido de demo del template (counter de ejemplo, logo, CSS) de un solo golpe, no archivo por archivo:
```bash
find src -mindepth 1 ! -name 'main.tsx' -delete
```
Luego eliminar cada import que quedó colgando en el archivo de entrada (hojas de estilo, el root component viejo).

**Checkpoint:** compila/typechequea en limpio, sin restos del template. Nada visual aún.

## Paso 3 — Arquitectura + stack

1. Armar el árbol de carpetas de [arquitectura-de-carpetas.md](arquitectura-de-carpetas.md) — solo las carpetas que ya tienen contenido real, sin capas vacías "por si acaso".
2. Instalar y configurar el stack de [stack-tecnologico.md](stack-tecnologico.md) una sola vez: Tailwind + tokens, router, alias `@/`, i18n, oxlint.

**Checkpoint:** el dev server sirve una página (aunque esté vacía) en el navegador — es lo primero que la persona puede ver. Mostrárselo.

## Paso 4 — Gate de sala limpia

Verificar de punta a punta, tú mismo, antes de seguir:
- typecheck pasa
- build pasa
- el dev server sirve la página

**Regla de sala limpia:** si existe un proyecto de referencia (código viejo, HTML exportado, archivo de diseño) para el producto que se está mockeando, no abrirlo hasta que esta verificación pase. Su estructura nunca debe filtrarse a las decisiones de arquitectura — es fuente de contenido para el paso 5, no un insumo técnico.

**Checkpoint:** confirmarle a la persona, en una frase, que la base está lista y verificada, y que ahora empieza la parte visible: portar las pantallas ([paso_5.md](paso_5.md)).
