import { Icon } from '@/shared/ui'
import { closedExercises } from '@/data/exercises'

export function ClosedExercisesGrid() {
  return (
    <>
      <div className="px-8 pb-2.5 text-[10.5px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
        Ejercicios anteriores
      </div>
      <div className="grid grid-cols-2 gap-3.5 px-8 pb-5">
        {closedExercises.map((exercise) => (
          <div
            key={exercise.year}
            className="flex items-center gap-3.5 rounded-2xl border border-border bg-white p-[18px_20px] transition-all hover:-translate-y-px hover:border-border-strong hover:shadow-[0_4px_16px_rgba(6,20,148,0.06)]"
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-cs-gris">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="2" y="4" width="18" height="16" rx="2.5" fill="#fff" stroke="#C4DFFF" strokeWidth="1.5" />
                <rect x="2" y="4" width="18" height="5" rx="2.5" fill="#C4DFFF" />
                <text x="11" y="17" textAnchor="middle" fill="#061494" fontSize="8" fontWeight="800" fontFamily="Montserrat">
                  {String(exercise.year).slice(2)}
                </text>
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-bold text-foreground">Ejercicio {exercise.year}</div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-md bg-cs-gris px-2.5 py-0.5 text-[10.5px] font-semibold text-cs-gris-oscuro">
                  Cerrado
                </span>
                {exercise.peps}
              </div>
            </div>
            <div className="ml-auto flex items-center gap-1 text-[12.5px] font-semibold text-primary hover:text-cs-azul-oscuro">
              Ver detalle <Icon name="chevron_right" size={12} color="currentColor" />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
