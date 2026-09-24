import { useState } from 'react'
import type { ForecastRound } from '@/data/forecast'
import { useForecastStore } from './use-forecast-store'
import { parseForecastImport, type ImportResult } from './forecast-import'

type Step = 'idle' | 'parsing' | 'result' | 'done'

export function useForecastCargaMasiva(round: ForecastRound | undefined) {
  const { updateN7MesesBatch } = useForecastStore()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('idle')
  const [fileName, setFileName] = useState('')
  const [result, setResult] = useState<ImportResult | null>(null)

  const reset = () => {
    setStep('idle')
    setFileName('')
    setResult(null)
  }

  const openDrawer = () => {
    reset()
    setOpen(true)
  }
  const closeDrawer = () => {
    setOpen(false)
    reset()
  }

  const onFile = async (file: File) => {
    if (!round) return
    setFileName(file.name)
    setStep('parsing')
    const parsed = await parseForecastImport(file, round)
    setResult(parsed)
    setStep('result')
  }

  const confirmar = () => {
    if (!round || !result?.preview) return
    const updates = result.rows.filter((r) => r.ok && r.meses).map((r) => ({ n4Codigo: r.n4Codigo, n7Codigo: r.n7Codigo, meses: r.meses! }))
    updateN7MesesBatch(round.id, updates)
    setStep('done')
  }

  return { open, step, fileName, result, openDrawer, closeDrawer, onFile, confirmar, reintentar: reset }
}
