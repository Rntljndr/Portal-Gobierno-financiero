import { Button, Icon } from '@/shared/ui'
import type { EquipoConContexto } from '@/data/gerencias-equipos'
import type { DraftPermisos } from '../lib/use-alcances-permisos'
import { AdministracionToggle } from './administracion-toggle'

interface AlcancesPermisosPanelProps {
  equiposAsignados: EquipoConContexto[]
  draft: DraftPermisos
  totalVer: number
  totalEditar: number
  hayCambios: boolean
  onSetPermiso: (ids: string[], patch: { ver?: boolean; editar?: boolean }) => void
  onQuitar: (equipoId: string) => void
  onGuardar: () => void
}

/** Panel derecho "Permisos asignados" — una tarjeta por equipo con alcance activo (unidad atómica del
 * permiso), con sus switches Ver/Editar y el botón "Guardar cambios" (F: igual patrón que la referencia,
 * sin backend: solo mueve el draft a la línea base en memoria del módulo). */
export function AlcancesPermisosPanel({ equiposAsignados, draft, totalVer, totalEditar, hayCambios, onSetPermiso, onQuitar, onGuardar }: AlcancesPermisosPanelProps) {
  return (
    <div className="flex w-[320px] shrink-0 flex-col rounded-xl border border-border bg-white">
      <div className="flex items-center justify-between border-b border-border p-3">
        <div>
          <div className="text-[10.5px] font-bold tracking-[0.06em] text-muted-foreground uppercase">Permisos asignados</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">
            {totalVer} con visualización · {totalEditar} con edición
          </div>
        </div>
        <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">{totalVer}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {equiposAsignados.length === 0 && <div className="p-4 text-center text-[12px] text-muted-foreground">Sin permisos asignados para este año.</div>}
        {equiposAsignados.map((eq) => (
          <div key={eq.id} className="mb-3 rounded-lg border border-border p-3 last:mb-0">
            <div className="mb-2.5 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="flex size-7 items-center justify-center rounded-md bg-[#EEF4FF] text-primary">
                  <Icon name="user" size={13} color="#0047B0" />
                </span>
                <div className="mt-1.5 truncate text-[12.5px] font-bold text-foreground">{eq.nombre}</div>
                <div className="truncate text-[11px] text-muted-foreground">{eq.gerenciaNombre}</div>
              </div>
              <button type="button" onClick={() => onQuitar(eq.id)} aria-label={`Quitar ${eq.nombre}`} className="shrink-0 text-muted-foreground hover:text-destructive">
                <Icon name="x_close" size={14} color="currentColor" />
              </button>
            </div>
            <label className="mb-2 flex items-center justify-between text-[12px] text-cs-gris-oscuro">
              Visualizar
              <AdministracionToggle checked={!!draft[eq.id]?.ver} onChange={(v) => onSetPermiso([eq.id], { ver: v, editar: v ? draft[eq.id]?.editar : false })} />
            </label>
            <label className="flex items-center justify-between text-[12px] text-cs-gris-oscuro">
              Editar
              <AdministracionToggle checked={!!draft[eq.id]?.editar} onChange={(v) => onSetPermiso([eq.id], { editar: v })} />
            </label>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-3">
        <div className="mb-2 text-center text-[11px] text-muted-foreground">{hayCambios ? 'Cambios sin guardar' : 'Sin cambios pendientes'}</div>
        <Button variant="primary" className="w-full" disabled={!hayCambios} onClick={onGuardar}>
          Guardar cambios
        </Button>
      </div>
    </div>
  )
}
