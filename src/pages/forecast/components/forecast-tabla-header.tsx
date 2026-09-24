import { Button, Icon } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import { HideZeroToggle } from './hide-zero-toggle'

interface ForecastTablaHeaderProps {
  activo: ForecastRound | undefined
  tab: 'n4' | 'n7'
  ocultarCeros: boolean
  onToggleOcultarCeros: (v: boolean) => void
  onImportar: () => void
  onDescargar: () => void
  onNuevo: () => void
  onCerrar: () => void
}

/** Header de la sección de servicios en la pantalla principal de Forecast — "Nuevo Forecast" y
 * "Cerrar Forecast" viven acá ahora (a la derecha de Importar/Descargar); su lugar anterior en el
 * header de página lo ocupan los tabs N4/N7 (F: "como en Reales"). Extraído aparte para mantener
 * ForecastListPage bajo el límite de líneas del linter. */
export function ForecastTablaHeader({ activo, tab, ocultarCeros, onToggleOcultarCeros, onImportar, onDescargar, onNuevo, onCerrar }: ForecastTablaHeaderProps) {
  return (
    <div className="mx-8 mb-3 flex flex-wrap items-center justify-between gap-3">
      <div className="text-[13px] font-bold text-foreground">
        {tab === 'n4' ? 'Servicios N4' : 'Servicios N7'}
        {activo ? ` — ${activo.titulo}` : ''}
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        {activo && (
          <>
            <HideZeroToggle checked={ocultarCeros} onChange={onToggleOcultarCeros} />
            <Button variant="outline" size="sm" onClick={onImportar}>
              <Icon name="upload" size={12} color="#0047B0" /> Importar
            </Button>
            <Button variant="outline" size="sm" onClick={onDescargar}>
              <Icon name="download" size={12} color="#0047B0" /> Descargar
            </Button>
          </>
        )}
        <Button variant="primary" size="sm" onClick={onNuevo}>
          <Icon name="plus" size={12} color="#fff" /> Nuevo Forecast
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-[#FECACA] text-[#B42318] hover:bg-[#FEE8E8] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
          disabled={!activo}
          onClick={onCerrar}
        >
          <Icon name="x_close" size={12} color="#B42318" /> Cerrar Forecast
        </Button>
      </div>
    </div>
  )
}
