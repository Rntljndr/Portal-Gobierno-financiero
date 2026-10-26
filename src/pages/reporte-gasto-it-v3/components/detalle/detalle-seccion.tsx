import { useState } from 'react'
import { Button, Card, Icon, Tag } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { useReporte } from '../../lib/contexto'
import {
  aplicarFiltros,
  construirPivot,
  DIM_LABEL,
  eliminarVista,
  guardarVista,
  listarVistas,
  mensual,
  VISTAS_PREDEFINIDAS,
  type DetalleEstado,
  type DimId,
  type Filtros,
  type PivotNodo,
  type Moneda,
} from '../../lib'
import type { V3Linea } from '@/data/gasto-it-v3'
import { Seccion } from '../base/seccion'
import { LineaMensual, LineaMensualLeyenda } from '../base/linea-mensual'
import { ConfigDrawer } from './config-drawer'
import { FiltrosBarra } from './filtros-barra'
import { PivotTabla } from './pivot-tabla'
import { VistasBar } from './vistas-bar'

/** "Configurar tabla" y "Guardar como vista" quedan ocultos por ahora (el código sigue disponible):
 * cambiar a `true` para volver a mostrarlos. */
const EDICION_VISTAS = false

interface DetalleSeccionProps {
  estado: DetalleEstado
  onChange: (e: DetalleEstado) => void
  defaultOpen: boolean
}

/** D. Detalle del gasto, como el del Reporte Tecnología: una pestaña por dimensión, tabla con apertura por
 * niveles en el período elegido arriba, filtros propios sobre la sección y evolutivo de la fila seleccionada. */
export function DetalleSeccion({ estado, onChange, defaultOpen }: DetalleSeccionProps) {
  const { lineasAbajo: lineas, moneda, periodo } = useReporte()
  const [, refrescar] = useState(0)
  const [config, setConfig] = useState(false)
  const [selKey, setSelKey] = useState<string | null>(null)
  const filtradas = aplicarFiltros(lineas, estado.filtros)
  const nodos = construirPivot(filtradas, estado.aperturas, periodo)
  const sel = selKey ? buscar(nodos, selKey) : null
  // Mismo detalle en las dos visiones (acordado: la Visión Negocio replica el de Tecnología).
  const tabs = VISTAS_PREDEFINIDAS
  const vistas = EDICION_VISTAS ? listarVistas() : tabs
  const base = vistas.find((v) => v.nombre === estado.vista)
  const modificada = !base || base.aperturas.join() !== estado.aperturas.join() || base.metricas.join() !== estado.metricas.join()
  const elegir = (nombre: string) => {
    const v = vistas.find((x) => x.nombre === nombre)
    if (v) onChange({ ...estado, vista: v.nombre, aperturas: v.aperturas, metricas: v.metricas })
  }


  return (
    <div id="detalle" className="flex scroll-mt-4 flex-col gap-3">
      <FiltrosBarra filtros={estado.filtros} onChange={(filtros) => onChange({ ...estado, filtros })} />
      <Seccion titulo="Detalle del gasto" subtitulo="Elige una dimensión, abre las filas para bajar de nivel y haz clic en una para ver su evolutivo. Usa el período elegido arriba." defaultOpen={defaultOpen}>
        <div className="flex flex-col gap-4">
          {EDICION_VISTAS && (
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" onClick={() => setConfig(true)}>
                <Icon name="config" size={16} color="currentColor" /> Configurar tabla
              </Button>
              <VistasBar
                vistas={vistas.filter((v) => !v.predefinida)}
                activa={modificada ? '' : estado.vista}
                modificada={modificada}
                onElegir={(v) => elegir(v.nombre)}
                onGuardar={(nombre) => {
                  guardarVista({ nombre, aperturas: estado.aperturas, metricas: estado.metricas })
                  onChange({ ...estado, vista: nombre })
                }}
                onEliminar={(nombre) => {
                  eliminarVista(nombre)
                  refrescar((n) => n + 1)
                }}
              />
            </div>
          )}
          <DimensionTabs tabs={tabs.map((v) => v.nombre)} activa={modificada ? '' : estado.vista} onChange={elegir} />
          <FiltrosChips filtros={estado.filtros} onChange={(filtros) => onChange({ ...estado, filtros })} />
          <PivotTabla nodos={nodos} lineas={filtradas} metricaIds={estado.metricas} moneda={moneda} periodo={periodo} seleccion={sel?.key ?? null} onSeleccion={(nodo) => setSelKey(nodo.key)} />
          <EvolutivoSeleccion sel={sel} lineas={filtradas} moneda={moneda} />
        </div>
        {EDICION_VISTAS && (
          <ConfigDrawer open={config} onClose={() => setConfig(false)} aperturas={estado.aperturas} metricas={estado.metricas} onChange={(aperturas, metricas) => onChange({ ...estado, aperturas, metricas })} />
        )}
      </Seccion>
    </div>
  )
}

/** Pestañas por dimensión, con el mismo patrón del detalle del Reporte Tecnología. */
function DimensionTabs({ tabs, activa, onChange }: { tabs: string[]; activa: string; onChange: (t: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-border-table pb-3" role="tablist">
      {tabs.map((t) => (
        <button
          key={t}
          type="button"
          role="tab"
          aria-selected={t === activa}
          onClick={() => onChange(t)}
          className={cn('rounded-lg px-3 py-2 text-xs font-bold text-muted-foreground hover:bg-surface-hover', t === activa && 'bg-info-surface text-primary')}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

function FiltrosChips({ filtros, onChange }: { filtros: Filtros; onChange: (f: Filtros) => void }) {
  const activos = (Object.entries(filtros) as [DimId, string[]][]).flatMap(([d, vs]) => (vs ?? []).map((v) => ({ d, v })))
  if (!activos.length) return null
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="font-bold text-muted-foreground">Filtros activos</span>
      {activos.map(({ d, v }) => (
        <Tag key={`${d}-${v}`} color="blue" size="sm">
          {DIM_LABEL[d]}: <b className="font-bold">{v}</b>
          <button type="button" aria-label={`Quitar ${v}`} onClick={() => onChange({ ...filtros, [d]: filtros[d]!.filter((x) => x !== v) })}>
            <Icon name="x_close" size={11} color="currentColor" />
          </button>
        </Tag>
      ))}
    </div>
  )
}

function buscar(nodos: PivotNodo[], key: string): PivotNodo | null {
  for (const n of nodos) {
    if (n.key === key) return n
    const h = buscar(n.hijos, key)
    if (h) return h
  }
  return null
}

function EvolutivoSeleccion({ sel, lineas, moneda }: { sel: PivotNodo | null; lineas: V3Linea[]; moneda: Moneda }) {
  return (
    <Card padding="md">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-bold text-foreground">
          Evolutivo mensual · {sel ? Object.values(sel.ruta).join(' › ') : 'todo lo filtrado'}
        </div>
        <LineaMensualLeyenda />
      </div>
      <div className="max-w-[900px]">
        <LineaMensual meses={mensual(sel ? sel.lineas : lineas)} moneda={moneda} />
      </div>
      {!sel && <div className="text-xs text-muted-foreground">Haz clic en una fila de la tabla para ver su evolutivo.</div>}
    </Card>
  )
}
