import { useEffect, useState } from 'react'
import { useToast } from '@/shared/lib/use-toast'
import { FORECAST_MES_ACTUAL } from '@/data/forecast'
import { monthKeys } from '@/data/reporteria'
import type { ForecastMesNota } from '@/data/forecast-lineas'
import { useForecastStore } from './use-forecast-store'
import { n4Identidad } from './forecast-identidad'
import { distribuirMontoN4 } from './forecast-llave'
import { calcN4Meses } from './forecast-edit-calc'
import { FORECAST_JUSTIFICACION_OPTIONS } from './use-forecast-editar-n7-detalle'

interface EditTarget {
  monthKey: string
  monthLabel: string
  currentValue: number
}

/** Estado de ForecastN4DetallePage — análogo a useForecastEditarN7Detalle pero a nivel de servicio
 * N4: editar un mes (o varios, vía "Distribuir Montos") redistribuye el monto entre los N7 hijos según
 * la llave vigente (forecast-llave.ts), en vez de escribir directo como en un N7. */
export function useForecastEditarN4Detalle(roundId: string | undefined, n4Codigo: string | undefined) {
  const { rounds, updateN4Monto, updateN7MesesBatch } = useForecastStore()
  const round = rounds.find((r) => r.id === roundId)
  const n4 = round?.lineas.find((l) => l.n4Codigo === n4Codigo)
  const { message, showToast } = useToast()
  const cutoff = FORECAST_MES_ACTUAL

  const [editTarget, setEditTarget] = useState<EditTarget | null>(null)
  const [distribuirOpen, setDistribuirOpen] = useState(false)
  const [justificacion, setJustificacion] = useState(FORECAST_JUSTIFICACION_OPTIONS[0])
  const [comentario, setComentario] = useState('')

  // Por n4Codigo (estable), no por `n4` — ver mismo criterio en use-forecast-editar-n7-detalle.ts.
  useEffect(() => {
    setJustificacion(FORECAST_JUSTIFICACION_OPTIONS[0])
    setComentario('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n4?.n4Codigo])

  const openEdit = (monthKey: string, monthLabel: string, currentValue: number) => setEditTarget({ monthKey, monthLabel, currentValue })
  const closeEdit = () => setEditTarget(null)

  const submitEdit = (monto: number, nota: ForecastMesNota) => {
    if (!round || !n4 || !editTarget) return
    updateN4Monto(round.id, n4.n4Codigo, editTarget.monthKey, monto, nota)
    setEditTarget(null)
    showToast('Monto actualizado y distribuido según la llave de distribución.')
  }

  /** Aplica varios meses a la vez: cada mes se redistribuye entre los N7 automáticos según la llave
   * vigente en ESE momento (igual que editar mes a mes, pero en un solo guardado) — ver
   * distribuirMontoN4 (forecast-llave.ts). */
  const aplicarDistribucion = (meses: Record<string, number>) => {
    if (!round || !n4 || Object.keys(meses).length === 0) return
    let working = n4
    const porN7: Record<string, Record<string, number>> = {}
    for (const [monthKey, monto] of Object.entries(meses)) {
      const n7s = distribuirMontoN4(working, monthKey, monto, cutoff)
      working = { ...working, n7: n7s }
      n7s.forEach((n7) => {
        porN7[n7.n7Codigo] ??= {}
        porN7[n7.n7Codigo][monthKey] = n7.meses[monthKey] ?? 0
      })
    }
    updateN7MesesBatch(
      round.id,
      Object.entries(porN7).map(([n7Codigo, mesesN7]) => ({ n4Codigo: n4.n4Codigo, n7Codigo, meses: mesesN7 })),
    )
    setDistribuirOpen(false)
    showToast('Distribución aplicada.')
  }

  const guardarNota = () => {
    if (!round || !n4) return
    const monthKey = monthKeys[cutoff] ?? monthKeys[monthKeys.length - 1]
    const monto = calcN4Meses(n4)[monthKey] || 0
    updateN4Monto(round.id, n4.n4Codigo, monthKey, monto, { justificacion, comentario: comentario || undefined })
    showToast('Justificación guardada.')
  }

  const identidad = round && n4 ? n4Identidad(n4) : null

  return {
    round,
    n4,
    identidad,
    cutoff,
    editTarget,
    openEdit,
    closeEdit,
    submitEdit,
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
