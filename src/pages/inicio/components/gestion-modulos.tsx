import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { Icon, IconBox, ProgressBar, Tag, type IconName } from '@/shared/ui'
import { getCierreSapFechasOrdenadas, PRELIM_MES_OPEN_LABEL } from '@/data/preliminares'
import { REALES_LAST_CLOSED, REALES_ULTIMO_REAL_LABEL } from '@/data/reales'
import { diasHasta, fechaLarga } from '../lib/accesos'
import { estadoEnCurso, fmtPct, fmtUsd } from '../lib/estado-ejercicios'
import { forecastAbierto } from '../lib/tareas'
import { Var } from './proceso'

interface ModuloCardProps {
  to: string
  icono: IconName
  titulo: string
  estado: ReactNode
  cifra: string
  cifraLabel: string
  contexto: ReactNode
  progreso: { valor: number; label: string; detalle: string }
  cta: string
}

/** Tarjeta de un módulo del ejercicio en curso: estado, cifra principal con su contexto, avance y acción. */
function ModuloCard({ to, icono, titulo, estado, cifra, cifraLabel, contexto, progreso, cta }: ModuloCardProps) {
  const navigate = useNavigate()
  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="group flex flex-col gap-3 rounded-xl border border-border-table bg-white p-4 text-left transition-colors hover:border-primary hover:bg-primary/5"
    >
      <div className="flex items-center gap-3">
        <IconBox icon={icono} variant="info" />
        <span className="flex-1 text-base font-bold text-primary">{titulo}</span>
        {estado}
      </div>
      <div>
        <div className="text-xxs font-bold tracking-wider text-muted-foreground uppercase">{cifraLabel}</div>
        <div className="text-xl font-bold text-foreground tabular-nums">{cifra}</div>
        <div className="text-xs text-muted-foreground">{contexto}</div>
      </div>
      <ProgressBar value={progreso.valor} label={progreso.label} valueLabel={progreso.detalle} />
      <div className="mt-auto flex items-center gap-1 border-t border-border-table pt-3 text-sm font-medium text-primary">
        {cta} <Icon name="chevron_right" size={14} color="currentColor" />
      </div>
    </button>
  )
}

/** Forecast, Reales y Preliminares del ejercicio en curso, cada uno con su estado y cifras del momento. */
export function GestionModulos() {
  const e = estadoEnCurso()
  const fcst = forecastAbierto()
  const cierre = getCierreSapFechasOrdenadas(PRELIM_MES_OPEN_LABEL)[0]
  const dFcst = fcst ? diasHasta(fcst.fechaTermino) : 0
  const mesAbierto = PRELIM_MES_OPEN_LABEL.toLowerCase()

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <ModuloCard
        to="/forecast"
        icono="trendup"
        titulo="Forecast"
        estado={fcst ? <Tag color="green" size="sm">Abierto</Tag> : <Tag color="gray" size="sm">Cerrado</Tag>}
        cifraLabel={fcst ? `${fcst.titulo} · proyección anual` : 'Proyección anual'}
        cifra={fmtUsd(e.proyectado)}
        contexto={
          <Var n={e.fcstDif}>
            {fmtUsd(e.fcstDif, true)} vs el forecast anterior · {e.fcstModificadas} líneas modificadas
          </Var>
        }
        progreso={{ valor: (e.fcstModificadas / Math.max(e.lineas, 1)) * 100, label: 'Líneas actualizadas', detalle: `${e.fcstModificadas} de ${e.lineas}` }}
        cta={fcst ? `Editar forecast · cierra en ${dFcst} días (${fechaLarga(fcst.fechaTermino)})` : 'Ir a Forecast'}
      />
      <ModuloCard
        to="/reales"
        icono="check"
        titulo="Reales"
        estado={<Tag color="blue" size="sm">Al día a {REALES_ULTIMO_REAL_LABEL}</Tag>}
        cifraLabel="Real acumulado"
        cifra={fmtUsd(e.realAcum)}
        contexto={<Var n={e.desvAcumPct}>{fmtPct(e.desvAcumPct, true)} vs el plan a la fecha</Var>}
        progreso={{ valor: (REALES_LAST_CLOSED / 12) * 100, label: 'Meses cerrados', detalle: `${REALES_LAST_CLOSED} de 12` }}
        cta="Ver reales"
      />
      <ModuloCard
        to="/preliminares"
        icono="calendar"
        titulo="Preliminares"
        estado={<Tag color="yellow" size="sm">Mes abierto</Tag>}
        cifraLabel={`Preliminar de ${mesAbierto}`}
        cifra={fmtUsd(e.prelim)}
        contexto={`Forecast del mes: ${fmtUsd(e.fcstMes)}${cierre ? ` · primer cierre SAP ${cierre.fecha}` : ''}`}
        progreso={{ valor: e.prelimAvancePct, label: 'Cargado vs forecast del mes', detalle: fmtPct(e.prelimAvancePct) }}
        cta="Cargar preliminares"
      />
    </div>
  )
}
