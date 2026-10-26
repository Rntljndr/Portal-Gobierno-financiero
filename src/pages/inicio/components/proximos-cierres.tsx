import { Card } from '@/shared/ui'
import { nextExercise } from '@/data/exercises'
import { CIERRE_PRESUPUESTO, diasHasta } from '../lib/accesos'
import { forecastAbierto } from '../lib/tareas'

const MES = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString('es-CL', { month: 'short' }).replace('.', '')
const DIA = (iso: string) => new Date(`${iso}T12:00:00`).getDate()

/** Cuenta regresiva de los cierres que gobiernan el trabajo de las próximas semanas. */
export function ProximosCierres() {
  const fcst = forecastAbierto()
  const hitos = [
    ...(fcst ? [{ id: 'f', fecha: fcst.fechaTermino, titulo: `Cierre ${fcst.titulo}`, sub: 'Termina la edición del forecast' }] : []),
    { id: 'p', fecha: CIERRE_PRESUPUESTO, titulo: `Cierre presupuesto ${nextExercise.year}`, sub: 'La estructura queda cerrada para edición' },
  ].sort((a, b) => a.fecha.localeCompare(b.fecha))

  return (
    <Card padding="md" className="flex h-full flex-col">
      <h2 className="mb-3 px-2 text-lg font-bold text-primary">Próximos cierres</h2>
      <ul className="flex flex-col gap-2">
        {hitos.map((h) => {
          const d = diasHasta(h.fecha)
          return (
            <li key={h.id} className="flex items-center gap-3 rounded-lg bg-surface-elevated p-3">
              <span className="flex w-12 shrink-0 flex-col items-center rounded-lg bg-white py-1.5 shadow-m">
                <span className="text-xxs font-bold text-destructive uppercase">{MES(h.fecha)}</span>
                <span className="text-lg leading-none font-bold text-foreground">{DIA(h.fecha)}</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-foreground">{h.titulo}</span>
                <span className="block text-xs text-muted-foreground">{h.sub}</span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-2xl leading-none font-bold text-primary tabular-nums">{d}</span>
                <span className="text-xs text-muted-foreground">{d === 1 ? 'día' : 'días'}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
