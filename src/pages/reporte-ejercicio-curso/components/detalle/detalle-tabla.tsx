import { Fragment } from 'react'
import { Icon, DesvioChip } from '@/shared/ui'
import { formatCompact } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'
import type { RealesRow } from '@/data/reales'
import { buildPivotTree, type PivotNode } from '../../lib/detalle/build-pivot-tree'
import { metricaById } from '../../lib/detalle/metricas'
import { useRecoeExpand } from '../../lib/use-recoe-expand'

const th = 'p-[8px_10px] text-left text-[10.5px] font-bold tracking-[0.05em] text-muted-foreground uppercase'
const thRight = `${th} text-right`
const PADDING_BY_DEPTH = [10, 34, 58]

function Celda({ metricaId, node, totalPlanGeneral, monedaSimbolo }: { metricaId: string; node: PivotNode; totalPlanGeneral: number; monedaSimbolo: string }) {
  const metrica = metricaById(metricaId)
  if (!metrica) return <td />
  const v = metrica.valor(node, totalPlanGeneral)
  if (v === null) return <td className="p-[8px_10px] text-right text-[12.5px] text-muted-foreground">—</td>
  if (metrica.id === 'desvioPct') {
    return (
      <td className="p-[8px_10px] text-right">
        <DesvioChip pct={v} />
      </td>
    )
  }
  const texto = metrica.tipo === 'pct' ? `${v >= 0 ? '+' : ''}${v.toFixed(1)}%` : `${v <= 0 && metrica.signed ? '(' : v > 0 && metrica.signed ? '+' : ''}${monedaSimbolo}${formatCompact(Math.abs(v))}${v <= 0 && metrica.signed ? ')' : ''}`
  const tono = metrica.signed ? (v <= 0 ? 'text-[#067647]' : 'text-[#B42318]') : 'text-foreground'
  return <td className={cn('p-[8px_10px] text-right text-[12.5px] font-semibold tabular-nums', tono)}>{texto}</td>
}

interface FilaProps {
  node: PivotNode
  depth: number
  metricas: string[]
  totalPlanGeneral: number
  monedaSimbolo: string
  isOpen: (k: string) => boolean
  toggle: (k: string) => void
}

function Fila({ node, depth, metricas, totalPlanGeneral, monedaSimbolo, isOpen, toggle }: FilaProps) {
  const tieneHijos = node.children.length > 0
  const abierto = isOpen(node.key)
  return (
    <Fragment>
      <tr className={cn('border-t border-[#F1F3F8]', depth === 0 && 'bg-[#FAFBFE]')}>
        <td className="p-[8px_10px] text-[13px] text-foreground" style={{ paddingLeft: PADDING_BY_DEPTH[Math.min(depth, 2)] }}>
          <span className="inline-flex items-center gap-1.5">
            {tieneHijos ? (
              <button type="button" onClick={() => toggle(node.key)} className="flex size-4 items-center justify-center rounded text-muted-foreground hover:bg-surface-hover">
                <Icon name={abierto ? 'chevron_down' : 'chevron_right'} size={11} color="currentColor" />
              </button>
            ) : (
              <span className="inline-block w-4" />
            )}
            <span className={depth === 0 ? 'font-bold' : ''}>{node.nombre}</span>
          </span>
        </td>
        {metricas.map((m) => (
          <Celda key={m} metricaId={m} node={node} totalPlanGeneral={totalPlanGeneral} monedaSimbolo={monedaSimbolo} />
        ))}
      </tr>
      {abierto &&
        node.children.map((c) => (
          <Fila key={c.key} node={c} depth={depth + 1} metricas={metricas} totalPlanGeneral={totalPlanGeneral} monedaSimbolo={monedaSimbolo} isOpen={isOpen} toggle={toggle} />
        ))}
    </Fragment>
  )
}

interface DetalleTablaProps {
  rows: RealesRow[]
  aperturas: string[]
  metricas: string[]
  monedaSimbolo: string
  primeraColumnaLabel: string
}

export function DetalleTabla({ rows, aperturas, metricas, monedaSimbolo, primeraColumnaLabel }: DetalleTablaProps) {
  const { isOpen, toggle } = useRecoeExpand()
  const tree = buildPivotTree(rows, aperturas)
  const totalPlanGeneral = tree.reduce((s, n) => s + n.totals.plan, 0)

  if (aperturas.length === 0) {
    return <div className="rounded-lg border border-dashed border-border p-8 text-center text-[13px] text-muted-foreground">Elige al menos una apertura en filas en "Configurar vista".</div>
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#FAFBFE]">
            <th className={th}>{primeraColumnaLabel}</th>
            {metricas.map((m) => (
              <th key={m} className={thRight}>
                {metricaById(m)?.label ?? m}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tree.map((n) => (
            <Fila key={n.key} node={n} depth={0} metricas={metricas} totalPlanGeneral={totalPlanGeneral} monedaSimbolo={monedaSimbolo} isOpen={isOpen} toggle={toggle} />
          ))}
          {tree.length === 0 && (
            <tr>
              <td colSpan={metricas.length + 1} className="p-6 text-center text-[13px] text-muted-foreground">
                Sin datos para los filtros seleccionados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
