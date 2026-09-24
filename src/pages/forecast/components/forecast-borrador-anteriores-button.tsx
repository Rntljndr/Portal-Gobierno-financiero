import { Button, Icon } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'

interface ForecastBorradorAnterioresButtonProps {
  borrador: ForecastRound | undefined
  anterioresCount: number
  onClick: () => void
}

/** Botón compacto (F: "más pequeña, como un solo botón") en el header de página, antes de "Cerrar
 * Forecast" — reemplaza a la card que ocupaba media fila. Abre el mismo drawer con el borrador arriba
 * y el buscador de anteriores debajo. */
export function ForecastBorradorAnterioresButton({ borrador, anterioresCount, onClick }: ForecastBorradorAnterioresButtonProps) {
  const disabled = !borrador && anterioresCount === 0

  return (
    <Button variant="outline" size="sm" disabled={disabled} onClick={onClick}>
      <Icon name="calendar" size={12} color="#0047B0" /> Borrador y Anteriores
    </Button>
  )
}
