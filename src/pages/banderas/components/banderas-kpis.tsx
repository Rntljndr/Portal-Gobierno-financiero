import type { BanderaRow } from '@/data/banderas'

function Kpi({ label, value, pillLabel, pillTone }: { label: string; value: number; pillLabel?: string; pillTone?: 'ok' | 'info' }) {
  const pillClass = pillTone === 'ok' ? 'bg-[#E1FBEF] text-[#067647]' : 'bg-[#E0EAFB] text-cs-azul'
  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <div className="mb-1.5 text-[10.5px] font-bold tracking-[0.06em] text-muted-foreground uppercase">{label}</div>
      <div className="flex items-center gap-2 text-2xl font-extrabold text-foreground">
        {value}
        {pillLabel && <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold ${pillClass}`}>{pillLabel}</span>}
      </div>
    </div>
  )
}

export function BanderasKpis({ rows }: { rows: BanderaRow[] }) {
  return (
    <div className="mx-8 mb-5 grid grid-cols-4 gap-3">
      <Kpi label="Total banderas" value={rows.length} />
      <Kpi label="Activas" value={rows.filter((r) => r.estado === 'activo').length} pillLabel="activo" pillTone="ok" />
      <Kpi label="Visibles para driver" value={rows.filter((r) => r.visible).length} pillLabel="visible" pillTone="info" />
      <Kpi label="Países" value={new Set(rows.map((r) => r.pais)).size} />
    </div>
  )
}
