# Tokens de diseño — Portal Financiero • SIP/PMO

Fuente: `tokens.json` del archivo Penpot (formato W3C Design Tokens). Sets: `Portal Financiero/Primitive` y `Portal Financiero/Semantic`.
Regla: **en código siempre se consume el token semántico**, nunca el hex directo ni el primitivo (salvo que no exista semántico para el caso).

## Fundamentos

- **Tipografía única: Montserrat** (token `FontFamily`). Ninguna vista debe usar otra familia.
- **Base font size: 16px**.
- **Sombra estándar `Shadow-M`**: `0 2px 15px -3px rgba(0,0,0,0.4)` → CSS: `box-shadow: 0 2px 15px -3px #0006;`

## Escala tipográfica (primitivos `fontSizes`)

| Token | px |
|---|---|
| xxs | 10 |
| xs | 12 |
| sm | 14 |
| md_base | 16 |
| lg | 18 |
| xl | 20 |
| 2xl | 24 |
| 3xl | 30 |
| 4xl | 36 |
| 5xl | 48 |
| 6xl | 60 |
| 7xl | 72 |
| 8xl | 96 |

Pesos: 100_Thin, 200_ExtraLight, 300_Light, 400_Regular, 500_Medium, 600_SemiBold, 700_Bold, 800_ExtraBold, 900_BlackHeavy.
Estilos compuestos semánticos: `text-{tamaño}.{Regular|Medium|Bold}` con line-height 1 (títulos ≥ xl... ver tabla: sm/xs/xxs/xl usan 1.2, resto 1).

## Colores primitivos

| Token | Hex |
|---|---|
| base.white | #FFFFFF |
| blue.100 | #C4DFFF |
| blue.200 | #B6CCF7 |
| blue.300 | #4D8DFF |
| blue.50 | #EFF4FF |
| blue.500 | #0073FF |
| blue.600 | #1E47B8 |
| blue.700 | #0047B0 |
| blue.800 | #003685 |
| blue.900 | #061494 |
| blue.950 | #0A1837 |
| blue.vivid | #0C0CE5 |
| cyan.500 | #00B1FF |
| gray.100 | #F3F5FC |
| gray.200 | #F1F5F9 |
| gray.300 | #EDEDED |
| gray.50 | #F0F6FF |
| green.100 | #ECFDF3 |
| green.300 | #ABEFC6 |
| green.50 | #E3F9EC |
| green.500 | #10B981 |
| green.700 | #067647 |
| neutral.100 | #EEF1FB |
| neutral.200 | #F1F3F8 |
| neutral.300 | #E4EAF6 |
| neutral.50 | #F8FAFC |
| neutral.500 | #8A90A2 |
| neutral.700 | #455B85 |
| neutral.900 | #2F2F2F |
| orange.400 | #F97316 |
| orange.500 | #FF6A00 |
| purple.400 | #8B5CF6 |
| purple.600 | #6922E7 |
| red.300 | #FCA5A5 |
| red.50 | #FEE8E8 |
| red.700 | #B42318 |
| teal.accent | #06EACE |
| yellow.100 | #FFF4E0 |
| yellow.200 | #FDBA74 |
| yellow.300 | #FCD34D |
| yellow.400 | #FBBF24 |
| yellow.50 | #FFFBEB |
| yellow.500 | #F59E0B |
| yellow.700 | #B45309 |

## Tokens semánticos (usar SIEMPRE estos en código)

### action

| Token | Tipo | Valor | Resuelto |
|---|---|---|---|
| action.primary.bg | color | `{blue.700}` | #0047B0 |
| action.primary.bg-hover | color | `{blue.800}` | #003685 |
| action.secondary.border | color | `{blue.200}` | #B6CCF7 |

### avatar

| Token | Tipo | Valor | Resuelto |
|---|---|---|---|
| avatar.bg | color | `{blue.500}` | #0073FF |

### bg

