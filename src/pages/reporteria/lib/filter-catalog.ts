import { servicios } from '@/data/services'

function uniqSorted(values: string[]): string[] {
  return [...new Set(values)].filter(Boolean).sort((a, b) => a.localeCompare(b, 'es'))
}

function buildCascadeMap(pairs: [string, string][]): Record<string, string[]> {
  const map: Record<string, Set<string>> = {}
  for (const [parent, child] of pairs) {
    map[parent] ??= new Set()
    map[parent].add(child)
  }
  return Object.fromEntries(Object.entries(map).map(([k, v]) => [k, uniqSorted([...v])]))
}

export const divisionOptions = uniqSorted(servicios.map((s) => s.division))
export const banderasByDivision = buildCascadeMap(servicios.map((s) => [s.division, s.bandera]))
export const allBanderas = uniqSorted(servicios.map((s) => s.bandera))

export const gerenciaPadreOptions = uniqSorted(servicios.map((s) => s.gerenciaPadre))
export const gerenciasByPadre = buildCascadeMap(servicios.map((s) => [s.gerenciaPadre, s.gerencia]))
export const allGerencias = uniqSorted(servicios.map((s) => s.gerencia))

export const equiposByGerencia = buildCascadeMap(servicios.map((s) => [s.gerencia, s.equipo]))
export const allEquipos = uniqSorted(servicios.map((s) => s.equipo))

export function optionsFor(map: Record<string, string[]>, selected: string[], fallback: string[]): string[] {
  if (selected.length === 0) return fallback
  const merged = new Set<string>()
  selected.forEach((s) => (map[s] ?? []).forEach((v) => merged.add(v)))
  return merged.size > 0 ? uniqSorted([...merged]) : fallback
}

export const forecastVersions = [
  { value: 'F1_2027', label: 'Forecast 1 — 2027' },
  { value: 'F2_2027', label: 'Forecast 2 — 2027' },
  { value: 'F3_2027', label: 'Forecast 3 — 2027 (actual)' },
]

/** Catálogos adicionales de filtros sin dato asociado en los fixtures — presentes para completar el panel, sin acotar los resultados (mismo criterio que el selector de Forecast). */
export const origenServicioOptions = ['Gasto post implementación', 'Nuevo CDG pendiente', 'Nuevo real pendiente', 'Nuevo servicio', 'Servicio recurrente']
export const referenciaOptions = ['AG-CT-6601-EF', 'AG-OE-6601-EN', 'AG-OK-0247-GG', 'AG-SI-0346-HP']
export const justificacionOptions = [
  'Desvío por estacionalidad',
  'Desvío por sub/sobre estimación de plan',
  'Desvío por tipo de cambio',
  'Nuevo servicio pedido por unidad de negocio',
  'Reclasificación por cambio de PEP',
  'Sin desvío presupuestario',
]
export const descripcionOptions = ['Amortizaciones nuevos proyectos', 'Amortizaciones recurrentes centrales', 'Consumo Cloud', 'Licencias y suscripciones', 'Soporte y mantenimiento']
