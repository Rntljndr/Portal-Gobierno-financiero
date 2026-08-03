import { useNavigate } from 'react-router'
import { Icon, Button } from '@/shared/ui'
import { nextExercise } from '@/data/exercises'

function CalendarBadgeGreen({ year }: { year: number }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="3" y="5" width="22" height="20" rx="3" fill="#DDF0E4" />
      <rect x="3" y="5" width="22" height="7" rx="3" fill="#C3E6CF" />
      <line x1="9" y1="2.5" x2="9" y2="7.5" stroke="#1F6F47" strokeWidth="2" strokeLinecap="round" />
      <line x1="19" y1="2.5" x2="19" y2="7.5" stroke="#1F6F47" strokeWidth="2" strokeLinecap="round" />
      <text x="14" y="21" textAnchor="middle" fill="#1F6F47" fontSize="9" fontWeight="800" fontFamily="Montserrat">
        {String(year).slice(2)}
      </text>
    </svg>
  )
}

const cardClasses =
  'relative flex cursor-pointer items-center gap-[18px] overflow-hidden rounded-2xl border border-[#A8D2B7] bg-[linear-gradient(95deg,#DDF0E4_0%,#CFE8D8_55%,#BFE0CB_140%)] p-[18px_22px] text-[#143E29] shadow-[0_4px_14px_rgba(31,111,71,0.14)]'

export function NextExerciseSection() {
  const navigate = useNavigate()

  return (
    <>
      <div className="px-8 pb-2.5 text-[10.5px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
        Próximo ejercicio
      </div>
      <div className="mx-8 mb-[18px] grid grid-cols-2 gap-[18px]">
        <div className={cardClasses} onClick={() => navigate('/ejercicios/mis-servicios')}>
          <div className="relative z-1 flex min-w-0 items-center gap-4">
            <div className="relative z-1 flex size-14 shrink-0 items-center justify-center rounded-xl border border-[#A8D2B7] bg-white text-[#1F6F47]">
              <CalendarBadgeGreen year={nextExercise.year} />
            </div>
            <div className="relative z-1 min-w-0">
              <div className="mb-1 inline-flex items-center gap-2 text-[10.5px] font-bold tracking-[0.16em] text-[#1F6F47] uppercase before:size-1.5 before:rounded-full before:bg-[#2A8C5C] before:shadow-[0_0_0_3px_rgba(42,140,92,0.25)]">
                Próximo ejercicio
              </div>
              <div className="text-[22px] leading-tight font-bold tracking-tight text-[#0F3621]">
                Ejercicio {nextExercise.year}
              </div>
              <div className="mt-1 text-[13px] text-[#355C46]">{nextExercise.description}</div>
            </div>
          </div>
          <Button
            variant="onGreenCard"
            className="relative z-1 ml-auto"
            onClick={(e) => {
              e.stopPropagation()
              navigate('/ejercicios/mis-servicios')
            }}
          >
            Ir a gestionar <Icon name="chevron_right" size={12} color="#1F6F47" />
          </Button>
        </div>

        <div className={cardClasses} onClick={() => navigate('/reporteria')}>
          <div className="relative z-1 flex min-w-0 items-center gap-4">
            <div className="relative z-1 flex size-14 shrink-0 items-center justify-center rounded-xl border border-[#A8D2B7] bg-white text-[#1F6F47]">
              <Icon name="chart" size={22} color="#1F6F47" />
            </div>
            <div className="relative z-1 min-w-0">
              <div className="mb-1 inline-flex items-center gap-2 text-[10.5px] font-bold tracking-[0.16em] text-[#1F6F47] uppercase before:size-1.5 before:rounded-full before:bg-[#2A8C5C] before:shadow-[0_0_0_3px_rgba(42,140,92,0.25)]">
                Reportería
              </div>
              <div className="text-[22px] leading-tight font-bold tracking-tight text-[#0F3621]">
                Reportería próximo ejercicio {nextExercise.year}
              </div>
              <div className="mt-1 text-[13px] text-[#355C46]">Información del próximo ejercicio en tiempo real</div>
            </div>
          </div>
          <Button
            variant="onGreenCard"
            className="relative z-1 ml-auto"
            onClick={(e) => {
              e.stopPropagation()
              navigate('/reporteria')
            }}
          >
            Ver <Icon name="chevron_right" size={12} color="#1F6F47" />
          </Button>
        </div>
      </div>
    </>
  )
}
