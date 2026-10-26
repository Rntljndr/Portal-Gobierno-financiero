import { CIERRE_PRESUPUESTO, diasHasta } from '../lib/accesos'
import { forecastAbierto, type Tarea } from '../lib/tareas'
import { Buscador } from './buscador'

const saludoPorHora = () => {
  const h = new Date().getHours()
  return h < 12 ? 'Buenos días' : h < 20 ? 'Buenas tardes' : 'Buenas noches'
}

/** Encabezado del inicio: saludo, fecha, una frase con lo importante del día y el buscador global. */
export function Saludo({ nombre, tareas }: { nombre: string; tareas: Tarea[] }) {
  const hoy = new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })
  const fcst = forecastAbierto()
  const dPres = diasHasta(CIERRE_PRESUPUESTO)
  const cierres = fcst
    ? `El forecast cierra en ${diasHasta(fcst.fechaTermino)} días y el presupuesto 2027, en ${dPres}.`
    : `El presupuesto 2027 cierra en ${dPres} días.`

  return (
    <div className="flex flex-wrap items-end justify-between gap-4 px-8 pt-6 pb-6">
      <div className="min-w-0">
        <div className="text-sm font-medium text-muted-foreground first-letter:uppercase">{hoy}</div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-primary">
          {saludoPorHora()}, {nombre}
        </h1>
        <p className="mt-1 text-base text-cs-gris-oscuro">
          Tienes <strong className="font-bold text-foreground">{tareas.length} tareas pendientes</strong>. {cierres}
        </p>
      </div>
      <Buscador />
    </div>
  )
}
