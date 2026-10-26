import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Saludo } from './components/saludo'
import { AccesosRapidos } from './components/accesos-rapidos'
import { Tareas } from './components/tareas'
import { ProximosCierres } from './components/proximos-cierres'
import { PanelPlanificacion } from './components/panel-planificacion'
import { PanelEnCurso } from './components/panel-en-curso'
import { RecentActivity } from './components/recent-activity'
import { GestionModulos } from './components/gestion-modulos'
import { currentExercise } from '@/data/exercises'
import { tareasPendientes } from './lib/tareas'

function Bloque({ titulo, accion, children }: { titulo: string; accion?: ReactNode; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">{titulo}</h2>
        {accion}
      </div>
      {children}
    </section>
  )
}

/** Inicio: saludo con lo importante del día y buscador global → tareas priorizadas y próximos cierres →
 * cómo van los dos ejercicios → accesos rápidos a cada ejercicio y su reportería → Forecast, Reales y
 * Preliminares con su estado → actividad reciente. */
export function InicioPage() {
  const tareas = tareasPendientes()
  return (
    <div className="h-full overflow-y-auto">
      <Saludo nombre="Andrea" tareas={tareas} />
      <div className="mx-8 mb-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <Tareas tareas={tareas} />
          </div>
          <ProximosCierres />
        </div>
        <Bloque titulo="Cómo van los ejercicios">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <PanelPlanificacion />
            <PanelEnCurso />
          </div>
        </Bloque>
        <Bloque titulo="Accesos rápidos">
          <AccesosRapidos />
        </Bloque>
        <Bloque titulo={`Gestión del ejercicio en curso ${currentExercise.year}`}>
          <GestionModulos />
        </Bloque>
        <Bloque
          titulo="Actividad reciente"
          accion={
            <Link to="/notificaciones" className="text-sm font-medium text-primary hover:underline">
              Ver todas
            </Link>
          }
        >
          <RecentActivity />
        </Bloque>
      </div>
    </div>
  )
}
