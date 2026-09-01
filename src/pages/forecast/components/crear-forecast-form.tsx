import { cn } from '@/shared/lib/utils'
import type { CrearForecastForm, FormErrors } from '../lib/use-crear-forecast'
import { PepSelectionSection } from './pep-selection-section'
import { TipoForecastSelector } from './tipo-forecast-selector'

const label = 'mb-1.5 block text-[11.5px] font-bold tracking-[0.05em] text-cs-gris-oscuro uppercase'
const input = 'h-10 w-full rounded-lg border border-border bg-white px-3 text-[13px] outline-none focus:border-primary'
const inputErr = 'border-[#E53E3E]'
const errMsg = 'mt-1 text-[11px] text-[#E53E3E]'
const hint = 'mt-1 text-[11px] text-muted-foreground'

interface CrearForecastFormFieldsProps {
  form: CrearForecastForm
  setField: <K extends keyof CrearForecastForm>(field: K, value: CrearForecastForm[K]) => void
  errors: FormErrors
  selPeps: Set<string>
  onTogglePep: (codigo: string) => void
}

export function CrearForecastFormFields({ form, setField, errors, selPeps, onTogglePep }: CrearForecastFormFieldsProps) {
  return (
    <div className="rounded-xl border border-border bg-white p-[20px_24px]">
      <div className="mb-4 border-b border-border pb-3 text-[13px] font-bold text-foreground">Datos del Forecast</div>

      <div className="mb-4">
        <label className={label}>
          Título <span className="text-[#E53E3E]">*</span>
        </label>
        <input maxLength={100} value={form.titulo} placeholder="Forecast 3 — Ago 2026" onChange={(e) => setField('titulo', e.target.value)} className={cn(input, errors.titulo && inputErr)} />
        {errors.titulo && <div className={errMsg}>{errors.titulo}</div>}
        <div className={hint}>{form.titulo.length}/100 caracteres</div>
      </div>

      <div className="mb-4">
        <label className={label}>
          Descripción <span className="font-normal normal-case text-muted-foreground">(opcional)</span>
        </label>
        <input value={form.descripcion} placeholder="Descripción o notas adicionales" onChange={(e) => setField('descripcion', e.target.value)} className={input} />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          <label className={label}>
            Fecha de inicio <span className="text-[#E53E3E]">*</span>
          </label>
          <input type="date" value={form.fechaInicio} onChange={(e) => setField('fechaInicio', e.target.value)} className={cn(input, errors.fechaInicio && inputErr)} />
          {errors.fechaInicio && <div className={errMsg}>{errors.fechaInicio}</div>}
        </div>
        <div>
          <label className={label}>
            Fecha de término <span className="text-[#E53E3E]">*</span>
          </label>
          <input type="date" value={form.fechaTermino} onChange={(e) => setField('fechaTermino', e.target.value)} className={cn(input, errors.fechaTermino && inputErr)} />
          {errors.fechaTermino && <div className={errMsg}>{errors.fechaTermino}</div>}
        </div>
      </div>

      <div className="mb-4">
        <label className={label}>
          Porcentaje desvío <span className="text-[#E53E3E]">*</span>
        </label>
        <div className="relative">
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={form.desvio}
            placeholder="0.0"
            onChange={(e) => setField('desvio', e.target.value)}
            className={cn(input, 'pr-8', errors.desvio && inputErr)}
          />
          <span className="absolute top-1/2 right-3 -translate-y-1/2 text-[13px] font-bold text-muted-foreground">%</span>
        </div>
        {errors.desvio && <div className={errMsg}>{errors.desvio}</div>}
      </div>

      <div className="mb-4">
        <label className={label}>
          Tipo de forecast <span className="text-[#E53E3E]">*</span>
        </label>
        <TipoForecastSelector value={form.tipo} onChange={(tipo) => setField('tipo', tipo)} />
      </div>

      {form.tipo === 'parcial' && <PepSelectionSection selPeps={selPeps} onTogglePep={onTogglePep} error={errors.peps} />}

      <label className="flex cursor-pointer items-center gap-2.5">
        <input type="checkbox" checked={form.notificar} onChange={(e) => setField('notificar', e.target.checked)} className="size-4 accent-primary" />
        <span className="text-[13px] font-medium text-foreground">Notificar usuarios al abrir este forecast</span>
      </label>
      {form.notificar && <div className="mt-1.5 ml-6.5 rounded-md bg-[#EEF4FF] p-[8px_12px] text-[11px] text-primary">Se enviará una notificación a todos los usuarios al abrir este forecast</div>}
    </div>
  )
}
