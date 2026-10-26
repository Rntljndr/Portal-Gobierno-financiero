import type { PivotNode } from './build-pivot-tree'

export interface MetricaColumna {
  id: string
  label: string
  tipo: 'monto' | 'pct'
  /** true = coloreada verde/rojo según signo (desvíos); false = siempre neutra (montos/participación). */
  signed: boolean
  /** `totalPlanGeneral` solo lo usa "% participación" (necesita el total del árbol completo, no del nodo). */
  valor: (n: PivotNode, totalPlanGeneral: number) => number | null
}

export const METRICAS: MetricaColumna[] = [
  { id: 'plan', label: 'Plan', tipo: 'monto', signed: false, valor: (n) => n.totals.plan },
  { id: 'forecast', label: 'Forecast', tipo: 'monto', signed: false, valor: (n) => n.totals.realMasForecast },
  { id: 'real', label: 'Real', tipo: 'monto', signed: false, valor: (n) => n.totals.real },
  { id: 'desvioMonto', label: 'Desvío $', tipo: 'monto', signed: true, valor: (n) => n.totals.desvio },
  { id: 'desvioPct', label: 'Desvío %', tipo: 'pct', signed: true, valor: (n) => n.totals.pctDesvio },
  {
    id: 'participacion',
    label: '% Participación',
    tipo: 'pct',
    signed: false,
    valor: (n, totalPlanGeneral) => (totalPlanGeneral > 0 ? (n.totals.plan / totalPlanGeneral) * 100 : null),
  },
  { id: 'realAnioAnterior', label: 'Real año anterior', tipo: 'monto', signed: false, valor: (n) => n.realAnioAnterior },
  { id: 'variacionAnioMonto', label: 'Variación vs. año ant. $', tipo: 'monto', signed: true, valor: (n) => n.totals.real - n.realAnioAnterior },
  {
    id: 'variacionAnioPct',
    label: 'Variación vs. año ant. %',
    tipo: 'pct',
    signed: true,
    valor: (n) => (n.realAnioAnterior > 0 ? ((n.totals.real - n.realAnioAnterior) / n.realAnioAnterior) * 100 : null),
  },
]

export function metricaById(id: string): MetricaColumna | undefined {
  return METRICAS.find((m) => m.id === id)
}
