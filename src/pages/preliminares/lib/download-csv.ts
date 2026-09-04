import { monthLabels } from '@/data/reporteria'
import { REALES_LAST_CLOSED } from '@/data/reales'
import type { PreliminarRow } from '@/data/preliminares'
import { calcPrelimMonths, calcPrelimTotals } from './preliminares-calc'

export function downloadPreliminaresCsv(rows: PreliminarRow[], filename: string) {
  const monthHeaders = monthLabels.map((n, i) => `${n} (${i < REALES_LAST_CLOSED ? 'Real' : i === REALES_LAST_CLOSED ? 'Preliminar' : 'Forecast'})`)
  const header = ['Código', 'Servicio', 'País', 'Gerencia Padre', 'Gerencia', 'Equipo', 'Centro de Costo', 'Asignación', 'Cuenta Contable', 'Moneda', 'Estado', 'Actualización']
    .concat(monthHeaders)
    .concat(['Plan acumulado', 'Real acumulado', 'Desvío acumulado', 'Desvío % acumulado', 'Plan total', 'Real+Forecast', 'Desvío anual', 'Desvío % anual'])
    .join(',')

  const csvRows = rows.map((r) => {
    const months = calcPrelimMonths(r)
    const t = calcPrelimTotals(r)
    return [
      r.codigo, `"${r.servicio}"`, r.pais, r.gerenciaPadre, r.gerencia, r.equipo, r.centroCosto, r.asignacion, r.cuentaContable, r.moneda,
      r.estado === 'definitivo' ? 'Definitivo' : 'Preliminar',
      r.tipoActualizacion === 'manual' ? 'Manual' : 'Automática',
    ]
      .concat(months.map((v) => String(Math.round(v))))
      .concat([
        Math.round(t.planAcum),
        Math.round(t.real),
        Math.round(t.desvioAcumMonto),
        t.desvioAcumPct === null ? '—' : `${t.desvioAcumPct.toFixed(1)}%`,
        Math.round(t.plan),
        Math.round(t.realMasForecast),
        Math.round(t.desvio),
        `${t.pctDesvio.toFixed(1)}%`,
      ].map(String))
      .join(',')
  })

  const blob = new Blob([[header, ...csvRows].join('\n')], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}
