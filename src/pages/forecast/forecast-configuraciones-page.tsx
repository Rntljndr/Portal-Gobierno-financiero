import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Breadcrumb, Button, EmptyState, PageHeader, Toast } from '@/shared/ui'
import { useToast } from '@/shared/lib/use-toast'
import { cn } from '@/shared/lib/utils'
import type { ForecastRound } from '@/data/forecast'
import { useForecastStore } from './lib/use-forecast-store'
import { ForecastSettingsCard } from './components/forecast-settings-card'
import { TasasCambioTable } from './components/tasas-cambio-table'

const label = 'mb-1.5 block text-[11.5px] font-bold tracking-[0.05em] text-cs-gris-oscuro uppercase'
const input = 'h-10 w-full rounded-lg border border-border bg-white px-3 text-[13px] outline-none focus:border-primary'

interface ForecastConfiguracionesDraft {
  titulo: string
  descripcion: string
  fechaInicio: string
  fechaTermino: string
  horaInicio: string
  horaTermino: string
  desvio: string
  notificar: boolean
}

function toDraft(round: ForecastRound): ForecastConfiguracionesDraft {
  return {
    titulo: round.titulo,
    descripcion: round.descripcion,
    fechaInicio: round.fechaInicio,
    fechaTermino: round.fechaTermino,
    horaInicio: round.horaInicio,
    horaTermino: round.horaTermino,
    desvio: String(round.desvio),
    notificar: round.notificar,
  }
}

interface DraftCardProps {
  draft: ForecastConfiguracionesDraft
  onChange: (draft: ForecastConfiguracionesDraft) => void
}

interface PeriodoDesvioCardProps extends DraftCardProps {
  /** F: sin ediciones todavía no hay nada que notificar — ver el checkbox "Notificar usuarios". */
  hasChanges: boolean
}

/** Card "Datos generales" — extraída para mantener ForecastConfiguracionesPage bajo el límite de
 * líneas del linter. "Tipo de forecast" es de solo lectura: cambiarlo después de creado el forecast
 * dejaría inconsistentes las líneas ya generadas (misma regla que ForecastActivoCard). */
function DatosGeneralesCard({ draft, onChange, tipo }: DraftCardProps & { tipo: ForecastRound['tipo'] }) {
  return (
    <ForecastSettingsCard icon="edit" title="Datos generales">
      <div className="mb-4">
        <label className={label}>Título</label>
        <input value={draft.titulo} onChange={(e) => onChange({ ...draft, titulo: e.target.value })} className={input} />
      </div>
      <div className="mb-4">
        <label className={label}>Descripción</label>
        <input value={draft.descripcion} onChange={(e) => onChange({ ...draft, descripcion: e.target.value })} className={input} />
      </div>
      <div>
        <label className={label}>Tipo de forecast</label>
        <div className="flex h-10 items-center rounded-lg border border-border bg-[#F8F9FD] px-3 text-[13px] font-semibold text-cs-gris-oscuro">{tipo === 'global' ? 'Global' : 'Parcial'}</div>
        <p className="mt-1 text-[11px] text-muted-foreground">Este campo no se puede modificar después de creado el forecast.</p>
      </div>
    </ForecastSettingsCard>
  )
}

/** Card "Periodo y desvío" — extraída por el mismo motivo que DatosGeneralesCard. */
function PeriodoDesvioCard({ draft, onChange, hasChanges }: PeriodoDesvioCardProps) {
  return (
    <ForecastSettingsCard icon="calendar" title="Periodo y desvío">
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          <label className={label}>Fecha de inicio</label>
          <div className="flex gap-2">
            <input type="date" value={draft.fechaInicio} onChange={(e) => onChange({ ...draft, fechaInicio: e.target.value })} className={`${input} flex-1`} />
            <input type="time" value={draft.horaInicio} onChange={(e) => onChange({ ...draft, horaInicio: e.target.value })} className={`${input} w-[108px]`} />
          </div>
        </div>
        <div>
          <label className={label}>Fecha de término</label>
          <div className="flex gap-2">
            <input type="date" value={draft.fechaTermino} onChange={(e) => onChange({ ...draft, fechaTermino: e.target.value })} className={`${input} flex-1`} />
            <input type="time" value={draft.horaTermino} onChange={(e) => onChange({ ...draft, horaTermino: e.target.value })} className={`${input} w-[108px]`} />
          </div>
        </div>
      </div>
      <div className="mb-4">
        <label className={label}>Porcentaje desvío</label>
        <div className="relative">
          <input type="number" min="0" max="100" step="0.1" value={draft.desvio} onChange={(e) => onChange({ ...draft, desvio: e.target.value })} className={`${input} pr-8`} />
          <span className="absolute top-1/2 right-3 -translate-y-1/2 text-[13px] font-bold text-muted-foreground">%</span>
        </div>
      </div>
      {/* F: "el campo de notificar a usuarios debe quedar disable [al ingresar], cuando se hace
       * alguna edición se tiene que habilitar" — nada que notificar hasta que se edite algo. */}
      <label className={cn('flex items-center gap-2.5', hasChanges ? 'cursor-pointer' : 'cursor-not-allowed opacity-50')}>
        <input
          type="checkbox"
          checked={draft.notificar}
          disabled={!hasChanges}
          onChange={(e) => onChange({ ...draft, notificar: e.target.checked })}
          className="size-4 accent-primary"
        />
        <span className="text-[13px] font-medium text-foreground">Notificar usuarios al abrir este forecast</span>
      </label>
    </ForecastSettingsCard>
  )
}

