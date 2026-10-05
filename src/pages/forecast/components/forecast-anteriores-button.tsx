import { Button, Icon } from '@/shared/ui'

interface ForecastAnterioresButtonProps {
  anterioresCount: number
  onClick: () => void
}

/** Botón compacto (F: "más pequeña, como un solo botón") en el header de página, antes de "Cerrar
 * Forecast" — reemplaza a la card que ocupaba media fila. Abre el drawer de forecasts anteriores
 * (solo lectura). No hay concepto de "Borrador" a nivel forecast (ver data/forecast.ts). */
export function ForecastAnterioresButton({ anterioresCount, onClick }: ForecastAnterioresButtonProps) {
  return (
    <Button variant="outline" size="sm" disabled={anterioresCount === 0} onClick={onClick}>
      <Icon name="calendar" size={12} color="#0047B0" /> Otros forecast
    </Button>
  )
}
