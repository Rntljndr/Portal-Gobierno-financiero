import { useState } from 'react'
import { Button, Icon, MultiSelect } from '@/shared/ui'
import { useReporte } from '../../lib/contexto'
import { contarFiltros, DIM_LABEL, DIMS_FILTRO, opcionesDe, type Filtros } from '../../lib'

interface FiltrosBarraProps {
  filtros: Filtros
  onChange: (f: Filtros) => void
}

/** Filtros del detalle con el patrón del sistema (Reporte Negocio, Reportería): botón "Filtros" con
 * contador y chevrón que despliega un panel en línea con los selectores. Solo afectan al detalle. Las
 * opciones salen de la selección actual (vista + país). */
export function FiltrosBarra({ filtros, onChange }: FiltrosBarraProps) {
  const { lineas } = useReporte()
  const [open, setOpen] = useState(false)
  const n = contarFiltros(filtros)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          <Icon name="filter" size={16} color="currentColor" />
          Filtros
          {n > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-2 text-xs font-bold text-white">{n}</span>}
          <Icon name={open ? 'chevron_up' : 'chevron_down'} size={16} color="currentColor" />
        </Button>
        {n > 0 && (
          <Button variant="ghost" onClick={() => onChange({})}>
            Limpiar filtros
          </Button>
        )}
        <span className="text-xs text-muted-foreground">Los filtros solo afectan al detalle del gasto; la vista ejecutiva no cambia.</span>
      </div>

      {open && (
        <div className="grid grid-cols-1 gap-3 rounded-xl border border-border-table bg-white p-4 shadow-m sm:grid-cols-2 xl:grid-cols-4">
          {DIMS_FILTRO.map((d) => (
            <div key={d}>
              <label className="mb-1 block text-xxs font-bold tracking-wider text-muted-foreground uppercase">{DIM_LABEL[d]}</label>
              <MultiSelect placeholder="Todos" options={opcionesDe(lineas, d)} values={filtros[d] ?? []} onChange={(v) => onChange({ ...filtros, [d]: v })} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
