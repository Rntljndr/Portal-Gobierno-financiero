import type { AreaSeed } from './gerencias-equipos-seed-types'
import { AREA_TECNOLOGIA } from './gerencias-equipos-seed-tecnologia'
import { AREA_DIGITAL } from './gerencias-equipos-seed-digital'
import { AREA_OPERACIONES } from './gerencias-equipos-seed-operaciones'
import { AREA_ESTRATEGIA } from './gerencias-equipos-seed-estrategia'

export type { EstadoOrganizacional, MiembroSeed, EquipoSeed, GerenciaSeed, AreaSeed } from './gerencias-equipos-seed-types'

/** Estructura organizacional completa (Área > Gerencia > Equipo > Miembro) — Áreas y Gerencias de
 * Tecnología/Digital/Operaciones reutilizan los mismos nombres que `pepN4Meta` (gerenciaPadre/gerencia)
 * para que "Gerencias y Equipos" quede consistente con el resto del portal (Forecast, Reales, etc.).
 * `desde`/`hasta` dan soporte al selector de Ejercicio: cada nodo solo existe desde su año de alta, y
 * queda Inactivo (sin desaparecer del histórico) desde su año de baja — ver `estructuraParaAnio`.
 * Dividida en un archivo por área (F: "mayor cantidad de líneas de ejemplo") para mantener cada archivo
 * bajo el límite de líneas del linter. */
export const GERENCIAS_EQUIPOS_SEED: AreaSeed[] = [AREA_TECNOLOGIA, AREA_DIGITAL, AREA_OPERACIONES, AREA_ESTRATEGIA]
