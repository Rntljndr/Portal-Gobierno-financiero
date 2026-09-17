import { useState } from 'react'
import { Icon, VistaNumeroToggle, type VistaNumero } from '@/shared/ui'
import type { DireccionPais } from '@/data/reporte-direccion'
import type { CurrencyView } from '@/data/reporteria'
import { DireccionCountryCard } from './direccion-country-card'

const VISIBLE_CARDS = 6
const GAP_PX = 10

interface DireccionCountrySummaryProps {
  /** Siempre las 7 cards, sin acotar por país — ver `buildCountrySummaryTree`. */
  tree: DireccionPais[]
  vista: CurrencyView
  vistaNumero: VistaNumero
  onVistaNumeroChange: (v: VistaNumero) => void
  /** Países acotados por el filtro o por "Ver montos por"; null = mostrar todas las cards con datos. */
  paisesActivos: string[] | null
}

export function DireccionCountrySummary({ tree, vista, vistaNumero, onVistaNumeroChange, paisesActivos }: DireccionCountrySummaryProps) {
  const [open, setOpen] = useState(true)
  const cols = Math.min(Math.max(tree.length, 1), VISIBLE_CARDS)

  return (
    <div className="mx-8 mb-6 rounded-2xl bg-[linear-gradient(180deg,var(--color-cs-azul)_0%,#003685_100%)] p-5.5">
      <div className="flex w-full flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => setOpen((v) => !v)} className="text-left">
          <div className="text-[17px] leading-tight font-extrabold tracking-tight text-white">Resumen por país</div>
          <div className="mt-0.5 text-xs text-white/72">Total Real, Plan y variaciones por país</div>
        </button>
        <div className="ml-auto flex items-center gap-3">
          <VistaNumeroToggle value={vistaNumero} onChange={onVistaNumeroChange} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex size-[30px] shrink-0 items-center justify-center rounded-[9px] bg-white/14 hover:bg-white/24"
          >
            <Icon name={open ? 'chevron_left' : 'chevron_right'} size={15} color="#fff" />
          </button>
        </div>
      </div>

      {open && (
        <div
          className="mt-4.5 grid grid-flow-col overflow-x-auto pb-1"
          style={{ gap: GAP_PX, gridAutoColumns: `calc((100% - ${GAP_PX * (cols - 1)}px) / ${cols})` }}
        >
          {tree.map((pais) => (
            <DireccionCountryCard
              key={pais.nombre}
              pais={pais}
              vista={vista}
              vistaNumero={vistaNumero}
              activo={(paisesActivos === null || paisesActivos.includes(pais.nombre)) && pais.divisiones.length > 0}
            />
          ))}
        </div>
      )}
    </div>
  )
}
