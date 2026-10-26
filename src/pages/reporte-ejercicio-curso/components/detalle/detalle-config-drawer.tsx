import { Drawer, Button, Icon } from '@/shared/ui'
import { APERTURAS } from '../../lib/detalle/dimensiones'
import { METRICAS } from '../../lib/detalle/metricas'

interface ReorderListProps {
  titulo: string
  disponibles: { id: string; label: string }[]
  seleccion: string[]
  onChange: (next: string[]) => void
}

/** Lista con checkbox (incluir/quitar) + botones ↑/↓ para reordenar — se construye acá, a propósito,
 * en vez de extender `columns-drawer.tsx` compartido: ese componente no reordena, y tocar su contrato
 * afectaría a todas las otras pantallas que ya lo usan. */
function ReorderList({ titulo, disponibles, seleccion, onChange }: ReorderListProps) {
  const toggle = (id: string) => onChange(seleccion.includes(id) ? seleccion.filter((x) => x !== id) : [...seleccion, id])
  const mover = (id: string, dir: -1 | 1) => {
    const i = seleccion.indexOf(id)
    const j = i + dir
    if (j < 0 || j >= seleccion.length) return
    const next = [...seleccion]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div>
      <div className="mb-2 text-[11px] font-bold tracking-[0.04em] text-muted-foreground uppercase">{titulo}</div>
      <div className="flex flex-col gap-1">
        {disponibles.map((d) => {
          const activo = seleccion.includes(d.id)
          const pos = seleccion.indexOf(d.id)
          return (
            <div key={d.id} className="flex items-center gap-2 rounded-lg border border-border bg-white px-2.5 py-2">
              <input type="checkbox" checked={activo} onChange={() => toggle(d.id)} className="size-4 accent-primary" />
              <span className="flex-1 text-[12.5px] text-foreground">{d.label}</span>
              {activo && (
                <>
                  <span className="text-[10.5px] font-bold text-muted-foreground">#{pos + 1}</span>
                  <button type="button" disabled={pos === 0} onClick={() => mover(d.id, -1)} className="rounded p-0.5 hover:bg-surface-hover disabled:opacity-30">
                    <Icon name="chevron_up" size={12} color="#0047B0" />
                  </button>
                  <button
                    type="button"
                    disabled={pos === seleccion.length - 1}
                    onClick={() => mover(d.id, 1)}
                    className="rounded p-0.5 hover:bg-surface-hover disabled:opacity-30"
                  >
                    <Icon name="chevron_down" size={12} color="#0047B0" />
                  </button>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface DetalleConfigDrawerProps {
  open: boolean
  onClose: () => void
  aperturas: string[]
  onChangeAperturas: (v: string[]) => void
  metricas: string[]
  onChangeMetricas: (v: string[]) => void
}

/** Elegir y ordenar las aperturas en filas y las columnas-métrica de la tabla dinámica. Fase 2 (no
 * implementada): modo "Editar vista" para arrastrar bloques/columnas/secciones en vez de usar ↑/↓. */
export function DetalleConfigDrawer({ open, onClose, aperturas, onChangeAperturas, metricas, onChangeMetricas }: DetalleConfigDrawerProps) {
  return (
    <Drawer open={open} onClose={onClose} eyebrow="Detalle configurable" title="Configurar vista" wide footer={<Button onClick={onClose}>Aplicar</Button>}>
      <div className="flex flex-col gap-6 p-[18px_22px]">
        <ReorderList titulo="Aperturas en filas (orden = jerarquía)" disponibles={APERTURAS} seleccion={aperturas} onChange={onChangeAperturas} />
        <ReorderList titulo="Columnas" disponibles={METRICAS} seleccion={metricas} onChange={onChangeMetricas} />
      </div>
    </Drawer>
  )
}
