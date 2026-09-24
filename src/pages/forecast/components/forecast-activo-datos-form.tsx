import { Button, Toast } from '@/shared/ui'

const label = 'mb-1.5 block text-[11.5px] font-bold tracking-[0.05em] text-cs-gris-oscuro uppercase'
const input = 'h-10 w-full rounded-lg border border-border bg-white px-3 text-[13px] outline-none focus:border-primary'

export interface ForecastActivoDraft {
  titulo: string
  descripcion: string
  fechaInicio: string
  fechaTermino: string
  desvio: string
  notificar: boolean
}

interface ForecastActivoDatosFormProps {
  draft: ForecastActivoDraft
  onChange: (draft: ForecastActivoDraft) => void
  onGuardar: () => void
  toastMessage: string | null
}

/** Formulario editable de Datos del Forecast para Control de Gestión — extraído de ForecastActivoCard
 * para mantenerlo bajo el límite de líneas del linter. */
export function ForecastActivoDatosForm({ draft, onChange, onGuardar, toastMessage }: ForecastActivoDatosFormProps) {
  return (
    <>
      <div className="mb-4">
        <label className={label}>Título</label>
        <input value={draft.titulo} onChange={(e) => onChange({ ...draft, titulo: e.target.value })} className={input} />
      </div>
      <div className="mb-4">
        <label className={label}>Descripción</label>
        <input value={draft.descripcion} onChange={(e) => onChange({ ...draft, descripcion: e.target.value })} className={input} />
      </div>
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          <label className={label}>Fecha de inicio</label>
          <input type="date" value={draft.fechaInicio} onChange={(e) => onChange({ ...draft, fechaInicio: e.target.value })} className={input} />
        </div>
        <div>
          <label className={label}>Fecha de término</label>
          <input type="date" value={draft.fechaTermino} onChange={(e) => onChange({ ...draft, fechaTermino: e.target.value })} className={input} />
        </div>
      </div>
      <div className="mb-1">
        <label className={label}>Porcentaje desvío</label>
        <div className="relative">
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={draft.desvio}
            onChange={(e) => onChange({ ...draft, desvio: e.target.value })}
            className={`${input} pr-8`}
          />
          <span className="absolute top-1/2 right-3 -translate-y-1/2 text-[13px] font-bold text-muted-foreground">%</span>
        </div>
      </div>
      <label className="mt-4 flex cursor-pointer items-center gap-2.5">
        <input type="checkbox" checked={draft.notificar} onChange={(e) => onChange({ ...draft, notificar: e.target.checked })} className="size-4 accent-primary" />
        <span className="text-[13px] font-medium text-foreground">Notificar usuarios al abrir este forecast</span>
      </label>

      <div className="mt-5 flex justify-end">
        <Button variant="primary" size="sm" onClick={onGuardar}>
          Guardar cambios
        </Button>
      </div>
      <Toast message={toastMessage} />
    </>
  )
}
