import { Badge } from '@/shared/ui'
import { destinosCatalogo, type DestinoCatalogo } from '@/data/administracion-catalogos'
import { CatalogoAdminPage, type CatalogoColumnDef } from './components/catalogo-admin-page'
import type { CatalogoFieldDef } from './components/catalogo-field'

const columns: CatalogoColumnDef<DestinoCatalogo>[] = [
  { key: 'destino', label: 'Destino' },
  { key: 'codigo', label: 'Código Destino' },
  {
    key: 'activo',
    label: 'Estado',
    render: (row) => (
      <Badge variant={row.activo ? 'success' : 'neutral'} className="text-[10.5px] font-bold uppercase">
        {row.activo ? 'Activo' : 'Inactivo'}
      </Badge>
    ),
  },
]

const fields: CatalogoFieldDef<DestinoCatalogo>[] = [
  { key: 'destino', label: 'Destino', type: 'text', placeholder: 'Ej: Destino1', required: true },
  { key: 'codigo', label: 'Código Destino', type: 'text', placeholder: 'Ej: A1B', required: true },
  { key: 'activo', label: 'Estado activo', type: 'toggle', helperText: 'El registro estará disponible en el sistema' },
]

export function DestinosPage() {
  return (
    <CatalogoAdminPage
      title="Destinos"
      subtitle="Gestión de destinos y su codificación"
      seed={destinosCatalogo}
      columns={columns}
      fields={fields}
      searchKeys={['destino', 'codigo']}
      entityLabel="Destino"
      buildRow={(v) => ({
        id: `${v.codigo}-${Date.now()}`,
        destino: v.destino ?? '',
        codigo: v.codigo ?? '',
        activo: v.activo ?? true,
      })}
    />
  )
}
