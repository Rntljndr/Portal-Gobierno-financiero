import { useState } from 'react'
import type { LlaveSegment } from '../lib/forecast-llave'

const BLUE_PALETTE = ['#0047B0', '#3B82F6', '#7DB8FF', '#A8D0FF', '#CDE5FF', '#EAF4FF']

/** Barra segmentada de la llave de distribución N4→N7. Patrón visual de CountryDistributionBar (servicio-detalle), replicado sin import cruzado entre pages. Los N7 con edición manual se dibujan con borde punteado en tono warning. */
export function ForecastLlaveBar({ segments }: { segments: LlaveSegment[] }) {
  const [hovered, setHovered] = useState<string | null>(null)
  if (segments.length === 0) return null

  return (
    <div>
      <div className="mb-2 flex h-2.5 gap-px overflow-hidden rounded-md">
        {segments.map((s, i) => (
          <div
            key={s.n7Codigo}
            className="relative cursor-pointer transition-[filter]"
            style={{
              width: `${Math.max(s.pct, 0.5)}%`,
              background: s.manual ? '#FFFBEB' : BLUE_PALETTE[Math.min(i, BLUE_PALETTE.length - 1)],
              border: s.manual ? '1.5px dashed #F59E0B' : undefined,
              filter: hovered && hovered !== s.n7Codigo ? 'grayscale(100%)' : 'none',
            }}
            onMouseEnter={() => setHovered(s.n7Codigo)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        {segments.map((s, i) => (
          <div
            key={s.n7Codigo}
            className="flex items-center gap-1.5 text-[11px] text-cs-gris-oscuro"
            style={{ filter: hovered && hovered !== s.n7Codigo ? 'grayscale(100%)' : 'none' }}
            onMouseEnter={() => setHovered(s.n7Codigo)}
            onMouseLeave={() => setHovered(null)}
          >
            <span
              className="inline-block size-2 shrink-0 rounded-sm"
              style={{ background: s.manual ? '#FFFBEB' : BLUE_PALETTE[Math.min(i, BLUE_PALETTE.length - 1)], border: s.manual ? '1.5px dashed #F59E0B' : undefined }}
            />
            <span className="max-w-[130px] truncate">{s.n7Nombre}</span>
            <span className="font-semibold">{s.pct.toFixed(0)}%</span>
            {s.manual && <span className="text-warning">manual</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
