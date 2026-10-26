import { Icon, KpiCard } from '@/shared/ui'
import type { EstructuraCounts } from '@/data/gerencias-equipos'

interface GerenciasEquiposKpiRowProps {
  counts: EstructuraCounts
}

/** Fila de KPIs del resumen (F: "debe tener una card para cada uno de estos campos como las card del
 * reporte de tecnología que están en la sección de Resumen consolidado") — mismo componente `KpiCard` y
 * mismo rótulo "Resumen" que `ConsolidadoKpiStrip` (Reporte Tecnología). */
export function GerenciasEquiposKpiRow({ counts }: GerenciasEquiposKpiRowProps) {
  return (
    <div className="mx-8 mb-5">
      <div className="mb-2.5 text-[11px] font-bold tracking-[0.08em] text-muted-foreground uppercase">Resumen</div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Gerencias" value={String(counts.gerencias)} icon={<Icon name="config" size={16} color="#0047B0" />} iconBg="#EEF1FB" />
        <KpiCard label="Equipos" value={String(counts.equipos)} icon={<Icon name="drives" size={16} color="#0047B0" />} iconBg="#EEF1FB" />
        <KpiCard label="Miembros" value={String(counts.miembros)} icon={<Icon name="user" size={16} color="#067647" />} iconBg="#E1FBEF" />
      </div>
    </div>
  )
}
