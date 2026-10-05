import { useEffect, useState } from 'react'
import { Icon } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'

function daysLeft(deadline: number) {
  return Math.max(0, Math.ceil((deadline - Date.now()) / 86400000))
}

interface ForecastPeriodoBannerProps {
  /** Fecha de término del forecast (round.fechaTermino, "YYYY-MM-DD"). */
  fechaTermino: string
  /** A3: hora (HH:mm) de cierre — antes hardcodeada a 23:59:59. */
  horaTermino: string
  onDismiss: () => void
}

/** Franja de periodo de edición (M1) — mismo componente visual que DeadlineBanner de Presupuesto
 * (mis-servicios/components/deadline-banner.tsx), adaptado a la fecha de término del forecast activo.
 * Solo se monta mientras el forecast está Abierto (ver ForecastActivoCard) — desaparece al cerrarlo.
 * Pasada la fecha de término (M7: "vencimiento automático") cambia a un aviso rojo — el forecast no se
 * cierra solo (eso lo sigue haciendo A3 a mano), pero deja de sonar como si quedara tiempo. */
export function ForecastPeriodoBanner({ fechaTermino, horaTermino, onDismiss }: ForecastPeriodoBannerProps) {
  const deadline = new Date(`${fechaTermino}T${horaTermino}:00`).getTime()
  const [days, setDays] = useState(() => daysLeft(deadline))
  const vencido = Date.now() > deadline

  useEffect(() => {
    const id = setInterval(() => setDays(daysLeft(deadline)), 60000)
    return () => clearInterval(id)
  }, [deadline])

  const fechaFmt = `${new Date(deadline).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}, ${horaTermino} hrs`

  return (
    <div className={cn('mx-8 mb-3.5 flex items-center gap-3.5 rounded-xl border p-[14px_18px]', vencido ? 'border-destructive-line bg-destructive-surface' : 'border-[#A7F3D0] bg-[#ECFDF5]')}>
      <div className={cn('flex size-9 shrink-0 items-center justify-center rounded-full border', vencido ? 'border-[#FDA29B] bg-[#FEE4E2]' : 'border-[#6EE7B7] bg-[#D1FAE5]')}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={vencido ? '#B42318' : '#059669'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        {vencido ? (
          <div className="text-[13.5px] leading-snug font-medium text-[#7A271A]">
            El periodo de edición venció el <strong>{fechaFmt}</strong>
          </div>
        ) : (
          <div className="text-[13.5px] leading-snug font-medium text-[#1a3a6b]">
            Quedan <strong className={days <= 3 ? 'text-[#B42318]' : 'font-bold text-primary'}>{days}</strong> días para que termine el periodo de edición
          </div>
        )}
        <div className={cn('mt-1 text-xs', vencido ? 'text-[#B42318]' : 'text-[#5474a0]')}>
          {vencido ? 'Cerrá el forecast desde "Cerrar Forecast" para dejar las líneas validadas.' : (
            <>
              Vence el <strong className="font-semibold text-[#1a3a6b]">{fechaFmt}</strong>. Después de esa fecha, el forecast se cierra para edición.
            </>
          )}
        </div>
      </div>
      <button type="button" onClick={onDismiss} aria-label="Cerrar aviso" className="flex size-7 shrink-0 items-center justify-center rounded-lg hover:bg-black/5">
        <Icon name="x_close" size={14} color="#8A90A2" />
      </button>
    </div>
  )
}
