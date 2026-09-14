import { preliminaresByCountry, PRELIM_PAISES } from '../lib/preliminares-by-country'
import { PreliminaresCountryCard } from './preliminares-country-card'
import type { PreliminarRow } from '@/data/preliminares'

interface PreliminaresCountrySummaryProps {
  title?: string
  subtitle?: string
  rows: (Pick<PreliminarRow, 'meses' | 'acumReal' | 'forecastMes' | 'preliminarMes'> & { pais: string })[]
  paisesList?: string[]
  /** Si true, los países sin participación muestran sus métricas en 0 en vez de "Sin datos". */
  zeroFill?: boolean
}

/** Cantidad de cards visibles a la vez antes de necesitar scroll lateral (el resto se distribuye a lo ancho por igual). */
const VISIBLE_CARDS = 6
const GAP_PX = 10

export function PreliminaresCountrySummary({
  title = 'Preliminares por país',
  subtitle = 'Preliminar del mes vs. plan y forecast del mes',
  rows,
  paisesList = PRELIM_PAISES,
  zeroFill = false,
}: PreliminaresCountrySummaryProps) {
  const cards = preliminaresByCountry(rows, paisesList, zeroFill)
  const cols = Math.min(cards.length, VISIBLE_CARDS)
  const gridStyle = cols > 1 ? { gap: GAP_PX, gridAutoColumns: `calc((100% - ${GAP_PX * (cols - 1)}px) / ${cols})` } : { gap: GAP_PX }

  return (
    <div className="mx-8 mb-4 rounded-2xl bg-[linear-gradient(180deg,var(--color-cs-azul)_0%,#003685_100%)] p-5.5">
      <div className="mb-4.5">
        <div className="text-[17px] leading-tight font-extrabold tracking-tight text-white">{title}</div>
        <div className="mt-0.5 text-xs text-white/72">{subtitle}</div>
      </div>
      <div className={cols > 1 ? 'grid grid-flow-col overflow-x-auto pb-1' : 'flex'} style={gridStyle}>
        {cards.map((c) => (
          <div key={c.pais} className={cols > 1 ? undefined : 'w-[220px]'}>
            <PreliminaresCountryCard c={c} />
          </div>
        ))}
      </div>
    </div>
  )
}
