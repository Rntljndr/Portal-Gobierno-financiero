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

/** Estado y guardado de ForecastN7DetallePage (F: "tabla con la información de los meses restantes
 * del año para realizar los movimientos para el forecast") — a diferencia de ForecastEditDrawer (un
 * mes a la vez), acá se editan todos los meses restantes del año juntos y se guardan en un solo
 * updateN7MesesBatch, con una única Justificación de Desvío + Comentarios para todo el conjunto. */
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

  // Depende de n7Codigo (estable) a propósito, no de `n7` (nueva referencia en cada update del
  // store): si dependiera de `n7`, guardar pisaría el draft justo guardado con el valor viejo.
  useEffect(() => {
    setDraft(buildDraft(n7, cutoff))
    setJustificacion(FORECAST_JUSTIFICACION_OPTIONS[0])
    setComentario('')
  }, [n7?.n7Codigo, cutoff])

  const setMes = (monthKey: string, value: string) => setDraft((d) => ({ ...d, [monthKey]: value }))

  const aplicarMesConjunto = () => {
    const editables = monthKeys.filter((_, i) => i >= cutoff)
    const primero = editables[0]
    if (!primero) return
    const valor = draft[primero] ?? '0'
    setDraft((d) => Object.fromEntries(editables.map((k) => [k, valor])) as typeof d)
  }

  const guardar = () => {
    if (!round || !n4 || !n7) return
    const meses = Object.fromEntries(monthKeys.filter((_, i) => i >= cutoff).map((k) => [k, Number(draft[k]) || 0]))
    updateN7MesesBatch(round.id, [{ n4Codigo: n4.n4Codigo, n7Codigo: n7.n7Codigo, meses, notas: { justificacion, comentario: comentario || undefined } }])
    showToast('Forecast actualizado.')
  }

  const identidad = round && n4 && n7 ? n7Identidad(n4.n4Codigo, n7, n4.n7, cutoff) : null
  const plan = n4 && n7 ? findPlanN7(n4.n4Codigo, n7.n7Codigo) : {}

  return { round, n4, n7, identidad, plan, cutoff, draft, setMes, aplicarMesConjunto, justificacion, setJustificacion, comentario, setComentario, guardar, message }
}
