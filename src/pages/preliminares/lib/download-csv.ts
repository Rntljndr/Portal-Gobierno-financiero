import type { PreliminarRow } from '@/data/preliminares'

export function downloadPreliminaresCsv(rows: PreliminarRow[], filename: string) {
  const header = [
    'Código', 'Servicio', 'País', 'Gerencia Padre', 'Gerencia', 'Equipo', 'Centro de Costo', 'Asignación',
    'Cuenta Contable', 'Moneda', 'Acum. Real (Ene-Jul)', 'Forecast del mes', 'Preliminar', 'Estado', 'Actualización',
  ].join(',')

  const csvRows = rows.map((r) =>
    [
      r.codigo, `"${r.servicio}"`, r.pais, r.gerenciaPadre, r.gerencia, r.equipo, r.centroCosto, r.asignacion,
      r.cuentaContable, r.moneda, Math.round(r.acumReal), Math.round(r.forecastMes), Math.round(r.preliminarMes),
      r.estado === 'definitivo' ? 'Definitivo' : 'Preliminar',
      r.tipoActualizacion === 'manual' ? 'Manual' : 'Automática',
    ].join(','),
  )

  const blob = new Blob([[header, ...csvRows].join('\n')], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}
