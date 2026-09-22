import { useState } from 'react'
import { useToast } from '@/shared/lib/use-toast'
import { FORECAST_MES_ACTUAL } from '@/data/forecast'
import type { ForecastN7Linea, ForecastMesNota } from '@/data/forecast-lineas'
import { useForecastStore } from './use-forecast-store'
import { calcN7Totals } from './forecast-edit-calc'
import { estaEnCero } from './hide-zero-lines'

interface EditTarget {
  n7: ForecastN7Linea
  monthKey: string
  monthLabel: string
  currentValue: number
}

interface PendingSubmit {
  n7: ForecastN7Linea
  monthKey: string
  monto: number
  nota: ForecastMesNota
}

export function useForecastEditarN7(roundId: string | undefined, n4Codigo: string | undefined) {
  const { rounds, updateN7Monto, resetLlaveN7 } = useForecastStore()
  const round = rounds.find((r) => r.id === roundId)
  const n4 = round?.lineas.find((l) => l.n4Codigo === n4Codigo)
  const { message, showToast } = useToast()

  const [editTarget, setEditTarget] = useState<EditTarget | null>(null)
  const [pending, setPending] = useState<PendingSubmit | null>(null)
  const [ocultarCeros, setOcultarCeros] = useState(true)

  const onDrawerSubmit = (monto: number, nota: ForecastMesNota) => {
    if (!editTarget) return
    setPending({ n7: editTarget.n7, monthKey: editTarget.monthKey, monto, nota })
    setEditTarget(null)
  }

  const confirmRuptura = () => {
    if (!round || !n4 || !pending) return
    updateN7Monto(round.id, n4.n4Codigo, pending.n7.n7Codigo, pending.monthKey, pending.monto, pending.nota)
    setPending(null)
    showToast('N7 marcado como edición manual — se desvinculó de la llave de distribución del servicio N4.')
  }

  const onResetLlave = (n7Codigo: string) => {
    if (!round || !n4) return
    resetLlaveN7(round.id, n4.n4Codigo, n7Codigo)
    showToast('Llave de distribución restablecida para este PEP N7.')
  }

  const n7s = n4?.n7 ?? []
  const n7Visibles = n4 ? (ocultarCeros ? n7s.filter((n7) => !estaEnCero(calcN7Totals(n4.n4Codigo, n7, FORECAST_MES_ACTUAL))) : n7s) : []

  return {
    round,
    n4,
    n7Visibles,
    ocultarCeros,
    setOcultarCeros,
    cutoff: FORECAST_MES_ACTUAL,
    message,
    editTarget,
    openEdit: (n7: ForecastN7Linea, monthKey: string, monthLabel: string, currentValue: number) => setEditTarget({ n7, monthKey, monthLabel, currentValue }),
    closeEdit: () => setEditTarget(null),
    onDrawerSubmit,
    rupturaOpen: pending !== null,
    cancelRuptura: () => setPending(null),
    confirmRuptura,
    onResetLlave,
  }
}
