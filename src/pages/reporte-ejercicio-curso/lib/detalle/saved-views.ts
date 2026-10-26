const STORAGE_KEY = 'recoe_vistas_v1'

export interface VistaGuardada {
  nombre: string
  aperturas: string[]
  metricas: string[]
  /** true = una de las 3 vistas estándar, no editable ni eliminable — misma homologación para todos. */
  predefinida?: boolean
}

/** 3 vistas estándar no editables — cubren lo que antes eran las pestañas "Gerencia Cross"/"Negocio"/
 * "Cuenta Contable", ahora como presets del mismo motor de tabla dinámica genérico. */
export const VISTAS_PREDEFINIDAS: VistaGuardada[] = [
  { nombre: 'Gerencia', aperturas: ['gerenciaEquipo'], metricas: ['plan', 'real', 'forecast', 'desvioMonto', 'desvioPct'], predefinida: true },
  { nombre: 'Negocio', aperturas: ['divisionBandera'], metricas: ['plan', 'real', 'realAnioAnterior', 'variacionAnioMonto', 'variacionAnioPct'], predefinida: true },
  { nombre: 'Cuenta contable', aperturas: ['cuentaContable'], metricas: ['plan', 'real', 'forecast', 'desvioMonto', 'desvioPct'], predefinida: true },
]

function leerGuardadas(): VistaGuardada[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as VistaGuardada[]) : []
  } catch {
    return []
  }
}

function escribirGuardadas(vistas: VistaGuardada[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vistas))
  } catch {
    // almacenamiento no disponible (modo privado, etc.) — la vista queda solo en memoria de esta sesión.
  }
}

/** Todas las vistas disponibles: las 3 predefinidas primero, luego las guardadas por el usuario. */
export function listarVistas(): VistaGuardada[] {
  return [...VISTAS_PREDEFINIDAS, ...leerGuardadas()]
}

/** Guarda (o sobrescribe, por nombre) una vista del usuario — nunca permite pisar una predefinida. */
export function guardarVista(vista: VistaGuardada) {
  if (VISTAS_PREDEFINIDAS.some((v) => v.nombre === vista.nombre)) return
  const resto = leerGuardadas().filter((v) => v.nombre !== vista.nombre)
  escribirGuardadas([...resto, { ...vista, predefinida: false }])
}

export function eliminarVista(nombre: string) {
  escribirGuardadas(leerGuardadas().filter((v) => v.nombre !== nombre))
}
