import { useState } from 'react'
import { Breadcrumb, Button, Icon, PageHeader, SearchToolbar, Toast } from '@/shared/ui'
import { useToast } from '@/shared/lib/use-toast'
import { usuariosCatalogo, type UsuarioCatalogo } from '@/data/administracion-usuarios'
import { UsuariosTable } from './components/usuarios-table'
import { UsuarioFormDrawer, type UsuarioForm } from './components/usuario-form-drawer'
import { ConfirmDeleteModal } from './components/confirm-delete-modal'
import { useCatalogo } from './lib/use-catalogo'

const EMPTY_FORM: UsuarioForm = { email: '', nombre: '', apellido: '', activo: true, roles: [] }

export function UsuariosPage() {
  const s = useCatalogo<UsuarioCatalogo>(usuariosCatalogo)
  const { message, showToast } = useToast()
  const [form, setForm] = useState(EMPTY_FORM)

  const q = s.query.trim().toLowerCase()
  const filtered = q
    ? s.rows.filter((r) => `${r.nombre} ${r.apellido}`.toLowerCase().includes(q) || r.email.toLowerCase().includes(q))
    : s.rows

  const openCreate = () => {
    setForm(EMPTY_FORM)
    s.openCreate()
  }
  const openEdit = (row: UsuarioCatalogo) => {
    setForm({ email: row.email, nombre: row.nombre, apellido: row.apellido, activo: row.activo, roles: row.roles })
    s.openEdit(row)
  }

  const canSubmit = Boolean(form.email && form.nombre && form.apellido && form.roles.length > 0)

  const submit = () => {
    if (s.editing) {
      s.update(s.editing.id, form)
      showToast('Usuario actualizado correctamente.')
    } else {
      s.create({ id: `u-${Date.now()}`, ...form })
      showToast('Usuario creado correctamente.')
    }
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Administración', to: '/administracion' }, { label: 'Usuarios' }]} />
      <PageHeader
        title="Usuarios"
        subtitle="Gestión de usuarios del sistema con asignación de módulos, roles y permisos"
        action={
          <Button variant="primary" size="sm" onClick={openCreate}>
            <Icon name="plus" size={12} color="#fff" /> Nuevo Usuario
          </Button>
        }
      />

      <SearchToolbar value={s.query} onChange={s.setQuery} placeholder="Buscar usuario..." resultCount={filtered.length} />

      <UsuariosTable rows={filtered} onEdit={openEdit} onDelete={s.requestDelete} />

      <UsuarioFormDrawer
        open={s.drawerOpen}
        editing={Boolean(s.editing)}
        onClose={s.closeDrawer}
        form={form}
        onChangeForm={setForm}
        canSubmit={canSubmit}
        onSubmit={submit}
      />

      <ConfirmDeleteModal
        open={s.deleteRow !== null}
        title="¿Eliminar usuario?"
        onClose={s.cancelDelete}
        onConfirm={() => {
          s.confirmDelete()
          showToast('Usuario eliminado correctamente.')
        }}
      >
        Estás a punto de eliminar a <strong className="text-foreground">{s.deleteRow?.nombre} {s.deleteRow?.apellido}</strong>. ¿Estás seguro de realizar esta acción?
      </ConfirmDeleteModal>

      <Toast message={message} />
    </div>
  )
}
