import { Select } from '@/shared/ui'
import { AdministracionToggle } from './administracion-toggle'

export interface CatalogoFieldDef<T> {
  key: keyof T & string
  label: string
  type: 'text' | 'select' | 'toggle'
  placeholder?: string
  options?: string[]
  required?: boolean
  helperText?: string
  /** Solo se muestra/permite editar al crear (p.ej. un código único e inmutable). */
  createOnly?: boolean
}

interface CatalogoFieldInputProps<T> {
  field: CatalogoFieldDef<T>
  value: unknown
  onChange: (value: string | boolean) => void
}

const labelClass = 'mb-1.5 block text-[12px] font-semibold text-cs-gris-oscuro'
const inputClass = 'h-[38px] w-full rounded-lg border border-border bg-white px-3 text-[12.5px] text-foreground outline-none hover:border-border-strong focus:border-primary'

export function CatalogoFieldInput<T>({ field, value, onChange }: CatalogoFieldInputProps<T>) {
  if (field.type === 'toggle') {
    return (
      <div className="flex items-center justify-between">
        <div>
          <div className={labelClass.replace('mb-1.5 block', '')}>{field.label}</div>
          {field.helperText && <div className="text-[11px] text-muted-foreground">{field.helperText}</div>}
        </div>
        <AdministracionToggle checked={Boolean(value)} onChange={onChange} label={field.label} />
      </div>
    )
  }

  if (field.type === 'select') {
    return (
      <div>
        <label className={labelClass}>
          {field.label} {field.required && '*'}
        </label>
        <Select value={(value as string) ?? ''} onChange={onChange} options={field.options ?? []} placeholder={field.placeholder ?? 'Seleccionar...'} />
      </div>
    )
  }

  return (
    <div>
      <label className={labelClass}>
        {field.label} {field.required && '*'}
      </label>
      <input
        type="text"
        value={(value as string) ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className={inputClass}
      />
    </div>
  )
}
