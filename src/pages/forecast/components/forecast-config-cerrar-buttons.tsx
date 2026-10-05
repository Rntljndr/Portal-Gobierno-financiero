import { Button, Icon } from '@/shared/ui'

interface ForecastConfigCerrarButtonsProps {
  onOpenConfiguraciones: () => void
  onCerrar: () => void
}

/** Botones "Configuraciones" + "Cerrar Forecast" — mismo lugar fijo en todas las pantallas de Forecast
 * (F: "el título del servicio... los botones de configuración y cerrar forecast también debe estar
 * siempre en el mismo lugar, que en la pantalla principal de forecast"). Usado tanto en el header de
 * ForecastListPage (ForecastListHeaderActions) como en el de ForecastEditarN7Page. */
export function ForecastConfigCerrarButtons({ onOpenConfiguraciones, onCerrar }: ForecastConfigCerrarButtonsProps) {
  return (
    <>
      <Button variant="outline" size="sm" onClick={onOpenConfiguraciones}>
        <Icon name="config" size={12} color="#0047B0" /> Configuraciones
      </Button>
      <Button variant="primary" size="sm" className="bg-[#B42318] hover:bg-[#941d15]" onClick={onCerrar}>
        <Icon name="lock" size={12} color="#fff" /> Cerrar Forecast
      </Button>
    </>
  )
}
