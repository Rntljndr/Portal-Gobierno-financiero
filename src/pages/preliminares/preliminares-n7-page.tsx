import { useNavigate, useParams } from 'react-router'
import { Badge, Breadcrumb, Button, EmptyState, Icon } from '@/shared/ui'
import { preliminaresRows, PRELIM_MES_OPEN_LABEL } from '@/data/preliminares'
import { PreliminaresKpis } from './components/preliminares-kpis'
import { PreliminaresTable } from './components/preliminares-table'

export function PreliminaresN7Page() {
  const { codigo } = useParams()
  const navigate = useNavigate()
  const n4 = preliminaresRows.find((r) => r.codigo === codigo)

  if (!n4) {
    return (
      <div className="mx-8 my-8">
        <EmptyState icon="search" title="PEP no encontrado" text="No existe un PEP N4 con ese código." />
      </div>
    )
  }

  const totalAcumReal = n4.children.reduce((s, c) => s + c.acumReal, 0)
  const totalForecast = n4.children.reduce((s, c) => s + c.forecastMes, 0)
  const planBase = totalAcumReal + totalForecast * 5

  return (
    <div className="h-full overflow-y-auto">
      <Breadcrumb
        items={[
          { label: 'SIP', to: '/' },
          { label: 'Presupuesto', to: '/ejercicios' },
          { label: 'Preliminares', to: '/preliminares' },
          { label: n4.servicio },
        ]}
      />
      <div className="flex flex-wrap items-start justify-between gap-4 p-[10px_32px_18px]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-[20px] leading-tight font-bold tracking-tight text-primary">{n4.servicio}</span>
            <Badge variant="primary">{n4.codigo}</Badge>
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-[13px] text-muted-foreground">
            <Icon name="check" size={13} color="#067647" /> Detalle N7 · PEP N7 · {PRELIM_MES_OPEN_LABEL}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/preliminares')}>
          <Icon name="chevron_left" size={12} color="currentColor" /> Volver
        </Button>
      </div>

      <PreliminaresKpis planBase={planBase} acumReal={totalAcumReal} disponible={planBase - totalAcumReal} />

      <PreliminaresTable
        rows={n4.children.map((c) => ({ ...c, parentServicio: n4.servicio }))}
        isN7
        itemLabel="PEPs N7"
        mesLabel={PRELIM_MES_OPEN_LABEL.split(' ')[0]}
      />
    </div>
  )
}
