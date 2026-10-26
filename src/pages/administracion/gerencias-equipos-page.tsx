import { Breadcrumb, Button, Icon, PageHeader, Select, Toast } from '@/shared/ui'
import { useToast } from '@/shared/lib/use-toast'
import { useGerenciasEquipos } from './lib/use-gerencias-equipos'
import { AdministracionEjercicioSelect } from './components/administracion-ejercicio-select'
import { GerenciasEquiposKpiRow } from './components/gerencias-equipos-kpi-row'
import { GerenciasEquiposTree } from './components/gerencias-equipos-tree'

const ACCION_LABEL = { ver: 'Ver detalle', editar: 'Editar', eliminar: 'Eliminar' } as const

/** "Gerencias y Equipos" (F: "navega en administración > Gerencia y equipo, esto cópialo en el
 * portal... debes agregar un selector de año en la parte superior derecha, como en Tasa de Hyperion")
 * — estructura Área > Gerencia > Equipo > Miembro copiada del ABM de referencia; el selector de
 * Ejercicio reconstruye toda la estructura vigente ese año (altas/bajas vía `desde`/`hasta` del seed,
 * ver `estructuraParaAnio`). Sin backend detrás: crear/editar/eliminar solo muestran un toast. */
export function GerenciasEquiposPage() {
  const s = useGerenciasEquipos()
  const { message, showToast } = useToast()

  return (
    <div className="h-full overflow-y-auto">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Administración', to: '/administracion' }, { label: 'Gerencias y Equipos' }]} />
      <PageHeader title="Gerencias y Equipos" subtitle="Administra la estructura organizacional completa: gerencias, equipos y sus dependencias." />

      <div className="mx-8 mb-5">
        <AdministracionEjercicioSelect anio={s.anio} anios={s.anios} onChange={s.setAnio} />
      </div>

      <GerenciasEquiposKpiRow counts={s.counts} />

      <div className="mx-8 mb-4 flex flex-wrap items-center gap-3">
        <div className="flex h-9 flex-1 min-w-[220px] items-center gap-2 rounded-lg border border-border bg-white px-3">
          <Icon name="search" size={14} color="#8A90A2" />
          <input
            value={s.search}
            onChange={(e) => s.setSearch(e.target.value)}
            placeholder="Buscar área, gerencia o equipo..."
            className="h-full flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="w-[160px]">
          <Select
            value={s.estadoFiltro}
            onChange={(v) => s.setEstadoFiltro(v as typeof s.estadoFiltro)}
            options={[
              { value: 'todos', label: 'Todos los estados' },
              { value: 'Activo', label: 'Activo' },
              { value: 'Inactivo', label: 'Inactivo' },
            ]}
          />
        </div>
        <Button variant="primary" size="sm" onClick={() => showToast('Crear estructuras no está disponible en este demo.')}>
          <Icon name="plus" size={13} color="#fff" /> Nueva Estructura
        </Button>
      </div>

      <GerenciasEquiposTree
        areas={s.estructura}
        expandidos={s.expandidos}
        onToggle={s.toggleExpand}
        onAction={(nombre, tipo) => showToast(`${ACCION_LABEL[tipo]} "${nombre}" no está disponible en este demo.`)}
      />
      <Toast message={message} />
    </div>
  )
}
