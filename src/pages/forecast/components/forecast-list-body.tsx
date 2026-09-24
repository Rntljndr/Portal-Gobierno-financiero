import { EmptyState } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import type { ForecastFlatN7Row } from '../lib/forecast-flat-n7'
import type { useForecastEditarN4 } from '../lib/use-forecast-editar-n4'
import { ForecastResumenSection } from './forecast-resumen-section'
import { ForecastTablaHeader } from './forecast-tabla-header'
import { ForecastN4Table } from './forecast-n4-table'
import { ForecastN7FlatTable } from './forecast-n7-flat-table'

interface ForecastListBodyProps {
  rounds: ForecastRound[]
  activo: ForecastRound | undefined
  borrador: ForecastRound | undefined
  anteriores: ForecastRound[]
  tab: 'n4' | 'n7'
  tabla: ReturnType<typeof useForecastEditarN4>
  flatN7Rows: ForecastFlatN7Row[]
  onOpenAnteriores: () => void
  onOpenDetalleActivo: () => void
  onRequestDelete: (round: ForecastRound) => void
  onImportar: () => void
  onDescargar: () => void
  onNuevo: () => void
  onCerrar: () => void
}

/** Cards de resumen + header de tabla + la tabla N4 o N7 activa — extraído aparte para mantener
 * ForecastListPage bajo el límite de líneas del linter. */
export function ForecastListBody({
  rounds,
  activo,
  borrador,
  anteriores,
  tab,
  tabla,
  flatN7Rows,
  onOpenAnteriores,
  onOpenDetalleActivo,
  onRequestDelete,
  onImportar,
  onDescargar,
  onNuevo,
  onCerrar,
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
        anterioresCount={anteriores.length}
        onOpenAnteriores={onOpenAnteriores}
        onOpenDetalleActivo={onOpenDetalleActivo}
        onRequestDelete={onRequestDelete}
      />

      <ForecastTablaHeader
        activo={activo}
        tab={tab}
        ocultarCeros={tabla.ocultarCeros}
        onToggleOcultarCeros={tabla.setOcultarCeros}
        onImportar={onImportar}
        onDescargar={onDescargar}
        onNuevo={onNuevo}
        onCerrar={onCerrar}
      />

      {!activo ? (
        <div className="mx-8 mb-8">
          <EmptyState icon="search" title="No hay un forecast activo" text="Abrí un nuevo forecast para ver y editar sus servicios acá." />
        </div>
      ) : tab === 'n4' ? (
        <ForecastN4Table roundId={activo.id} rows={tabla.lineasVisibles} cutoff={tabla.cutoff} onEditMonth={tabla.openEdit} />
      ) : (
        <ForecastN7FlatTable roundId={activo.id} rows={flatN7Rows} cutoff={tabla.cutoff} />
      )}
    </>
  )
}
