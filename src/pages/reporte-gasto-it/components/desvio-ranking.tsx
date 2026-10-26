import { useState } from 'react'
import { Badge, SegmentedTabs } from '@/shared/ui'
import type { GitLinea } from '@/data/gasto-it-v2'
import { agrupar, estadoDe, ESTADO_META, fmtPct, fmtUSD, type Estado } from '../lib'

export interface Dimension {
  value: string
  label: string
  keyFn: (l: GitLinea) => string
}

const BAR_COLOR: Record<Estado, string> = {
  sobre: '#B42318',
  linea: '#B0B7C9',
  sub: '#F59E0B',
}

interface DesvioRankingProps {
  lineas: GitLinea[]
  dimensiones: Dimension[]
  titulo?: string
}

/** "¿Dónde están los desvíos?" — desvío proyectado al cierre por la dimensión elegida, como barras
 * divergentes desde cero (derecha = sobre plan, izquierda = bajo plan), ordenado de mayor sobregasto a
 * mayor subejecución. */
export function DesvioRanking({ lineas, dimensiones, titulo = '¿Dónde están los desvíos?' }: DesvioRankingProps) {
  const [dimValue, setDimValue] = useState(dimensiones[0].value)
  const dim = dimensiones.find((d) => d.value === dimValue) ?? dimensiones[0]
  const grupos = agrupar(lineas, dim.keyFn).sort((a, b) => b.t.desvProy - a.t.desvProy)
  const maxAbs = Math.max(...grupos.map((g) => Math.abs(g.t.desvProy)), 1)

  return (
    <section className="flex h-full flex-col rounded-xl border border-border bg-white p-[14px_18px]">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-[14px] font-bold text-foreground">{titulo}</div>
          <div className="text-[12px] text-muted-foreground">Desvío proyectado al cierre vs. plan anual, por {dim.label.toLowerCase()}.</div>
        </div>
        {dimensiones.length > 1 && (
          <div className="max-w-full overflow-x-auto">
            <SegmentedTabs value={dim.value} onChange={setDimValue} options={dimensiones.map(({ value, label }) => ({ value, label }))} />
          </div>
        )}
      </div>

      <div className="mb-1 grid grid-cols-[minmax(110px,1.1fr)_2fr_auto] items-center gap-3 text-[10px] font-bold tracking-[0.06em] text-muted-foreground uppercase">
        <span>{dim.label}</span>
        <span className="flex justify-between">
          <span>← Bajo</span>
          <span>Sobre →</span>
        </span>
        <span className="w-[150px] text-right">Desvío</span>
      </div>

      <div className="flex flex-col">
        {grupos.map((g) => {
          const estado = estadoDe(g.t.desvProyPct)
          const w = (Math.abs(g.t.desvProy) / maxAbs) * 50
          const over = g.t.desvProy >= 0
          return (
            <div
              key={g.key}
              className="grid grid-cols-[minmax(110px,1.1fr)_2fr_auto] items-center gap-3 border-t border-border-table py-2"
              title={`${g.label}: plan ${fmtUSD(g.t.planAnual)} · proyección ${fmtUSD(g.t.proyeccion)} · desvío ${fmtUSD(g.t.desvProy, true)} (${fmtPct(g.t.desvProyPct, true)})`}
            >
              <div className="min-w-0">
                <div className="truncate text-[13px] font-medium text-foreground">{g.label}</div>
                <div className="text-[11px] text-muted-foreground tabular-nums">Plan {fmtUSD(g.t.planAnual)}</div>
              </div>
              <div className="relative h-4">
                <div className="absolute top-[-4px] bottom-[-4px] left-1/2 w-px bg-border-table-strong" />
                <div
                  className="absolute top-0.5 h-3 rounded-[4px]"
                  style={{
                    background: BAR_COLOR[estado],
                    width: `${Math.max(w, 0.6)}%`,
                    left: over ? '50%' : `${50 - w}%`,
                  }}
                />
              </div>
              <div className="flex w-[150px] items-center justify-end gap-2">
                <span className="text-[12.5px] font-semibold text-foreground tabular-nums">{fmtUSD(g.t.desvProy, true)}</span>
                <Badge variant={ESTADO_META[estado].variant} className="w-[62px] justify-center px-1.5">
                  {fmtPct(g.t.desvProyPct, true)}
                </Badge>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
