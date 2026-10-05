import { useState } from 'react'
import type { ForecastRound } from '@/data/forecast'
import { useForecastStore } from './use-forecast-store'
import { forecastIdentityDefaultVisible } from './forecast-identity-cols'

/** Estado de UI (drawers/modales abiertos) de ForecastEditarN7Page — agrupado en un solo hook para
 * mantener el componente de la página bajo el límite de líneas del linter. La comparativa de tabla
 * (Plan/Forecast anterior) vive en el store, no acá, para que la selección persista al navegar entre
 * el listado y el detalle de un servicio (F: "debe permanecer en todas las vistas"). */
export function useForecastN7EditarUi() {
  const { comparativa, setComparativa } = useForecastStore()
  const [closeTarget, setCloseTarget] = useState<ForecastRound | null>(null)
  const [compararOpen, setCompararOpen] = useState(false)
  const [editandoN7Codigo, setEditandoN7Codigo] = useState<string | null>(null)
  const [visibleColsN7, setVisibleColsN7] = useState<string[]>(() => forecastIdentityDefaultVisible('n7'))

  return {
    closeTarget,
    setCloseTarget,
    compararOpen,
    setCompararOpen,
    comparativa,
    setComparativa,
    editandoN7Codigo,
    setEditandoN7Codigo,
    visibleColsN7,
    setVisibleColsN7,
  }
}
