export interface PepN7Row {
  servicio: string
  cod: string
  bandera: string
  destino: string
  ceco: string
}

export interface PepN4Row {
  pep: string
  pais: string
  moneda: string
  cod: string
  servicio: string
  area: string
  cuenta: string
  fechaCreacion: string
  ultimaEdicion: { fecha: string; usuario: string }
}

export const pepsN4: PepN4Row[] = [
  { pep: 'AG-AT-1193-HP', pais: 'Argentina', moneda: 'ARS', cod: '1193', servicio: 'Desarrollo herramientas gestión, planificación y Mejora Continua', area: 'PMO-Licenciamiento', cuenta: 'Honorarios Profesionales', fechaCreacion: '2025-03-12', ultimaEdicion: { fecha: '2026-07-18', usuario: 'Andrea Morales' } },
  { pep: 'AG-AT-1277-HP', pais: 'Argentina', moneda: 'ARS', cod: '1277', servicio: 'Desarrolladores UX', area: 'PMO-Licenciamiento', cuenta: 'Honorarios Profesionales', fechaCreacion: '2025-03-15', ultimaEdicion: { fecha: '2026-06-30', usuario: 'Carlos Vega' } },
  { pep: 'AG-AT-P053-RH', pais: 'Argentina', moneda: 'ARS', cod: 'P053', servicio: 'Nómina', area: 'PMO-Licenciamiento', cuenta: 'Nómina', fechaCreacion: '2025-04-02', ultimaEdicion: { fecha: '2026-08-01', usuario: 'Andrea Morales' } },
  { pep: 'AG-BC-0498-VM', pais: 'Argentina', moneda: 'ARS', cod: '0498', servicio: '[ADM] Aéreos, traslados y viáticos internacionales', area: 'Back Office', cuenta: 'Viáticos y Movilidad', fechaCreacion: '2025-02-20', ultimaEdicion: { fecha: '2026-05-14', usuario: 'Luis Pinto' } },
  { pep: 'AG-BC-0631-TL', pais: 'Argentina', moneda: 'ARS', cod: '0631', servicio: '[ADM] Telefonía móvil', area: 'Back Office', cuenta: 'Telefonía', fechaCreacion: '2025-02-20', ultimaEdicion: { fecha: '2026-07-22', usuario: 'Carlos Vega' } },
  { pep: 'AG-BC-0632-VM', pais: 'Argentina', moneda: 'ARS', cod: '0632', servicio: '[ADM] Traslados (radiotaxis - remises)', area: 'Back Office', cuenta: 'Viáticos y Movilidad', fechaCreacion: '2025-02-21', ultimaEdicion: { fecha: '2026-04-10', usuario: 'Andrea Morales' } },
  { pep: 'AG-BC-0633-VM', pais: 'Argentina', moneda: 'ARS', cod: '0633', servicio: '[ADM] Viáticos y alimentación', area: 'Back Office', cuenta: 'Viáticos y Movilidad', fechaCreacion: '2025-02-21', ultimaEdicion: { fecha: '2026-08-05', usuario: 'Luis Pinto' } },
  { pep: 'AG-BC-0716-RH', pais: 'Argentina', moneda: 'ARS', cod: '0716', servicio: 'Nómina', area: 'Back Office', cuenta: 'Nómina', fechaCreacion: '2025-05-10', ultimaEdicion: { fecha: '2026-07-30', usuario: 'Andrea Morales' } },
]

export const pepsN7: Record<string, PepN7Row[]> = {
  'AG-AT-1193-HP': [
    { servicio: 'Desarrollo herramientas gestión, planificación y Mejora Continua', cod: 'AG-AT-1193-HP-AGO-100', bandera: '🇦🇷', destino: 'Argentina-Central-Sistemas', ceco: 'AGO1007305' },
  ],
  'AG-AT-1277-HP': [
    { servicio: 'Desarrolladores UX', cod: 'AG-AT-1277-HP-AGO-200', bandera: '🇦🇷', destino: 'Argentina-Central-UX', ceco: 'AGO1007306' },
  ],
}

export const gerenciaOpciones = ['PMO', 'Tecnología', 'Finanzas', 'Operaciones', 'RRHH']
export const equipoOpciones = ['Desarrollo', 'QA', 'Infraestructura', 'Producto', 'Diseño']
export const cuentaContableOpciones = ['Honorarios Profesionales', 'Servicios Tecnológicos', 'Gastos Generales', 'Licencias y Suscripciones']
export const banderaPaisOpciones = [
  { emoji: '🇦🇷', label: 'Argentina' },
  { emoji: '🇧🇷', label: 'Brasil' },
  { emoji: '🇨🇱', label: 'Chile' },
  { emoji: '🇨🇴', label: 'Colombia' },
  { emoji: '🇵🇪', label: 'Perú' },
  { emoji: '🇺🇸', label: 'EEUU' },
]
export const cecoOpciones = ['AGO1007305', 'AGO1007306', 'AGO1007307', 'AGO1007308', 'BRS2001100', 'CHL3002200', 'COL4003300', 'PER5004400', 'EEU6005500']
export const destinoOpciones = [
  'Argentina-Central-Sistemas', 'Argentina-Central-UX', 'Argentina-Norte-IT',
  'Brasil-SP-Desarrollo', 'Brasil-RJ-Infraestructura',
  'Chile-Santiago-PMO', 'Chile-Santiago-QA',
  'Colombia-Bogotá-Producto', 'Colombia-Medellín-IT',
  'Perú-Lima-Desarrollo', 'EEUU-NY-Producto',
]

function uniqSorted(values: string[]): string[] {
  return [...new Set(values)].filter(Boolean).sort((a, b) => a.localeCompare(b, 'es'))
}

export const pepFiltroOpciones = {
  pais: uniqSorted(pepsN4.map((r) => r.pais)),
  moneda: uniqSorted(pepsN4.map((r) => r.moneda)),
  area: uniqSorted(pepsN4.map((r) => r.area)),
  cuenta: uniqSorted(pepsN4.map((r) => r.cuenta)),
}
