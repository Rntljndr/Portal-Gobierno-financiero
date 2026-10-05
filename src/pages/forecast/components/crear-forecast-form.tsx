import { MultiSelect } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import type { CrearForecastForm, FormErrors } from '../lib/use-crear-forecast'
import { FORECAST_GERENCIA_OPTIONS, equiposDisponiblesParaGerencias } from '../lib/forecast-gerencias'
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
  selEquipos: Set<string>
  onChangeEquipos: (equipos: string[]) => void
  selGerencias: Set<string>
  onChangeGerencias: (gerencias: string[]) => void
  readOnly?: boolean
}

/** Gerencia + Equipos de un Forecast Parcial (F: "a la izquierda se habilita un dropdown con la
 * gerencia... al lado derecho de este campo se habilita otro dropdown con los equipos, dependiendo de
 * la gerencia que has habilitado") — dos MultiSelect lado a lado (mismo componente que los filtros de
 * N4/N7), reemplazan la tabla de checkboxes anterior. Extraído aparte para mantener
 * CrearForecastFormFields bajo el límite de líneas del linter. */
function ParcialGruposFields({ selEquipos, onChangeEquipos, selGerencias, onChangeGerencias, error }: Pick<CrearForecastFormFieldsProps, 'selEquipos' | 'onChangeEquipos' | 'selGerencias' | 'onChangeGerencias'> & { error?: string }) {
  const equiposOptions = equiposDisponiblesParaGerencias(selGerencias)
  return (
    <div className="mb-2 grid grid-cols-2 gap-3">
      <div>
        <label className={label}>Gerencia</label>
        <MultiSelect placeholder="Todas las gerencias" options={FORECAST_GERENCIA_OPTIONS.map((g) => g.gerencia)} values={[...selGerencias]} onChange={onChangeGerencias} />
      </div>
      <div>
        <label className={label}>Equipos</label>
        <MultiSelect placeholder="Todos los equipos" options={equiposOptions} values={[...selEquipos]} onChange={onChangeEquipos} />
        {error && <div className={errMsg}>{error}</div>}
      </div>
    </div>
  )
}

export function CrearForecastFormFields({ form, setField, errors, selEquipos, onChangeEquipos, selGerencias, onChangeGerencias, readOnly = false }: CrearForecastFormFieldsProps) {
  return (
    <div className="rounded-xl border border-border bg-white p-[20px_24px]">
      <div className="mb-4 border-b border-border pb-3 text-[13px] font-bold text-foreground">Datos del Forecast</div>

      <div className="mb-4">
        <label className={label}>Título{!readOnly && <span className="text-[#E53E3E]"> *</span>}</label>
        <input readOnly={readOnly} maxLength={100} value={form.titulo} placeholder="Forecast 3 — Ago 2026" onChange={(e) => setField('titulo', e.target.value)} className={cn(input, errors.titulo && inputErr)} />
        {errors.titulo && <div className={errMsg}>{errors.titulo}</div>}
        {!readOnly && <div className={hint}>{form.titulo.length}/100 caracteres</div>}
      </div>

      <div className="mb-4">
        <label className={label}>
          Descripción {!readOnly && <span className="font-normal normal-case text-muted-foreground">(opcional)</span>}
        </label>
        <input readOnly={readOnly} value={form.descripcion} placeholder="Descripción o notas adicionales" onChange={(e) => setField('descripcion', e.target.value)} className={input} />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          {/* F: "al crear un nuevo forecast la fecha de inicio no debe tener hora de inicio" — a
           * diferencia de Fecha de término, que sí la mantiene (define el cierre exacto del periodo
           * de edición, A3). form.horaInicio sigue con su valor por defecto (09:00) para no romper lo
           * que ya lo muestra (ForecastActivoCard/ForecastPeriodoBanner). */}
          <label className={label}>Fecha de inicio{!readOnly && <span className="text-[#E53E3E]"> *</span>}</label>
          <input readOnly={readOnly} type="date" value={form.fechaInicio} onChange={(e) => setField('fechaInicio', e.target.value)} className={cn(input, errors.fechaInicio && inputErr)} />
          {errors.fechaInicio && <div className={errMsg}>{errors.fechaInicio}</div>}
        </div>
        <div>
          <label className={label}>Fecha de término{!readOnly && <span className="text-[#E53E3E]"> *</span>}</label>
          <div className="flex gap-2">
            <input readOnly={readOnly} type="date" value={form.fechaTermino} onChange={(e) => setField('fechaTermino', e.target.value)} className={cn(input, 'flex-1', errors.fechaTermino && inputErr)} />
            <input readOnly={readOnly} type="time" value={form.horaTermino} onChange={(e) => setField('horaTermino', e.target.value)} className={cn(input, 'w-[108px]')} />
          </div>
          {errors.fechaTermino && <div className={errMsg}>{errors.fechaTermino}</div>}
        </div>
      </div>

      <div className="mb-4">
        <label className={label}>Porcentaje desvío{!readOnly && <span className="text-[#E53E3E]"> *</span>}</label>
        <div className="relative">
          <input
            readOnly={readOnly}
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
        <label className={label}>Tipo de forecast{!readOnly && <span className="text-[#E53E3E]"> *</span>}</label>
        <TipoForecastSelector value={form.tipo} onChange={(tipo) => setField('tipo', tipo)} readOnly={readOnly} />
      </div>

      {form.tipo === 'parcial' && (
        <>
          <ParcialGruposFields selEquipos={selEquipos} onChangeEquipos={onChangeEquipos} selGerencias={selGerencias} onChangeGerencias={onChangeGerencias} error={errors.equipos} />
          {/* F: debajo del campo de forecast parcial. */}
          <div className="mb-4 rounded-md bg-[#EEF4FF] p-[8px_12px] text-[11px] text-primary">
            El forecast será visible en su totalidad. Solo la gerencia y los equipos seleccionados podrán editarlo
          </div>
        </>
      )}

      <label className={cn('flex items-center gap-2.5', readOnly ? 'cursor-default' : 'cursor-pointer')}>
        <input type="checkbox" checked={form.notificar} disabled={readOnly} onChange={(e) => setField('notificar', e.target.checked)} className="size-4 accent-primary" />
        <span className="text-[13px] font-medium text-foreground">Notificar usuarios al abrir este forecast</span>
      </label>
      {form.notificar && <div className="mt-1.5 ml-6.5 rounded-md bg-[#EEF4FF] p-[8px_12px] text-[11px] text-primary">Se enviará una notificación a todos los usuarios al abrir este forecast</div>}
    </div>
  )
}
