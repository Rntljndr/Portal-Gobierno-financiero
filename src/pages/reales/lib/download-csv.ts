import { monthLabels, REALES_LAST_CLOSED } from '@/data/reales'
import type { RealesRow } from '@/data/reales'
import { calcMonths, calcTotals } from './reales-calc'

export function downloadRealesCsv(rows: RealesRow[], filename: string) {
  const monthHeaders = monthLabels.map((n, i) => `${n} (${i < REALES_LAST_CLOSED ? 'Real' : 'Forecast'})`)
  const header = ['Código', 'Nombre', 'País Origen', 'Gerencia Padre', 'Gerencia', 'Equipo', 'C. Costo', 'Asignación', 'Bandera', 'Cta. Contable', 'Moneda']
    .concat(monthHeaders)
    .concat(['Plan Total', 'Acum Real', 'Disponible', 'Real+FC', 'Desvío', '%Desvío'])
    .join(',')

  const csvRows = rows.map((r) => {
    const months = calcMonths(r)
    const c = calcTotals(r)
    return [r.codigo, `"${r.nombre}"`, r.pais, r.gerenciaPadre, r.gerencia, r.equipo, r.centroCosto, r.asignacion, r.bandera, r.cuentaContable, r.moneda]
      .concat(months.map((v) => String(Math.round(v))))
      .concat([Math.round(c.plan), Math.round(c.real), Math.round(c.disponible), Math.round(c.realMasForecast), Math.round(c.desvio), `${c.pctDesvio.toFixed(1)}%`].map(String))
      .join(',')
  })

  const blob = new Blob([[header, ...csvRows].join('\n')], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}
