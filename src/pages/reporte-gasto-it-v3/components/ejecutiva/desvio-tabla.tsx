import { useState } from 'react'
import { Button, Icon, SegmentedTabs, Tag } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import type { V3Linea } from '@/data/gasto-it-v3'
import { useReporte } from '../../lib/contexto'
import { agrupar, claseSigno, fmtMonto, fmtPct, medir, pesoVenta, PERIODOS, type Medida } from '../../lib'
import { BarraDesvio } from '../base/barra-desvio'
import { EstadoChip, EstadoTexto } from '../base/estado-chip'
import { Seccion } from '../base/seccion'
import { HC_TITULO, HcCelda } from '../base/hc-celda'
import { TD, TD_NUM, TH, TR, TR_HEAD } from '../base/tabla'

type Orden = 'pct' | 'monto'

/** Filas visibles por defecto: los cinco con mayor desvío (el resto, con "Ver todos"). */
const TOP = 5

export interface DesvioTablaProps {
  /** Nombre de la dimensión en singular ("Negocio") y plural para el título ("Negocios"). */
  dimension: string
  plural: string
  nivel1: (l: V3Linea) => string
  /** Apertura de cada fila: clave del sub-grupo y una línea secundaria opcional. */
  nivel2: (l: V3Linea) => { key: string; titulo: string; sub?: string }
  /** Muestra la columna "% sobre venta" (dimensiones de negocio). */
  conVenta?: boolean
  /** Muestra la columna Headcount (país, división, negocio y gerencia; no en cuentas contables). */
  conHc?: boolean
  /** Filas menos prominentes que van al final (rubros técnicos en la Visión Negocio). */
  esSecundaria?: (ls: V3Linea[]) => boolean
  defaultOpen: boolean
}

interface Fila {
  key: string
  titulo: string
  sub?: string
  lineas: V3Linea[]
  m: Medida
}

const filas = (ls: V3Linea[], fn: (l: V3Linea) => { key: string; titulo: string; sub?: string }, periodo: Parameters<typeof medir>[1]): Fila[] =>
  agrupar(ls, (l) => fn(l).key).map((g) => ({ ...fn(g.lineas[0]), lineas: g.lineas, m: medir(g.lineas, periodo) }))

/** Tabla de desvíos por una dimensión (negocio, gerencia o rubro) en el período elegido, ordenable por
 * desvío en % o en monto; cada fila se abre al nivel siguiente con la misma barra Bajo · Sobre. */
export function DesvioTabla({ dimension, plural, nivel1, nivel2, conVenta, conHc = true, esSecundaria, defaultOpen }: DesvioTablaProps) {
  const { lineasAbajo, periodo, ajustes } = useReporte()
  const [orden, setOrden] = useState<Orden>(ajustes.rankingOrden)
  const [abiertos, setAbiertos] = useState<Set<string>>(new Set())
  const [todos, setTodos] = useState(false)
  const val = (f: Fila) => (orden === 'pct' ? f.m.desvPct : f.m.desv)
  const todas = filas(lineasAbajo, (l) => ({ key: nivel1(l), titulo: nivel1(l) }), periodo).sort((a, b) => val(b) - val(a))
  const sec = (f: Fila) => Boolean(esSecundaria?.(f.lineas))
  const ordenada = [...todas.filter((f) => !sec(f)), ...todas.filter(sec)]
  const lista = todos ? ordenada : ordenada.slice(0, TOP)
  const top = todas[0]
  const maxAbs = Math.max(...todas.map((f) => Math.abs(f.m.desv)), 1)
  const per = PERIODOS.find((p) => p.value === periodo)!
  const toggle = (k: string) => setAbiertos((s) => new Set(s.has(k) ? [...s].filter((x) => x !== k) : [...s, k]))

  const titulo =
    top && top.m.desvPct >= 0.05 ? (
      <span className="flex flex-wrap items-center gap-2">
        {plural} con mayor desvío
        <Tag color="red">{top.titulo}</Tag>
      </span>
    ) : (
      `${plural}: ninguno sobre el plan`
    )

  return (
    <Seccion
      titulo={titulo}
      subtitulo={`${per.label} · abre una fila para ver su detalle.`}
      acciones={
        <div className="flex items-center gap-2">
          <div className="text-xxs font-bold text-primary">Ordenar por</div>
          <SegmentedTabs<Orden>
            size="sm"
            value={orden}
            onChange={setOrden}
            options={[
              { value: 'pct', label: 'Por %' },
              { value: 'monto', label: 'Por monto' },
            ]}
          />
        </div>
      }
      defaultOpen={defaultOpen}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px]">
          <thead>
            <tr className={TR_HEAD}>
              <th className={`${TH} text-left`}>{dimension}</th>
              <th className={`${TH} text-right`}>Plan</th>
              <th className={`${TH} text-right`}>Real</th>
              <th className={`${TH} w-[22%] text-center`}>← Bajo · Sobre →</th>
              <th className={`${TH} text-right`}>Desvío</th>
              <th className={`${TH} text-right`}>Var. año ant.</th>
              {conVenta && <th className={`${TH} text-right`}>% sobre venta</th>}
              {conHc && (
                <th className={`${TH} text-right`} title={HC_TITULO}>
                  Headcount
                </th>
              )}
              <th className={`${TH} w-10`} />
            </tr>
          </thead>
          <tbody>
            {lista.map((f) => (
              <Grupo key={f.key} f={f} maxAbs={maxAbs} conVenta={conVenta} conHc={conHc} secundaria={sec(f)} abierto={abiertos.has(f.key)} onToggle={() => toggle(f.key)} nivel2={nivel2} />
            ))}
          </tbody>
        </table>
      </div>
      {ordenada.length > TOP && (
        <div className="mt-3 flex justify-center">
          <Button variant="ghost" onClick={() => setTodos(!todos)}>
            {todos ? `Ver solo los ${TOP} con mayor desvío` : `Ver todos (${ordenada.length})`}
          </Button>
        </div>
      )}
    </Seccion>
  )
}

