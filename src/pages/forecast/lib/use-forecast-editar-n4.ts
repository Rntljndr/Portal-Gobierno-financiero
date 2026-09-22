import { useState } from 'react'
import { useToast } from '@/shared/lib/use-toast'
import { FORECAST_MES_ACTUAL } from '@/data/forecast'
import type { ForecastN4Linea, ForecastMesNota } from '@/data/forecast-lineas'
import { useForecastStore } from './use-forecast-store'
import { calcLlaveDistribucion } from './forecast-llave'
import { calcN4Totals } from './forecast-edit-calc'
import { estaEnCero } from './hide-zero-lines'

interface EditTarget {
  n4: ForecastN4Linea
  monthKey: string
  monthLabel: string
  currentValue: number
}

export function useForecastEditarN4(roundId: string | undefined) {
  const { rounds, updateN4Monto } = useForecastStore()
  const round = rounds.find((r) => r.id === roundId)
  const { message, showToast } = useToast()

  const [editTarget, setEditTarget] = useState<EditTarget | null>(null)
  const [ocultarCeros, setOcultarCeros] = useState(true)

  const submitEdit = (monto: number, nota: ForecastMesNota) => {
    if (!round || !editTarget) return
    updateN4Monto(round.id, editTarget.n4.n4Codigo, editTarget.monthKey, monto, nota)
    setEditTarget(null)
    showToast('Monto actualizado y distribuido según la llave de distribución.')
  }

  const lineas = round?.lineas ?? []
  const lineasVisibles = ocultarCeros ? lineas.filter((n4) => !estaEnCero(calcN4Totals(n4, FORECAST_MES_ACTUAL))) : lineas

  return {
    round,
    lineasVisibles,
    ocultarCeros,
    setOcultarCeros,
    cutoff: FORECAST_MES_ACTUAL,
    message,
    editTarget,
    llave: editTarget ? calcLlaveDistribucion(editTarget.n4, FORECAST_MES_ACTUAL) : [],
    openEdit: (n4: ForecastN4Linea, monthKey: string, monthLabel: string, currentValue: number) => setEditTarget({ n4, monthKey, monthLabel, currentValue }),
    closeEdit: () => setEditTarget(null),
    submitEdit,
  }
}
