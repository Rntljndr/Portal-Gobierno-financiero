import { Breadcrumb, ComingSoon, PageHeader } from '@/shared/ui'

interface AdministracionPlaceholderPageProps {
  title: string
}

/** Pantalla placeholder para las secciones de Administración aún sin implementar (Países, Áreas, Divisiones, etc.). */
export function AdministracionPlaceholderPage({ title }: AdministracionPlaceholderPageProps) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Administración', to: '/administracion/peps' }, { label: title }]} />
      <PageHeader title={title} subtitle="Administración del sistema" />
      <div className="flex-1">
        <ComingSoon title={title} />
      </div>
    </div>
  )
}
