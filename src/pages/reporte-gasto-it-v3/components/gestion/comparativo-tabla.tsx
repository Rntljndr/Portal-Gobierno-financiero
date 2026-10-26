import { useState, type ReactNode } from 'react'
import { Button, DimensionTabs, Icon } from '@/shared/ui'
import type { V3Linea } from '@/data/gasto-it-v3'
import { agrupar, dimValor, type DimId } from '../../lib'
import { BarraDesvio } from '../base/barra-desvio'
import { Seccion } from '../base/seccion'
import { TD, TD_NUM, TH, TR, TR_HEAD } from '../base/tabla'

const DIMS: { value: DimId; label: string }[] = [
  { value: 'pais', label: 'País' },
  { value: 'division', label: 'División' },
  { value: 'negocio', label: 'Negocio' },
  { value: 'gerencia', label: 'Gerencia' },
  { value: 'rubro', label: 'Rubro' },
  { value: 'cuentaContable', label: 'Cuenta contable' },
]
const TOP = 8

export interface Columna {
  label: string
  celda: (ls: V3Linea[]) => ReactNode
}

interface ComparativoTablaProps {
  titulo: ReactNode
  subtitulo: string
  lineas: V3Linea[]
  columnas: Columna[]
  /** Diferencia que ordena las filas (mayor movimiento primero) y dibuja la barra ← Baja · Sube →. */
  dif: (ls: V3Linea[]) => number
  barra: string
}

/** Tabla de comparación por dimensión (pestañas): cada fila abre sus servicios. Ordena por el mayor
 * movimiento absoluto, muestra los primeros 8 y "Ver todos" para el resto. */
export function ComparativoTabla({ titulo, subtitulo, lineas, columnas, dif, barra }: ComparativoTablaProps) {
  const [dim, setDim] = useState<DimId>('pais')
  const [abierta, setAbierta] = useState<string | null>(null)
  const [todos, setTodos] = useState(false)
  const filas = agrupar(lineas, (l) => dimValor(dim, l)).sort((a, b) => Math.abs(dif(b.lineas)) - Math.abs(dif(a.lineas)))
  const maxAbs = Math.max(...filas.map((f) => Math.abs(dif(f.lineas))), 1)
  const visibles = todos ? filas : filas.slice(0, TOP)
  const cambiarDim = (d: DimId) => {
    setDim(d)
    setAbierta(null)
    setTodos(false)
  }

  return (
    <Seccion titulo={titulo} subtitulo={subtitulo}>
      <DimensionTabs value={dim} onChange={cambiarDim} options={DIMS} className="-mx-6 mb-2" />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px]">
          <thead>
            <tr className={TR_HEAD}>
              <th className={`${TH} text-left`}>{DIMS.find((d) => d.value === dim)!.label}</th>
              {columnas.map((c) => (
                <th key={c.label} className={`${TH} text-right`}>
                  {c.label}
                </th>
              ))}
              <th className={`${TH} w-[20%] text-center`}>{barra}</th>
              <th className={`${TH} w-10`} />
            </tr>
          </thead>
          <tbody>
            {visibles.map((f) => {
              const abierto = abierta === f.key
              const hijos = abierto ? agrupar(f.lineas, (l) => l.servicio).sort((a, b) => Math.abs(dif(b.lineas)) - Math.abs(dif(a.lineas))) : []
              const maxHijo = Math.max(...hijos.map((h) => Math.abs(dif(h.lineas))), 1)
              return [
                <tr key={f.key} onClick={() => setAbierta(abierto ? null : f.key)} className={`${TR} cursor-pointer`} aria-expanded={abierto}>
                  <td className={`${TD} font-bold`}>{f.key}</td>
                  <Celdas ls={f.lineas} columnas={columnas} dif={dif} maxAbs={maxAbs} />
                  <td className="px-3 py-3 text-right text-primary">
                    <Icon name={abierto ? 'chevron_up' : 'chevron_down'} size={16} color="currentColor" />
                  </td>
                </tr>,
                ...hijos.map((h) => (
                  <tr key={`${f.key}|${h.key}`} className="border-b border-border-table bg-surface-subtle">
                    <td className={`${TD} pl-8`}>{h.key}</td>
                    <Celdas ls={h.lineas} columnas={columnas} dif={dif} maxAbs={maxHijo} />
                    <td />
                  </tr>
                )),
              ]
            })}
          </tbody>
        </table>
      </div>
      {filas.length > TOP && (
        <div className="mt-3 flex justify-center">
          <Button variant="ghost" onClick={() => setTodos(!todos)}>
            {todos ? `Ver solo los ${TOP} con más movimiento` : `Ver todos (${filas.length})`}
          </Button>
        </div>
      )}
    </Seccion>
  )
}

function Celdas({ ls, columnas, dif, maxAbs }: { ls: V3Linea[]; columnas: Columna[]; dif: (ls: V3Linea[]) => number; maxAbs: number }) {
  return (
    <>
      {columnas.map((c) => (
        <td key={c.label} className={TD_NUM}>
          {c.celda(ls)}
        </td>
      ))}
      <td className="px-3 py-3">
        <BarraDesvio monto={dif(ls)} maxAbs={maxAbs} />
      </td>
    </>
  )
}
