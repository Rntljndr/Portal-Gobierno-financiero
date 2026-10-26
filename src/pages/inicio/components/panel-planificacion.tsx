import { useNavigate } from 'react-router'
import { Button, Card, Icon, Tag } from '@/shared/ui'
import { nextExercise } from '@/data/exercises'
import type { EstadoServicio } from '@/data/services'
import { estadoPlanificacion, fmtPct, fmtUsd } from '../lib/estado-ejercicios'
import { Cifra, Proceso, Var } from './proceso'

const SEGMENTOS: { estado: EstadoServicio; label: string; clase: string }[] = [
  { estado: 'Aprobado', label: 'Aprobadas', clase: 'bg-success' },
  { estado: 'Enviado', label: 'Enviadas', clase: 'bg-primary' },
  { estado: 'Requiere revisión', label: 'Requieren revisión', clase: 'bg-warning' },
  { estado: 'Borrador', label: 'Borrador', clase: 'bg-border-strong' },
]

/** Panel del ejercicio en planificación: etapas del presupuesto, avance de las líneas y plan vs forecast. */
export function PanelPlanificacion() {
  const navigate = useNavigate()
  const e = estadoPlanificacion()
  const listas = e.porEstado.Aprobado + e.porEstado.Enviado

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <Tag color="green" size="sm">
            En planificación · presupuesto abierto
          </Tag>
          <div className="mt-2 text-2xl font-bold tracking-tight text-primary">Ejercicio {nextExercise.year}</div>
          <div className="text-sm text-muted-foreground">Cierre del presupuesto: 1 de noviembre de 2026</div>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-baseline justify-between text-sm">
          <span className="font-bold text-foreground">Avance de las líneas</span>
          <span className="text-muted-foreground">
            <span className="font-bold text-foreground">{listas}</span> de {e.total} enviadas o aprobadas
          </span>
        </div>
        <div className="flex h-3 gap-0.5 overflow-hidden rounded-full bg-chart-track" aria-hidden>
          {SEGMENTOS.map((s) => (
            <span key={s.estado} className={s.clase} style={{ width: `${(e.porEstado[s.estado] / e.total) * 100}%` }} />
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {SEGMENTOS.map((s) => (
            <span key={s.estado} className="inline-flex items-center gap-1.5">
              <span className={`size-2 rounded-full ${s.clase}`} />
              {s.label} <span className="font-bold text-foreground">{e.porEstado[s.estado]}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Cifra label={`Plan ${nextExercise.year}`} valor={fmtUsd(e.planUsd)} detalle={<Var n={e.varPct}>{fmtPct(e.varPct, true)} vs forecast {nextExercise.year - 1}</Var>} />
        <Cifra label="Por resolver" valor={e.porEstado['Requiere revisión'] + e.porEstado.Borrador} detalle="Líneas en borrador o con revisión pedida" />
      </div>

      <Proceso
        pasos={[
          { titulo: 'Apertura del ejercicio', detalle: `Ejercicio ${nextExercise.year} abierto y líneas asignadas`, estado: 'hecho' },
          { titulo: 'Revisión y envío de líneas', detalle: `${listas} de ${e.total} enviadas · plazo 1 nov 2026`, estado: 'actual', to: '/ejercicios/mis-servicios' },
          { titulo: 'Aprobación de Control de Gestión', detalle: `${e.porEstado.Aprobado} de ${e.total} aprobadas`, estado: 'actual', to: '/reporte-plan' },
          { titulo: 'Cierre del presupuesto', detalle: 'La estructura queda cerrada para edición', estado: 'pendiente' },
        ]}
      />

      <div className="mt-auto flex flex-wrap gap-2">
        <Button onClick={() => navigate('/ejercicios/mis-servicios')}>
          Revisar mis líneas <Icon name="arrow_right" size={16} color="currentColor" />
        </Button>
        <Button variant="outline" onClick={() => navigate('/reporte-plan')}>
          Reporte de plan
        </Button>
      </div>
    </Card>
  )
}
