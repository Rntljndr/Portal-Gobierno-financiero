import { pepPreview, type CrearServicioDraft } from '../lib/crear-servicio-draft'
import { BanderaOrigenFields, Field, GerenciaFields, PaisCuentaFields } from './crear-servicio-fields'

const inputClass = 'h-10 w-full rounded-lg border border-border bg-white px-3 text-[13px] outline-none focus:border-primary'

interface CrearServicioFormProps {
  draft: CrearServicioDraft
  onChange: (patch: Partial<CrearServicioDraft>) => void
}

export function CrearServicioForm({ draft, onChange }: CrearServicioFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <Field label="Nombre del servicio">
        <input
          value={draft.nombre}
          onChange={(e) => onChange({ nombre: e.target.value })}
          placeholder="Ej: HP - Consultoría SAP Chile"
          className={inputClass}
        />
      </Field>

      <PaisCuentaFields draft={draft} onChange={onChange} />
      <BanderaOrigenFields draft={draft} onChange={onChange} />
      <GerenciaFields draft={draft} onChange={onChange} />

      <label className="flex items-center gap-2 text-[13px] text-foreground">
        <input type="checkbox" checked={draft.contratoUsd} onChange={(e) => onChange({ contratoUsd: e.target.checked })} className="size-4" />
        Contrato en dólares
      </label>

      <div>
        <label className="mb-1.5 block text-[11.5px] font-semibold tracking-[0.03em] text-cs-gris-oscuro uppercase">Preview de PEP</label>
        <div className="h-10 w-full rounded-lg border border-border bg-[#F3F4F6] px-3 leading-10 text-[13px] tracking-wide text-muted-foreground">
          {pepPreview(draft)}
        </div>
      </div>
    </div>
  )
}
