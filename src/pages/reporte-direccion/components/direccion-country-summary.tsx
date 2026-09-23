import { useEffect, useState } from 'react'
import { Icon, VistaNumeroToggle, type VistaNumero } from '@/shared/ui'
import type { DireccionPais } from '@/data/reporte-direccion'
import type { CurrencyView } from '@/data/reporteria'
import { DireccionSummaryCard } from './direccion-summary-card'
import { buildSummaryItems, summaryDenominadores, summaryTitulo, type DrillState } from '../lib/direccion-summary-items'

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
  const [drill, setDrill] = useState<DrillState | null>(null)

  useEffect(() => {
    if (!drill) return
    const pais = tree.find((p) => p.nombre === drill.pais)
    if (!pais || (drill.division && !pais.divisiones.some((d) => d.nombre === drill.division))) setDrill(null)
  }, [tree, drill])

  const items = buildSummaryItems(tree, drill, paisesActivos, setDrill)
  const denom = summaryDenominadores(tree, drill)
  const { titulo, subtitulo } = summaryTitulo(drill)
  const cols = Math.min(Math.max(items.length, 1), VISIBLE_CARDS)

  return (
    <div className="mx-8 mb-6 rounded-2xl bg-[linear-gradient(180deg,var(--color-cs-azul)_0%,#003685_100%)] p-5.5">
      <div className="flex w-full flex-wrap items-start justify-between gap-3">
        <div>
          <button type="button" onClick={() => setOpen((v) => !v)} className="text-left">
            <div className="text-[17px] leading-tight font-extrabold tracking-tight text-white">{titulo}</div>
            <div className="mt-0.5 text-xs text-white/72">{subtitulo}</div>
          </button>
          {drill && (
            <button
              type="button"
              onClick={() => setDrill(drill.division ? { pais: drill.pais } : null)}
              className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-white/85 hover:text-white"
            >
              <Icon name="chevron_left" size={12} color="currentColor" />
              {drill.division ? 'Volver a divisiones' : 'Volver a países'}
            </button>
          )}
        </div>
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
          {items.map((item) => (
            <DireccionSummaryCard
              key={item.key}
              nombre={item.nombre}
              flag={item.flag}
              levelBadge={item.levelBadge}
              node={item.node}
              denomReal={denom.real}
              denomPlan={denom.plan}
              vista={vista}
              vistaNumero={vistaNumero}
              activo={item.activo}
              onClick={item.onClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}
