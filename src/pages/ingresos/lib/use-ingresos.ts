import { useMemo, useState } from 'react'
import { monthKeys } from '@/data/reporteria'
import { BANDERAS_MAESTRO, type BanderaMaestro } from '@/data/administracion/ingresos-banderas'
import { EJERCICIOS_INGRESOS, INGRESOS_SEED, type IngresoBandera } from '@/data/administracion/ingresos'
import { sortIngresos, type SortColumn, type SortDir } from './sort-ingresos'

export interface IngresoRow {
  maestro: BanderaMaestro
  meses: Record<string, number>
  total: number
}

const DEFAULT_EJERCICIO = 2027

function sumMeses(meses: Record<string, number>): number {
  return monthKeys.reduce((acc, k) => acc + (meses[k] ?? 0), 0)
}

export function useIngresos() {
  const [ejercicio, setEjercicio] = useState(DEFAULT_EJERCICIO)
  const [registros, setRegistros] = useState<IngresoBandera[]>(INGRESOS_SEED)
  const [sortCol, setSortCol] = useState<SortColumn>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [editingRows, setEditingRows] = useState<Set<string>>(new Set())

  const rowsSinOrdenar: IngresoRow[] = useMemo(() => {
    const porBandera = new Map(registros.filter((r) => r.ejercicio === ejercicio).map((r) => [r.bandera, r]))
    return BANDERAS_MAESTRO.filter((m) => porBandera.has(m.nombre)).map((maestro) => {
      const meses = porBandera.get(maestro.nombre)!.meses
      return { maestro, meses, total: sumMeses(meses) }
    })
  }, [registros, ejercicio])

  const rows = useMemo(() => sortIngresos(rowsSinOrdenar, sortCol, sortDir), [rowsSinOrdenar, sortCol, sortDir])

  const banderasSinCargar = useMemo(() => {
    const cargadas = new Set(rows.map((r) => r.maestro.nombre))
    return BANDERAS_MAESTRO.filter((m) => !cargadas.has(m.nombre))
  }, [rows])

  function onSort(col: NonNullable<SortColumn>) {
    if (sortCol !== col) {
      setSortCol(col)
      setSortDir('asc')
    } else {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    }
  }

  function toggleEditing(bandera: string) {
    setEditingRows((prev) => {
      const next = new Set(prev)
      if (next.has(bandera)) next.delete(bandera)
      else next.add(bandera)
      return next
    })
  }

  function upsertRegistro(bandera: string, meses: Record<string, number>) {
    setRegistros((prev) => {
      const idx = prev.findIndex((r) => r.bandera === bandera && r.ejercicio === ejercicio)
      if (idx === -1) return [...prev, { bandera, ejercicio, meses }]
      const next = [...prev]
      next[idx] = { ...next[idx], meses }
      return next
    })
  }

  function updateMes(bandera: string, mesKey: string, valor: number) {
    setRegistros((prev) =>
      prev.map((r) => (r.bandera === bandera && r.ejercicio === ejercicio ? { ...r, meses: { ...r.meses, [mesKey]: valor } } : r)),
    )
  }

  function applyBulk(items: { bandera: string; meses: Record<string, number> }[]) {
    setRegistros((prev) => {
      let next = [...prev]
      for (const item of items) {
        const idx = next.findIndex((r) => r.bandera === item.bandera && r.ejercicio === ejercicio)
        if (idx === -1) next = [...next, { bandera: item.bandera, ejercicio, meses: item.meses }]
        else next[idx] = { ...next[idx], meses: item.meses }
      }
      return next
    })
  }

  return {
    ejercicio,
    setEjercicio,
    ejercicios: EJERCICIOS_INGRESOS,
    rows,
    banderasSinCargar,
    upsertRegistro,
    updateMes,
    applyBulk,
    sortCol,
    sortDir,
    onSort,
    editingRows,
    toggleEditing,
  }
}
