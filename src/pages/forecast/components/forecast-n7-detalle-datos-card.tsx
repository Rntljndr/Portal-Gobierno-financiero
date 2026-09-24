import { DataField } from '@/pages/servicio-detalle/components/data-field'
import type { ForecastRound } from '@/data/forecast'
import type { ForecastN4Linea, ForecastN7Linea } from '@/data/forecast-lineas'
import type { ForecastIdentidadN7 } from '../lib/forecast-identidad'
import { formatFechaCorta } from '../lib/format-date'

interface ForecastN7DetalleDatosCardProps {
  round: ForecastRound
  n4: ForecastN4Linea
  n7: ForecastN7Linea
  identidad: ForecastIdentidadN7
}

/** Ficha de identidad de "Forecast Nivel 7" (F, copiada de la pantalla de detalle por PEP de
 * GestionOpex): Pep, País, Estado, Área, Servicio, Gerencia - Equipo, Bandera, Cuenta Contable,
 * Período, Llave de Distribución Plan/Forecast, Usuario Última Edición. Mismo patrón DataField que el
 * resto del módulo. */
export function ForecastN7DetalleDatosCard({ round, n4, n7, identidad }: ForecastN7DetalleDatosCardProps) {
  const isManual = n7.tipoActualizacion === 'manual'

  return (
    <div className="mx-8 mb-5 rounded-xl border border-border bg-white p-[20px]">
      <div className="mb-4 border-b border-border pb-3 text-[15px] font-bold text-primary">Forecast Nivel 7</div>
      <div className="mb-5 grid grid-cols-3 gap-5">
        <DataField label="Pep" value={n7.n7Codigo} />
        <DataField label="País" value={identidad.pais} />
        <DataField label="Estado" value={identidad.estado} />
      </div>
      <div className="mb-5 grid grid-cols-3 gap-5">
        <DataField label="Área" value={identidad.gerencia} />
        <DataField label="Servicio" value={n4.n4Nombre} />
        <DataField label="Gerencia - Equipo" value={`${identidad.gerenciaPadre} - ${identidad.equipo}`} />
      </div>
      <div className="mb-5 grid grid-cols-3 gap-5">
        <DataField label="Bandera" value={identidad.bandera} />
        <DataField label="Cuenta Contable" value={identidad.cuentaContable} />
        <DataField label="Período" value={`${round.titulo} (${formatFechaCorta(round.fechaInicio)} al ${formatFechaCorta(round.fechaTermino)})`} />
      </div>
      <div className="grid grid-cols-3 gap-5">
        <DataField label="Llave de Distribución Plan" value={`${identidad.llavePlanPct.toFixed(1)}%`} />
        <DataField label="Llave de Distribución Forecast" value={`${identidad.llaveForecastPct.toFixed(1)}%`} />
        <DataField label="Usuario Última Edición" value={isManual ? 'Andrea Morales' : '—'} />
      </div>
    </div>
  )
}
