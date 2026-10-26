import { Button, ConfigRow, Drawer, Icon, Switch, Tag } from '@/shared/ui'
import { APERTURAS, METRICAS } from '../../lib'

interface ListaProps {
  titulo: string
  disponibles: { id: string; label: string }[]
  seleccion: string[]
  onChange: (next: string[]) => void
}

/** Cada opción es un Drw-config-row con Switch para incluirla y ↑/↓ para ordenarla.
 * (Fase 2: arrastrar bloques y columnas en un modo "Editar vista".) */
function Lista({ titulo, disponibles, seleccion, onChange }: ListaProps) {
  const toggle = (id: string) => onChange(seleccion.includes(id) ? seleccion.filter((x) => x !== id) : [...seleccion, id])
  const mover = (id: string, dir: -1 | 1) => {
    const i = seleccion.indexOf(id)
    const j = i + dir
    if (j < 0 || j >= seleccion.length) return
    const next = [...seleccion]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  const ordenados = [...seleccion.map((id) => disponibles.find((d) => d.id === id)!).filter(Boolean), ...disponibles.filter((d) => !seleccion.includes(d.id))]

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs font-bold text-muted-foreground">{titulo}</div>
      {ordenados.map((d) => {
        const pos = seleccion.indexOf(d.id)
        const control = (
          <div className="flex items-center gap-1">
            {pos >= 0 && (
              <>
                <Tag color="blue" size="sm">
                  #{pos + 1}
                </Tag>
                <button type="button" aria-label={`Subir ${d.label}`} disabled={pos === 0} onClick={() => mover(d.id, -1)} className="rounded-lg p-1 text-primary hover:bg-white disabled:opacity-30">
                  <Icon name="chevron_up" size={14} color="currentColor" />
                </button>
                <button type="button" aria-label={`Bajar ${d.label}`} disabled={pos === seleccion.length - 1} onClick={() => mover(d.id, 1)} className="rounded-lg p-1 text-primary hover:bg-white disabled:opacity-30">
                  <Icon name="chevron_down" size={14} color="currentColor" />
                </button>
              </>
            )}
            <Switch checked={pos >= 0} onChange={() => toggle(d.id)} label={`Incluir ${d.label}`} />
          </div>
        )
        return <ConfigRow key={d.id} compact title={d.label} control={control} />
      })}
    </div>
  )
}

interface ConfigDrawerProps {
  open: boolean
  onClose: () => void
  aperturas: string[]
  metricas: string[]
  onChange: (aperturas: string[], metricas: string[]) => void
}

export function ConfigDrawer({ open, onClose, aperturas, metricas, onChange }: ConfigDrawerProps) {
  return (
    <Drawer open={open} onClose={onClose} eyebrow="Detalle del gasto" title="Configurar tabla" wide footer={<Button onClick={onClose}>Aplicar</Button>}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Lista titulo="Aperturas en filas (el orden es la jerarquía)" disponibles={APERTURAS} seleccion={aperturas} onChange={(a) => onChange(a, metricas)} />
        <Lista titulo="Métricas en columnas" disponibles={METRICAS} seleccion={metricas} onChange={(m) => onChange(aperturas, m)} />
      </div>
    </Drawer>
  )
}
