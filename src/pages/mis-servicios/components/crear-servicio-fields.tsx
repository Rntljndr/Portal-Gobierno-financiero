import { Select } from '@/shared/ui'
import { filtroOpciones, paises, type Pais, type TipoOrigen } from '@/data/services'
import { banderas, cuentas, type CrearServicioDraft } from '../lib/crear-servicio-draft'

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11.5px] font-semibold tracking-[0.03em] text-cs-gris-oscuro uppercase">
        {label} <span className="text-[#DC2626]">*</span>
      </label>
      {children}
    </div>
  )
}

interface FieldsProps {
  draft: CrearServicioDraft
  onChange: (patch: Partial<CrearServicioDraft>) => void
}

export function PaisCuentaFields({ draft, onChange }: FieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-3.5">
      <Field label="País">
        <Select value={draft.pais} onChange={(v) => onChange({ pais: v as Pais })} options={paises} placeholder="Seleccionar país" />
      </Field>
      <Field label="Cuenta contable">
        <Select value={draft.cuentaContable} onChange={(v) => onChange({ cuentaContable: v })} options={cuentas} placeholder="Seleccionar cuenta" />
      </Field>
    </div>
  )
}

export function BanderaOrigenFields({ draft, onChange }: FieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-3.5">
      <Field label="Bandera">
        <Select value={draft.bandera} onChange={(v) => onChange({ bandera: v })} options={banderas} placeholder="Seleccionar bandera" />
      </Field>
      <Field label="Origen del servicio">
        <Select
          value={draft.tipoOrigen}
          onChange={(v) => onChange({ tipoOrigen: v as TipoOrigen })}
          options={[
            { value: 'Nuevo', label: 'Nuevo servicio' },
            { value: 'Recurrente', label: 'Servicio recurrente' },
          ]}
          placeholder="Seleccionar origen"
        />
      </Field>
    </div>
  )
}

export function GerenciaFields({ draft, onChange }: FieldsProps) {
  return (
    <div className="grid grid-cols-3 gap-3.5">
      <Field label="Gerencia padre">
        <Select value={draft.gerenciaPadre} onChange={(v) => onChange({ gerenciaPadre: v })} options={filtroOpciones.gerenciaPadre} placeholder="Seleccionar" />
      </Field>
      <Field label="Gerencia">
        <Select value={draft.gerencia} onChange={(v) => onChange({ gerencia: v })} options={filtroOpciones.gerencia} placeholder="Seleccionar" />
      </Field>
      <Field label="Equipo">
        <Select value={draft.equipo} onChange={(v) => onChange({ equipo: v })} options={filtroOpciones.equipo} placeholder="Seleccionar" />
      </Field>
    </div>
  )
}
