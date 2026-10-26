import { Badge } from '@/shared/ui'
import { areasCatalogo, paisOpciones, type AreaCatalogo } from '@/data/administracion-catalogos'
import { CatalogoAdminPage, type CatalogoColumnDef } from './components/catalogo-admin-page'
import type { CatalogoFieldDef } from './components/catalogo-field'

const columns: CatalogoColumnDef<AreaCatalogo>[] = [
  { key: 'codigo', label: 'Código' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'pais', label: 'País' },
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

const fields: CatalogoFieldDef<AreaCatalogo>[] = [
  { key: 'codigo', label: 'Código', type: 'text', placeholder: 'Ej: SM', required: true },
  { key: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Ej: Supermercados', required: true },
  { key: 'descripcion', label: 'Descripción', type: 'text', placeholder: 'Ej: Área de supermercados y retail', required: true },
  { key: 'pais', label: 'País', type: 'select', options: paisOpciones, required: true },
  { key: 'activo', label: 'Estado activo', type: 'toggle', helperText: 'El registro estará disponible en el sistema' },
]

export function AreasPage() {
  return (
    <CatalogoAdminPage
      title="Áreas"
      subtitle="Gestión de áreas de negocio y su codificación por país"
      seed={areasCatalogo}
      columns={columns}
      fields={fields}
      searchKeys={['codigo', 'nombre', 'pais']}
      entityLabel="Área"
      buildRow={(v) => ({
        id: `${v.codigo}-${v.pais}-${Date.now()}`,
        codigo: v.codigo ?? '',
        nombre: v.nombre ?? '',
        descripcion: v.descripcion ?? '',
        pais: v.pais ?? '',
        activo: v.activo ?? true,
      })}
    />
  )
}
