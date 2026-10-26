import { useState } from 'react'
import { cn } from '@/shared/lib/utils'
import { divisionDe, V3_DIVISIONES, V3_FLAG, V3_PAISES, type V3Linea } from '@/data/gasto-it-v3'
import { useReporte } from '../../lib/contexto'
import { agrupar, claseSigno, fmtMonto, fmtPct, medir, pesoVenta, PERIODOS } from '../../lib'
import { EstadoChip, EstadoTexto } from '../base/estado-chip'
import { Seccion } from '../base/seccion'
import { TD, TD_NUM, TH, TR, TR_HEAD } from '../base/tabla'
import { HC_TITULO, HcCelda } from '../base/hc-celda'

/** Escala divergente de 5 pasos con tokens: rojo = sobre plan, verde = bajo plan (más intenso pasada la
 * tolerancia), gris solo sin desvío. */
function tono(pct: number, tol: number) {
  if (pct > tol) return 'bg-destructive-line text-foreground'
  if (pct >= 0.05) return 'bg-destructive-surface text-destructive'
  if (pct < -tol) return 'bg-success-line text-foreground'
  if (pct <= -0.05) return 'bg-success-surface text-success'
  return 'bg-surface-elevated text-muted-foreground'
}

type Celda = { pais: string; division: string } | null

/** Mapa de calor país × división (Visión Negocio): de un vistazo, dónde se desvía el gasto IT del negocio.
 * Clic en una celda lista los negocios de ese país y división con su monto, desvío y peso sobre la venta. */
export function MapaCalor({ defaultOpen }: { defaultOpen: boolean }) {
  const { lineasAbajo, periodo, ajustes, moneda } = useReporte()
  const [sel, setSel] = useState<Celda>(null)
  const paises = V3_PAISES.filter((p) => lineasAbajo.some((l) => l.pais === p))
  const divisiones = V3_DIVISIONES.filter((d) => lineasAbajo.some((l) => divisionDe(l.negocio) === d))
  const de = (p: string, d: string) => lineasAbajo.filter((l) => l.pais === p && divisionDe(l.negocio) === d)
  const per = PERIODOS.find((x) => x.value === periodo)!

  return (
    <Seccion titulo="País por división" subtitulo={`${per.label} · desvío contra el plan. Haz clic en una celda para ver sus negocios.`} defaultOpen={defaultOpen}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-1">
          <thead>
            <tr>
              <th className={`${TH} text-left`} />
              {divisiones.map((d) => (
                <th key={d} className={`${TH} text-center`}>
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paises.map((p) => (
              <tr key={p}>
                <th className="px-3 py-2 text-left text-sm font-bold whitespace-nowrap text-foreground">
                  <span className="mr-2 text-lg">{V3_FLAG[p]}</span>
                  {p}
                </th>
                {divisiones.map((d) => {
                  const ls = de(p, d)
                  if (!ls.length) return <td key={d} className="rounded-lg bg-surface-subtle p-3 text-center text-xs text-muted-foreground">—</td>
                  const m = medir(ls, periodo)
                  const activa = sel?.pais === p && sel?.division === d
                  return (
                    <td key={d} className="p-0">
                      <button
                        type="button"
                        onClick={() => setSel(activa ? null : { pais: p, division: d })}
                        className={cn('flex w-full flex-col items-center gap-1 rounded-lg p-3', tono(m.desvPct, ajustes.tolerancia), activa && 'ring-2 ring-primary')}
                      >
                        <span className="text-sm font-bold tabular-nums">{fmtPct(m.desvPct, true)}</span>
                        <span className="text-xs tabular-nums">{fmtMonto(m.desv, moneda, true)}</span>
                        <span className="text-xs text-cs-gris-oscuro tabular-nums">{fmtPct(pesoVenta(ls, periodo).real, false, 2)} venta</span>
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sel && <NegociosDeCelda titulo={`${sel.division} · ${sel.pais}`} lineas={de(sel.pais, sel.division)} />}
    </Seccion>
  )
}

function NegociosDeCelda({ titulo, lineas }: { titulo: string; lineas: V3Linea[] }) {
  const { periodo, moneda } = useReporte()
  const negocios = agrupar(lineas, (l) => l.negocio)
  return (
    <div className="mt-4 rounded-xl border border-border-table p-4">
      <div className="mb-2 text-sm font-bold text-foreground">{titulo}</div>
      <table className="w-full">
        <thead>
          <tr className={TR_HEAD}>
            <th className={`${TH} text-left`}>Negocio</th>
            <th className={`${TH} text-right`}>Plan</th>
            <th className={`${TH} text-right`}>Real</th>
            <th className={`${TH} text-right`}>Desvío</th>
            <th className={`${TH} text-right`}>Var. año ant.</th>
            <th className={`${TH} text-right`}>% sobre venta</th>
            <th className={`${TH} text-right`} title={HC_TITULO}>
              Headcount
            </th>
          </tr>
        </thead>
        <tbody>
          {negocios.map((g) => {
            const m = medir(g.lineas, periodo)
            return (
              <tr key={g.key} className={TR}>
                <td className={`${TD} font-bold`}>{g.key}</td>
                <td className={TD_NUM}>{fmtMonto(m.plan, moneda)}</td>
                <td className={TD_NUM}>{fmtMonto(m.valor, moneda)}</td>
                <td className={`${TD_NUM} space-x-2`}>
                  <EstadoTexto pct={m.desvPct}>{fmtMonto(m.desv, moneda, true)}</EstadoTexto>
                  <EstadoChip pct={m.desvPct} />
                </td>
                <td className={cn(TD_NUM, claseSigno(m.varPct))}>{fmtPct(m.varPct, true)}</td>
                <td className={TD_NUM}>{fmtPct(pesoVenta(g.lineas, periodo).real, false, 2)}</td>
                <td className={TD_NUM}>
                  <HcCelda lineas={g.lineas} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
