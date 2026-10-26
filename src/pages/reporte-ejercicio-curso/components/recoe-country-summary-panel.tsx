import { useState } from 'react'
import { Icon } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { currencyViews, type CurrencyView } from '@/data/reporteria'
import type { Pais } from '@/data/services'
import { PaisMonedaSelector } from '@/features/pais-moneda-selector/pais-moneda-selector'
import type { PaisResumen } from '../lib/recoe-data'
import { RecoeCountrySummaryCard } from './recoe-country-summary-card'

interface RecoeCountrySummaryPanelProps {
  resumen: PaisResumen[]
  vista: CurrencyView
  onChangeVista: (v: CurrencyView) => void
  paisMoneda: Pais | null
  onChangePaisMoneda: (p: Pais | null) => void
}

const SUBTITULO: Record<CurrencyView, string> = {
  origen: 'Plan, Real, Forecast y Real año anterior, en moneda de origen',
  destino: 'Mismas cifras, convertidas a la moneda de un país destino',
  dolar: 'Mismas cifras, consolidadas en USD',
}

/** Resumen por país de "Reporte Ejercicio en Curso" — mismo recuadro azul plegable que
 * ForecastCountrySummaryPanel (Forecast M2) / CountryBudgetPanel (Presupuesto). El selector de moneda
 * (label "Ver montos por" + Origen ML / Destino ML / Destino USD) va en la misma fila y posición que en
 * `CountryBudgetPanel` — junto al título, antes del botón de contraer —, con el mismo toggle propio de
 * fondo azul que usa ese panel (no el `SegmentedTabs` compartido, pensado para fondo claro: su texto
 * inactivo `text-primary/70` queda ilegible sobre este degradado). Sin botones adicionales (ni
 * "Conversión" por card ni "Volver a consolidado"). El selector de país solo aparece en "Destino ML"
 * (hay que elegir a qué país convertir) — a diferencia del módulo de Presupuesto, acá no tiene sentido
 * un selector "país origen" en Origen ML: este panel siempre muestra TODOS los países a la vez, cada
 * uno en su propia moneda, nunca uno solo. */
export function RecoeCountrySummaryPanel({ resumen, vista, onChangeVista, paisMoneda, onChangePaisMoneda }: RecoeCountrySummaryPanelProps) {
  const [open, setOpen] = useState(true)
  const necesitaPais = vista === 'destino'

  const cambiarVista = (v: CurrencyView) => {
    onChangeVista(v)
    onChangePaisMoneda(null)
  }

  return (
    <div className="rounded-[18px] bg-[linear-gradient(180deg,var(--color-cs-azul)_0%,#003685_100%)] p-5.5">
      <div className={cn('flex flex-wrap items-center gap-x-4 gap-y-2', open && 'mb-4.5')}>
        <button type="button" onClick={() => setOpen((v) => !v)} className="min-w-0 flex-1 text-left">
          <div className="text-[17px] leading-tight font-extrabold tracking-tight text-white">Resumen por país</div>
          <div className="mt-0.5 text-xs text-white/72">{SUBTITULO[vista]}</div>
        </button>

        {open && (
          <div className="flex shrink-0 items-center gap-2.5">
            <span className="text-[10px] font-bold tracking-[0.1em] whitespace-nowrap text-white/68 uppercase">Ver montos por</span>
            <div className="flex gap-0.5 rounded-[11px] border border-white/22 bg-white/13 p-[3px]">
              {currencyViews.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => cambiarVista(v.id)}
                  className={cn(
                    'rounded-lg px-4.5 py-1.5 text-[12.5px] font-bold whitespace-nowrap',
                    vista === v.id ? 'bg-white text-[#0047B0] shadow-[0_1px_3px_rgba(6,20,60,0.2)]' : 'text-white/80 hover:text-white',
                  )}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        )}

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
        <>
          {necesitaPais && (
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="rounded-lg bg-white/10 p-1.5">
                <PaisMonedaSelector vista={vista} value={paisMoneda} onChange={onChangePaisMoneda} />
              </div>
              {!paisMoneda && (
                <span className="inline-flex items-center gap-1 text-[11.5px] text-white/80">
                  <Icon name="info" size={12} color="#fff" /> Selecciona un país destino.
                </span>
              )}
            </div>
          )}

          <div className="flex gap-2.5 overflow-x-auto pb-1">
            {resumen.map((r) => (
              <div key={r.pais} className="shrink-0" style={{ width: `calc((100% - ${(resumen.length - 1) * 10}px) / ${resumen.length})` }}>
                <RecoeCountrySummaryCard r={r} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
