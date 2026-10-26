import { useNavigate } from 'react-router'
import { Icon, NavShortcutCard } from '@/shared/ui'
import { nextExercise } from '@/data/exercises'

function CalendarBadgeGreen({ year }: { year: number }) {
  return (
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
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

export function NextExerciseSection() {
  const navigate = useNavigate()

  return (
    <>
      <div className="px-8 pb-2.5 text-[10.5px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
        Próximo ejercicio
      </div>
      <div className="mx-8 mb-[18px] grid grid-cols-2 gap-[18px]">
        <NavShortcutCard
          icon={<CalendarBadgeGreen year={nextExercise.year} />}
          label="Próximo ejercicio"
          title={`Ejercicio ${nextExercise.year}`}
          description={nextExercise.description}
          buttonLabel="Ir a gestionar"
          onNavigate={() => navigate('/ejercicios/mis-servicios')}
        />
        <NavShortcutCard
          icon={<Icon name="chart" size={18} color="#1F6F47" />}
          label="Reporte"
          title={`Reporte de plan ${nextExercise.year}`}
          description="Reportería planificación, Negocio y Tecnología"
          buttonLabel="Ver"
          onNavigate={() => navigate('/reporte-plan')}
        />
      </div>
    </>
  )
}
