# Theme DevExp

Sistema visual independiente. Este documento es **el insumo para construir pantallas nuevas** con esta identidad: landings, dashboards, vistas mobile o desktop, en cualquier producto que lo adopte.

La implementación de referencia vive en `src/shared/styles/tokens.css` y en los componentes de `src/shared/ui/`. Si algo no coincide con el código, **manda el código** — este documento lo describe, no lo reemplaza.

---

## 1. La regla que ordena todo: dos superficies

Antes de elegir un solo color hay que responder **en qué superficie estás**. El theme tiene dos capas de marca deliberadas, y mezclarlas es el error más caro.

| | **Marketing** (landing, portadas) | **Producto** (dashboard, app) |
|---|---|---|
| Acento | Degradado `teal → cyan → blue` | Verde sólido `--primary` |
| Dónde se usa | Títulos hero, logo, glows de fondo | Botones, estados, foco, énfasis |
| Sensación | Expresiva, editorial | Sobria, funcional |

**El degradado nunca entra al dashboard. El verde nunca es el acento de un hero de marketing.**

Una excepción única y explícita: el degradado puede aparecer como **línea de 2px** en el borde superior de una tarjeta destacada dentro del producto, como firma de marca. Nada más.

---

## 2. Color

### Usa los tokens semánticos, no los crudos

Los colores crudos (`--color-devexp-*`) existen para definir el sistema. **En una pantalla se usan los semánticos**, porque son los que cambian solos entre tema claro y oscuro.

| Token semántico | Para qué | Oscuro | Claro |
|---|---|---|---|
| `--background` | Fondo de página | `#060d18` | `#eef1f5` |
| `--foreground` | Texto principal | `#ffffff` | `#0b1220` |
| `--muted-foreground` | Texto secundario, ayudas, metadatos | `#7a94ab` | `#5b6b7c` |
| `--muted` | Fondo sutil: hover, chips, campos | `blanco 5%` | `negro 6%` |
| `--border` | Todo borde y separador | `blanco 9%` | `negro 12%` |
| `--primary` | Acción principal, estado activo | `#1d9e75` | igual |
| `--ring` | Anillo de foco de teclado | `#1d9e75` | igual |

### Colores de estado

| Token | Valor | Uso |
|---|---|---|
| `--success` | `#34d399` | En línea, completado, confirmación |
| `--destructive` | `#fb7185` | Eliminar, error, detenido |
| `--warning` | `#fbbf24` | Advertencia, pendiente |
| `--color-devexp-violet` | `#378add` | Informativo, categoría neutra |

Los estados llevan **fondo al 10% y borde al 30%** de su color, nunca relleno sólido salvo en un botón de acción.

### Acento de marketing

```
--color-brand-teal  #2dd4bf
--color-brand-cyan  #20b8d8
--color-brand-blue  #1b6ef3
```

Degradado listo para usar: `--hero-title-gradient`. En tema claro **se invierte la dirección y se oscurece**, porque el degradado original no contrasta sobre fondo gris claro.

### Reglas duras de color

- **Nunca escribas un hexadecimal en un componente.** Si necesitas un color de marca, usa `var(--color-brand-*)`. Esto salió de la auditoría: había literales `#2dd4bf` repetidos en varios archivos.
- Para opacidades sobre un token, usa `color-mix()` o la sintaxis `bg-primary/10`, no un hex nuevo.
- El fondo `#060d18` no es negro: es azul muy oscuro. Un negro puro al lado se ve sucio.

---

## 3. Tipografía

Tres familias, cada una con un trabajo. **No se intercambian.**

| Familia | Token | Para qué |
|---|---|---|
| **Space Grotesk** | `--font-heading` | Títulos y números grandes. Nunca para texto corrido. |
| **Inter** | `--font-sans` | Todo el texto de interfaz: párrafos, botones, etiquetas. |
| **JetBrains Mono** | `--font-mono` | Datos técnicos: URLs, IDs, rutas, badges, versiones, fechas de sistema. |

La monoespaciada es una **señal semántica**: dice "esto es un dato, no una frase". Si lo puede leer una persona como oración, no va en mono.

### Escala real en uso

| Tamaño | Dónde |
|---|---|
| `text-xs` (12px) | Badges, metadatos, etiquetas. **El más usado.** |
| `text-sm` (14px) | Texto de interfaz por defecto |
| `text-[15px]` / `text-base` | Párrafos de lectura |
| `text-lg` – `text-xl` | Títulos de sección |
| `text-2xl` – `text-4xl` | Títulos de página y hero |

Títulos: interlineado ajustado (`leading-tight`) y `letter-spacing` negativo (`tracking-tight`). Texto corrido: interlineado holgado (`leading-relaxed`).

