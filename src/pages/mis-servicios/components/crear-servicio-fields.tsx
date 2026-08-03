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

export const selectClass = 'h-10 w-full rounded-lg border border-border bg-white px-3 text-[13px] outline-none focus:border-primary'

interface FieldsProps {
  draft: CrearServicioDraft
  onChange: (patch: Partial<CrearServicioDraft>) => void
}

export function PaisCuentaFields({ draft, onChange }: FieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-3.5">
      <Field label="País">
        <select value={draft.pais} onChange={(e) => onChange({ pais: e.target.value as Pais })} className={selectClass}>
          <option value="">Seleccionar país</option>
          {paises.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Cuenta contable">
        <select value={draft.cuentaContable} onChange={(e) => onChange({ cuentaContable: e.target.value })} className={selectClass}>
          <option value="">Seleccionar cuenta</option>
          {cuentas.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>
    </div>
  )
}

export function BanderaOrigenFields({ draft, onChange }: FieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-3.5">
      <Field label="Bandera">
        <select value={draft.bandera} onChange={(e) => onChange({ bandera: e.target.value })} className={selectClass}>
          <option value="">Seleccionar bandera</option>
          {banderas.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Origen del servicio">
        <select value={draft.tipoOrigen} onChange={(e) => onChange({ tipoOrigen: e.target.value as TipoOrigen })} className={selectClass}>
          <option value="">Seleccionar origen</option>
          <option value="Nuevo">Nuevo servicio</option>
          <option value="Recurrente">Servicio recurrente</option>
        </select>
      </Field>
    </div>
  )
}

export function GerenciaFields({ draft, onChange }: FieldsProps) {
  return (
    <div className="grid grid-cols-3 gap-3.5">
      <Field label="Gerencia padre">
        <select value={draft.gerenciaPadre} onChange={(e) => onChange({ gerenciaPadre: e.target.value })} className={selectClass}>
          <option value="">Seleccionar</option>
          {filtroOpciones.gerenciaPadre.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Gerencia">
        <select value={draft.gerencia} onChange={(e) => onChange({ gerencia: e.target.value })} className={selectClass}>
          <option value="">Seleccionar</option>
          {filtroOpciones.gerencia.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Equipo">
        <select value={draft.equipo} onChange={(e) => onChange({ equipo: e.target.value })} className={selectClass}>
          <option value="">Seleccionar</option>
          {filtroOpciones.equipo.map((eq) => (
            <option key={eq} value={eq}>
              {eq}
            </option>
          ))}
        </select>
      </Field>
    </div>
  )
}
