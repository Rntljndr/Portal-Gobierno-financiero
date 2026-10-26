import { Button, Drawer } from '@/shared/ui'
import type { TipoSolicitudAprobador } from '@/data/administracion-reglas'
import { AdministracionToggle } from './administracion-toggle'
import { AprobadoresPicker } from './aprobadores-picker'

export interface TipoSolicitudForm {
  nombre: string
  descripcion: string
  aprobadores: TipoSolicitudAprobador[]
  activo: boolean
}

interface TipoSolicitudDrawerProps {
  open: boolean
  onClose: () => void
  form: TipoSolicitudForm
  onChangeForm: (form: TipoSolicitudForm) => void
  nuevoAprobador: string
  onChangeNuevoAprobador: (v: string) => void
  onSubmit: () => void
}

export function TipoSolicitudDrawer({ open, onClose, form, onChangeForm, nuevoAprobador, onChangeNuevoAprobador, onSubmit }: TipoSolicitudDrawerProps) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Tipos de solicitud"
      subtitle="Editar registro"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={onSubmit}>
            Guardar cambios
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
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
          <label className="mb-1.5 block text-[12px] font-semibold text-cs-gris-oscuro">Descripción *</label>
          <input
            type="text"
            value={form.descripcion}
            onChange={(e) => onChangeForm({ ...form, descripcion: e.target.value })}
            className="h-[38px] w-full rounded-lg border border-border bg-white px-3 text-[12.5px] text-foreground outline-none hover:border-border-strong focus:border-primary"
          />
        </div>
        <AprobadoresPicker
          aprobadores={form.aprobadores}
          onChange={(aprobadores) => onChangeForm({ ...form, aprobadores })}
          nuevoAprobador={nuevoAprobador}
          onChangeNuevoAprobador={onChangeNuevoAprobador}
        />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[12px] font-semibold text-cs-gris-oscuro">Estado activo</div>
            <div className="text-[11px] text-muted-foreground">El registro estará disponible en el sistema</div>
          </div>
          <AdministracionToggle checked={form.activo} onChange={(v) => onChangeForm({ ...form, activo: v })} label="Estado activo" />
        </div>
      </div>
    </Drawer>
  )
}
