# IT DS — Guía de tema

> **Archivo:** `theme-itds.md`

Especificación de diseño reutilizable para vestir cualquier portal con el look and feel del **IT DS de Cencosud** (theme **IT**, no Arcus): sistema light-first, basado en tokens, con azul como color primario y un vocabulario de componentes consistente. Este documento es la referencia a usar cuando se necesite aplicar el tema IT a un producto nuevo — no describe ningún proyecto en particular.

> **Fuente:** tokens y componentes extraídos del archivo Penpot "IT DS | Components" (audit v4, 2026-05-25) vía el skill `itds-board-composer`. Las secciones marcadas **⚠️ Propuesta a validar** cubren aspectos de implementación en código (iconografía, motion, z-index, foco) que el Design System no fija explícitamente a nivel Penpot — se proponen valores razonables y consistentes con el resto del sistema, pendientes de confirmar contra una implementación de referencia.

---

## 1. Principios del sistema

- **Light-first, basado en tokens.** Todo color, radio, sombra y tipografía sale de variables nombradas (`--color-*`, `--radius-*`, `--text-*`, `--shadow-*`), nunca de valores sueltos en componentes.
- **Un solo color primario.** `Theme` (azul, Blue.600) es el acento de marca — foco, CTA, nav activo. Los semánticos (`Info`, `Success`, `Warning`, `Alert`, `Error`, `Accent`) son roles aparte y no deben sustituir a `Theme` en elementos de marca/interactivos.
- **Cada color semántico es una escala de 12 pasos**, no un solo valor: `Default · Hover · Pressed · Filled · Disabled · Softest · Softer · Soft · Strong · Stronger · Strongest`. Los componentes siempre citan el paso exacto de la escala, nunca un hex libre.
- **Badges/Tags usan la fórmula "softest + stronger"**: fondo pálido (`*.Softest`) + texto/ícono en el paso oscuro (`*.Stronger` o `*.Strong`) de la misma familia — nunca bloque sólido con texto blanco (esa combinación se reserva para botones sólidos y avatar).
- **Los estados son variantes explícitas, no transiciones improvisadas.** Cada superficie interactiva (botón, input, sidebar item, tag) declara sus propios estados (`Default/Hover/Pressed/Disabled`, y donde aplica `Loading/Error/Success`) como componentes o variantes distintas dentro del propio Design System — la implementación en código debe respetar esos mismos estados punto por punto.
- **Radio único por defecto.** 8px (`lg`) es el radio semántico de botones, inputs y contenedores base — no usar valores fuera de la escala de §4.
- **Lo técnico/categórico va en texto compacto y bold.** Tags, badges y helper text usan pesos y tamaños pequeños de la escala tipográfica (`text-xs.Bold`, `text-xs.Medium`), nunca tamaños de body libre.

---

## 2. Color

### 2.1 Tokens por rol

| Rol en UI | Variable CSS | Token IT DS | Valor |
|---|---|---|---|
| Fondo base | `--color-screen-base` | `Screen.Base` | `#FFFFFF` |
| Fondo suave | `--color-screen-soft` | `Screen.Soft` | `#F1F5F9` |
| Fondo sutil | `--color-screen-softest` | `Screen.Softest` | `#FCF8F8` |
| Color primario | `--color-theme-primary` | `Theme.Primary` | `#2563EB` |
| Hover primario | `--color-theme-hover` | `Theme.Hover` | `#1D4ED8` |
| Pressed primario | `--color-theme-pressed` | `Theme.Pressed` | `#1E40AF` |
| Texto principal | `--color-neutral-strongest` | `Neutral.Strongest` | `#0F172A` |
| Texto secundario | `--color-neutral-default` | `Neutral.Default` | `#475569` |
| Borde / divisor | `--color-neutral-softer` | `Neutral.Softer` | `#CBD5E1` |
| Superficie tonal | `--color-tonal-default` | `Tonal.Default` | `#F1F5F9` |
| Info | `--color-info-default` | `Info.Default` | `#2563EB` |
| Éxito | `--color-success-default` | `Success.Default` | `#16A34A` |
| Advertencia | `--color-warning-default` | `Warning.Default` | `#D97706` |
| Alerta | `--color-alert-default` | `Alert.Default` | `#EA580C` |
| Error | `--color-error-default` | `Error.Default` | `#DC2626` |
| Acento secundario | `--color-accent-default` | `Accent.Default` | `#7C3AED` |
| Overlay oscuro | `--color-black-500` | `Transparent.Black.500` | `rgba(0,0,0,0.50)` |

