import { Icon, Button } from '@/shared/ui'
import { currentExercise } from '@/data/exercises'

function CalendarBadge({ year }: { year: number }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="3" y="5" width="22" height="20" rx="3" fill="rgba(255,255,255,0.18)" />
      <rect x="3" y="5" width="22" height="7" rx="3" fill="rgba(255,255,255,0.25)" />
      <line x1="9" y1="2.5" x2="9" y2="7.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <line x1="19" y1="2.5" x2="19" y2="7.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <text x="14" y="21" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="800" fontFamily="Montserrat">
        {String(year).slice(2)}
      </text>
    </svg>
  )
}

const cardClasses =
  'relative flex items-center gap-[18px] overflow-hidden rounded-2xl bg-[linear-gradient(95deg,var(--color-cs-azul-oscuro)_0%,var(--color-cs-azul)_60%,var(--color-cs-azul-claro)_140%)] p-[22px_26px] text-white'

export function CurrentExerciseSection() {
  return (
    <>
      <div className="px-8 pb-2.5 text-[10.5px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
        Ejercicio en curso
      </div>
      <div className="mx-8 mb-[18px] grid grid-cols-2 gap-[18px]">
        <div className={cardClasses}>
          <div className="relative z-1 flex min-w-0 items-center gap-4">
            <div className="relative z-1 flex size-14 shrink-0 items-center justify-center rounded-xl bg-white/16">
              <CalendarBadge year={currentExercise.year} />
            </div>
            <div className="relative z-1 min-w-0">
              <div className="mb-1 text-[10.5px] font-bold tracking-[0.16em] text-white/70 uppercase">
                Ejercicio en curso
              </div>
              <div className="text-[22px] leading-tight font-bold tracking-tight">Ejercicio {currentExercise.year}</div>
              <div className="mt-1 text-[13px] text-white/85">{currentExercise.description}</div>
            </div>
          </div>
          <Button variant="onBlue" className="relative z-1 ml-auto">
            Ir <Icon name="chevron_right" size={12} color="#fff" />
          </Button>
        </div>

        <div className={cardClasses}>
          <div className="relative z-1 flex min-w-0 items-center gap-4">
            <div className="relative z-1 flex size-14 shrink-0 items-center justify-center rounded-xl bg-white/16">
              <Icon name="chart" size={22} color="#fff" />
            </div>
            <div className="relative z-1 min-w-0">
              <div className="mb-1 text-[10.5px] font-bold tracking-[0.16em] text-white/70 uppercase">Reportería</div>
              <div className="text-[22px] leading-tight font-bold tracking-tight">
                Reportería de Ejercicio en curso {currentExercise.year}
              </div>
              <div className="mt-1 text-[13px] text-white/85">Información del ejercicio en tiempo real</div>
            </div>
          </div>
          <Button variant="onBlue" className="relative z-1 ml-auto">
            Ver <Icon name="chevron_right" size={12} color="#fff" />
          </Button>
        </div>
      </div>
    </>
  )
}
