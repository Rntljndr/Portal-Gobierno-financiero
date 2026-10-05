import { useEffect, useState } from 'react'
import { useToast } from '@/shared/lib/use-toast'
import { FORECAST_MES_ACTUAL } from '@/data/forecast'
import { monthKeys } from '@/data/reporteria'
import type { ForecastN7Linea } from '@/data/forecast-lineas'
import { useForecastStore } from './use-forecast-store'
import { n7Identidad } from './forecast-identidad'
import { findPlanN7 } from './forecast-edit-calc'

export const FORECAST_JUSTIFICACION_OPTIONS = [
  'Sin desvío presupuestario',
  'Variación de tipo de cambio',
  'Cambio de alcance del servicio',
  'Ajuste por estacionalidad',
  'Otro',
]

function buildDraft(n7: ForecastN7Linea | undefined, cutoff: number): Record<string, string> {
  const draft: Record<string, string> = {}
  if (!n7) return draft
  monthKeys.forEach((k, i) => {
    if (i >= cutoff) draft[k] = String(n7.meses[k] || 0)
  })
  return draft
}

/** Estado de ForecastN7DetallePage (F, copiada de GestionOpex QA): los meses restantes del año se
 * editan directo en la Tabla de Forecast (inputs, no un drawer por celda) y quedan en `draft` hasta
 * que se presiona "Guardar", que los aplica todos juntos en un solo updateN7MesesBatch junto con la
 * Justificación de Desvío / Comentarios. "Distribuir Montos" no existe a nivel N7 (C7) — solo tiene
 * sentido a nivel N4, sobre el agregado de sus PEP N7 (ver A6). */
export function useForecastEditarN7Detalle(roundId: string | undefined, n4Codigo: string | undefined, n7Codigo: string | undefined) {
  const { rounds, updateN7MesesBatch } = useForecastStore()
  const round = rounds.find((r) => r.id === roundId)
  const n4 = round?.lineas.find((l) => l.n4Codigo === n4Codigo)
  const n7 = n4?.n7.find((l) => l.n7Codigo === n7Codigo)
  const { message, showToast } = useToast()
  const cutoff = FORECAST_MES_ACTUAL

  const [draft, setDraft] = useState<Record<string, string>>(() => buildDraft(n7, cutoff))
  const [justificacion, setJustificacion] = useState(FORECAST_JUSTIFICACION_OPTIONS[0])
  const [comentario, setComentario] = useState('')

  // Depende de n7Codigo (estable), no de `n7` (nueva referencia en cada update del store): si
  // dependiera de `n7`, guardar pisaría el draft justo guardado con el valor viejo.
  useEffect(() => {
    setDraft(buildDraft(n7, cutoff))
    setJustificacion(FORECAST_JUSTIFICACION_OPTIONS[0])
    setComentario('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n7?.n7Codigo, cutoff])

  const setMes = (monthKey: string, value: string) => setDraft((d) => ({ ...d, [monthKey]: value }))

  const editables = monthKeys.filter((_, i) => i >= cutoff)

  /** F: "se debe agregar un campo que sea monto total a asignar, según los meses que quedan para
   * forecastear" — reemplaza "Repetir primer mes"/flechas por fila: un monto único se reparte EN
   * PARTES IGUALES entre los meses de forecast aún abiertos (F: "el monto será distribuido
   * igualitariamente", mismo criterio que ForecastEditarMontosModal/"Asignación de monto" de
   * Presupuesto) — el último mes absorbe el redondeo. */
  const aplicarMontoTotal = (monto: number) => {
    let acumulado = 0
    setDraft((d) => {
      const next = { ...d }
      editables.forEach((k, i) => {
        const partesIguales = Math.round(monto / editables.length)
        const valor = i === editables.length - 1 ? Math.round(monto - acumulado) : partesIguales
        acumulado += valor
        next[k] = String(valor)
      })
      return next
    })
  }

  const guardar = () => {
    if (!round || !n4 || !n7) return
    const meses = Object.fromEntries(monthKeys.filter((_, i) => i >= cutoff).map((k) => [k, Number(draft[k]) || 0]))
    updateN7MesesBatch(round.id, [{ n4Codigo: n4.n4Codigo, n7Codigo: n7.n7Codigo, meses, notas: { justificacion, comentario: comentario || undefined } }])
    showToast('Forecast guardado.')
  }

  const identidad = round && n4 && n7 ? n7Identidad(n4.n4Codigo, n7, n4.n7, cutoff) : null
  const plan = n4 && n7 ? findPlanN7(n4.n4Codigo, n7.n7Codigo) : {}

  // ¿Hay algo sin guardar? (F: "si se ha modificado un dato" — confirmar antes de salir). Compara el
  // draft contra el mismo baseline que lo llenó al entrar, más justificación/comentario tocados.
  const baseline = buildDraft(n7, cutoff)
  const hasChanges = Object.keys(baseline).some((k) => draft[k] !== baseline[k]) || justificacion !== FORECAST_JUSTIFICACION_OPTIONS[0] || comentario.trim() !== ''

  return {
    round,
    n4,
    n7,
    identidad,
    plan,
    cutoff,
    draft,
    setMes,
    aplicarMontoTotal,
    justificacion,
    setJustificacion,
    comentario,
    setComentario,
    guardar,
    hasChanges,
    message,
  }
}
