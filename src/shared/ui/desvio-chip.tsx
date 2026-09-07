import { Badge } from './badge'
import { Icon } from './icon'

/** Badge de desvío %, reutilizado por Reales y Preliminares. Solo rojo (positivo) o verde (negativo) — sin tono naranjo/amarillo intermedio. */
export function DesvioChip({ pct }: { pct: number | null }) {
  if (pct === null) return <Badge variant="neutral">—</Badge>
  const over = pct > 0
  const variant = over ? 'destructive' : 'success'

  return (
    <Badge variant={variant}>
      <Icon name={over ? 'alert' : 'check'} size={10} color="currentColor" />
      {over ? '+' : ''}
      {pct.toFixed(1)}%
    </Badge>
  )
}

/** Flechita de desvío para celdas angostas (Ajuste R5): sin fondo ni badge, solo el ícono — arriba en rojo si gasta de más, abajo en verde si ahorra, nada si es cero. */
export function DesvioArrow({ pct }: { pct: number | null }) {
  if (pct === null || Math.round(pct * 10) === 0) return null
  const over = pct > 0
  return <Icon name={over ? 'chevron_up' : 'chevron_down'} size={9} color={over ? '#B42318' : '#067647'} />
}
