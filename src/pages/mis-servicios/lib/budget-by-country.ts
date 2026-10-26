import { convertMoneda, getDestinos, paisIpc, paisLabel, paisMoneda, paises, type Pais, type Servicio } from '@/data/services'
import { formatCompact } from '@/shared/lib/format'

export type CardTone = 'up' | 'down' | 'ipc' | 'hl' | 'muted'
/** Fila de una tarjeta de país ('sep' = separador). */
export type CardMetric = { label: string; value: string; tone?: CardTone } | 'sep'

/** Datos de una tarjeta de país del panel "por país" (genérica: cada vista arma sus métricas). */
export interface CountryCardData {
  pais: Pais
  label: string
  moneda: string
  empty: boolean
  metricas: CardMetric[]
}

export interface CountryBudgetRow extends CountryCardData {
  pais: Pais
  label: string
  moneda: string
  empty: boolean
  plan: string
  base: string
  fcIpc: string
  varAbs: string
  varPct: string
  up: boolean
  ipc: string
}

function summarize(pais: Pais, plan: number, base: number, fcIpc: number, empty: boolean): CountryBudgetRow {
  const varAbs = fcIpc - base
  const varPct = base ? (varAbs / base) * 100 : 0
  const up = varAbs >= 0
  const ipc = paisIpc[pais]
  const r = {
    pais,
    label: paisLabel[pais] ?? pais.toUpperCase(),
    moneda: paisMoneda[pais],
    empty,
    plan: formatCompact(plan),
    base: formatCompact(base),
    fcIpc: formatCompact(fcIpc),
    varAbs: `${up ? '+' : '−'}${formatCompact(Math.abs(varAbs))}`,
    varPct: `${up ? '+' : '−'}${Math.abs(varPct).toFixed(1)}%`,
    up,
    ipc: ipc != null ? `${ipc.toFixed(1)}%` : '—',
  }
  const tone: CardTone = up ? 'up' : 'down'
  const metricas: CardMetric[] = [
    { label: 'Plan', value: r.plan },
    { label: 'Forecast base', value: r.base, tone: 'muted' },
    { label: 'Forecast + IPC', value: r.fcIpc, tone: 'hl' },
    'sep',
    { label: 'Variación $', value: r.varAbs, tone },
    { label: 'Variación %', value: `${r.varPct} ${up ? '↗' : '↘'}`, tone },
    'sep',
    { label: 'IPC', value: r.ipc, tone: 'ipc' },
  ]
  return { ...r, metricas }
}

export function budgetByOrigen(services: Servicio[]): CountryBudgetRow[] {
  return paises.map((p) => {
    const items = services.filter((s) => s.pais === p)
    const plan = items.reduce((a, s) => a + s.totalPlan, 0)
    const base = items.reduce((a, s) => a + s.forecastBase, 0)
    const fcIpc = items.reduce((a, s) => a + s.forecastIPC, 0)
    return summarize(p, plan, base, fcIpc, items.length === 0)
  })
}

export function budgetByDestino(services: Servicio[]): CountryBudgetRow[] {
  return paises.map((d) => {
    let plan = 0
    let base = 0
    let fcIpc = 0
    let hit = false
    services.forEach((s) => {
      getDestinos(s).forEach((dest) => {
        if (dest.pais !== d) return
        hit = true
        plan += convertMoneda((s.totalPlan * dest.pct) / 100, s.pais, d)
        base += convertMoneda((s.forecastBase * dest.pct) / 100, s.pais, d)
        fcIpc += convertMoneda((s.forecastIPC * dest.pct) / 100, s.pais, d)
      })
    })
    return summarize(d, plan, base, fcIpc, !hit)
  })
}
