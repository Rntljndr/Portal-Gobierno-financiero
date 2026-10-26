import { useState } from 'react'
import { Breadcrumb, PageHeader, SearchToolbar, Toast } from '@/shared/ui'
import { useToast } from '@/shared/lib/use-toast'
import { tiposSolicitudCatalogo, type TipoSolicitudCatalogo } from '@/data/administracion-reglas'
import { TiposSolicitudTable } from './components/tipos-solicitud-table'
import { TipoSolicitudDrawer, type TipoSolicitudForm } from './components/tipo-solicitud-drawer'
import { useCatalogo } from './lib/use-catalogo'

const EMPTY_FORM: TipoSolicitudForm = { nombre: '', descripcion: '', aprobadores: [], activo: true }

export function TiposSolicitudPage() {
  const s = useCatalogo<TipoSolicitudCatalogo>(tiposSolicitudCatalogo)
  const { message, showToast } = useToast()
  const [form, setForm] = useState<TipoSolicitudForm>(EMPTY_FORM)
  const [nuevoAprobador, setNuevoAprobador] = useState('')

  const q = s.query.trim().toLowerCase()
  const filtered = q ? s.rows.filter((r) => r.nombre.toLowerCase().includes(q) || r.descripcion.toLowerCase().includes(q)) : s.rows

  const openEdit = (row: TipoSolicitudCatalogo) => {
    setForm({ nombre: row.nombre, descripcion: row.descripcion, aprobadores: row.aprobadores, activo: row.activo })
    setNuevoAprobador('')
    s.openEdit(row)
  }

  const submit = () => {
    if (!s.editing) return
    s.update(s.editing.id, form)
    showToast('Tipo de solicitud actualizado correctamente.')
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Administración', to: '/administracion' }, { label: 'Tipos de Solicitud' }]} />
      <PageHeader title="Tipos de solicitud" subtitle="Gestión de tipos de solicitud" />

      <SearchToolbar value={s.query} onChange={s.setQuery} placeholder="Buscar registro..." resultCount={filtered.length} />

      <TiposSolicitudTable rows={filtered} onEdit={openEdit} />

      <TipoSolicitudDrawer
        open={s.drawerOpen}
        onClose={s.closeDrawer}
        form={form}
        onChangeForm={setForm}
        nuevoAprobador={nuevoAprobador}
        onChangeNuevoAprobador={setNuevoAprobador}
        onSubmit={submit}
      />

      <Toast message={message} />
    </div>
  )
}