**Regla importante:** `Theme` (azul) es para foco, nav activo y CTA — cualquier cosa "interactiva/de marca". `Info` comparte el mismo azul en el theme IT por diseño, pero conceptualmente es un rol distinto (mensajes informativos, no marca) — al construir en código, mantenerlos como variables separadas aunque hoy resuelvan al mismo hex, para no acoplar accidentalmente marca y semántica.

### 2.2 Escala semántica completa

Cada familia (`Theme`, `Info`, `Success`, `Warning`, `Alert`, `Error`, `Accent`, `Neutral`) sigue la misma estructura de 12 pasos sobre su paleta base:

| Familia | Paleta base | Default | Softest (fondo de badge) | Stronger (texto sobre badge) |
|---|---|---|---|---|
| Theme | Blue | `#2563EB` | `#DBEAFE` | `#1D4ED8` |
| Info | Blue | `#2563EB` | `#DBEAFE` | `#1D4ED8` |
| Success | Green | `#16A34A` | `#DCFCE7` | `#16803C` |
| Warning | Yellow | `#D97706` | `#FEF3C7` | `#B45309` |
| Alert | Orange | `#EA580C` | `#FFEDD5` | `#C2410C` |
| Error | Red | `#DC2626` | `#FEE2E2` | `#B91C1C` |
| Accent | Purple | `#7C3AED` | `#EDE9FE` | `#6D28D9` |
| Neutral | Lynch/Slate | `#475569` | `#F1F5F9` | `#334155` |

**Ejemplo de aplicación (Tag/estado):** Entregado → bg `#DCFCE7` / texto+ícono `#16803C` · Pendiente → bg `#FEF3C7` / texto+ícono `#B45309` · Cancelado → bg `#FEE2E2` / texto+ícono `#B91C1C` · Inactivo → bg `#F1F5F9` / texto+ícono `#475569`. Un Tag de estado nunca queda en gris por defecto — siempre usar el color semántico correspondiente.

**Marcas Cencosud (`Brand.*`):** paleta aparte (Paris `#006DFF`, Jumbo `#19AD49`, Easy `#DF1122`, etc.) reservada para superficies que necesiten identificar una cadena específica — no se usan como acento del tema base.

### 2.3 Contraste

Medido sobre los pares que efectivamente usa el sistema (WCAG AA = 4.5:1 en texto normal):

