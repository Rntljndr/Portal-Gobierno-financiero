import { useState } from 'react'
import { Icon, Tag } from '@/shared/ui'
import { TD, TD_NUM, TH, TR, TR_HEAD } from '../base/tabla'
import { cn } from '@/shared/lib/utils'
import { aplanar, claseSigno, DIM_LABEL, fmtHc, fmtMonto, fmtPct, medir, METRICAS, type Metrica, type Moneda, type Periodo, type PivotNodo } from '../../lib'
import type { V3Linea } from '@/data/gasto-it-v3'
import { EstadoTexto } from '../base/estado-chip'

interface PivotTablaProps {
  nodos: PivotNodo[]
  lineas: V3Linea[]
  metricaIds: string[]
  moneda: Moneda
  periodo: Periodo
  seleccion: string | null
  onSeleccion: (n: PivotNodo) => void
}

/** Tabla dinámica: filas anidadas según las aperturas elegidas; clic en una fila la selecciona para el
 * evolutivo mensual; la flecha la abre al siguiente nivel. */
export function PivotTabla({ nodos, lineas, metricaIds, moneda, periodo, seleccion, onSeleccion }: PivotTablaProps) {
  const [abiertos, setAbiertos] = useState<Set<string>>(new Set())
  const metricas = metricaIds.map((id) => METRICAS.find((m) => m.id === id)).filter((m): m is Metrica => Boolean(m))
  const totalPlan = medir(lineas, periodo).plan
  const filas = aplanar(nodos, abiertos)
  const toggle = (k: string) => setAbiertos((s) => new Set(s.has(k) ? [...s].filter((x) => x !== k) : [...s, k]))
  const celda = (m: Metrica, n: PivotNodo) => {
    const v = m.valor(n.m, n, totalPlan)
    if (m.tipo === 'hc') return <span>{n.hc.aplica ? fmtHc(v) : '—'}</span>
    const signed = m.semaforo || m.id === 'varPct'
    const txt = m.tipo === 'monto' ? fmtMonto(v, moneda, signed) : fmtPct(v, signed, m.id === 'pesoVenta' ? 2 : 1)
    if (m.id === 'varPct') return <span className={claseSigno(v)}>{txt}</span>
    if (!m.semaforo) return <span>{txt}</span>
    return <EstadoTexto pct={n.m.desvPct}>{txt}</EstadoTexto>
  }

  return (
    <div className="max-h-[560px] overflow-auto rounded-lg border border-border-table">
      <table className="w-full min-w-[900px]">
        <thead className="sticky top-0 z-[1] bg-white">
          <tr className={TR_HEAD}>
            <th className={`${TH} text-left`}>{nodos[0] ? DIM_LABEL[nodos[0].nivel] : 'Apertura'}</th>
            {metricas.map((m) => (
              <th key={m.id} className={`${TH} text-right`}>
                {m.label}
              </th>
            ))}
            <th className={`${TH} w-10`} />
          </tr>
        </thead>
        <tbody>
          {filas.map(({ nodo, depth }) => (
            <tr
              key={nodo.key}
              onClick={() => onSeleccion(nodo)}
              className={cn(TR, 'cursor-pointer', seleccion === nodo.key && 'bg-info-surface')}
            >
              <td className={TD} style={{ paddingLeft: 12 + depth * 22 }}>
                <div className="flex items-center gap-2">
                  <span className={depth ? 'text-cs-gris-oscuro' : 'font-bold'}>{nodo.nombre}</span>
                  {depth > 0 && (
                    <Tag color="gray" size="sm">
                      {DIM_LABEL[nodo.nivel]}
                    </Tag>
                  )}
                </div>
              </td>
              {metricas.map((m) => (
                <td key={m.id} className={TD_NUM}>
                  {celda(m, nodo)}
                </td>
              ))}
              <td className="px-3 py-3 text-right">
                {nodo.hijos.length > 0 && (
                  <button
                    type="button"
                    aria-label={abiertos.has(nodo.key) ? 'Contraer' : 'Expandir'}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggle(nodo.key)
                    }}
                    className="rounded-lg p-1 text-primary hover:bg-surface-hover"
                  >
                    <Icon name={abiertos.has(nodo.key) ? 'chevron_up' : 'chevron_down'} size={16} color="currentColor" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
