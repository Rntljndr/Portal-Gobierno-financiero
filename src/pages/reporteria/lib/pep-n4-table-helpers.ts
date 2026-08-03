import { ipcFactorByMonth, monthKeys } from '@/data/reporteria'
import type { PepN7Row } from '@/data/reporteria'

export type SortCol = 'pais' | 'paisDestino' | 'equipo' | null

export function fmtM(v: number): string {
  const n = Math.round(Math.abs(v))
  return n >= 1000 ? `${n.toLocaleString('es-CL')} MM` : `${n.toLocaleString('es-CL')} M`
}

export function rowTotal(meses: Record<string, number>): number {
  return monthKeys.reduce((a, k) => a + (meses[k] || 0), 0)
}

export function rowTotalPlan(meses: Record<string, number>, planFactor: number): number {
  return monthKeys.reduce((a, k) => a + Math.round((meses[k] || 0) * planFactor), 0)
}

export function rowTotalFIPC(meses: Record<string, number>): number {
  return monthKeys.reduce((a, k) => a + Math.round((meses[k] || 0) * (ipcFactorByMonth[k] || 1)), 0)
}

export interface VarInfo {
  color: string
  arrow: string
  pctLabel: string
  absLabel: string
}

export function varInfo(actual: number, base: number, isTotalRow: boolean): VarInfo {
  const diff = actual - base
  const pct = base > 0 ? (diff / base) * 100 : 0
  const color = diff > 0 ? '#DC2626' : diff < 0 ? '#067647' : '#0047B0'
  const arrow = diff > 0 ? '↑' : diff < 0 ? '↓' : '→'
  const pctLabel = diff !== 0 ? `${arrow}${Math.abs(pct).toFixed(1).replace('.', ',')}%` : isTotalRow ? '→ 0,0%' : '—'
  const absLabel = diff !== 0 ? `${arrow}${fmtM(Math.abs(diff))}` : isTotalRow ? `→ ${fmtM(0)}` : '—'
  return { color, arrow, pctLabel, absLabel }
}

export function sortRows<T extends PepN7Row>(rows: T[], sortCol: SortCol, sortDir: 'asc' | 'desc' | null): T[] {
  if (!sortCol || !sortDir) return rows
  const sorted = [...rows]
  sorted.sort((a, b) => {
    const av = sortCol === 'pais' ? a.pais : sortCol === 'paisDestino' ? a.paisDestino || a.pais : a.equipo
    const bv = sortCol === 'pais' ? b.pais : sortCol === 'paisDestino' ? b.paisDestino || b.pais : b.equipo
    const c = av.localeCompare(bv, 'es')
    return sortDir === 'asc' ? c : -c
  })
  return sorted
}
