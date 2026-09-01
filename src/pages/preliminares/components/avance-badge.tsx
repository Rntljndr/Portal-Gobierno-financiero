import { Badge, Icon } from '@/shared/ui'
import { prelimFmt } from '../lib/preliminares-calc'

export function AvanceBadge({ pct }: { pct: number | null }) {
  if (pct === null) {
    return <Badge variant="neutral">Sin dato</Badge>
  }
  const low = pct < 85
  const high = pct > 105
  const variant = high ? 'destructive' : low ? 'warning' : 'success'

  return (
    <Badge variant={variant}>
      <Icon name={high || low ? 'alert' : 'check'} size={10} color="currentColor" />
      {pct.toFixed(1)}%
    </Badge>
  )
}

export function DifChip({ dif, moneda }: { dif: number | null; moneda: string }) {
  if (dif === null) return <span className="text-xs text-muted-foreground">—</span>
  const isPos = dif > 0
  return (
    <span className={`font-mono text-[12.5px] font-semibold tabular-nums ${isPos ? 'text-destructive' : 'text-success'}`}>
      {isPos ? '+' : ''}
      {prelimFmt(dif, moneda)}
    </span>
  )
}