/** Configuraciones del forecast activo (A1), como pantalla completa en vez de drawer — mismo patrón
 * que la pantalla de Configuraciones de Presupuesto (pages/configuraciones/configuraciones-page.tsx):
 * breadcrumb + header, cards en grilla de 2 columnas arriba, card de ancho completo abajo, footer fijo
 * Volver/Actualizar. Los campos siguen siendo los propios de un "round" de Forecast — Presupuesto no
 * tiene ese concepto, así que no hay más que portar de ahí para estos campos puntuales (ver
 * ForecastSettingsCard, reimplementación local de SettingsCard). Solo Control de Gestión, y solo con
 * el forecast activo (ver ForecastActivoActions, que no ofrece este botón fuera de esas condiciones). */
export function ForecastConfiguracionesPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { rounds, updateRoundDatos, updateTasaCambio } = useForecastStore()
  const round = rounds.find((r) => r.id === id)
  const { message, showToast } = useToast()
  const [draft, setDraft] = useState<ForecastConfiguracionesDraft>(() =>
    round ? toDraft(round) : { titulo: '', descripcion: '', fechaInicio: '', fechaTermino: '', horaInicio: '', horaTermino: '', desvio: '0', notificar: false },
  )

  useEffect(() => {
    if (round) setDraft(toDraft(round))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round?.id])

  if (!round) {
    return (
      <div className="mx-8 my-8">
        <EmptyState icon="search" title="Forecast no encontrado" text="No existe un ejercicio de forecast con ese identificador." />
      </div>
    )
  }

  const volverHref = `/forecast/${round.id}`
  const hasChanges = JSON.stringify(draft) !== JSON.stringify(toDraft(round))

  // F: "Guardar... solo debe guardar la información" — persiste los cambios sin notificar, sin
  // importar el estado del checkbox. "Actualizar ejecuta todos los cambios guardados, también se debe
  // notificar a los usuarios si es que el campo de notificar a usuarios está habilitado" — mismo
  // guardado, más el aviso de notificación cuando el checkbox quedó tildado.
  const guardar = () => {
    updateRoundDatos(round.id, {
      titulo: draft.titulo,
      descripcion: draft.descripcion,
      fechaInicio: draft.fechaInicio,
      fechaTermino: draft.fechaTermino,
      horaInicio: draft.horaInicio,
      horaTermino: draft.horaTermino,
      desvio: Number(draft.desvio) || 0,
    })
    showToast('Información guardada.')
  }

  const actualizar = () => {
    updateRoundDatos(round.id, { ...draft, desvio: Number(draft.desvio) || 0 })
    showToast(draft.notificar ? 'Configuración actualizada y notificación enviada a los usuarios.' : 'Configuración actualizada correctamente.')
  }

  return (
    <div className="h-full overflow-y-auto">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Forecast', to: '/forecast' }, { label: round.titulo, to: volverHref }, { label: 'Configuraciones' }]} />
      <PageHeader title="Configuraciones" subtitle={`Edita y actualiza la información del forecast "${round.titulo}".`} />

      <div className="grid grid-cols-2 gap-4 p-[0_32px_16px]">
        <DatosGeneralesCard draft={draft} onChange={setDraft} tipo={round.tipo} />
        <PeriodoDesvioCard draft={draft} onChange={setDraft} hasChanges={hasChanges} />
      </div>

      <div className="p-[0_32px_16px]">
        <TasasCambioTable value={round.tasasCambio} onChange={(moneda, mesIndex, valor) => updateTasaCambio(round.id, moneda, mesIndex, valor)} />
      </div>

      <div className="flex justify-end gap-2 border-t border-border bg-white p-[16px_32px_28px]">
        <Button variant="outline" onClick={() => navigate(volverHref)}>
          Volver
        </Button>
        {/* F: "agregar un botón de guardar la información, al lado derecho de volver, solo debe
         * guardar la información" */}
        <Button variant="outline" disabled={!hasChanges} className="disabled:opacity-50" onClick={guardar}>
          Guardar
        </Button>
        <Button variant="primary" disabled={!hasChanges} className="disabled:opacity-50" onClick={actualizar}>
          Actualizar →
        </Button>
      </div>

      <Toast message={message} />
    </div>
  )
}
