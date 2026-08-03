import { useEffect, useState } from 'react'
import { Icon } from '@/shared/ui'

function daysLeft(deadline: number) {
  return Math.max(0, Math.ceil((deadline - Date.now()) / 86400000))
}

export function DeadlineBanner({ deadline, onDismiss }: { deadline: number; onDismiss: () => void }) {
  const [days, setDays] = useState(() => daysLeft(deadline))

  useEffect(() => {
    const id = setInterval(() => setDays(daysLeft(deadline)), 60000)
    return () => clearInterval(id)
  }, [deadline])

  return (
    <div className="mx-8 mb-3.5 flex items-center gap-3.5 rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] p-[14px_18px]">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#6EE7B7] bg-[#D1FAE5]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] leading-snug font-medium text-[#1a3a6b]">
          Recordá: tenés <strong className={days <= 5 ? 'text-[#B42318]' : 'font-bold text-primary'}>{days}</strong>{' '}
          días para revisar y editar el presupuesto
        </div>
        <div className="mt-1 text-xs text-[#5474a0]">
          Vence el{' '}
          <strong className="font-semibold text-[#1a3a6b]">
            {new Date(deadline).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}
          </strong>
          . Después de esa fecha, la estructura se cierra para edición.
        </div>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Cerrar aviso"
        className="flex size-7 shrink-0 items-center justify-center rounded-lg hover:bg-black/5"
      >
        <Icon name="x_close" size={14} color="#8A90A2" />
      </button>
    </div>
  )
}
