import { V3_MES_EN_CURSO, V3_MESES_CERRADOS, v3Gestion, type V3Linea } from '@/data/gasto-it-v3'

const sum = (xs: number[]) => xs.reduce((s, v) => s + v, 0)
const pct = (a: number, b: number) => (b > 0 ? (a / b) * 100 : 0)
/** Diferencias menores a esto se consideran "sin cambio" (ruido de redondeo). */
const UMBRAL = 0.5

/** Forecast en edición vs el forecast anterior, año completo (real cerrado + forecast de meses abiertos). */
export interface CompFcst {
  actual: number
  anterior: number
  dif: number
  difPct: number
  modificadas: number
  total: number
}

export function compararForecast(lineas: V3Linea[]): CompFcst {
  let actual = 0
  let anterior = 0
  let modificadas = 0
  for (const l of lineas) {
    const a = sum(l.realForecast)
    const b = sum(v3Gestion[l.id].forecastAnterior)
    actual += a
    anterior += b
    if (Math.abs(a - b) > UMBRAL) modificadas++
  }
  return { actual, anterior, dif: actual - anterior, difPct: pct(actual - anterior, anterior), modificadas, total: lineas.length }
}

/** Meses abiertos: forecast anterior vs en edición, mes a mes. */
export function fcstPorMes(lineas: V3Linea[]): { mes: number; anterior: number; actual: number }[] {
  return Array.from({ length: 12 - V3_MESES_CERRADOS }, (_, k) => {
    const i = V3_MESES_CERRADOS + k
    return { mes: i, anterior: sum(lineas.map((l) => v3Gestion[l.id].forecastAnterior[i])), actual: sum(lineas.map((l) => l.realForecast[i])) }
  })
}

/** Preliminares del mes en curso contra el forecast de ese mes. */
export interface CompPrelim {
  forecastMes: number
  preliminar: number
  avancePct: number
  dif: number
  anioAnterior: number
  sobreForecast: number
}

export function compararPreliminar(lineas: V3Linea[]): CompPrelim {
  const i = V3_MES_EN_CURSO
  const forecastMes = sum(lineas.map((l) => l.realForecast[i]))
  const preliminar = sum(lineas.map((l) => v3Gestion[l.id].preliminar))
  const sobreForecast = lineas.filter((l) => v3Gestion[l.id].preliminar > l.realForecast[i]).length
  return { forecastMes, preliminar, avancePct: pct(preliminar, forecastMes), dif: preliminar - forecastMes, anioAnterior: sum(lineas.map((l) => l.realAnioAnterior[i])), sobreForecast }
}
