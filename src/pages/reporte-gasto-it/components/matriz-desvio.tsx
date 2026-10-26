import { GIT_CATEGORIAS, GIT_PAISES, type GitLinea } from '@/data/gasto-it-v2'
import { fmtPct, fmtUSD, totales } from '../lib'

/** Escala divergente de 5 pasos (ámbar = subejecución, gris = en línea, rojo = sobre plan — mismo semáforo del reporte); el texto de la
 * celda siempre lleva el % con signo, así que el color nunca es la única señal. */
function celdaColor(pct: number): { bg: string; fg: string } {
  if (pct > 10) return { bg: '#FCA5A5', fg: '#7A1A12' }
  if (pct > 3) return { bg: '#FEE8E8', fg: '#B42318' }
  if (pct < -20) return { bg: '#FCD34D', fg: '#7A3E06' }
  if (pct < -10) return { bg: '#FFFBEB', fg: '#B45309' }
  return { bg: '#F1F5F9', fg: '#455B85' }
}

const LEYENDA = [
  { label: '< −20 %', pct: -25 },
  { label: '−20 a −10 %', pct: -15 },
  { label: 'En línea', pct: 0 },
  { label: '+3 a +10 %', pct: 5 },
  { label: '> +10 %', pct: 15 },
]

/** Comparativo País × Categoría del desvío proyectado al cierre (%), con totales por fila y columna. */
export function MatrizDesvio({ lineas }: { lineas: GitLinea[] }) {
  const paises = GIT_PAISES.filter((p) => lineas.some((l) => l.pais === p))
  const categorias = GIT_CATEGORIAS.filter((c) => lineas.some((l) => l.categoria === c))

  return (
    <section className="rounded-xl border border-border bg-white p-[14px_18px]">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[14px] font-bold text-foreground">Comparativo país × categoría</div>
          <div className="text-[12px] text-muted-foreground">Desvío proyectado al cierre vs. plan anual. Pasa el mouse sobre una celda para ver montos.</div>
        </div>
        <MatrizLeyenda />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-separate border-spacing-[3px] text-[12px]">
          <thead>
            <tr>
              <th className="p-1.5 text-left text-[11px] font-medium text-cs-gris-oscuro" />
              {categorias.map((c) => (
                <th key={c} className="p-1.5 text-center text-[11px] leading-tight font-medium text-cs-gris-oscuro">
                  {c}
                </th>
              ))}
              <th className="p-1.5 text-center text-[11px] font-semibold text-foreground">Total país</th>
            </tr>
          </thead>
          <tbody>
            {paises.map((pais) => {
              const fila = lineas.filter((l) => l.pais === pais)
              const tp = totales(fila)
              return (
                <tr key={pais}>
                  <th className="p-1.5 text-left text-[12.5px] font-semibold text-foreground">{pais}</th>
                  {categorias.map((cat) => {
                    const ls = fila.filter((l) => l.categoria === cat)
                    if (!ls.length) return <td key={cat} className="rounded-[4px] bg-[#F8FAFC] p-2 text-center text-muted-foreground">—</td>
                    const t = totales(ls)
                    const c = celdaColor(t.desvProyPct)
                    return (
                      <td
                        key={cat}
                        className="rounded-[4px] p-2 text-center font-semibold tabular-nums"
                        style={{ background: c.bg, color: c.fg }}
                        title={`${cat} · ${pais}\nPlan ${fmtUSD(t.planAnual)} · Proyección ${fmtUSD(t.proyeccion)}\nDesvío ${fmtUSD(t.desvProy, true)}`}
                      >
                        {fmtPct(t.desvProyPct, true)}
                      </td>
                    )
                  })}
                  <td className="rounded-[4px] border border-border-table-strong bg-white p-2 text-center font-bold tabular-nums" style={{ color: celdaColor(tp.desvProyPct).fg }}>
                    {fmtPct(tp.desvProyPct, true)}
                  </td>
                </tr>
              )
            })}
            <tr>
              <th className="p-1.5 text-left text-[12.5px] font-semibold text-foreground">Total</th>
              {categorias.map((cat) => {
                const t = totales(lineas.filter((l) => l.categoria === cat))
                return (
                  <td key={cat} className="rounded-[4px] border border-border-table-strong bg-white p-2 text-center font-bold tabular-nums" style={{ color: celdaColor(t.desvProyPct).fg }}>
                    {fmtPct(t.desvProyPct, true)}
                  </td>
                )
              })}
              <td className="rounded-[4px] bg-primary p-2 text-center font-bold text-white tabular-nums">{fmtPct(totales(lineas).desvProyPct, true)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}

function MatrizLeyenda() {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-[10.5px] text-cs-gris-oscuro">
      {LEYENDA.map((l) => {
        const c = celdaColor(l.pct)
        return (
          <span key={l.label} className="flex items-center gap-1">
            <span className="inline-block size-3 rounded-[4px]" style={{ background: c.bg }} />
            {l.label}
          </span>
        )
      })}
    </div>
  )
}
