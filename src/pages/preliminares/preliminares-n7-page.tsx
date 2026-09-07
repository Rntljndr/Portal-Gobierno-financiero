import { useNavigate, useParams } from 'react-router'
import { Badge, Breadcrumb, EmptyState, Icon, VolverBar } from '@/shared/ui'
import { usePreliminaresStore } from './lib/use-preliminares-store'
import { PreliminarDetalleSection } from './components/preliminar-detalle-section'
import { CierreIndicator } from './components/cierre-indicator'

export function PreliminaresN7Page() {
  const { codigo } = useParams()
  const navigate = useNavigate()
  const store = usePreliminaresStore()
  const n4 = store.rows.find((r) => r.codigo === codigo)

  if (!n4) {
    return (
      <div className="mx-8 my-8">
        <EmptyState icon="search" title="PEP no encontrado" text="No existe un PEP N4 con ese código." />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Presupuesto', to: '/ejercicios' }, { label: 'Preliminares', to: '/preliminares' }, { label: `N4 — ${n4.servicio}` }]} />
        <div className="flex flex-wrap items-start justify-between gap-4 p-[10px_32px_18px]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-[20px] leading-tight font-bold tracking-tight text-primary">N4 — {n4.servicio}</span>
              <Badge variant="primary">{n4.codigo}</Badge>
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-[13px] text-muted-foreground">
              <Icon name="check" size={13} color="#067647" /> Detalle de servicio · {store.mesAbierto}
            </div>
          </div>
          <CierreIndicator mesAbierto={store.mesAbierto} />
        </div>

        <PreliminarDetalleSection n4={n4} />
      </div>
      <VolverBar label="Volver" onBack={() => navigate('/preliminares')} />
    </div>
  )
}