En mobile los títulos de hero bajan a **28px** — se probó y por encima de eso rompen en palabras sueltas.

---

## 4. Espaciado

Escala de 4px. La que realmente se usa:

| Valor | Uso típico |
|---|---|
| `gap-1` / `gap-1.5` | Ícono + texto dentro de un control |
| `gap-2` | **El más común.** Elementos relacionados en fila |
| `gap-3` / `gap-4` | Bloques dentro de una tarjeta |
| `gap-6` | Secciones de una pantalla |
| `py-24` | Respiro vertical entre secciones de landing |

Padding interno: `px-3 py-2` en controles chicos, `p-4` a `p-6` en tarjetas, `px-4 py-6` en el contenido de página (`lg:px-10 lg:py-8` en desktop).

---

## 5. Radios

| Token | Valor | Cuándo |
|---|---|---|
| `rounded-md` | 6px | Badges, chips, campos chicos |
| `rounded-lg` | 8px | **Botones, inputs, filas.** El más usado. |
| `rounded-xl` | 12px | Tarjetas, contenedores |
| `rounded-2xl` | 16px | Bloques destacados, modales |
| `rounded-full` | — | Avatares, puntos de estado, pastillas |

Regla: **el radio crece con el tamaño del elemento.** Un botón de 32px con radio de 16px se ve inflado.

Si necesitas un radio fuera de la escala, **defínelo como token con un comentario que explique por qué**, no lo escribas suelto. Precedente: `--radius-brand-mark: 7px`, que es una excepción del isotipo.

---

## 6. Sombras y elevación

```
--shadow-card        0 40px 100px rgb(0 0 0 / 75%)     tarjeta flotante sobre fondo oscuro
--shadow-modal       0 24px 60px  rgb(0 0 0 / 50%)     diálogos
--shadow-card-hover  0 8px 24px   primary 15%          hover con tinte verde
```

En superficies oscuras **la elevación se comunica con borde y fondo, no con sombra**. Una tarjeta se distingue por `border` + fondo `blanco 3.5%`; la sombra se reserva para lo que realmente flota sobre el resto.

---

## 7. Movimiento

- Curva de la casa: `--ease-spring` → `cubic-bezier(0.2, 0.9, 0.3, 1.2)`. Tiene rebote leve: sirve para elementos que **aparecen**, no para cambios de color.
- Transiciones de estado (hover, foco): 150–200 ms, curva estándar.
- Entradas y despliegues: 300–600 ms con `--ease-spring`.
- Hover de botón: `translate-y-[-1px]`. Sutil, nunca escala.

**Toda animación decorativa va dentro de `@media (prefers-reduced-motion: no-preference)`.** No es opcional: el sistema ya lo respeta y romperlo es una regresión de accesibilidad.

---

## 8. Accesibilidad

El foco de teclado es **parte del theme, no un extra**:

```css
:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
}
```

Se agregó deliberadamente porque el sistema de referencia no lo tenía. **No lo quites para "limpiar" una pantalla.**

Además:
- Contraste mínimo AA sobre `--background` en ambos temas.
- Los íconos que comunican estado llevan texto o `aria-label`; nunca color solo.
- Un enlace que abre pestaña nueva lo indica con ícono y `title`.

---

## 9. Componentes base

### Botón

Tres variantes, dos tamaños. **Todo botón sale de este componente** — no se estiliza uno a mano.

| Variante | Aspecto |
|---|---|
| `primary` | Relleno verde, texto blanco |
| `outline` | Borde, transparente, texto que vira a verde en hover |
| `ghost` | Sin borde, fondo `muted` en hover |

| Tamaño | Alto |
|---|---|
| `md` | 32px — el de interfaz |
| `lg` | 48px — CTA de landing |

Base: `rounded-lg`, `gap-1.5`, peso medio, `hover:-translate-y-px`, deshabilitado al 70% de opacidad.

> Esto salió de la auditoría: había **tres alturas distintas de botón para la misma acción**. Si necesitas un tamaño nuevo, agrégalo como variante, no como clase suelta.

### Tarjeta

`rounded-xl border border-border p-5`. Sin sombra por defecto.

### Badge

`rounded-md px-2 py-0.5 text-xs font-mono`. Variantes: `default` (neutro), `primary`, `success`. Siempre monoespaciada — es un dato.

### Campos

`rounded-md border border-border`, fondo transparente, `px-3 py-2`, `text-sm`. En foco: `border-primary`, sin `outline` propio (lo pone `:focus-visible`).

### Diálogo