| Token | Tipo | Valor | Resuelto |
|---|---|---|---|
| bg.base | color | `#F8FAFC` | #F8FAFC |
| bg.disabled | color | `#EDEFF4` | #EDEFF4 |
| bg.neutral | color | `#EDEDED` | #EDEDED |
| bg.surface | color | `#FFFFFF` | #FFFFFF |
| bg.surface-elevated | color | `#F3F5FC` | #F3F5FC |
| bg.surface-hover | color | `#F0F6FF` | #F0F6FF |
| bg.surface-subtle | color | `#F8FAFC` | #F8FAFC |

### border

| Token | Tipo | Valor | Resuelto |
|---|---|---|---|
| border.default | color | `rgba(6,20,148,0.10)` | rgba(6,20,148,0.10) |
| border.disabled | color | `rgba(6,20,148,0.06)` | rgba(6,20,148,0.06) |
| border.strong | color | `rgba(6,20,148,0.18)` | rgba(6,20,148,0.18) |
| border.subtle | color | `rgba(6,20,148,0.08)` | rgba(6,20,148,0.08) |
| border.table | color | `#F1F3F8` | #F1F3F8 |
| border.table-strong | color | `#E4EAF6` | #E4EAF6 |

### brand

| Token | Tipo | Valor | Resuelto |
|---|---|---|---|
| brand.accent | color | `{teal.accent}` | #06EACE |
| brand.accent-warm | color | `{orange.500}` | #FF6A00 |

### chart

| Token | Tipo | Valor | Resuelto |
|---|---|---|---|
| chart.bar.track | color | `#EEF1FB` | #EEF1FB |
| chart.bar.warning | color | `#F59E0B` | #F59E0B |
| chart.bar.warning-end | color | `#FBBF24` | #FBBF24 |
| chart.capex | color | `#F97316` | #F97316 |
| chart.licenses | color | `#8B5CF6` | #8B5CF6 |
| chart.opex | color | `#0047B0` | #0047B0 |
| chart.services | color | `#10B981` | #10B981 |

### feedback

| Token | Tipo | Valor | Resuelto |
|---|---|---|---|
| feedback.accent.bg | color | `#f1effc` | #f1effc |
| feedback.accent.fg | color | `#7e3fed` | #7e3fed |
| feedback.error.bg | color | `#FEE8E8` | #FEE8E8 |
| feedback.error.border | color | `#FCA5A5` | #FCA5A5 |
| feedback.error.dot | color | `#B42318` | #B42318 |
| feedback.error.fg | color | `#B42318` | #B42318 |
| feedback.info.bg | color | `#EFF4FF` | #EFF4FF |
| feedback.info.border | color | `#B6CCF7` | #B6CCF7 |
| feedback.info.dot | color | `#0047B0` | #0047B0 |
| feedback.info.fg | color | `#0047B0` | #0047B0 |
| feedback.success.bg | color | `#E3F9EC` | #E3F9EC |
| feedback.success.border | color | `#ABEFC6` | #ABEFC6 |
| feedback.success.dot | color | `#10B981` | #10B981 |
| feedback.success.fg | color | `#067647` | #067647 |
| feedback.warning.bg | color | `#FFF4E0` | #FFF4E0 |
| feedback.warning.border | color | `#FDBA74` | #FDBA74 |
| feedback.warning.dot | color | `#F59E0B` | #F59E0B |
| feedback.warning.fg | color | `#B45309` | #B45309 |

### overlay

| Token | Tipo | Valor | Resuelto |
|---|---|---|---|
| overlay.brand.08 | color | `rgba(12,12,229,0.08)` | rgba(12,12,229,0.08) |
| overlay.brand.10 | color | `rgba(6,20,148,0.10)` | rgba(6,20,148,0.10) |
| overlay.brand.18 | color | `rgba(6,20,148,0.18)` | rgba(6,20,148,0.18) |
| overlay.white.08 | color | `rgba(255,255,255,0.08)` | rgba(255,255,255,0.08) |
| overlay.white.14 | color | `rgba(255,255,255,0.14)` | rgba(255,255,255,0.14) |
| overlay.white.45 | color | `rgba(255,255,255,0.45)` | rgba(255,255,255,0.45) |
| overlay.white.75 | color | `rgba(255,255,255,0.75)` | rgba(255,255,255,0.75) |

