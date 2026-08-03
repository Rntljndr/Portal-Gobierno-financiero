# Portar el Contenido por Tiers (Paso 5)

## Contenido
- Los cuatro tiers
- Protocolo por unidad
- Errores comunes

Aplica una vez que la arquitectura de [arquitectura-de-carpetas.md](arquitectura-de-carpetas.md) está armada y verificada (pasos 1–4), y existe una fuente de referencia (código legacy, HTML exportado, archivo de diseño) disponible como contenido.

**Al retomar un proyecto ya empezado:** el estado vive en el propio repo, no en la memoria. Comparar lo ya portado (`src/pages/`, `shared/ui/`, el git log) contra el inventario de pantallas de la referencia; lo que falta es el backlog, ordenado por estos mismos tiers.

## Los cuatro tiers

Extraer de abajo hacia arriba en el grafo de dependencias, nunca de arriba hacia abajo:

1. **Tier 0 — Identidad visual.** Colores de marca, tipografía, espaciado. Actualizar `shared/styles/tokens.css` primero; todo lo visual depende de esto.
2. **Tier 1 — Shell.** `shared/layout` (sidebar, topbar, layout wrapper). Nada más se puede demostrar sin un lugar donde montarse. Adelantar cualquier primitiva de `shared/ui` que el shell necesite (ej. un dropdown para un menú de usuario), aunque en teoría sea de Tier 2.
3. **Tier 2 — Primitivas de `shared/ui`, priorizadas por reuso *medido*.** No adivinar qué botón/card/input importa más — correr grep sobre la referencia para contar imports reales:
   ```bash
   for c in button card badge select dialog; do
     n=$(grep -rl "components/ui/$c" src/pages 2>/dev/null | wc -l)
     echo "$n  $c"
   done | sort -rn
   ```
   Si la referencia no es código React, medir el reuso igual pero sobre lo que haya: en un export HTML, grep de tags/clases repetidas (`<button`, `class="card`, `<table`); en un archivo de diseño, inventariar qué componentes se repiten pantalla por pantalla.

   Construir primero las primitivas de mayor reuso, instalando el paquete headless de cada una a medida que se llega a ella (no todas por adelantado). Saltar primitivas sin uso real hasta que algo realmente las necesite.
4. **Tier 3 — Páginas, agrupadas por patrón estructural, no por área de negocio.** Agrupar las pantallas por forma (lista simple, tabla+filtros, formulario multi-paso, dashboard con gráficos), y portar primero la instancia *más simple* de cada patrón — se vuelve el template del resto de esa familia. Cuando la pantalla "vitrina" (la principal del producto, o la que la persona pide ver primero) también es la más compleja de su familia, esa es una tensión real (construir el template barato primero vs. mostrar primero lo importante) — exponerla y preguntar en lenguaje de producto ("¿prefieres ver primero X, que es la pantalla principal, o empezar por Y, que es más simple y sale más rápido?"), no decidir en silencio.

## Protocolo por unidad

Repetir para cada primitiva o página, sin importar el formato de la fuente (código, HTML, archivo de diseño):

1. Definir el contrato de datos (tipos) que necesita, en `data/`.
2. Poblar fixtures representativas en `data/` que calcen con ese contrato — mantenerlas libres de cualquier concepto de framework/JSX. Guardar un ícono como string-key, no como referencia a un componente: una API real nunca devolvería un componente de React.
3. Detectar qué primitivas de `shared/ui` necesita; para las que falten, instalar el paquete específico que envuelven (si es nuevo) y construirlas — quedan disponibles para toda unidad futura.
4. Componer la página/componente con primitivas + fixtures, respetando las reglas de dependencia de [arquitectura-de-carpetas.md](arquitectura-de-carpetas.md).
5. Verificar tú mismo: typecheck, renderizarlo, confirmar que no viola ninguna dirección de dependencia.
6. **Checkpoint visual:** mostrar la pantalla en el navegador y pedir feedback de diseño (¿se parece a la referencia? ¿algo se ve mal?) antes de pasar a la siguiente unidad. Los ajustes visuales chicos se hacen en el momento; los cambios de alcance se anotan y se deciden aparte.

## Errores comunes

| Error | Corrección |
|---|---|
| Portar pantallas en el orden de la fuente o por "importancia" | Ordenar por tier de dependencia en vez de eso |
| Adivinar qué primitivas se reusan más | Contar imports reales con grep sobre la referencia |
| Copiar tal cual bugs o basura de datos de la referencia | Sanitizar el contenido al portar — ids obsoletos, exports sin uso, restos de copy-paste de otros productos |
| Guardar conceptos de UI (componentes de ícono, JSX) dentro de fixtures de `data/` | La data solo tiene keys/valores; el componente que la consume mapea key → presentación |
| Elegir un orden en silencio cuando "vitrina" y "más simple de construir" no coinciden | Exponer la tensión y preguntar, en lenguaje de producto |
| Instalar todos los paquetes headless posibles por adelantado "por si acaso" | Instalar por primitiva, solo cuando se va a construir |
| Encadenar varias pantallas sin mostrar ninguna | Checkpoint visual con la persona después de cada unidad |
