import type { AnalysisGroup } from '@/data/reporteria'
import { formatTableAmount, formatTableAmountUSD } from '@/shared/lib/format'
import type { ScrollTarget } from '../lib/scroll-target'

interface Top5Item {
  nombre: string
  grup: string
  plan: number
  fBase: number
}

interface Top5CardProps {
  groups: AnalysisGroup[]
  isDolar?: boolean
  onItemClick?: (item: ScrollTarget) => void
}

export function Top5Card({ groups, isDolar = false, onItemClick }: Top5CardProps) {
  const items: Top5Item[] = []
  groups.forEach((g) => {
    g.children.forEach((c) => {
      items.push({ nombre: c.nombre, grup: g.nombre, plan: c.plan, fBase: c.fBase })
    })
  })
  items.sort((a, b) => b.fBase - a.fBase)
  const top5 = items.slice(0, 5)
  const maxVal = top5[0]?.fBase || 1
  const fmt = isDolar ? formatTableAmountUSD : formatTableAmount

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white">
      <div className="flex min-h-[45px] items-start border-b border-border p-[12px_16px]">
        <span className="text-[13px] font-bold text-foreground">Top 5 mayor gasto</span>
      </div>
      <div className="flex flex-1 flex-col">
        {top5.length === 0 && <div className="p-[20px_16px] text-center text-xs text-muted-foreground">Sin datos</div>}
        {top5.map((item, i) => (
          <Top5Row
            key={item.nombre}
            item={item}
            rank={i + 1}
            barPct={maxVal > 0 ? Math.round((item.fBase / maxVal) * 100) : 0}
            isLast={i === top5.length - 1}
            fmt={fmt}
            onClick={() => onItemClick?.({ nombre: item.nombre, grup: item.grup, ts: Date.now() })}
          />
        ))}
      </div>
    </div>
  )
}

function Top5Row({
  item,
  rank,
  barPct,
  isLast,
  fmt,
  onClick,
}: {
  item: Top5Item
  rank: number
  barPct: number
  isLast: boolean
  fmt: (v: number) => string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 flex-col justify-center p-[10px_16px] text-left hover:bg-[#F8FAFC] ${isLast ? '' : 'border-b border-border'}`}
    >
      <div className="mb-1 flex items-center gap-1.5">
        <span className="min-w-[14px] shrink-0 text-[11px] font-bold text-muted-foreground">{rank}</span>
        <span className="flex-1 truncate text-xs font-semibold text-foreground">{item.nombre}</span>
      </div>
      <div className="mb-[5px] pl-5">
        <div className="h-1 rounded-sm bg-[#E2E8F0]">
          <div className="h-full rounded-sm bg-primary" style={{ width: `${barPct}%` }} />
        </div>
      </div>
      <div className="pl-5 text-[10.5px] text-muted-foreground">
        Plan: {fmt(item.plan)}&emsp;FC: {fmt(item.fBase)}
      </div>
    </button>
  )
}
