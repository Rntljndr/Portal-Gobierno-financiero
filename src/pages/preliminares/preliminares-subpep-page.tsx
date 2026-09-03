import { useNavigate, useParams } from 'react-router'
import { Badge, Breadcrumb, Button, EmptyState, Icon } from '@/shared/ui'
import { PRELIM_MES_OPEN_LABEL } from '@/data/preliminares'
import { usePreliminaresStore } from './lib/use-preliminares-store'
import { PreliminaresTable } from './components/preliminares-table'
import { SubPepsTable } from './components/subpeps-table'

export function PreliminaresSubPepPage() {
  const { codigo, n7codigo } = useParams()
  const navigate = useNavigate()
  const store = usePreliminaresStore()
  const n4 = store.rows.find((r) => r.codigo === codigo)
  const n7 = n4?.children.find((c) => c.codigo === n7codigo)

  if (!n4 || !n7) {
    return (
      <div className="mx-8 my-8">
        <EmptyState icon="search" title="PEP N7 no encontrado" text="No existe un PEP N7 con ese código." />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <Breadcrumb
        items={[
          { label: 'SIP', to: '/' },
          { label: 'Presupuesto', to: '/ejercicios' },
          { label: 'Preliminares', to: '/preliminares' },
          { label: n4.servicio, to: `/preliminares/${encodeURIComponent(n4.codigo)}` },
          { label: n7.servicio },
        ]}
      />
      <div className="flex flex-wrap items-start justify-between gap-4 p-[10px_32px_18px]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-[20px] leading-tight font-bold tracking-tight text-primary">{n7.servicio}</span>
            <Badge variant="primary">{n7.codigo}</Badge>
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-[13px] text-muted-foreground">
            <Icon name="check" size={13} color="#067647" /> SubPEPs · {PRELIM_MES_OPEN_LABEL}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate(`/preliminares/${encodeURIComponent(n4.codigo)}`)}>
          <Icon name="chevron_left" size={12} color="currentColor" /> Volver a N7
        </Button>
      </div>

      <PreliminaresTable
        rows={[{ ...n7, parentServicio: n4.servicio }]}
        isN7
        itemLabel="PEP N7"
        mesLabel={PRELIM_MES_OPEN_LABEL.split(' ')[0]}
      />

      <div className="mx-8 mb-2 text-[13.5px] font-bold text-foreground">SubPEPs</div>
      <div className="mx-8 mb-8">
        <SubPepsTable n7Rows={[n7]} />
      </div>
    </div>
  )
}
