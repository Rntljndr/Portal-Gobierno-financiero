import { useState } from 'react'
import { Button, FilterButton, Icon, Tag } from '@/shared/ui'
import type { Vista } from '../../lib'

interface VistasBarProps {
  vistas: Vista[]
  activa: string
  modificada: boolean
  onElegir: (v: Vista) => void
  onGuardar: (nombre: string) => void
  onEliminar: (nombre: string) => void
}

/** Vistas como FilterButton: las predefinidas llevan candado (no editables); las del usuario se pueden borrar. */
export function VistasBar({ vistas, activa, modificada, onElegir, onGuardar, onEliminar }: VistasBarProps) {
  const [nombre, setNombre] = useState('')
  const [guardando, setGuardando] = useState(false)
  const confirmar = () => {
    if (!nombre.trim()) return
    onGuardar(nombre.trim())
    setNombre('')
    setGuardando(false)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {vistas.map((v) => (
        <span key={v.nombre} className="inline-flex items-center gap-1">
          <FilterButton active={v.nombre === activa} onClick={() => onElegir(v)}>
            {v.predefinida && <Icon name="lock" size={14} color="currentColor" />}
            {v.nombre}
          </FilterButton>
          {!v.predefinida && (
            <button type="button" aria-label={`Eliminar vista ${v.nombre}`} onClick={() => onEliminar(v.nombre)} className="rounded-lg p-1 text-muted-foreground hover:bg-surface-hover hover:text-primary">
              <Icon name="trash" size={14} color="currentColor" />
            </button>
          )}
        </span>
      ))}
      {modificada && <Tag color="gray">Vista sin guardar</Tag>}

      <div className="ml-auto flex items-center gap-2">
        {guardando ? (
          <>
            <input
              autoFocus
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && confirmar()}
              placeholder="Nombre de la vista"
              aria-label="Nombre de la vista"
              className="h-[41px] w-[220px] rounded-lg border border-border bg-white px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />
            <Button onClick={confirmar} disabled={!nombre.trim()}>
              Guardar
            </Button>
            <Button variant="ghost" onClick={() => setGuardando(false)}>
              Cancelar
            </Button>
          </>
        ) : (
          <Button variant="outline" onClick={() => setGuardando(true)}>
            <Icon name="save" size={16} color="currentColor" /> Guardar como vista
          </Button>
        )}
      </div>
    </div>
  )
}
