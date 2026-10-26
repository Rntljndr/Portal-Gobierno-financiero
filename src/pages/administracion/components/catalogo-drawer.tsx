import { Button, Drawer } from '@/shared/ui'
import { CatalogoFieldInput, type CatalogoFieldDef } from './catalogo-field'

interface CatalogoDrawerProps<T> {
  title: string
  open: boolean
  editing: boolean
  onClose: () => void
  fields: CatalogoFieldDef<T>[]
  form: Partial<T>
  onChangeField: (key: keyof T & string, value: string | boolean) => void
  canSubmit: boolean
  onSubmit: () => void
}

export function CatalogoDrawer<T>({ title, open, editing, onClose, fields, form, onChangeField, canSubmit, onSubmit }: CatalogoDrawerProps<T>) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={title}
      subtitle={editing ? 'Editar registro' : 'Nuevo registro'}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" disabled={!canSubmit} className="disabled:opacity-50" onClick={onSubmit}>
            {editing ? 'Guardar cambios' : 'Crear'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {fields
          .filter((f) => !f.createOnly || !editing)
          .map((f) => (
            <CatalogoFieldInput key={f.key} field={f} value={form[f.key]} onChange={(v) => onChangeField(f.key, v)} />
          ))}
      </div>
    </Drawer>
  )
}
