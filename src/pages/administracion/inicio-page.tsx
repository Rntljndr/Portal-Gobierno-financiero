import { Breadcrumb, PageHeader, ShortcutGroup } from '@/shared/ui'
import { ADMIN_SECCION_GRUPOS } from './lib/admin-secciones'

export function AdminInicioPage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Administración' }]} />
      <PageHeader title="Administración" subtitle="Accede rápidamente a cualquiera de las secciones de administración del portal." />

      <div className="mx-8 mb-8 flex flex-col gap-6">
        {ADMIN_SECCION_GRUPOS.map((grupo) => (
          <ShortcutGroup key={grupo.label} label={grupo.label} icon={grupo.icon} secciones={grupo.secciones} />
        ))}
      </div>
    </div>
  )
}
