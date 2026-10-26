import { Badge } from '@/shared/ui'
import { paisesCatalogo, monedaOpciones, type PaisCatalogo } from '@/data/administracion-catalogos'
import { CatalogoAdminPage, type CatalogoColumnDef } from './components/catalogo-admin-page'
import type { CatalogoFieldDef } from './components/catalogo-field'

const columns: CatalogoColumnDef<PaisCatalogo>[] = [
  { key: 'codigo', label: 'Código' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'moneda', label: 'Moneda' },
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

const fields: CatalogoFieldDef<PaisCatalogo>[] = [
  { key: 'codigo', label: 'Código', type: 'text', placeholder: 'Ej: CL', required: true },
  { key: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Ej: Chile', required: true },
  { key: 'moneda', label: 'Moneda', type: 'select', options: monedaOpciones, required: true },
  { key: 'activo', label: 'Estado activo', type: 'toggle', helperText: 'El registro estará disponible en el sistema' },
]

export function PaisesPage() {
  return (
    <CatalogoAdminPage
      title="Países"
      subtitle="Gestión de países disponibles en el sistema."
      seed={paisesCatalogo}
      columns={columns}
      fields={fields}
      searchKeys={['codigo', 'nombre', 'moneda']}
      entityLabel="País"
      buildRow={(v) => ({
        id: `${v.codigo}-${Date.now()}`,
        codigo: v.codigo ?? '',
        nombre: v.nombre ?? '',
        moneda: v.moneda ?? '',
        activo: v.activo ?? true,
      })}
    />
  )
}
