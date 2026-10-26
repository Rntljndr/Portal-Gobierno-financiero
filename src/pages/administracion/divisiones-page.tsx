import { Badge } from '@/shared/ui'
import { divisionesCatalogo, type DivisionCatalogo } from '@/data/administracion-catalogos'
import { CatalogoAdminPage, type CatalogoColumnDef } from './components/catalogo-admin-page'
import type { CatalogoFieldDef } from './components/catalogo-field'

const columns: CatalogoColumnDef<DivisionCatalogo>[] = [
  { key: 'codigo', label: 'Código' },
  { key: 'nombre', label: 'División' },
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

const fields: CatalogoFieldDef<DivisionCatalogo>[] = [
  { key: 'codigo', label: 'Código', type: 'text', placeholder: 'Ej: AVENTURA', required: true },
  { key: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Ej: Aventura', required: true },
  { key: 'activo', label: 'Estado activo', type: 'toggle', helperText: 'El registro estará disponible en el sistema' },
]

export function DivisionesPage() {
  return (
    <CatalogoAdminPage
      title="Divisiones"
      subtitle="Gestión de divisiones y su codificación"
      seed={divisionesCatalogo}
      columns={columns}
      fields={fields}
      searchKeys={['codigo', 'nombre']}
      entityLabel="División"
      buildRow={(v) => ({
        id: `${v.codigo}-${Date.now()}`,
        codigo: v.codigo ?? '',
        nombre: v.nombre ?? '',
        activo: v.activo ?? true,
      })}
    />
  )
}
