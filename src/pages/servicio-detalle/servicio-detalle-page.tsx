import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Button, EmptyState, EnviarCdGModal, Icon, Toast } from '@/shared/ui'
import { useToast } from '@/shared/lib/use-toast'
import { formatNumber } from '@/shared/lib/format'
import { servicios } from '@/data/services'
import { DetailHeader } from './components/detail-header'
import { DataAccordion } from './components/data-accordion'
import { BudgetSummary } from './components/budget-summary'
import { PepN7Table } from './components/pep-n7-table'
import { buildPepN7Rows } from './lib/build-pep-n7-rows'

export function ServicioDetallePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const servicio = servicios.find((s) => s.id === id)
  const rows = useMemo(() => (servicio ? buildPepN7Rows(servicio) : []), [servicio])
  const [showEnviar, setShowEnviar] = useState(false)
  const { message, showToast } = useToast()

  if (!servicio) {
    return (
      <div className="mx-8 my-8">
        <EmptyState icon="search" title="Servicio no encontrado" text="No existe un servicio con ese identificador." />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <DetailHeader s={servicio} />
        <DataAccordion s={servicio} />
        <BudgetSummary s={servicio} />
        <PepN7Table rows={rows} moneda={servicio.moneda} />
      </div>
      <div className="flex justify-end gap-3 border-t border-border bg-white p-[14px_32px]">
        <Button variant="outline" onClick={() => navigate('/ejercicios/mis-servicios')}>
          Volver
        </Button>
        <Button variant="primary" onClick={() => setShowEnviar(true)}>
          <Icon name="send" size={13} color="#fff" /> Enviar a Control de Gestión
        </Button>
      </div>

      <EnviarCdGModal
        open={showEnviar}
        onClose={() => setShowEnviar(false)}
        rows={[
          { label: 'Servicio a enviar', value: servicio.nombre },
          { label: 'Monto', value: `${servicio.moneda} ${formatNumber(servicio.totalPlan)}` },
          { label: 'PEPs', value: String(rows.length) },
        ]}
        onConfirmed={() => {
          showToast('Información enviada exitosamente.')
          setTimeout(() => navigate('/ejercicios/mis-servicios'), 900)
        }}
      />
      <Toast message={message} />
    </div>
  )
}
