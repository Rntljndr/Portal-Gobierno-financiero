import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Badge, Breadcrumb, Button, EmptyState, Icon, SegmentedTabs } from '@/shared/ui'
import { PRELIM_MES_OPEN_LABEL } from '@/data/preliminares'
import { realesRows } from '@/data/reales'
import { calcTotals as calcRealesTotals } from '../reales/lib/reales-calc'
import { RealesKpis } from '../reales/components/reales-kpis'
import { RealesTable } from '../reales/components/reales-table'
import { usePreliminaresStore } from './lib/use-preliminares-store'
import { PreliminarDetalleSection } from './components/preliminar-detalle-section'

export function PreliminaresN7Page() {
  const { codigo } = useParams()
  const navigate = useNavigate()
  const store = usePreliminaresStore()
  const n4 = store.rows.find((r) => r.codigo === codigo)
  const [vista, setVista] = useState<'preliminar' | 'real'>('preliminar')

  if (!n4) {
    return (
      <div className="mx-8 my-8">
        <EmptyState icon="search" title="PEP no encontrado" text="No existe un PEP N4 con ese código." />
      </div>
    )
  }

  const realN4 = realesRows.find((r) => r.codigo === codigo)

  return (
    <div className="h-full overflow-y-auto">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Presupuesto', to: '/ejercicios' }, { label: 'Preliminares', to: '/preliminares' }, { label: n4.servicio }]} />
      <div className="flex flex-wrap items-start justify-between gap-4 p-[10px_32px_18px]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-[20px] leading-tight font-bold tracking-tight text-primary">{n4.servicio}</span>
            <Badge variant="primary">{n4.codigo}</Badge>
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-[13px] text-muted-foreground">
            <Icon name="check" size={13} color="#067647" /> Detalle de servicio · {PRELIM_MES_OPEN_LABEL}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SegmentedTabs
            value={vista}
            onChange={setVista}
            options={[
              { value: 'preliminar', label: 'Vista Preliminar' },
              { value: 'real', label: 'Vista Real' },
            ]}
          />
          <Button variant="outline" size="sm" onClick={() => navigate('/preliminares')}>
            <Icon name="chevron_left" size={12} color="currentColor" /> Volver
          </Button>
        </div>
      </div>

      {vista === 'preliminar' ? (
        <PreliminarDetalleSection n4={n4} />
      ) : realN4 ? (
        <>
          <RealesKpis totals={calcRealesTotals(realN4)} currency="USD" />
          <RealesTable rows={realN4.children.map((c) => ({ ...c, parentCodigo: realN4.codigo, parentNombre: realN4.nombre }))} mode="n7" currency="USD" comparisons={[]} itemLabel="PEPs N7" />
        </>
      ) : (
        <div className="mx-8 mb-8">
          <EmptyState icon="search" title="Sin datos de Reales" text="Este servicio aún no tiene información en el módulo de Reales." />
        </div>
      )}
    </div>
  )
}
