import { Badge, Icon } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import { formatFechaCorta } from '../lib/format-date'
import { EstadoBadge } from './estado-badge'
import { ForecastDatosCard } from './forecast-datos-card'
import { ForecastActivoActions } from './forecast-activo-actions'

interface ForecastActivoCardProps {
  round: ForecastRound | undefined
  anterioresCount: number
  detalleOpen: boolean
  onToggleDetalle: () => void
  onVerTasas: () => void
  onOpenAnteriores: () => void
  onOpenConfiguraciones: () => void
  onCerrar: () => void
  /** F: viendo un forecast anterior puntual (ForecastDetailPage) — la etiqueta pasa a "Forecast
   * Anterior" y se oculta el aviso de "no hay ningún forecast abierto" (puede haberlo, en otro lado). */
  historico?: boolean
  ocultarConfigCerrar?: boolean
}

/** Barra de ancho completo con la información del forecast activo (estado "Abierto") — a lo sumo puede
 * haber uno a la vez (ver forecast-store.tsx#addRound). Si no hay ninguno abierto, `round` recibe el
 * último cerrado (A4: "la vista nunca queda vacía") y esta misma card lo muestra con la etiqueta
 * "Último Forecast Cerrado" en vez de "Forecast Activo". Botonera a la derecha, en este orden (F):
 * Anteriores — Configuraciones — Ver tasa de cambio — Cerrar Forecast — chevron de detalle (ver
 * ForecastActivoActions; Configuraciones/Cerrar Forecast solo se ofrecen si `round` está Abierto). Al
 * desplegar el detalle, este crece dentro del mismo recuadro en vez de abrir uno aparte, siempre de
 * solo lectura (ForecastDatosCard) — editar título, descripción, fechas, % desvío y tasas de cambio
 * vive en un solo lugar (A1): el drawer de "Configuraciones", solo para Control de Gestión y solo con
 * el forecast activo. No se edita tipo ni la selección de PEPs acá: cambiarlos después de creado el
 * forecast dejaría inconsistentes las líneas ya generadas. */
export function ForecastActivoCard({ round, anterioresCount, detalleOpen, onToggleDetalle, onVerTasas, onOpenAnteriores, onOpenConfiguraciones, onCerrar, historico, ocultarConfigCerrar }: ForecastActivoCardProps) {
  const actions = (
    <ForecastActivoActions
      round={round}
      anterioresCount={anterioresCount}
      detalleOpen={detalleOpen}
      onToggleDetalle={onToggleDetalle}
      onVerTasas={onVerTasas}
      onOpenAnteriores={onOpenAnteriores}
      onOpenConfiguraciones={onOpenConfiguraciones}
      onCerrar={onCerrar}
      ocultarConfigCerrar={ocultarConfigCerrar}
    />
  )

  if (!round) {
    return (
      <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-border-strong bg-white p-5">
        <div>
          <div className="mb-1.5 text-[11px] font-bold tracking-[0.07em] text-muted-foreground uppercase">Forecast</div>
          <div className="text-[13px] text-muted-foreground">Todavía no se creó ningún forecast.</div>
        </div>
        {actions}
      </div>
    )
  }

  const esActivo = round.estado === 'Abierto'

  return (
    <div className="w-full rounded-xl border border-border bg-white">
      <div className="p-5">
        <div className="flex items-center gap-2 text-[10.5px] font-medium text-muted-foreground">
          <span className={esActivo && !historico ? 'font-bold text-primary' : ''}>{historico ? 'Forecast Anterior' : esActivo ? 'Forecast Activo' : 'Último Forecast Cerrado'}</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Icon name="calendar" size={10} color="#8A90A2" />
            Edición: {formatFechaCorta(round.fechaInicio)} {round.horaInicio} – {formatFechaCorta(round.fechaTermino)} {round.horaTermino}
          </span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[18px] font-extrabold tracking-tight text-foreground">{round.titulo}</span>
            <EstadoBadge estado={round.estado} cerradoManual={round.cerradoManual} />
            <Badge variant="neutral">{round.tipo === 'global' ? 'Global' : 'Parcial'}</Badge>
            <Badge variant="neutral">Desvío máx: {round.desvio}%</Badge>
            {round.pepsCount !== null && <span className="text-[11.5px] text-muted-foreground">{round.pepsCount} PEPs habilitados</span>}
          </div>
          {actions}
        </div>
      </div>

      {!esActivo && !historico && (
        <div className="border-t border-border bg-[#F8F9FD] p-[10px_20px] text-[11.5px] text-muted-foreground">
          No hay ningún forecast abierto actualmente — mostrando el último cerrado. Buscá otros en "Anteriores".
        </div>
      )}

      {detalleOpen && (
        <div className="border-t border-border p-5">
          <ForecastDatosCard round={round} embedded />
        </div>
      )}
    </div>
  )
}
