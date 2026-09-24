import { Button, Icon } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import { HideZeroToggle } from './hide-zero-toggle'

interface ForecastTablaHeaderProps {
  activo: ForecastRound | undefined
  ocultarCeros: boolean
  onToggleOcultarCeros: (v: boolean) => void
  onImportar: () => void
  onDescargar: () => void
}

/** Header de la sección de servicios N4 en la pantalla principal de Forecast — extraído aparte solo
 * para mantener ForecastListPage bajo el límite de líneas del linter. */
export function ForecastTablaHeader({ activo, ocultarCeros, onToggleOcultarCeros, onImportar, onDescargar }: ForecastTablaHeaderProps) {
  return (
    <div className="mx-8 mb-3 flex flex-wrap items-center justify-between gap-3">
      <div className="text-[13px] font-bold text-foreground">Servicios N4{activo ? ` — ${activo.titulo}` : ''}</div>
      {activo && (
        <div className="flex items-center gap-2.5">
          <HideZeroToggle checked={ocultarCeros} onChange={onToggleOcultarCeros} />
          <Button variant="outline" size="sm" onClick={onImportar}>
            <Icon name="upload" size={12} color="#0047B0" /> Importar
          </Button>
          <Button variant="outline" size="sm" onClick={onDescargar}>
            <Icon name="download" size={12} color="#0047B0" /> Descargar
          </Button>
        </div>
      )}
    </div>
  )
}
