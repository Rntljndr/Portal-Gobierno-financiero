import { useState } from 'react'
import { Badge } from '@/shared/ui'
import type { GitLinea } from '@/data/gasto-it-v2'
import { estadoDe, ESTADO_META, fmtPct, fmtUSD, totales, type Estado, type Totales } from '../lib'

type Filtro = 'todos' | Estado

/** Seguimiento operativo por contrato/proveedor: cuánto lleva, cuánto proyecta y en qué estado está. */
export function LineasTable({ lineas }: { lineas: GitLinea[] }) {
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const filas = lineas
    .map((l) => ({ l, t: totales([l]) }))
    .sort((a, b) => Math.abs(b.t.desvProy) - Math.abs(a.t.desvProy))
  const conteo = (e: Estado) => filas.filter((f) => estadoDe(f.t.desvProyPct) === e).length
  const visibles = filtro === 'todos' ? filas : filas.filter((f) => estadoDe(f.t.desvProyPct) === filtro)

  const chips: { value: Filtro; label: string }[] = [
    { value: 'todos', label: `Todos · ${filas.length}` },
    { value: 'sobre', label: `Sobre plan · ${conteo('sobre')}` },
    { value: 'sub', label: `Subejecución · ${conteo('sub')}` },
    { value: 'linea', label: `En línea · ${conteo('linea')}` },
  ]

  return (
    <section className="rounded-xl border border-border bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-table p-[14px_18px]">
        <div>
          <div className="text-[14px] font-bold text-foreground">Detalle por contrato y proveedor</div>
          <div className="text-[12px] text-muted-foreground">Ordenado por tamaño del desvío proyectado.</div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {chips.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setFiltro(c.value)}
              className={`rounded-full border px-3 py-1 text-[11.5px] font-semibold whitespace-nowrap ${
                filtro === c.value ? 'border-primary bg-primary text-white' : 'border-border bg-white text-cs-gris-oscuro hover:border-primary/40'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[520px] overflow-auto">
        <table className="w-full min-w-[920px] text-[13px]">
          <thead className="sticky top-0 z-[1] bg-white">
            <tr className="border-b border-border-table-strong text-[12px] font-medium text-cs-gris-oscuro">
              <th className="p-[10px_18px] text-left font-medium">Proveedor / contrato</th>
              <th className="p-2.5 text-left font-medium">Negocio</th>
              <th className="p-2.5 text-right font-medium">Plan anual</th>
              <th className="p-2.5 text-right font-medium">Real acumulado</th>
              <th className="w-[150px] p-2.5 text-left font-medium">Avance vs. plan a la fecha</th>
              <th className="p-2.5 text-right font-medium">Proyección</th>
              <th className="p-2.5 text-right font-medium">Desvío proyectado</th>
              <th className="p-[10px_18px] text-left font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map(({ l, t }) => (
              <LineaRow key={l.id} l={l} t={t} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function LineaRow({ l, t }: { l: GitLinea; t: Totales }) {
  const estado = estadoDe(t.desvProyPct)
  const avance = t.planAcum > 0 ? (t.realAcum / t.planAcum) * 100 : 0
  return (
    <tr className="border-b border-border-table last:border-0 hover:bg-surface-hover">
      <td className="p-[10px_18px]">
        <div className="font-medium text-foreground">{l.proveedor}</div>
        <div className="text-[11.5px] text-muted-foreground">
          {l.categoria} · {l.tipo}
        </div>
      </td>
      <td className="p-2.5 text-foreground">
        {l.negocio} <span className="text-muted-foreground">{l.pais}</span>
      </td>
      <td className="p-2.5 text-right tabular-nums">{fmtUSD(t.planAnual)}</td>
      <td className="p-2.5 text-right tabular-nums">{fmtUSD(t.realAcum)}</td>
      <td className="p-2.5">
        <div className="flex items-center gap-2">
          <div className="relative h-2 flex-1 rounded-full bg-[#EEF1FB]">
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ width: `${Math.min(avance, 130) / 1.3}%`, background: avance > 103 ? '#B42318' : avance < 90 ? '#F59E0B' : '#0047B0' }}
            />
            <div className="absolute -top-0.5 -bottom-0.5 w-0.5 rounded-full bg-cs-negro" style={{ left: `${100 / 1.3}%` }} />
          </div>
          <span className="w-[42px] text-right text-[11.5px] text-cs-gris-oscuro tabular-nums">{Math.round(avance)} %</span>
        </div>
      </td>
      <td className="p-2.5 text-right tabular-nums">{fmtUSD(t.proyeccion)}</td>
      <td className={`p-2.5 text-right font-semibold tabular-nums ${t.desvProy > 0 ? 'text-destructive' : 'text-success'}`}>
        {fmtUSD(t.desvProy, true)}
        <div className="text-[11px] font-normal">{fmtPct(t.desvProyPct, true)}</div>
      </td>
      <td className="p-[10px_18px]">
        <Badge variant={ESTADO_META[estado].variant}>{ESTADO_META[estado].label}</Badge>
      </td>
    </tr>
  )
}
