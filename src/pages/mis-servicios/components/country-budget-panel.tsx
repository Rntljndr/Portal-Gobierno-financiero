import { useState } from 'react'
import { Icon } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { budgetByDestino, budgetByOrigen } from '../lib/budget-by-country'
import { CountryBudgetCard } from './country-budget-card'
import type { Servicio } from '@/data/services'

export function CountryBudgetPanel({ services }: { services: Servicio[] }) {
  const [open, setOpen] = useState(true)
  const [vista, setVista] = useState<'origen' | 'destino'>('origen')
  const rows = vista === 'destino' ? budgetByDestino(services) : budgetByOrigen(services)

  return (
    <div className="mx-8 mb-7 rounded-[18px] bg-[linear-gradient(180deg,var(--color-cs-azul)_0%,#003685_100%)] p-5.5">
      <div className={cn('flex items-center gap-4', open && 'mb-4.5')}>
        <button type="button" onClick={() => setOpen((v) => !v)} className="min-w-0 flex-1 text-left">
          <div className="text-[17px] leading-tight font-extrabold tracking-tight text-white">
            Presupuesto 2027 por país
          </div>
          <div className="mt-0.5 text-xs text-white/72">
            {vista === 'destino'
              ? 'Gasto distribuido según los países impactados (destino)'
              : 'Montos según el país que paga o registra el servicio (origen)'}
          </div>
        </button>

        <div className="flex shrink-0 items-center gap-2.5">
          <span className="text-[10px] font-bold tracking-[0.1em] whitespace-nowrap text-white/68 uppercase">
            Ver montos por
          </span>
          <div className="flex gap-0.5 rounded-[11px] border border-white/22 bg-white/13 p-[3px]">
            <button
              type="button"
              onClick={() => setVista('origen')}
              className={cn(
                'rounded-lg px-4.5 py-1.5 text-[12.5px] font-bold text-white/80 hover:text-white',
                vista === 'origen' && 'bg-white text-primary shadow-[0_1px_3px_rgba(6,20,60,0.2)]',
              )}
            >
              Origen
            </button>
            <button
              type="button"
              onClick={() => setVista('destino')}
              className={cn(
                'rounded-lg px-4.5 py-1.5 text-[12.5px] font-bold text-white/80 hover:text-white',
                vista === 'destino' && 'bg-white text-primary shadow-[0_1px_3px_rgba(6,20,60,0.2)]',
              )}
            >
              Destino
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Contraer' : 'Expandir'}
          className="flex size-[30px] shrink-0 items-center justify-center rounded-[9px] bg-white/14 hover:bg-white/24"
        >
          <Icon name={open ? 'chevron_left' : 'chevron_right'} size={15} color="#fff" />
        </button>
      </div>

      {open && (
        <div className="grid grid-cols-6 gap-2.5">
          {rows.map((c) => (
            <CountryBudgetCard key={c.pais} c={c} onViewFx={() => {}} />
          ))}
        </div>
      )}
    </div>
  )
}
