import { Button, Drawer } from '@/shared/ui'
import type { UsuarioRol } from '@/data/administracion-usuarios'
import { AdministracionToggle } from './administracion-toggle'
import { ModulosRolesPicker } from './modulos-roles-picker'

export interface UsuarioForm {
  email: string
  nombre: string
  apellido: string
  activo: boolean
  roles: UsuarioRol[]
}

interface UsuarioFormDrawerProps {
  open: boolean
  editing: boolean
  onClose: () => void
  form: UsuarioForm
  onChangeForm: (form: UsuarioForm) => void
  canSubmit: boolean
  onSubmit: () => void
}

export function UsuarioFormDrawer({ open, editing, onClose, form, onChangeForm, canSubmit, onSubmit }: UsuarioFormDrawerProps) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={editing ? 'Editar Usuario' : 'Nuevo Usuario'}
      subtitle="Completa los datos del usuario y selecciona los módulos a los que tendrá acceso"
      wide
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" disabled={!canSubmit} className="disabled:opacity-50" onClick={onSubmit}>
            {editing ? 'Guardar cambios' : 'Crear usuario'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-cs-gris-oscuro">Email corporativo *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => onChangeForm({ ...form, email: e.target.value })}
              placeholder="usuario@cencosud.com"
              className="h-[38px] w-full rounded-lg border border-border bg-white px-3 text-[12.5px] text-foreground outline-none hover:border-border-strong focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-cs-gris-oscuro">Nombre *</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => onChangeForm({ ...form, nombre: e.target.value })}
              className="h-[38px] w-full rounded-lg border border-border bg-white px-3 text-[12.5px] text-foreground outline-none hover:border-border-strong focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-cs-gris-oscuro">Apellido *</label>
            <input
              type="text"
              value={form.apellido}
              onChange={(e) => onChangeForm({ ...form, apellido: e.target.value })}
              className="h-[38px] w-full rounded-lg border border-border bg-white px-3 text-[12.5px] text-foreground outline-none hover:border-border-strong focus:border-primary"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-[12px] font-semibold text-cs-gris-oscuro">Estado del usuario</div>
            <div className="text-[11px] text-muted-foreground">Usuario activo por defecto</div>
          </div>
          <AdministracionToggle checked={form.activo} onChange={(v) => onChangeForm({ ...form, activo: v })} label="Estado del usuario" />
        </div>

        <ModulosRolesPicker roles={form.roles} onChange={(roles) => onChangeForm({ ...form, roles })} />
      </div>
    </Drawer>
  )
}
