import { useNavigate } from 'react-router'
import { Button, Card, Icon, Tag } from '@/shared/ui'
import { currentExercise } from '@/data/exercises'
import { forecastRoundsIniciales } from '@/data/forecast'
import { getCierreSapFechasOrdenadas, PRELIM_MES_OPEN_LABEL } from '@/data/preliminares'
import { REALES_LAST_CLOSED, REALES_ULTIMO_REAL_LABEL } from '@/data/reales'
import { estadoEnCurso, fmtPct, fmtUsd } from '../lib/estado-ejercicios'
import { Cifra, Proceso, Var } from './proceso'
import { CicloMeses } from './ciclo-meses'

const fechaCorta = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })

/** Panel del ejercicio en curso: cifras contra el plan y el ciclo del mes (real cerrado → preliminares →
 * forecast → cierre contable), cada etapa con acceso a su pantalla. */
export function PanelEnCurso() {
  const navigate = useNavigate()
  const e = estadoEnCurso()
  const fcst = forecastRoundsIniciales.find((r) => r.estado === 'Abierto')
  const cierre = getCierreSapFechasOrdenadas(PRELIM_MES_OPEN_LABEL)[0]
  const mesAbierto = PRELIM_MES_OPEN_LABEL.split(' ')[0].toLowerCase()

  return (
    <Card className="flex flex-col gap-5">
      <div>
        <Tag color="blue" size="sm">
          En curso · {REALES_LAST_CLOSED} de 12 meses cerrados
        </Tag>
        <div className="mt-2 text-2xl font-bold tracking-tight text-primary">Ejercicio {currentExercise.year}</div>
        <div className="text-sm text-muted-foreground">
          Último real: {REALES_ULTIMO_REAL_LABEL} · mes abierto: {PRELIM_MES_OPEN_LABEL}
        </div>
      </div>

      <CicloMeses cerrados={REALES_LAST_CLOSED} />

      <div className="grid grid-cols-2 gap-3">
        <Cifra label="Real acumulado" valor={fmtUsd(e.realAcum)} detalle={<Var n={e.desvAcumPct}>{fmtPct(e.desvAcumPct, true)} vs plan a la fecha</Var>} />
        <Cifra label="Proyectado anual" valor={fmtUsd(e.proyectado)} detalle={<Var n={e.desvAnualPct}>{fmtPct(e.desvAnualPct, true)} vs plan anual</Var>} />
      </div>

      <Proceso
        pasos={[
          { titulo: `Real cerrado a ${REALES_ULTIMO_REAL_LABEL.toLowerCase()}`, detalle: 'Ejecución contable de SAP, de enero al último cierre', estado: 'hecho', to: '/reales' },
          {
            titulo: `Preliminares de ${mesAbierto}`,
            detalle: `${fmtPct(e.prelimAvancePct)} cargado del forecast del mes${cierre ? ` · primer cierre SAP ${cierre.fecha}` : ''}`,
            estado: 'actual',
            to: '/preliminares',
          },
          {
            titulo: fcst ? `${fcst.titulo} en edición` : 'Forecast',
            detalle: (
              <>
                {fcst ? `Hasta el ${fechaCorta(fcst.fechaTermino)} · ` : ''}
                {e.fcstModificadas} líneas modificadas · <Var n={e.fcstDif}>{fmtUsd(e.fcstDif, true)} vs el anterior</Var>
              </>
            ),
            estado: fcst ? 'actual' : 'pendiente',
            to: '/forecast',
          },
          { titulo: `Cierre contable de ${mesAbierto}`, detalle: 'El preliminar pasa a real y se actualiza la reportería', estado: 'pendiente' },
        ]}
      />

      <div className="mt-auto flex flex-wrap gap-2">
        <Button onClick={() => navigate('/reporte-ejercicio-curso')}>
          Reporte ejercicio en curso <Icon name="arrow_right" size={16} color="currentColor" />
        </Button>
        <Button variant="outline" onClick={() => navigate('/reporte-ejercicio-curso?vista=gestion')}>
          Ver en destino
        </Button>
      </div>
    </Card>
  )
}
