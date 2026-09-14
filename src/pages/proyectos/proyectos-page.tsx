import { Breadcrumb, ComingSoon, PageHeader } from '@/shared/ui'

export function ProyectosPage() {
  return (
    <div className="flex h-full flex-col">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Gestión de Proyectos' }]} />
      <PageHeader title="Gestión de Proyectos" subtitle="Seguimiento de proyectos de tecnología" />
      <div className="flex-1">
        <ComingSoon title="Gestión de Proyectos" />
      </div>
    </div>
  )
}
