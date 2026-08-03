import { Breadcrumb, EmptyState, PageHeader } from '@/shared/ui'

export function ReportesPage() {
  return (
    <div className="flex h-full flex-col">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Reportes' }]} />
      <PageHeader title="Reportes" subtitle="Reportes ejecutivos y descargas" />
      <div className="mx-8 mb-6">
        <EmptyState
          icon="chart"
          iconColor="#0047B0"
          title="Próximamente"
          text="El módulo de reportes estará disponible en una próxima iteración."
        />
      </div>
    </div>
  )
}
