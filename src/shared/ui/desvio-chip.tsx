import { Badge } from './badge'
import { Icon } from './icon'

/** Badge de desvío %, reutilizado por Reales y Preliminares. */
export function DesvioChip({ pct }: { pct: number | null }) {
  if (pct === null) return <Badge variant="neutral">—</Badge>
  const over = pct > 0
  const warn = Math.abs(pct) > 5
  const variant = warn && over ? 'destructive' : over ? 'warning' : 'success'

  return (
    <Badge variant={variant}>
      <Icon name={over ? 'alert' : 'check'} size={10} color="currentColor" />
      {over ? '+' : ''}
      {pct.toFixed(1)}%
    </Badge>
  )
}
