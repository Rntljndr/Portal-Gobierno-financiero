import { cn } from '@/shared/lib/utils'
import { EJERCICIO_ACTUAL, EJERCICIO_PLANIFICACION } from '@/data/peps'

interface CrearPepN4EjercicioSectionProps {
  ejercicio: number
  onChange: (ejercicio: number) => void
}

const OPCIONES = [
  { anio: EJERCICIO_ACTUAL, label: 'Ejercicio en curso' },
  { anio: EJERCICIO_PLANIFICACION, label: 'Ejercicio en planificación' },
]

/** "Ejercicio de habilitación" + "Se creará en ejercicio" (F: copiado del drawer de referencia) — si se
 * habilita desde el ejercicio en curso, el servicio nace ahí y se arrastra como "Servicio recurrente"
 * al ejercicio de planificación; si se habilita directo en planificación, nace solo ahí. */
export function CrearPepN4EjercicioSection({ ejercicio, onChange }: CrearPepN4EjercicioSectionProps) {
  const esActual = ejercicio === EJERCICIO_ACTUAL

  return (
    <div className="mb-5">
      <label className="mb-1 block text-[12px] font-semibold text-cs-gris-oscuro">
        Ejercicio de habilitación <span className="text-[#DC2626]">*</span>
      </label>
      <p className="mb-2.5 text-[11.5px] text-muted-foreground">Seleccione desde qué ejercicio queda habilitado el PEP.</p>
      <div className="mb-4 grid grid-cols-2 gap-3">
        {OPCIONES.map((opt) => (
          <button
            key={opt.anio}
            type="button"
            onClick={() => onChange(opt.anio)}
            className={cn(
              'flex items-center gap-2.5 rounded-lg border p-[12px_14px] text-left',
              ejercicio === opt.anio ? 'border-primary bg-primary/5' : 'border-border bg-white hover:border-border-strong',
            )}
          >
            <span
              className={cn(
                'flex size-4 shrink-0 items-center justify-center rounded-full border-2',
                ejercicio === opt.anio ? 'border-primary' : 'border-border-strong',
              )}
            >
              {ejercicio === opt.anio && <span className="size-2 rounded-full bg-primary" />}
            </span>
            <span>
              <span className="block text-[14px] font-bold text-foreground">{opt.anio}</span>
              <span className="block text-[11px] text-muted-foreground">{opt.label}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-[#F8F9FD] p-[12px_14px]">
        <div className="mb-1.5 text-[10.5px] font-bold tracking-[0.06em] text-muted-foreground uppercase">Se creará en ejercicio</div>
        <div className="flex items-center gap-2 text-[12.5px]">
          <span className="font-bold text-foreground">{ejercicio}</span>
          <span className="text-cs-gris-oscuro">El servicio nace aquí</span>
        </div>
        {esActual && (
          <>
            <div className="ml-[7px] h-3 border-l border-border" />
            <div className="flex items-center gap-2 text-[12.5px]">
              <span className="font-bold text-foreground">{EJERCICIO_PLANIFICACION}</span>
              <span className="text-cs-gris-oscuro">Se arrastra como continuación</span>
              <span className="rounded-full bg-[#EEF4FF] px-2 py-0.5 text-[10.5px] font-semibold text-primary">Servicio recurrente</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
