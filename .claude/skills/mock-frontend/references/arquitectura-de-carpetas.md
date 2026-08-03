# Arquitectura de Carpetas

## Contenido
- Por qué esta forma
- El árbol
- Dirección de las dependencias
- Reglas "nunca"
- Propósito de cada carpeta

## Por qué esta forma

Tanto el Atomic Design estricto de 5 capas (átomos/moléculas/organismos/templates/páginas) como el Feature-Sliced Design completo son más ceremonia de la que necesita un equipo chico de diseño+frontend — no hay complejidad de backend ni ownership multi-equipo de qué protegerse. Esto es un híbrido pragmático (estilo Bulletproof-React): primitivas planas + composición, con `features/` creado solo cuando una pantalla tiene lógica genuinamente compleja o reutilizada. No se pre-crean capas vacías "por si acaso" — se agrega una capa la primera vez que algo realmente la necesita.

## El árbol

```
src/
├── app/                    # Shell: App.tsx, router.tsx, providers.tsx
├── pages/                  # Una carpeta por ruta/pantalla (delgadas, componen shared/features)
│   └── <pagina>/
│       ├── XxxPage.tsx
│       └── components/     # sub-componentes usados SOLO por esta página
├── features/               # Solo cuando una página necesita lógica/estado propio no trivial
│   └── <feature>/
│       ├── components/
│       ├── hooks/
│       └── types.ts
├── shared/
│   ├── ui/                 # Primitivas del design system: Button, Dialog, Select, Tabs...
│   │   └── index.ts        # el ÚNICO barrel del proyecto
│   ├── layout/              # Sidebar, Topbar, PageHeader — composición, no primitivas
│   ├── hooks/
│   ├── lib/
│   │   └── utils.ts         # cn() = clsx + tailwind-merge
│   ├── types/
│   ├── constants/
│   └── styles/
│       └── tokens.css       # tokens de Tailwind: capa primitiva + capa semántica
├── data/                    # Capa de datos mock — reemplaza a un backend real futuro
├── i18n/
│   ├── index.ts
│   └── locales/
└── assets/
```

`features/` y cualquier `components/` de una página no se scaffoldean vacíos — se crean la primera vez que algo va ahí.

## Dirección de las dependencias

Las flechas solo apuntan hacia abajo. Nada importa nunca hacia arriba o hacia un costado cruzando un límite:

```
app/  ──▶  pages/  ──▶  features/  ──▶  shared/
                  ╰────────────────────▶  (pages/ también puede ir directo a shared/)
            pages/ y features/  ──▶  data/   (solo lectura: tipos + fixtures)

i18n/  ──▶  consumida por CUALQUIER carpeta, pero i18n/ no consume nada de src/
```

## Reglas "nunca"

Son límites duros, no defaults para saltarse casualmente. Si alguna parece necesitar romperse, esa es la señal de que algo está en la carpeta equivocada — no una excepción a otorgar.

1. **`shared/*` nunca importa de `pages/`, `features/`, `data/` o `app/`.** La base no puede conocer lo que se construye encima.
2. **`data/` nunca importa componentes React ni `shared/ui`.** Es dato y tipos puros — cero JSX. Esto es lo que permite que reemplazar la data mock por una API real sea un cambio que no toca la UI.
3. **`features/<A>` nunca importa de `features/<B>`.** Las features hermanas están aisladas. Lo compartido se promueve a `shared/`, nunca se cruza.
4. **`pages/<A>` nunca importa de `pages/<B>`.** Las páginas hermanas están aisladas. Nada depende de una página.
5. **`shared/ui` nunca importa de `shared/layout`.** La dirección es layout → ui, jamás al revés — las primitivas no pueden saber que existe un Sidebar.
6. **Nada importa de `app/` salvo `main.tsx`.** `app/` es la raíz de composición, no un recurso reutilizable.

## Propósito de cada carpeta

| Carpeta | Por qué existe | Qué va adentro | Puede importar de | Nunca importa de |
|---|---|---|---|---|
| `app/` | Raíz de composición: arma todo el shell | `App.tsx`, `router.tsx`, `providers.tsx` (agregar `providers.tsx` recién cuando exista un provider global real — no dejarlo como stub vacío) | `pages/`, `shared/`, `i18n/` | — (nada más importa de `app/`) |
| `pages/<x>/` | Una pantalla/ruta real, ensamblando todo para ese caso de uso | `XxxPage.tsx` + `components/` propios de esa página | `shared/`, `features/`, `data/`, `i18n/` | otras `pages/`, `app/` |
| `features/<x>/` | Lógica de negocio con estado propio, demasiado compleja o reutilizada para vivir en una página | `components/`, `hooks/`, `types.ts` de una capacidad | `shared/`, `data/`, `i18n/` | otras `features/`, `pages/`, `app/` |
| `shared/ui/` | Vocabulario visual base del design system, cero conocimiento de negocio | `Button`, `Dialog`, `Select`, `Tabs`... | librerías externas (Radix, CVA) + `shared/lib` | `pages/`, `features/`, `data/`, `app/`, `shared/layout` |
| `shared/layout/` | Composición estructural reutilizable entre páginas | `Sidebar`, `Topbar`, `DashboardLayout` | `shared/ui`, `shared/lib`, `shared/hooks` | `pages/`, `features/`, `data/`, `app/` |
| `shared/hooks/` | Comportamiento reutilizable, sin conocimiento de dominio | `useDebounce`, `useToggle` | `shared/lib` | `shared/ui`, `pages/`, `features/`, `data/` |
| `shared/lib/` | Funciones utilitarias puras, sin JSX | `cn()`, `formatCurrency()` | solo librerías externas | cualquier otra carpeta |
| `shared/types/` | Tipos TS genéricos y transversales (no entidades de dominio) | `Nullable<T>`, `SelectOption` | — | `data/` (los tipos de dominio viven en `data/`, no acá) |
| `shared/constants/` | Constantes genéricas transversales, o valores presentacionales deliberadamente fuera del sistema de tokens semánticos | breakpoints, `chart-colors.ts` (paleta de acento para KPIs/data-viz — esos colores no cargan significado, por eso no son tokens semánticos) | — | — |
| `shared/styles/` | Design tokens y cualquier CSS global | `tokens.css` | nada (CSS puro) | todo (se importa una sola vez, en `main.tsx`) |
| `data/` | Reemplaza al backend que todavía no existe | fixtures tipadas + los contratos de datos (tipos) que devolvería una API real | `shared/types` | `shared/ui`, `pages/`, `features/`, `app/` |
| `i18n/` | Capa de traducción, lista aunque haya un solo idioma | `index.ts` (`useTranslation`/`t()`), `locales/*.ts` | solo librerías externas de i18n | cualquier carpeta de `src/` |
