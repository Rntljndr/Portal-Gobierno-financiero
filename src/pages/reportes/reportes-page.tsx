import { useNavigate } from 'react-router'
import { Breadcrumb, Icon, NavShortcutCard, PageHeader } from '@/shared/ui'

export function ReportesPage() {
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Reportes' }]} />
      <PageHeader title="Reportes" subtitle="Reportes ejecutivos y descargas" />
      <div className="mx-8 mb-6 grid grid-cols-2 gap-[18px]">
        <NavShortcutCard
          icon={<Icon name="dashboard" size={18} color="#1F6F47" />}
          label="Negocio"
          title="Reporte Negocio"
          description="Consolidado ejecutivo por país, división y bandera"
          buttonLabel="Ver"
          onNavigate={() => navigate('/reporte-plan?reporte=negocio')}
        />
        <NavShortcutCard
          icon={<Icon name="view_cards" size={18} color="#1F6F47" />}
          label="Tecnología"
          title="Reporte Tecnología"
          description="Presupuesto consolidado por país, gerencia y rubro"
          buttonLabel="Ver"
          onNavigate={() => navigate('/reporte-plan?reporte=tecnologia')}
        />
      </div>
    </div>
  )
}
