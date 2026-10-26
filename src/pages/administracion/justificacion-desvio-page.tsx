import { Badge } from '@/shared/ui'
import { justificacionesDesvioCatalogo, type JustificacionDesvioCatalogo } from '@/data/administracion-reglas'
import { CatalogoAdminPage, type CatalogoColumnDef } from './components/catalogo-admin-page'
import type { CatalogoFieldDef } from './components/catalogo-field'

function HabilitadoBadge({ habilitado }: { habilitado: boolean }) {
  return (
    <Badge variant={habilitado ? 'success' : 'neutral'} className="text-[10.5px] font-bold uppercase">
      {habilitado ? 'Habilitado' : 'No habilitado'}
    </Badge>
  )
}

const columns: CatalogoColumnDef<JustificacionDesvioCatalogo>[] = [
  { key: 'descripcion', label: 'Justificación de Desvío' },
  { key: 'presupuesto', label: 'Presupuesto', render: (row) => <HabilitadoBadge habilitado={row.presupuesto} /> },
  { key: 'forecast', label: 'Forecast', render: (row) => <HabilitadoBadge habilitado={row.forecast} /> },
]

const fields: CatalogoFieldDef<JustificacionDesvioCatalogo>[] = [
  { key: 'descripcion', label: 'Descripción', type: 'text', placeholder: 'Ej: Desvío x Tipo de Cambio', required: true },
  { key: 'presupuesto', label: 'Disponible en Presupuesto', type: 'toggle', helperText: 'La justificación se podrá elegir al explicar desvíos de presupuesto' },
  { key: 'forecast', label: 'Disponible en Forecast', type: 'toggle', helperText: 'La justificación se podrá elegir al explicar desvíos de forecast' },
]

export function JustificacionDesvioPage() {
  return (
    <CatalogoAdminPage
      title="Justificación de Desvío"
      subtitle="Gestión de las justificaciones disponibles para explicar desvíos"
      seed={justificacionesDesvioCatalogo}
      columns={columns}
      fields={fields}
      searchKeys={['descripcion']}
      entityLabel="Justificación"
      buildRow={(v) => ({
        id: `j-${Date.now()}`,
        descripcion: v.descripcion ?? '',
        presupuesto: v.presupuesto ?? true,
        forecast: v.forecast ?? true,
      })}
    />
  )
}
