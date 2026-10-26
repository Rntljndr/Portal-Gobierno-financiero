import { Badge } from '@/shared/ui'
import { cuentasContablesCatalogo, rubroOpciones, tipoCuentaOpciones, type CuentaContableCatalogo } from '@/data/administracion-catalogos'
import { CatalogoAdminPage, type CatalogoColumnDef } from './components/catalogo-admin-page'
import type { CatalogoFieldDef } from './components/catalogo-field'

const columns: CatalogoColumnDef<CuentaContableCatalogo>[] = [
  { key: 'codigo', label: 'Código' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'tipo', label: 'Tipo' },
  { key: 'rubro', label: 'Rubro' },
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

const fields: CatalogoFieldDef<CuentaContableCatalogo>[] = [
  { key: 'codigo', label: 'Código', type: 'text', placeholder: 'Ej: AA', required: true },
  { key: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Ej: Caja y bancos', required: true },
  { key: 'rubro', label: 'Rubro', type: 'select', options: rubroOpciones, required: true },
  { key: 'tipo', label: 'Tipo', type: 'select', options: tipoCuentaOpciones, required: true },
  { key: 'activo', label: 'Estado activo', type: 'toggle', helperText: 'El registro estará disponible en el sistema' },
]

export function CuentasContablesPage() {
  return (
    <CatalogoAdminPage
      title="Cuentas Contables"
      subtitle="Plan de cuentas contables. El Rubro clasifica la cuenta y afecta el comportamiento funcional del sistema."
      seed={cuentasContablesCatalogo}
      columns={columns}
      fields={fields}
      searchKeys={['codigo', 'nombre', 'rubro', 'tipo']}
      entityLabel="Cuenta contable"
      buildRow={(v) => ({
        id: `${v.codigo}-${Date.now()}`,
        codigo: v.codigo ?? '',
        nombre: v.nombre ?? '',
        rubro: v.rubro ?? '',
        tipo: v.tipo ?? '',
        activo: v.activo ?? true,
      })}
    />
  )
}