Overlay negro al 60%. Contenedor centrado, `max-w-md`, `rounded-xl`, `p-6`, `--shadow-modal`. Cerrar con **X arriba a la derecha**, con `aria-label`.

Construidos sobre **Radix UI**: aporta foco atrapado, cierre con Esc y roles ARIA. No reimplementes un modal a mano.

---

## 10. Iconografía

**lucide-react**, sin excepciones. Nunca glifos Unicode (`⚛`, `◉`): la auditoría encontró uno que directamente no se dibujaba.

| Tamaño | Uso |
|---|---|
| `size-3` (12px) | Dentro de badges |
| `size-4` (16px) | **El estándar.** Botones, filas, navegación |
| `size-5` (20px) | Encabezados de sección |
| `size-9` (36px) | Contenedor de ícono con fondo |

Trazo por defecto (2px), heredan `currentColor`, y decorativos siempre con `aria-hidden`.

---

## 11. Layout

### Dashboard

```
┌────────────┬──────────────────────────────┐
│            │  Topbar  64px, sticky, borde │
│  Sidebar   ├──────────────────────────────┤
│  240px     │                              │
│            │  Contenido                   │
│  oculto    │  px-4 py-6                   │
│  en mobile │  lg:px-10 lg:py-8            │
└────────────┴──────────────────────────────┘
```

- Sidebar `w-60` (240px), mismo fondo que la página, separada por borde. Ítem activo: fondo `sidebar-accent` + texto verde.
- Topbar `h-16`, `sticky top-0`, con borde inferior.
- El contenido es la única zona con scroll.
- **En mobile la sidebar se reemplaza por una capa a pantalla completa**, no se colapsa a íconos.

### Landing

- Secciones de ancho completo con contenido centrado y máximo de ancho.
- `py-24` entre secciones.
- Fondo animado en canvas solo en el hero.
- **Alterna el fondo entre secciones** (`bg-muted/40` con bordes horizontales) para romper la monotonía. Salió de la auditoría: todo plano se lee como una sola masa.
- La navegación marca la sección visible durante el scroll.

### Contenido de lectura

Máximo `62ch` para párrafos largos. Tablas y bloques de datos van a ancho completo.

---

## 12. Responsive

| Breakpoint | Ancho | Uso real |
|---|---|---|
| `sm` | 640px | **El principal.** Mobile → tablet |
| `lg` | 1024px | Aparece la sidebar, crece el padding |
| `3xl` | 2000px | Ensancha el contenido en pantallas ultra anchas |

Se diseña **mobile primero**. Los breakpoints agregan, no quitan.

En mobile: controles a ancho completo, títulos más chicos, y nada de scroll horizontal — si una fila no cabe, se apila o se oculta el scrollbar con `.scrollbar-hide`.

---

## 13. Tema claro

Se activa con `[data-theme="light"]` en el elemento raíz. **No es un theme aparte**: solo redefine los tokens semánticos.

Al construir algo nuevo, la prueba es simple: **cambia el tema y míralo**. Si algo se rompe, es porque hay un color escrito a mano en vez de un token.

Ojo con el fondo claro: es `#eef1f5`, un gris azulado, no blanco puro. Un `#ffffff` al lado se ve como un parche.

---

## 14. Errores a evitar

Estos salieron de una auditoría real sobre este theme. Los once hallazgos se corrigieron; estas son las reglas que quedaron:

1. Hexadecimales sueltos en componentes → siempre tokens.
2. Varias alturas de botón para la misma acción → una sola variante.
3. Glifos Unicode como íconos → lucide.
4. Radios arbitrarios → escala, o token con comentario.
5. Secciones de landing todas iguales → alternar fondo.
6. Enlace que abre pestaña nueva sin avisar → ícono + `title`.
7. Navegación que no indica dónde estás al hacer scroll.
8. Tomar prestado un patrón visual reconocible para comunicar otra cosa. Un caso real: una sección con forma de tabla de precios —tres tarjetas, una destacada, checklist— que en realidad describía etapas de madurez. **El patrón pesa más que el contenido**: la gente lee "elige un plan" antes de leer el texto. Si el patrón no corresponde, cámbialo (ahí fue una línea de tiempo).

---

## 15. Para empezar una pantalla nueva

1. **¿Marketing o producto?** Define el acento (degradado o verde).
2. **¿Mobile o desktop primero?** Mobile primero, siempre.
3. Arma la estructura con `background`, `border` y `muted`. Nada de color todavía.
4. Aplica tipografía: Space Grotesk en títulos, Inter en texto, mono en datos.
5. Recién ahí agrega el acento, y solo donde hay una acción o un estado.
6. Prueba el tema claro.
7. Recorre la pantalla con Tab y confirma que se ve el foco.
