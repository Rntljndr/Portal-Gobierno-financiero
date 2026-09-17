import type { CurrencyView } from '@/data/reporteria'
import { computeDimMetrics } from './dimension-metrics'
import type { DimFlatRow } from './flatten-dimension-tree'

function csvCell(v: string | number): string {
  const s = String(v)
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function downloadConsolidadoCsv(rows: DimFlatRow[], levelLabels: string[], vista: CurrencyView) {
  const totalPlan = rows.filter((r) => r.depth === 0).reduce((a, r) => a + r.node.plan, 0) || 1
  const header = ['Agrupador / PEP N4', 'Nivel', 'Código', 'Plan', 'Forecast + IPC', 'Variación', 'Variación %', '% del Plan']
  const lines = rows.map((r) => {
    const m = computeDimMetrics(r.node, totalPlan)
    const nivel = levelLabels[r.depth] ?? 'PEP N4'
    return [r.node.nombre, nivel, r.node.codigo ?? '', r.node.plan, r.node.fIPC, m.varMonto, m.varPct.toFixed(1), m.pctPlan.toFixed(1)].map(csvCell).join(';')
  })
  const csv = [header.join(';'), ...lines].join('\n')
  const monedaSuffix = vista === 'dolar' ? 'USD' : 'ML'
  const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Presupuesto-consolidado-2027-${monedaSuffix}.csv`
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
