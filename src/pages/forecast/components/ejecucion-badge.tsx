import { Badge } from '@/shared/ui'
import { clasificarEjecucion } from '../lib/ejecucion-thresholds'

const LABELS = { ahorro: 'Ahorro', 'en-ejecucion': 'En ejecución', 'sobre-ejecucion': 'Sobre ejecución' } as const
const VARIANTS = { ahorro: 'success', 'en-ejecucion': 'neutral', 'sobre-ejecucion': 'destructive' } as const

/** Etiqueta junto al % de desvío (Ajuste T4) — el signo por sí solo generaba confusión, así que se
 * suma un texto explícito coherente con el color del chip existente (DesvioChip). */
export function EjecucionBadge({ pct }: { pct: number | null }) {
  const estado = clasificarEjecucion(pct)
  if (!estado) return null
  return (
    <Badge variant={VARIANTS[estado]} className="text-[9px] tracking-wide whitespace-nowrap">
      {LABELS[estado]}
    </Badge>
  )
}
