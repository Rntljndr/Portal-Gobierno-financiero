import { Drawer, Icon } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import type { ForecastN7Linea } from '@/data/forecast-lineas'
import { forecastHistorialCompleto, FORECAST_HISTORIAL_ESTILO } from '../lib/forecast-historial'

interface ForecastHistorialDrawerProps {
  round: ForecastRound | undefined
  n7: ForecastN7Linea | undefined
  onClose: () => void
}

/** "Historial del PEP" (F) — timeline de los eventos de estado del PEP N7 (envíos, revisiones por
 * edición manual, aprobaciones/rechazos de Control de Gestión), más reciente primero, cada uno con su
 * comentario/justificación si lo tuvo. Se abre al seleccionar el tag de estado (ver
 * ForecastEstadoHistorialTag). */
export function ForecastHistorialDrawer({ round, n7, onClose }: ForecastHistorialDrawerProps) {
  const eventos = round && n7 ? forecastHistorialCompleto(n7, round) : []

  return (
    <Drawer open={!!n7} onClose={onClose} title="Historial del PEP" subtitle={n7 ? `${n7.n7Codigo} · ${n7.n7Nombre}` : undefined}>
      <div className="flex flex-col gap-4">
        {eventos.map((ev, i) => {
          const estilo = FORECAST_HISTORIAL_ESTILO[ev.estado]
          return (
            <div key={i} className="flex gap-3 border-b border-border pb-4 last:border-b-0 last:pb-0">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full" style={{ background: estilo.bg }}>
                <Icon name={estilo.icon} size={12} color={estilo.color} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[13px] font-bold" style={{ color: estilo.color }}>
                    {ev.estado}
                  </span>
                  {(i === 0 || !ev.autor) && (
                    <span className="rounded bg-[#F1F3F8] px-1.5 py-0.5 text-[9.5px] font-bold tracking-[0.04em] text-muted-foreground uppercase">
                      {i === 0 ? 'Actual' : 'Automático'}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">
                  {ev.fecha}
                  {ev.autor ? ` · ${ev.autor}` : ''}
                </div>
                {ev.comentario && <div className="mt-1.5 rounded-md bg-[#F8F9FD] p-[8px_10px] text-[12px] text-cs-gris-oscuro italic">"{ev.comentario}"</div>}
              </div>
            </div>
          )
        })}
      </div>
    </Drawer>
  )
}