### radius

| Token | Tipo | Valor | Resuelto |
|---|---|---|---|
| radius.full | borderRadius | `999` | 999px |
| radius.lg | borderRadius | `12` | 12px |
| radius.md | borderRadius | `8` | 8px |
| radius.sm | borderRadius | `4` | 4px |
| radius.xl | borderRadius | `16` | 16px |

### sidebar

| Token | Tipo | Valor | Resuelto |
|---|---|---|---|
| sidebar.bg-end | color | `#003685` | #003685 |
| sidebar.bg-start | color | `#0047B0` | #0047B0 |
| sidebar.divider | color | `rgba(255,255,255,0.10)` | rgba(255,255,255,0.10) |
| sidebar.item-active | color | `#1E47B8` | #1E47B8 |
| sidebar.item-border | color | `rgba(255,255,255,0.14)` | rgba(255,255,255,0.14) |
| sidebar.item-hover | color | `rgba(255,255,255,0.08)` | rgba(255,255,255,0.08) |
| sidebar.item-text | color | `rgba(255,255,255,0.75)` | rgba(255,255,255,0.75) |
| sidebar.item-text-active | color | `{base.white}` | #FFFFFF |
| sidebar.section-label | color | `rgba(255,255,255,0.45)` | rgba(255,255,255,0.45) |

### spacing

| Token | Tipo | Valor | Resuelto |
|---|---|---|---|
| spacing.0 | spacing | `0` | 0px |
| spacing.0-5 | spacing | `2` | 2px |
| spacing.1 | spacing | `4` | 4px |
| spacing.2 | spacing | `8` | 8px |
| spacing.3 | spacing | `12` | 12px |
| spacing.4 | spacing | `16` | 16px |
| spacing.6 | spacing | `24` | 24px |
| spacing.8 | spacing | `32` | 32px |

### status

| Token | Tipo | Valor | Resuelto |
|---|---|---|---|
| status.approved.bg | color | `#ECFDF3` | #ECFDF3 |
| status.approved.border | color | `#ABEFC6` | #ABEFC6 |
| status.approved.dot | color | `#10B981` | #10B981 |
| status.approved.fg | color | `#067647` | #067647 |
| status.closed.bg | color | `#F1F5F9` | #F1F5F9 |
| status.closed.fg | color | `#455B85` | #455B85 |
| status.deviated.bg | color | `#FFFBEB` | #FFFBEB |
| status.deviated.border | color | `#FCD34D` | #FCD34D |
| status.deviated.dot | color | `#F59E0B` | #F59E0B |
| status.deviated.fg | color | `#B45309` | #B45309 |
| status.in-progress.bg | color | `#EFF4FF` | #EFF4FF |
| status.in-progress.border | color | `#B6CCF7` | #B6CCF7 |
| status.in-progress.dot | color | `#0047B0` | #0047B0 |
| status.in-progress.fg | color | `#0047B0` | #0047B0 |

### stroke

| Token | Tipo | Valor | Resuelto |
|---|---|---|---|
| stroke.default | borderWidth | `1` | 1px |
| stroke.thick | borderWidth | `2` | 2px |

### text

| Token | Tipo | Valor | Resuelto |
|---|---|---|---|
| text.brand | color | `#0047B0` | #0047B0 |
| text.brand-emphasis | color | `#061494` | #061494 |
| text.dark | color | `#0A1837` | #0A1837 |
| text.disabled | color | `#B0B7C9` | #B0B7C9 |
| text.muted | color | `#8A90A2` | #8A90A2 |
| text.on-brand | color | `{base.white}` | #FFFFFF |
| text.primary | color | `#2F2F2F` | #2F2F2F |
| text.secondary | color | `#455B85` | #455B85 |

## Variables CSS listas para usar

El archivo `assets/tokens.css` contiene todos estos tokens como variables CSS con prefijo `--pf-`. Cópialo tal cual al proyecto y consume las variables (ej. `background: var(--pf-action-primary-bg)`).