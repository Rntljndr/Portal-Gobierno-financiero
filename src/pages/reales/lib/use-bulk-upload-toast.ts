import { useState } from 'react'

/** Toast de confirmación de carga masiva, repetido en las 3 pantallas de Reales. */
export function useBulkUploadToast() {
  const [toast, setToast] = useState<string | null>(null)
  const onApplied = (count: number) => {
    setToast(`${count} filas de reales cargadas correctamente.`)
    setTimeout(() => setToast(null), 4000)
  }
  return { toast, onApplied }
}
