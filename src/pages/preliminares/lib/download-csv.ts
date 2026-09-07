import type { PreliminarRow } from '@/data/preliminares'
import { calcCompletitud, calcPrelimRowTotals } from './preliminares-calc'

export function downloadPreliminaresCsv(rows: (PreliminarRow & { children?: PreliminarRow[] })[], filename: string) {
  const header = [
    'Código', 'Servicio', 'País', 'Gerencia Padre', 'Gerencia', 'Equipo', 'Centro de Costo', 'Asignación', 'Cuenta Contable', 'Moneda', 'Estado', 'Actualización',
    'Real acumulado', 'Forecast del mes', 'Plan del mes', 'Preliminar del mes',
    'Desvío vs Plan', 'Desvío % vs Plan', 'Desvío vs Forecast', 'Desvío % vs Forecast',
  ].join(',')

  const csvRows = rows.map((r) => {
    const t = calcPrelimRowTotals(r)
    const estado = r.children ? `${calcCompletitud(r.children)}%` : r.estado === 'definitivo' ? 'Definitivo' : 'Preliminar'
    return [
      r.codigo, `"${r.servicio}"`, r.pais, r.gerenciaPadre, r.gerencia, r.equipo, r.centroCosto, r.asignacion, r.cuentaContable, r.moneda,
      estado,
      r.tipoActualizacion === 'manual' ? 'Manual' : 'Automática',
    ]
      .concat(
        [t.realAcum, t.forecastMes, t.planMes, t.preliminarMes, t.desvioPlanMonto].map((v) => String(Math.round(v))),
        [t.desvioPlanPct === null ? '—' : `${t.desvioPlanPct.toFixed(1)}%`],
        [String(Math.round(t.desvioForecastMonto))],
        [t.desvioForecastPct === null ? '—' : `${t.desvioForecastPct.toFixed(1)}%`],
      )
      .join(',')
  })

  const blob = new Blob([[header, ...csvRows].join('\n')], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}
