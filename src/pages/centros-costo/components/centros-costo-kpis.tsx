import { Badge } from '@/shared/ui'
import type { CentroCostoRow } from '@/data/centros-costo'

function Kpi({ label, value, pillLabel }: { label: string; value: number; pillLabel?: string }) {
  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <div className="mb-1.5 text-[10.5px] font-bold tracking-[0.06em] text-muted-foreground uppercase">{label}</div>
      <div className="flex items-center gap-2 text-2xl font-extrabold text-foreground">
        {value}
        {pillLabel && <Badge variant="primary">{pillLabel}</Badge>}
      </div>
    </div>
  )
}

export function CentrosCostoKpis({ rows }: { rows: CentroCostoRow[] }) {
  const conDriver = rows.filter((r) => r.driverNomina || r.driverServicio || r.driverAmortizacion).length
  return (
    <div className="mx-8 mb-5 grid grid-cols-3 gap-3">
      <Kpi label="Total centros" value={rows.length} />
      <Kpi label="Centrales" value={rows.filter((r) => r.tipo === 'Central').length} pillLabel="central" />
      <Kpi label="Con driver asignado" value={conDriver} />
    </div>
  )
}
