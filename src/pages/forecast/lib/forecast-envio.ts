import type { ForecastRound } from '@/data/forecast'
import type { ForecastEnvioEstado, ForecastHistorialEstado, ForecastN4Linea } from '@/data/forecast-lineas'
import { forecastHistorialEntry } from './forecast-historial'

/** Al cerrar un forecast (A3), todos los PEP N4 y N7 quedan "Validado por Control de Gestión", igual
 * que en Reales — sin importar en qué estado de envío estuvieran. */
function aplicarValidacionCierre(lineas: ForecastN4Linea[]): ForecastN4Linea[] {
  return lineas.map((n4) => ({
    ...n4,
    envioEstado: 'Validado por Control de Gestión' as const,
    n7: n4.n7.map((line) => ({ ...line, envioEstado: 'Validado por Control de Gestión' as const })),
  }))
}

/** Patch completo de un round al cerrarlo — extraído para mantener forecast-store.tsx#ForecastProvider
 * bajo el límite de líneas del linter. */
export function aplicarCierreRound(round: ForecastRound): ForecastRound {
  return { ...round, estado: 'Cerrado', cerradoManual: true, lineas: aplicarValidacionCierre(round.lineas) }
}

/** Transiciones de estado de envío disponibles desde la barra de acciones masivas (M7: "selección
 * múltiple, enviar/aprobar/rechazar"). "enviar" también permite reenviar algo Rechazado. */
export type ForecastEnvioTransicion = 'enviar' | 'aprobar' | 'rechazar'

const ENVIO_TRANSICION_DESTINO: Record<ForecastEnvioTransicion, ForecastEnvioEstado> = {
  enviar: 'Enviado a CG',
  aprobar: 'Validado por Control de Gestión',
  rechazar: 'Rechazado',
}

const ENVIO_TRANSICION_ORIGEN: Record<ForecastEnvioTransicion, ForecastEnvioEstado[]> = {
  enviar: ['Abierto', 'Rechazado'],
  aprobar: ['Enviado a CG'],
  rechazar: ['Enviado a CG'],
}

/** F: cada transición deja su propio evento en el historial del PEP (ver forecast-historial.ts) — mismo
 * nombre que el estado de envío correspondiente, salvo "Enviado a CG" → "Enviado" (más corto en el tag). */
const ENVIO_TRANSICION_HISTORIAL: Record<ForecastEnvioTransicion, ForecastHistorialEstado> = {
  enviar: 'Enviado',
  aprobar: 'Aprobado',
  rechazar: 'Rechazado',
}

/** Clave única de una línea N7 dentro de un round, para el Set de selección múltiple (M7) — no hay un
 * id propio por línea, así que se compone n4Codigo+n7Codigo igual que en otros lados del módulo. */
export function forecastN7Key(n4Codigo: string, n7Codigo: string): string {
  return `${n4Codigo}::${n7Codigo}`
}

/** Aplica en bloque una transición de estado de envío (M7) sobre las líneas seleccionadas — reconoce
 * tanto claves de N4 (código plano) como de N7 (forecastN7Key) dentro del mismo Set, así que funciona
 * sin importar desde qué pantalla se seleccionó (listado N4, tab N7 plano, o la tabla N7 de un N4
 * puntual). Ignora en silencio cualquier línea seleccionada que no esté en un estado de origen válido
 * para esa transición (p. ej. "aprobar" algo que sigue Abierto). */
export function aplicarTransicionCdGBulk(lineas: ForecastN4Linea[], transicion: ForecastEnvioTransicion, seleccion: Set<string>): ForecastN4Linea[] {
  const destino = ENVIO_TRANSICION_DESTINO[transicion]
  const historialEstado = ENVIO_TRANSICION_HISTORIAL[transicion]
  const puedeTransicionar = (estado: ForecastEnvioEstado) => ENVIO_TRANSICION_ORIGEN[transicion].includes(estado)

  return lineas.map((n4) => ({
    ...n4,
    envioEstado: seleccion.has(n4.n4Codigo) && puedeTransicionar(n4.envioEstado) ? destino : n4.envioEstado,
    n7: n4.n7.map((l) =>
      seleccion.has(forecastN7Key(n4.n4Codigo, l.n7Codigo)) && puedeTransicionar(l.envioEstado)
        ? { ...l, envioEstado: destino, historial: [...l.historial, forecastHistorialEntry(historialEstado)] }
        : l,
    ),
  }))
}
