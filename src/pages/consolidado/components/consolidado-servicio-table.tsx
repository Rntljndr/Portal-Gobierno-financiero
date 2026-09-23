import { useMemo, useState } from 'react'
import { cn } from '@/shared/lib/utils'
import { Badge, EmptyState } from '@/shared/ui'
import { countryFlags } from '@/data/reporteria'
import { formatNumber } from '@/shared/lib/format'
import type { ServicioLineaRow } from '../lib/consolidado-servicio-lineas'
import { sortServicioLineas, type ServicioSortCol, type SortDir } from '../lib/sort-servicio-lineas'
import { ConsolidadoVarianceValue } from './consolidado-variance-cell'

const th = 'p-[9px_10px] text-left text-[10.5px] font-bold tracking-[0.04em] text-muted-foreground uppercase whitespace-nowrap bg-[#FAFBFE]'
const thNum = `${th} text-right`
const td = 'p-[9px_10px] text-[12.5px] whitespace-nowrap'
const tdR = `${td} text-right tabular-nums`

interface HeaderCellProps {
  col: NonNullable<ServicioSortCol>
  label: string
  align?: 'left' | 'right'
  sortCol: ServicioSortCol
  sortDir: SortDir
  onSort: (col: NonNullable<ServicioSortCol>) => void
}

function HeaderCell({ col, label, align = 'left', sortCol, sortDir, onSort }: HeaderCellProps) {
  const active = sortCol === col
  return (
    <th className={cn(align === 'right' ? thNum : th, active && 'text-primary')}>
      <button type="button" onClick={() => onSort(col)} className={cn('inline-flex items-center gap-1', align === 'right' && 'flex-row-reverse')}>
        {label} {active ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
      </button>
    </th>
  )
}

function ServicioLineaRowView({ row }: { row: ServicioLineaRow }) {
  return (
    <tr className="border-t border-border-table hover:bg-surface-hover">
      <td className={td}>
        <Badge variant="primary" shape="chip" className="text-[10px]">{row.pepN4}</Badge>
      </td>
      <td className={`${td} max-w-[220px] truncate font-semibold text-foreground`} title={row.servicio}>{row.servicio}</td>
      <td className={`${td} text-cs-gris-oscuro`}>{row.centroCosto}</td>
      <td className={`${td} text-cs-gris-oscuro`}>{row.gerencia}</td>
      <td className={`${td} text-cs-gris-oscuro`}>{row.equipo}</td>
      <td className={`${td} text-cs-gris-oscuro`}>{row.rubro}</td>
      <td className={`${td} text-cs-gris-oscuro`}>{row.cuentaContable}</td>
      <td className={td}>{countryFlags[row.origen] ?? ''} {row.origen}</td>
      <td className={td}>{countryFlags[row.destino] ?? ''} {row.destino}</td>
      <td className={`${td} text-cs-gris-oscuro`}>{row.moneda}</td>
      <td className={`${tdR} font-semibold text-foreground`}>{formatNumber(row.plan)}</td>
      <td className={tdR}>{formatNumber(row.forecastIPC)}</td>
      <td className={tdR}><ConsolidadoVarianceValue value={row.varMonto} /></td>
      <td className={tdR}><ConsolidadoVarianceValue value={row.varPct} percent /></td>
      <td className={tdR}>{formatNumber(row.hcPlan)}</td>
      <td className={`${td} text-cs-gris-oscuro`}>{row.justificacionDesvio}</td>
    </tr>
  )
}

const COLUMNS: { col: NonNullable<ServicioSortCol>; label: string; align?: 'right' }[] = [
  { col: 'pepN4', label: 'PEP N4' },
  { col: 'servicio', label: 'Servicio' },
  { col: 'centroCosto', label: 'Centro costo' },
  { col: 'gerencia', label: 'Gerencia' },
  { col: 'equipo', label: 'Equipo' },
  { col: 'rubro', label: 'Rubro' },
  { col: 'cuentaContable', label: 'Cuenta contable' },
  { col: 'origen', label: 'Origen' },
  { col: 'destino', label: 'Destino' },
  { col: 'moneda', label: 'Moneda' },
  { col: 'plan', label: 'Nuevo plan', align: 'right' },
  { col: 'forecastIPC', label: 'Forecast + IPC', align: 'right' },
  { col: 'varMonto', label: 'Var. monto', align: 'right' },
  { col: 'varPct', label: 'Var. %', align: 'right' },
  { col: 'hcPlan', label: 'HC plan', align: 'right' },
  { col: 'justificacionDesvio', label: 'Justificación desvío' },
]

export function ConsolidadoServicioTable({ rows }: { rows: ServicioLineaRow[] }) {
  const [sortCol, setSortCol] = useState<ServicioSortCol>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const sorted = useMemo(() => sortServicioLineas(rows, sortCol, sortDir), [rows, sortCol, sortDir])

  const onSort = (col: NonNullable<ServicioSortCol>) => {
    if (sortCol !== col) {
      setSortCol(col)
      setSortDir('asc')
    } else {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    }
  }

  if (rows.length === 0) {
    return (
      <div className="p-4">
        <EmptyState icon="search" title="Sin líneas para los filtros aplicados" text="Probá ajustar los filtros." />
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {COLUMNS.map((c) => (
              <HeaderCell key={c.col} col={c.col} label={c.label} align={c.align} sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <ServicioLineaRowView key={row.key} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
