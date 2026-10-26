import { useState } from 'react'
import { Breadcrumb, Button, Icon, PageHeader, Pagination, SearchToolbar, Toast } from '@/shared/ui'
import { useToast } from '@/shared/lib/use-toast'
import { centrosCostoCatalogo, type CentroCostoCatalogo, type CentroCostoTipo } from '@/data/administracion-reglas'
import { CentrosCostoTable } from './components/centros-costo-table'
import { CentroCostoDrawer } from './components/centro-costo-drawer'
import { useCatalogo } from './lib/use-catalogo'

const PAGE_SIZE = 10

export function CentrosCostoAdminPage() {
  const s = useCatalogo<CentroCostoCatalogo>(centrosCostoCatalogo)
  const { message, showToast } = useToast()
  const [codigo, setCodigo] = useState('')
  const [tipo, setTipo] = useState<CentroCostoTipo>('Central')
  const [activo, setActivo] = useState(true)

  const q = s.query.trim().toLowerCase()
  const filtered = q ? s.rows.filter((r) => r.codigo.toLowerCase().includes(q)) : s.rows
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageSafe = Math.min(s.page, totalPages)
  const paged = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE)

  const openCreate = () => {
    setCodigo('')
    setTipo('Central')
    setActivo(true)
    s.openCreate()
  }

  const openEdit = (row: CentroCostoCatalogo) => {
    setCodigo(row.codigo)
    setTipo(row.tipo)
    setActivo(row.activo)
    s.openEdit(row)
  }

  const submit = () => {
    if (s.editing) {
      s.update(s.editing.id, { tipo, activo })
      showToast('Centro de costo actualizado correctamente.')
    } else {
      s.create({ id: codigo, codigo, tipo, activo })
      showToast('Centro de costo creado correctamente.')
    }
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Administración', to: '/administracion' }, { label: 'Centros de Costo' }]} />
      <PageHeader
        title="Centros de Costo"
        subtitle="Catálogo maestro de centros de costo: alta, tipo (central/directo) y habilitación."
        action={
          <Button variant="primary" size="sm" onClick={openCreate}>
            <Icon name="plus" size={12} color="#fff" /> Nuevo registro
          </Button>
        }
      />

      <SearchToolbar value={s.query} onChange={s.setQuery} placeholder="Buscar registro..." resultCount={filtered.length} />

      <CentrosCostoTable rows={paged} onEdit={openEdit} />

      <Pagination page={pageSafe} totalPages={totalPages} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={s.setPage} itemLabel="registros" />

      <CentroCostoDrawer
        open={s.drawerOpen}
        editing={Boolean(s.editing)}
        onClose={s.closeDrawer}
        codigo={codigo}
        onChangeCodigo={setCodigo}
        tipo={tipo}
        onChangeTipo={setTipo}
        activo={activo}
        onChangeActivo={setActivo}
        onSubmit={submit}
      />

      <Toast message={message} />
    </div>
  )
}
