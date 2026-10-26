import { Button, Drawer, SegmentedTabs } from '@/shared/ui'
import type { CentroCostoTipo } from '@/data/administracion-reglas'
import { AdministracionToggle } from './administracion-toggle'

interface CentroCostoDrawerProps {
  open: boolean
  editing: boolean
  onClose: () => void
  codigo: string
  onChangeCodigo: (v: string) => void
  tipo: CentroCostoTipo
  onChangeTipo: (v: CentroCostoTipo) => void
  activo: boolean
  onChangeActivo: (v: boolean) => void
  onSubmit: () => void
}

export function CentroCostoDrawer({ open, editing, onClose, codigo, onChangeCodigo, tipo, onChangeTipo, activo, onChangeActivo, onSubmit }: CentroCostoDrawerProps) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Centros de Costo"
      subtitle={editing ? 'Editar registro' : 'Nuevo registro'}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" disabled={codigo.length === 0} className="disabled:opacity-50" onClick={onSubmit}>
            {editing ? 'Guardar cambios' : 'Crear'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-[12px] font-semibold text-cs-gris-oscuro">Código *</label>
          <input
            type="text"
            value={codigo}
            maxLength={10}
            disabled={editing}
            onChange={(e) => onChangeCodigo(e.target.value.toUpperCase())}
            placeholder="Ej: CV00110200"
            className="h-[38px] w-full rounded-lg border border-border bg-white px-3 text-[12.5px] text-foreground outline-none hover:border-border-strong focus:border-primary disabled:cursor-not-allowed disabled:bg-[#f4f6fb] disabled:text-muted-foreground"
          />
          <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
            <span>Letras y números, mayúsculas. Único, no editable después de creado.</span>
            <span>{codigo.length}/10</span>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-[12px] font-semibold text-cs-gris-oscuro">Tipo *</label>
          <SegmentedTabs value={tipo} onChange={onChangeTipo} options={[{ value: 'Central', label: 'Central' }, { value: 'Directa', label: 'Directa' }]} />
          <div className="mt-1 text-[11px] text-muted-foreground">El gasto se distribuye usando drivers según el rubro contable.</div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[12px] font-semibold text-cs-gris-oscuro">Estado activo</div>
            <div className="text-[11px] text-muted-foreground">El registro estará disponible en el sistema</div>
          </div>
          <AdministracionToggle checked={activo} onChange={onChangeActivo} label="Estado activo" />
        </div>
      </div>
    </Drawer>
  )
}
