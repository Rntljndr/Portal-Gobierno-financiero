import { Badge } from '@/shared/ui'

/** Badge de completitud del N4 (M6) — cuánto de sus PEP N7 ya salió de "Abierto". Mismo estilo que
 * CompletitudBadge de Preliminares (preliminares/components/estado-badge.tsx): un único Badge
 * variant="primary" con solo el número, sin variación de color ni texto adicional. */
export function ForecastCompletitudBadge({ pct }: { pct: number }) {
  return <Badge variant="primary">{pct}%</Badge>
}
