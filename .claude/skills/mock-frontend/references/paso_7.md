# Paso 7 — Export Standalone para Publicar (opcional)

Paso opcional: se ofrece cuando el paso 5 está completo, nunca se fuerza — se ejecuta solo si la persona lo pide. Genera una salida ADICIONAL pensada para subir a una plataforma de publicación de prototipos (ej. Gamma); el proyecto de desarrollo sigue intacto y sigue corriendo con `pnpm dev` como siempre.

## Contenido
- Qué genera
- Cambios de una sola vez
- Verificación
- Formato alternativo: zip

## Qué genera

Un build separado, con su propia configuración de Vite, que no toca `vite.config.ts` ni el router que usa el proyecto en desarrollo. Dos formatos posibles:
1. **Un solo archivo `.html` autocontenido** (preferido) — todo el CSS/JS embebido, se puede abrir con doble clic y arrastrar directo a la zona de carga.
2. **Un `.zip` del build normal**, con `index.html` en la raíz del comprimido — alternativa si el archivo único da problemas (ver [Formato alternativo](#formato-alternativo-zip)).

## Cambios de una sola vez

### 1. Config de build separada

`vite.config.export.ts`, no `vite.config.ts`:
```ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  base: './', // rutas relativas: sin esto, /assets/x.js da 404 fuera de la raíz del dominio
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    outDir: 'export',
    emptyOutDir: true,
  },
})
```
Instalar la dependencia nueva: `pnpm add -D vite-plugin-singlefile`.
Agregar el script en `package.json`: `"build:export": "VITE_STANDALONE_EXPORT=true vite build --config vite.config.export.ts"`.
Agregar `export` a `.gitignore`, igual que `dist` — es un build, no código fuente.

### 2. Router sin servidor

`createBrowserRouter` necesita que el servidor reescriba cualquier ruta a `index.html` — así es como funciona en Vercel. Gamma no tiene ese servidor. La versión export usa `createHashRouter` (URLs con `#/ruta`, resueltas 100% en el navegador), sin reemplazar el router que usa el proyecto en desarrollo:
```ts
// src/app/router.tsx
import { createBrowserRouter, createHashRouter } from 'react-router'

const createRouter = import.meta.env.VITE_STANDALONE_EXPORT
  ? createHashRouter
  : createBrowserRouter

export const router = createRouter([ /* ...igual que antes... */ ])
```

### 3. Ningún asset referenciado por ruta absoluta hacia `public/`

El más difícil de detectar porque falla en silencio: la página carga bien, pero una imagen sale rota — y si la ruta se arma con una variable (ej. un toggle de tema), solo se nota al disparar ese estado puntual. Pasa en dos variantes, y las dos se detectan con el mismo chequeo: cualquier string que empiece con `/` y apunte a algo que vive en `public/`, sea fija (`src="/logo.png"`) o armada en runtime (`` `/steps/${nombre}.svg` ``) — Vite nunca reescribe strings literales, solo lo que pasa por `import`.

Barrer todo lo que hay en `public/` contra las referencias del código antes de exportar:
```bash
for f in public/*; do
  b=$(basename "$f")
  grep -rn "[\`'\"]/$b" src --include='*.tsx' --include='*.ts' --include='*.css'
done
```
Cualquier resultado hay que corregirlo igual, sea ruta fija o armada en runtime:
- Mover el archivo de `public/` a `src/assets/` — lo que está en `public/` se copia tal cual y el empaquetador nunca lo ve; lo que está en `src/assets/` sí se puede importar y queda embebido.
- Importar el asset explícitamente en vez de escribir la ruta a mano. Si hay varias variantes (ej. una por tema), elegir con un mapa para que el empaquetador detecte todas:
  ```ts
  import stepDark from '@/assets/steps/pedido-dark.svg'
  import stepLight from '@/assets/steps/pedido-light.svg'

  const stepIcons = { pedido: { dark: stepDark, light: stepLight } } as const
  const src = stepIcons[nombre][theme === 'light' ? 'light' : 'dark']
  ```

**Después de mover lo que se usa, revisar qué queda en `public/`.** Vite copia esa carpeta completa al build sin importar si algo la referencia — cualquier archivo que sobre ahí (ya migrado, o simplemente sin uso) va a aparecer como archivo suelto junto al `.html`, rompiendo el objetivo de "un solo archivo" aunque ya no lo importe nadie. Para el export de un solo archivo, `public/` debe quedar vacía (el favicon es la única excepción razonable: queda como archivo suelto al lado del `.html`, pero solo afecta el ícono de la pestaña, no el contenido de la página).

## Verificación

Esta prueba la hacés vos, nunca la persona — no le pidas que abra ni revise nada técnico. Prueba binaria antes de entregar: abrir el `.html` generado vos mismo, simulando el doble clic con el comando del sistema (`open export/index.html` en Mac; equivalente en el sistema que corresponda), **sin ningún servidor de por medio**. Si se ve bien así, se va a ver bien en Gamma; si necesita un servidor para cargar, todavía queda una ruta absoluta sin corregir (volver al punto 1).

Revisar en particular cualquier estado que cambie de imagen — el toggle de tema claro/oscuro es donde se manifiesta el punto 3. Si algo se ve mal, corregirlo y repetir la prueba antes de avisarle a la persona — ella solo se entera del resultado final, nunca del ida y vuelta.

## Formato alternativo: zip

Si el archivo único no es viable (un asset que `vite-plugin-singlefile` no puede embeber, o el bundle pesa demasiado), correr el mismo build sin `viteSingleFile()` en los plugins y comprimir la carpeta `export/` con `index.html` en la raíz del zip:
```bash
cd export && zip -r ../export.zip . && cd ..
```

## Checkpoint

Avisarle a la persona, en una frase, dónde quedó el archivo (`.html` o `.zip`) y que está listo para arrastrar a la zona de carga de Gamma — sin mencionar configuración técnica.
