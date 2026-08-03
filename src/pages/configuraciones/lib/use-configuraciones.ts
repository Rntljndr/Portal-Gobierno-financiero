import { useRef, useState } from 'react'
import { buildEmptyCotizaciones, buildEmptyIpc, type CotizacionesPorPais, type IpcPorPais } from '@/data/configuraciones'

const ANIO = 2026

function snapshot(fechaInicio: string, fechaFin: string, ipc: IpcPorPais, cotizaciones: CotizacionesPorPais) {
  return JSON.stringify({ fechaInicio, fechaFin, ipc, cotizaciones })
}

export function useConfiguraciones() {
  const [fechaInicio, setFechaInicio] = useState(`${ANIO}-01-01`)
  const [fechaFin, setFechaFin] = useState(`${ANIO}-12-31`)
  const [ipc, setIpc] = useState<IpcPorPais>(buildEmptyIpc)
  const [cotizaciones, setCotizaciones] = useState<CotizacionesPorPais>(buildEmptyCotizaciones)
  const [saving, setSaving] = useState(false)
  const savedSnapshot = useRef(snapshot(`${ANIO}-01-01`, `${ANIO}-12-31`, buildEmptyIpc(), buildEmptyCotizaciones()))

  const hasChanges = snapshot(fechaInicio, fechaFin, ipc, cotizaciones) !== savedSnapshot.current

  const onIpcChange = (pais: string, value: string) => setIpc((prev) => ({ ...prev, [pais]: value }))

  const onCotizacionSave = (pais: string, values: Record<string, string>) =>
    setCotizaciones((prev) => ({ ...prev, [pais]: values }))

  const save = (onDone: () => void) => {
    setSaving(true)
    setTimeout(() => {
      savedSnapshot.current = snapshot(fechaInicio, fechaFin, ipc, cotizaciones)
      setSaving(false)
      onDone()
    }, 600)
  }

  return { fechaInicio, setFechaInicio, fechaFin, setFechaFin, ipc, onIpcChange, cotizaciones, onCotizacionSave, hasChanges, saving, save }
}
