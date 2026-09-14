import { Breadcrumb, ComingSoon, PageHeader } from '@/shared/ui'

export function SolicitudesPage() {
  return (
    <div className="flex h-full flex-col">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Solicitudes' }]} />
      <PageHeader title="Solicitudes" subtitle="Solicitudes de servicios y cambios" />
      <div className="flex-1">
        <ComingSoon title="Solicitudes" />
      </div>
    </div>
  )
}
