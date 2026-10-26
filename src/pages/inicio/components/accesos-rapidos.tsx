import { ShortcutGroup, Tag } from '@/shared/ui'
import { currentExercise, nextExercise } from '@/data/exercises'

/** Accesos rápidos a cada ejercicio y su reportería (en curso a la izquierda, en planificación a la derecha) y,
 * debajo, la configuración anual del ejercicio; mismas tarjetas que la pantalla de Administración. */
export function AccesosRapidos() {
  return (
    <div className="flex flex-col gap-6">
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ShortcutGroup
        label={`Ejercicio en curso ${currentExercise.year}`}
        icon="ejercicios"
        badge={<Tag color="blue" size="sm">En curso</Tag>}
        gridClassName="sm:grid-cols-1 lg:grid-cols-1"
        collapsible={false}
        secciones={[
          { label: `Ejercicio ${currentExercise.year}`, to: '/ejercicios/en-curso', descripcion: 'Ejecución de tus líneas: plan, real y forecast', icon: 'ejercicios' },
          { label: 'Reporte ejercicio en curso', to: '/reporte-ejercicio-curso', descripcion: 'Gasto real, forecast y desvíos del año', icon: 'chart' },
        ]}
      />
      <ShortcutGroup
        label={`Ejercicio en planificación ${nextExercise.year}`}
        icon="calendar"
        badge={<Tag color="green" size="sm">Presupuesto abierto</Tag>}
        gridClassName="sm:grid-cols-1 lg:grid-cols-1"
        collapsible={false}
        secciones={[
          { label: `Mis líneas ${nextExercise.year}`, to: '/ejercicios/mis-servicios', descripcion: 'Revisa, ajusta y envía tus líneas presupuestarias', icon: 'edit' },
          { label: 'Reporte de plan', to: '/reporte-plan', descripcion: 'Reportería planificación, Negocio y Tecnología', icon: 'chart' },
        ]}
      />
    </div>
    <ShortcutGroup
      label={`Configuración anual ${nextExercise.year}`}
      icon="config"
      collapsible={false}
      secciones={[
        { label: 'Drivers', to: '/ejercicios/mis-servicios/drivers', descripcion: '199 drivers de distribución del gasto', icon: 'drives' },
        { label: 'Banderas', to: '/ejercicios/mis-servicios/banderas', descripcion: '120 banderas por país y división', icon: 'flag' },
        { label: 'Cecos centrales', to: '/ejercicios/mis-servicios/cecos', descripcion: '354 centros de costo centrales', icon: 'ceco' },
      ]}
    />
    </div>
  )
}
