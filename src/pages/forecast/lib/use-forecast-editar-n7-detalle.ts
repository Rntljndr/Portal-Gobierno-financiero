import { useEffect, useState } from 'react'
import { useToast } from '@/shared/lib/use-toast'
import { FORECAST_MES_ACTUAL } from '@/data/forecast'
import { monthKeys } from '@/data/reporteria'
import type { ForecastMesNota } from '@/data/forecast-lineas'
import { useForecastStore } from './use-forecast-store'
import { n7Identidad } from './forecast-identidad'

export const FORECAST_JUSTIFICACION_OPTIONS = [
  'Sin desvío presupuestario',
  'Variación de tipo de cambio',
  'Cambio de alcance del servicio',
  'Ajuste por estacionalidad',
  'Otro',
]

interface EditTarget {
  monthKey: string
  monthLabel: string
  currentValue: number
}

/** Estado de ForecastN7DetallePage: edición celda a celda (igual patrón que el resto de Forecast, vía
 * ForecastEditDrawer sobre ForecastN7Table) + el drawer de "Distribuir Montos" (varios meses a la vez)
 * + la Justificación de Desvío / Comentarios general del PEP, que se guarda como nota del primer mes
 * abierto (mismo lugar de donde ya lee "Motivo" el resto del módulo — ver forecast-identidad.ts). */
export function useForecastEditarN7Detalle(roundId: string | undefined, n4Codigo: string | undefined, n7Codigo: string | undefined) {
  const { rounds, updateN7Monto, updateN7MesesBatch, resetLlaveN7 } = useForecastStore()
  const round = rounds.find((r) => r.id === roundId)
  const n4 = round?.lineas.find((l) => l.n4Codigo === n4Codigo)
  const n7 = n4?.n7.find((l) => l.n7Codigo === n7Codigo)
  const { message, showToast } = useToast()
  const cutoff = FORECAST_MES_ACTUAL

  const [editTarget, setEditTarget] = useState<EditTarget | null>(null)
  const [distribuirOpen, setDistribuirOpen] = useState(false)
  const [justificacion, setJustificacion] = useState(FORECAST_JUSTIFICACION_OPTIONS[0])
  const [comentario, setComentario] = useState('')

  // Reinicia el formulario de justificación al entrar a otro PEP N7 (por n7Codigo, estable — no por
  // `n7`, que cambia de referencia en cada edición y pisaría lo que el usuario recién escribió).
  useEffect(() => {
    setJustificacion(FORECAST_JUSTIFICACION_OPTIONS[0])
    setComentario('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n7?.n7Codigo])

  const openEdit = (monthKey: string, monthLabel: string, currentValue: number) => setEditTarget({ monthKey, monthLabel, currentValue })
  const closeEdit = () => setEditTarget(null)

  const submitEdit = (monto: number, nota: ForecastMesNota) => {
    if (!round || !n4 || !n7 || !editTarget) return
    updateN7Monto(round.id, n4.n4Codigo, n7.n7Codigo, editTarget.monthKey, monto, nota)
    setEditTarget(null)
    showToast('Monto actualizado.')
  }

  const onResetLlave = () => {
    if (!round || !n4 || !n7) return
    resetLlaveN7(round.id, n4.n4Codigo, n7.n7Codigo)
    showToast('Llave de distribución restablecida para este PEP N7.')
  }

  const aplicarDistribucion = (meses: Record<string, number>) => {
    if (!round || !n4 || !n7 || Object.keys(meses).length === 0) return
    updateN7MesesBatch(round.id, [{ n4Codigo: n4.n4Codigo, n7Codigo: n7.n7Codigo, meses }])
    setDistribuirOpen(false)
    showToast('Distribución aplicada.')
  }

  const guardarNota = () => {
    if (!round || !n4 || !n7) return
    const monthKey = monthKeys[cutoff] ?? monthKeys[monthKeys.length - 1]
    updateN7Monto(round.id, n4.n4Codigo, n7.n7Codigo, monthKey, n7.meses[monthKey] || 0, { justificacion, comentario: comentario || undefined })
    showToast('Justificación guardada.')
  }

  const identidad = round && n4 && n7 ? n7Identidad(n4.n4Codigo, n7, n4.n7, cutoff) : null

  return {
    round,
    n4,
    n7,
    identidad,
    cutoff,
    editTarget,
    openEdit,
    closeEdit,
    submitEdit,
    onResetLlave,
    distribuirOpen,
    setDistribuirOpen,
    aplicarDistribucion,
    justificacion,
    setJustificacion,
    comentario,
    setComentario,
    guardarNota,
    message,
  }
}