interface GrupoProps {
  f: Fila
  maxAbs: number
  conVenta?: boolean
  conHc: boolean
  secundaria: boolean
  abierto: boolean
  onToggle: () => void
  nivel2: DesvioTablaProps['nivel2']
}

function Grupo({ f, maxAbs, conVenta, conHc, secundaria, abierto, onToggle, nivel2 }: GrupoProps) {
  const { periodo } = useReporte()
  const hijos = abierto ? filas(f.lineas, nivel2, periodo).sort((a, b) => b.m.desv - a.m.desv) : []
  const maxHijo = Math.max(...hijos.map((h) => Math.abs(h.m.desv)), 1)
  return (
    <>
      <tr onClick={onToggle} className={`${TR} cursor-pointer`} aria-expanded={abierto}>
        <td className={TD}>
          <span className={secundaria ? 'text-muted-foreground' : 'font-bold'}>{f.titulo}</span>
          {secundaria && (
            <Tag color="gray" size="sm" className="ml-2">
              Técnico
            </Tag>
          )}
        </td>
        <Celdas f={f} maxAbs={maxAbs} conVenta={conVenta} conHc={conHc} />
        <td className="px-3 py-3 text-right text-primary">
          <Icon name={abierto ? 'chevron_up' : 'chevron_down'} size={16} color="currentColor" />
        </td>
      </tr>
      {hijos.map((h) => (
        <tr key={h.key} className="border-b border-border-table bg-surface-subtle">
          <td className={`${TD} pl-8`}>
            <div className="font-bold">{h.titulo}</div>
            {h.sub && <div className="text-muted-foreground">{h.sub}</div>}
          </td>
          <Celdas f={h} maxAbs={maxHijo} conVenta={conVenta} conHc={conHc} />
          <td />
        </tr>
      ))}
    </>
  )
}

function Celdas({ f, maxAbs, conVenta, conHc }: { f: Fila; maxAbs: number; conVenta?: boolean; conHc: boolean }) {
  const { moneda, periodo } = useReporte()
  return (
    <>
      <td className={TD_NUM}>{fmtMonto(f.m.plan, moneda)}</td>
      <td className={TD_NUM}>{fmtMonto(f.m.valor, moneda)}</td>
      <td className="px-3 py-3">
        <BarraDesvio monto={f.m.desv} maxAbs={maxAbs} />
      </td>
      <td className={`${TD_NUM} space-x-2`}>
        <EstadoTexto pct={f.m.desvPct}>{fmtMonto(f.m.desv, moneda, true)}</EstadoTexto>
        <EstadoChip pct={f.m.desvPct} />
      </td>
      <td className={cn(TD_NUM, claseSigno(f.m.varPct))}>{fmtPct(f.m.varPct, true)}</td>
      {conVenta && <td className={TD_NUM}>{fmtPct(pesoVenta(f.lineas, periodo).real, false, 2)}</td>}
      {conHc && (
        <td className={TD_NUM}>
          <HcCelda lineas={f.lineas} />
        </td>
      )}
    </>
  )
}
