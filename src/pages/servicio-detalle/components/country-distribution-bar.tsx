import { useState } from 'react'
import { paisFlag, type Pais } from '@/data/services'

const BLUE_PALETTE = ['#0B4A99', '#246FD1', '#4E99F5', '#7DB8FF', '#A8D0FF', '#CDE5FF', '#EAF4FF']

interface Segment {
  pais: Pais
  pct: number
  color: string
}

export function CountryDistributionBar({ segments }: { segments: { pais: Pais; pct: number }[] }) {
  const [hovered, setHovered] = useState<Pais | null>(null)
  const colored: Segment[] = [...segments]
    .sort((a, b) => b.pct - a.pct)
    .map((s, i) => ({ ...s, color: BLUE_PALETTE[Math.min(i, BLUE_PALETTE.length - 1)] }))

  return (
    <div className="p-[14px_24px]">
      <div className="mb-2.5 flex h-2.5 overflow-hidden rounded-md">
        {colored.map((s) => (
          <div
            key={s.pais}
            className="relative cursor-pointer transition-[filter]"
            style={{
              width: `${s.pct}%`,
              background: s.color,
              filter: hovered && hovered !== s.pais ? 'grayscale(100%)' : 'none',
            }}
            onMouseEnter={() => setHovered(s.pais)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-4">
        {colored.map((s) => (
          <div
            key={s.pais}
            className="flex items-center gap-1.5 text-xs text-cs-gris-oscuro"
            style={{ filter: hovered && hovered !== s.pais ? 'grayscale(100%)' : 'none' }}
            onMouseEnter={() => setHovered(s.pais)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="inline-block size-2 shrink-0 rounded-sm" style={{ background: s.color }} />
            <span>{paisFlag[s.pais]}</span>
            <span className="font-semibold">{s.pct.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