| Combinación | Ratio | AA |
|---|---|---|
| `Theme.Primary` (#2563EB) + texto blanco | 5.17:1 | ✅ |
| `Error.Default` (#DC2626) + texto blanco | 4.83:1 | ✅ |
| `Accent.Default` (#7C3AED) + texto blanco | 5.70:1 | ✅ |
| `Success.Default` (#16A34A) + texto blanco | 3.30:1 | ❌ |
| `Warning.Default` (#D97706) + texto blanco | 3.19:1 | ❌ |
| Badge Success: bg `#DCFCE7` + texto `#16803C` | 4.57:1 | ✅ |
| Badge Warning: bg `#FEF3C7` + texto `#B45309` | 4.51:1 | ✅ |
| Badge Error: bg `#FEE2E2` + texto `#B91C1C` | 5.30:1 | ✅ |
| Badge Theme: bg `#DBEAFE` + texto `#1D4ED8` | 5.49:1 | ✅ |
| `Neutral.Default` (texto secundario) sobre blanco | 7.58:1 | ✅ |
| `Neutral.Strongest` (texto principal) sobre blanco | 17.85:1 | ✅ |

**Lectura:** `Success` y `Warning` **no** pasan AA como fondo sólido con texto blanco — coherente con que el catálogo de `Button` solo define variantes sólidas para `Theme` y `Danger` (rojo), nunca "Success" o "Warning" como botón sólido. Esos dos colores se usan siempre en su combinación segura: fondo *Softest* + texto *Stronger* (badges, tags, alerts) — nunca como bloque sólido de alto contraste. Al portar el tema a código, respetar esta restricción: no crear un botón "success" sólido con texto blanco.

---

## 3. Tipografía

Una sola familia con roles fijos:

| Rol | Familia | Uso |
|---|---|---|
| UI / cuerpo / encabezados | **DM Sans** | Toda la interfaz — párrafos, botones, nav, inputs, títulos |

Line-height: **1.25** en todos los niveles. Pesos usados: 400 (Regular) · 500 (Medium) · 700 (Bold).

### Escala jerárquica de uso

| Rol | Token | px / peso | Uso típico |
|---|---|---|---|
| H1 | `text-2xl.Bold` | 24 / 700 | Título principal de pantalla (cuando no hay PageHeader) |
| H2 | `text-xl.Bold` | 20 / 700 | Título de sección dentro del body |
| H3 | `text-xl.Medium` | 20 / 500 | Subtítulo de H2, nombre de card |
| H4 | `text-base.Bold` | 16 / 700 | Label de grupo de campos, heading de alert inline |
| Body / nav | `text-base.Medium` | 16 / 500 | Navegación, labels de input, breadcrumb, sidebar |
| Párrafo | `text-base.Regular` | 16 / 400 | Descripción larga, cuerpo de modal/card |
| Secundario | `text-sm.Medium` | 14 / 500 | Nota aclaratoria, metadata, texto de apoyo |
| Caption | `text-sm.Regular` | 14 / 400 | Descripción de stepper, texto terciario |
| Tag / badge | `text-xs.Bold` | 12 / 700 | Texto dentro de tags, chips, badges |
| Helper | `text-xs.Medium` | 12 / 500 | Helper text de inputs, contadores |
| Footer / legal | `text-xs.Regular` | 12 / 400 | Copyright, notas legales, texto de pie |

**Escala completa de tamaños disponible** (por si se necesita un nivel fuera de la jerarquía anterior, p. ej. hero de landing): `10 · 12 · 14 · 16 · 18 · 20 · 24 · 30 · 36 · 48 · 60 · 72 · 96` px (tokens `text-xxs` → `text-8xl`). Los títulos desde `text-6xl` (60px) requieren tracking negativo (`letter-spacing` hasta `-4.8px` en `text-8xl`) — ver tabla de letter-spacing en los tokens primitivos.

---

## 4. Radios, sombras, espaciado

### Escala de radios

`0 · 4 · 8 · 12 · 16 · 24 · 26 · 999(full)` px — no usar valores fuera de esta escala.

| Token | Valor | Uso semántico |
|---|---|---|
| `none` | 0px | Sin redondeo |
| `sm` | 4px | Badge compacto |
| `lg` | **8px** | **Default del sistema** — botón, input, card, box |
| `xl` | 12px | Contenedores destacados |
| `2xl` | 16px | Modal, panel grande |
| `3xl` | 24px | Superficies hero |
| `full` | 999px | Avatar, pill, chip cerrado |

Los tokens semánticos `Button`, `Border-Input`, `Box` y `Radius` apuntan todos a `lg` = **8px** — es el radio base de casi todo el sistema en el theme IT.

### Sombras

| Token | Valor resuelto | Uso |
|---|---|---|
| `Shadow-Down.S` | `0 1px 3px 0 rgba(0,0,0,0.20)` | Elevación mínima (card en reposo, dropdown) |
| `Shadow-Down.M` | `0 1px 8px -1px rgba(0,0,0,0.30)` | Elevación media (card en hover, popover) |
| `Shadow-Down.L` | `0 2px 15px -3px rgba(0,0,0,0.40)` | Elevación alta (modal, drawer, menú flotante) |
| `Shadow-Up.S/M/L` | mismos valores, offsetY negativo | Superficies ancladas al borde inferior (bottom sheet, bottom navigation) |

### Espaciado

Escala base en px: `0 · 2 · 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128` (tokens `spacing.0` → `spacing.32`), más una escala negativa (`-4 · -8 · -12 · -16 · -24`) para overlaps y pulls (ej. `AvatarGroup`).

| Uso de referencia | Spacing |
|---|---|
| Padding interno de input (`Input` semántico) | 12px (`spacing.3`) |
| Gap entre secciones de una pantalla | 16px (`spacing.4`) |
| Gap entre componentes dentro del body | 24px (`spacing.6`) |
| Icon box / avatar grande | 64px (`spacing.16`) |

---

## 5. Iconografía

**⚠️ Propuesta a validar** — el Design System no nombra explícitamente una librería de íconos en los archivos de referencia, pero la nomenclatura de las instancias (`navigation/expand_more`, `dashboard_customize`, `icon/close`, `icon/notifications` — categoría + snake_case) coincide con la convención de **Material Symbols/Icons de Google**. Se propone:

- **Librería:** Material Symbols (outlined), snake_case por categoría.
- **Tamaño estándar:** 20–24px según el tamaño del componente anfitrión (`ActionIcon`/`IconButton` tienen tamaños LG/MD/SM propios).
- **Color:** hereda del texto/ícono del contenedor (`currentColor` en implementación web). Inactivo = `Neutral.Default`/`Neutral.Strong`; activo/acento = `Theme.Primary`.

---

## 6. Componentes

### 6.1 Botones

Variantes: `Primary` · `Secondary` · `Tertiary` · `Tonal` · `Danger` · `Danger Text` · `Overlay` — tamaños `LG` · `MD` · `SM`. Estados: `Default` · `Hover` · `Pressed` · `Disabled` · `Loading`.

- `Primary` y `Danger`: fondo sólido (`Theme.Primary` / `Error.Default`) + texto blanco — únicas variantes que usan bloque sólido con texto blanco, ver §2.3.
- `Secondary`/`Tertiary`/`Tonal`: menor peso visual, sin fondo sólido de alto contraste.
- `Loading`: el contenido se reemplaza por un spinner centrado y bloquea nuevas interacciones.
- `Disabled`: atenúa colores y elimina toda retroalimentación táctil.
- Usar `Primary` una sola vez por vista — es la jerarquía más alta de la pantalla.

### 6.2 Cards

`Card / CardImage` (Horizontal, Vertical) · `Card / CardFeature` (BGImage, SideImage — tamaños M/L).

- Reposo: contenedor delimitado, radio `lg` (8px) o superior según tamaño.
- Hover (cuando la card es clicable): leve aumento de elevación (`Shadow-Down.S` → `Shadow-Down.M`) o refuerzo de borde — nunca un cambio de color brusco.
- No anidar cards ni usarlas para contenido puramente tabular (usar `Table`).

### 6.3 Tablas

`Table` + `Table Header` + `Table Cells` + `Paginator`.

- Header: agrupa título, búsqueda, filtros y acciones — se reorganiza según lo que esté presente.
- Celdas: soportan texto, tags, acciones, menús contextuales y skeleton de carga; responden a hover solo cuando son interactivas.
- Usar `Table` para listados operativos comparables; para ≤5 ítems sin necesidad de comparar, usar `DataList` en su lugar.

### 6.4 Badges y Tags

- **Badge**: indicador pasivo (numérico o punto), siempre sobre un componente anfitrión (botón, ícono, tab). Valores altos se abrevian ("99+").
- **Tag**: etiqueta de estado/categoría, variantes de color `Blue/Yellow/Green/Red/Purple/Accent/Theme/Gray`. Sigue siempre la fórmula *Softest bg + Stronger texto* de §2.2 — nunca queda en gris por defecto cuando representa un estado real.
- `Is Closable = true` habilita el chip interactivo de filtros (con hover/pressed sobre el ícono de cierre).

### 6.5 Inputs

Familia `Text Input` / `Password Input` / `Date Input` / `Search Input` / `Phone Input` / `OTP Input` / `Text Area` — todos comparten el mismo vocabulario de estados: `Default` · `Hover` · `Pressed` (foco) · `Disabled` · `Error` · `Success` (algunos) · `Filled` (con valor).

- Radio `lg` (8px), borde `Neutral.Softer` en reposo.
- `Error`: borde en color `Error.Default` + mensaje auxiliar.
- Validar en tiempo real, no solo al enviar.
- Label y placeholder siempre deben reemplazarse por contenido contextual real — nunca dejar el texto genérico visible.

### 6.6 Sidebar / AppBar (navegación)

- **Sidebar**: navegación lateral persistente, modos `Collapsed` (solo íconos) y `Expand` (íconos + label + subniveles). Item activo permanece resaltado en `Theme.Primary`; hover destaca sin cambio brusco. Solo para desktop — en mobile usar `Navbar`/bottom navigation.
- **AppBar**: barra superior persistente y adaptativa (`Desktop` / `Mobile`) — logo, navegación, buscador, `UserMenu`. Activar solo los bloques necesarios; no combinar con `Navbar` a la vez.

### 6.7 Select / Dropdown

- Desktop: dropdown que despliega lista de opciones al hacer clic/foco. Mobile: `BottomSheet` con `Radiobutton`.
- `Filled` refuerza visualmente cuando ya hay un valor seleccionado.
- Usar `Select` para >4 opciones de elección única; `Radiobutton` para 2–3; `Multiselect` para selección múltiple.
- Incluir búsqueda interna si la lista supera 7–10 opciones.

### 6.8 Avatar

- Círculo (radio `full`), tamaños `xs/s/m/l/xl`. Con imagen: recorte circular centrado. Sin imagen: iniciales (máx. 2 caracteres) con contraste adecuado sobre el fondo.
- Hover/Pressed solo si el avatar es interactivo (abre menú de usuario o perfil) — nunca aplicar esos estados a un avatar puramente decorativo.
- Para representar grupos, usar `AvatarGroup`, no avatares sueltos superpuestos manualmente.

### 6.9 Estado vacío (EmptyState)

- Título breve + descripción opcional + imagen/ícono opcional + botón de acción cuando exista una acción real ("Crear nuevo", "Limpiar filtros").
- Reservado para vacíos esperados (lista sin resultados, módulo recién configurado) — no usar para estados de carga (usar `Skeleton`/`Loader`) ni para errores del sistema.

### 6.10 Loading (Loader / Skeleton)

- **Loader**: spinner, barra de progreso o logo animado — comunica que el sistema está procesando.
- **Skeleton**: abstracción visual mínima que prefigura la forma del contenido real mientras carga; desaparece en cuanto los datos están disponibles, sin saltos de layout.
- No combinar Loader y Skeleton en el mismo espacio, y no usar Skeleton para cargas instantáneas (<200ms).

### 6.11 Overlays (Modal / Drawer / Bottom Sheet)

- **Modal**: ventana centrada sobre fondo atenuado, bloquea el resto de la interfaz. Debe orientar el foco al primer elemento interactivo relevante al abrirse y permitir navegación completa por teclado.
- **Drawer**: panel lateral deslizante para profundizar en un ítem sin abandonar la vista principal (encabezado + contenido + acciones).
- **Bottom Sheet**: equivalente mobile de drawer/dropdown, ancla al borde inferior (usa `Shadow-Up`).

---

## 7. Motion y capas

**⚠️ Propuesta a validar** — el Design System define los estados de cada componente (Default/Hover/Pressed/...) como variantes discretas, pero no fija curvas de easing ni una escala de z-index a nivel de código. Se proponen valores conservadores, consistentes con las descripciones de "transición suave" que sí aparecen documentadas (sidebar, menú mobile, skeleton→contenido):

| Propiedad | Valor propuesto |
|---|---|
| Duración | `150ms–250ms` |
| Easing | `ease-out` por defecto |

| z-index propuesto | Uso |
|---|---|
| 10 | Dropdown / Select desplegado |
| 20 | Tooltip |
| 30 | Sidebar (modo overlay en mobile) |
| 100 | Drawer / Bottom Sheet |
| 200 | Modal (overlay de pantalla completa) |
| 9999 | Toast / Notification (siempre encima de todo) |

---

## 8. Accesibilidad

Lo que el Design System sí documenta explícitamente:

- **Modal**: debe orientar el foco al abrirse hacia el primer elemento interactivo relevante y permitir navegación completa por teclado; debe poder cerrarse sin "encerrar" al usuario.
- **Contraste**: ver §2.3 — los pares sólido+texto blanco usados en botones (`Theme`, `Danger`) pasan AA; `Success` y `Warning` solo se usan en su combinación segura *Softest + Stronger*, nunca como bloque sólido de alto contraste.
- **Área táctil**: componentes con íconos accionables (CSAT, bottom navigation) deben mantener tamaño de toque adecuado en mobile.
- **No depender solo del color**: los estados (tags, alerts) deben reforzarse con iconografía o texto, no solo con el tono.

**⚠️ Propuesta a validar** — no hay una regla de `:focus-visible` documentada a nivel CSS. Se propone, consistente con `Theme.Primary`:

```css
:focus-visible {
  outline: 2px solid var(--color-theme-primary);
  outline-offset: 2px;
}
```

---

## 9. Qué queda fuera de este tema

Este documento cubre el sistema **base** del theme IT (color, tipografía, radios, sombras, un subconjunto representativo de componentes, motion y accesibilidad). No incluye:

- **Catálogo completo de componentes.** El IT DS tiene ~60 tipos de componente (charts, ecommerce, upload, stepper, progress, etc.) — este documento resume los ~11 de uso más transversal; el resto se documenta en el skill `itds-board-composer` (`references/component-descriptions.md` y `ds-snapshot.md`).
- **Motion, z-index, iconografía y `:focus-visible` como specs de código verificadas.** Estas secciones (§5, §7 y parte de §8) son propuestas razonadas a partir de patrones observados en el Design System, no valores confirmados contra una implementación — validar antes de tomarlos como fuente de verdad.
- **Paleta de marcas Cencosud (`Brand.*`).** Existe como capacidad del sistema para identificar cadenas específicas (Paris, Jumbo, Easy, etc.), pero no forma parte del acento del tema base — cada implementación que la necesite la aplica por separado.
