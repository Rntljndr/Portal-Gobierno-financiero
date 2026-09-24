import { EmptyState } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import type { useForecastEditarN4 } from '../lib/use-forecast-editar-n4'
import type { useForecastFilters } from '../lib/use-forecast-filters'
import { ForecastResumenSection } from './forecast-resumen-section'
import { ForecastFilterToggle, ForecastFiltersPanel } from './forecast-filters'
import { ForecastTablaHeader } from './forecast-tabla-header'
import { ForecastN4Table } from './forecast-n4-table'
import { ForecastN7FlatTable } from './forecast-n7-flat-table'

interface ForecastListBodyProps {
  rounds: ForecastRound[]
  activo: ForecastRound | undefined
  borrador: ForecastRound | undefined
  anterioresCount: number
  tab: 'n4' | 'n7'
  tabla: ReturnType<typeof useForecastEditarN4>
  filtros: ReturnType<typeof useForecastFilters>
  detalleOpen: boolean
  onToggleDetalle: () => void
  onVerTasas: () => void
  onOpenAnteriores: () => void
  onCerrar: () => void
  onImportar: () => void
  onDescargar: () => void
}

/** Barra de resumen + filtros (F: "bajo la card del forecast activo") + header de tabla + la tabla N4
 * o N7 activa — extraído aparte para mantener ForecastListPage bajo el límite de líneas del linter. */
export function ForecastListBody({
  rounds,
  activo,
  borrador,
  anterioresCount,
  tab,
  tabla,
  filtros,
  detalleOpen,
  onToggleDetalle,
  onVerTasas,
  onOpenAnteriores,
  onCerrar,
  onImportar,
  onDescargar,
}: ForecastListBodyProps) {
  if (rounds.length === 0) {
    return (
      <div className="mx-8 mb-8">
        <EmptyState icon="calendar" title="No hay ejercicios de forecast registrados" text="Creá el primero para empezar a proyectar el presupuesto." />
      </div>
    )
  }

  return (
    <>
      <ForecastResumenSection
        activo={activo}
        borrador={borrador}
        anterioresCount={anterioresCount}
        detalleOpen={detalleOpen}
        onToggleDetalle={onToggleDetalle}
        onVerTasas={onVerTasas}
        onOpenAnteriores={onOpenAnteriores}
        onCerrar={onCerrar}
      />

      {activo && (
        <div className="mx-8 mb-3">
          <ForecastFilterToggle open={filtros.open} onToggle={() => filtros.setOpen((v) => !v)} activeCount={filtros.activeCount} />
        </div>
      )}
      <ForecastFiltersPanel
        open={filtros.open}
        isN7={tab === 'n7'}
        filters={filtros.filters}
        options={filtros.options}
        onChange={filtros.onChange}
        onClear={filtros.clear}
        activeCount={filtros.activeCount}
      />

      <ForecastTablaHeader activo={activo} tab={tab} onImportar={onImportar} onDescargar={onDescargar} />

      {!activo ? (
        <div className="mx-8 mb-8">
          <EmptyState icon="search" title="No hay un forecast activo" text="Abrí un nuevo forecast para ver y editar sus servicios acá." />
        </div>
      ) : tab === 'n4' ? (
        <ForecastN4Table roundId={activo.id} rows={filtros.filteredN4} cutoff={tabla.cutoff} onEditMonth={tabla.openEdit} />
      ) : (
        <ForecastN7FlatTable roundId={activo.id} rows={filtros.filteredN7} cutoff={tabla.cutoff} />
      )}
    </>
  )
}
