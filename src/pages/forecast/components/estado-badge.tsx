import { Badge } from '@/shared/ui'
import type { ForecastEstado } from '@/data/forecast'

const VARIANT: Record<ForecastEstado, 'success' | 'neutral'> = {
  Abierto: 'success',
  Cerrado: 'neutral',
}

const LABEL: Record<ForecastEstado, (manual: boolean) => string> = {
  Abierto: () => 'Abierto',
  Cerrado: (manual) => (manual ? 'Cerrado manualmente' : 'Cerrado'),
}

export function EstadoBadge({ estado, cerradoManual }: { estado: ForecastEstado; cerradoManual: boolean }) {
  return <Badge variant={VARIANT[estado]}>{LABEL[estado](cerradoManual)}</Badge>
}
