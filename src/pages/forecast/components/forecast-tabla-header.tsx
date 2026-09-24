import { Button, Icon } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'

interface ForecastTablaHeaderProps {
  activo: ForecastRound | undefined
  tab: 'n4' | 'n7'
  onImportar: () => void
  onDescargar: () => void
}

/** Header de la sección de servicios en la pantalla principal de Forecast — Importar/Descargar. El
 * checkbox "Ocultar líneas en cero" se eliminó de acá (F); el ocultamiento de líneas en cero sigue
 * aplicado por defecto (ver useForecastEditarN4), solo que ya no hay control para desactivarlo desde
 * esta pantalla. "Nuevo Forecast"/"Cerrar Forecast" volvieron al header de página (F). Extraído aparte
 * para mantener ForecastListPage bajo el límite de líneas del linter. */
export function ForecastTablaHeader({ activo, tab, onImportar, onDescargar }: ForecastTablaHeaderProps) {
  return (
    <div className="mx-8 mb-3 flex flex-wrap items-center justify-between gap-3">
      <div className="text-[13px] font-bold text-foreground">
        {tab === 'n4' ? 'Servicios N4' : 'Servicios N7'}
        {activo ? ` — ${activo.titulo}` : ''}
      </div>
      {activo && (
        <div className="flex flex-wrap items-center gap-2.5">
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
