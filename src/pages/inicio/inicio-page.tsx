import { Breadcrumb, PageHeader } from '@/shared/ui'
import { DashboardHero } from './components/hero'
import { DashboardKpiRow } from './components/kpi-row'
import { DashboardShortcuts } from './components/shortcuts'
import { RecentActivity } from './components/recent-activity'

export function InicioPage() {
  return (
    <div className="h-full overflow-y-auto">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Inicio' }]} />
      <PageHeader
        title="Bienvenida, Andrea"
        subtitle="Resumen de tus servicios y líneas presupuestarias"
        action={<span className="text-xs font-medium text-muted-foreground">Última actualización: Hoy, 09:41 AM</span>}
      />
      <DashboardHero />
      <DashboardKpiRow />
      <DashboardShortcuts />
      <RecentActivity />
    </div>
  )
}
