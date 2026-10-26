import { Breadcrumb, Icon, PageHeader } from '@/shared/ui'
import { useAlcancesPermisos } from './lib/use-alcances-permisos'
import { AdministracionEjercicioSelect } from './components/administracion-ejercicio-select'
import { AdministracionEstadoBadge } from './components/administracion-estado-badge'
import { AlcancesUsuariosLista } from './components/alcances-usuarios-lista'
import { AlcancesEstructuraTree } from './components/alcances-estructura-tree'
import { AlcancesPermisosPanel } from './components/alcances-permisos-panel'

/** "Alcances y permisos" (F: "navega en Administración > Alcance y permisos, esto cópialo en el
 * portal... selector de año... al seleccionar el año se trae las configuraciones ejecutadas ese año")
 * — gestiona qué puede visualizar/editar cada usuario dentro de la estructura organizacional, copiada
 * del ABM de referencia. El selector de Ejercicio reconstruye la estructura Y los alcances vigentes
 * ese año a la vez (ver `useAlcancesPermisos`). */
export function AlcancesPermisosPage() {
  const s = useAlcancesPermisos()

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Administración', to: '/administracion' }, { label: 'Alcances y permisos' }]} />
      <PageHeader
        title="Asignación de alcances"
        subtitle="Gestiona los permisos operativos de cada usuario: qué puede visualizar y qué puede editar dentro de la estructura organizacional."
      />

      <div className="mx-8 mb-5">
        <AdministracionEjercicioSelect anio={s.anio} anios={s.anios} onChange={s.setAnio} />
      </div>

      <div className="mx-8 mb-8 flex flex-1 gap-4">
        <AlcancesUsuariosLista usuarios={s.usuarios} usuarioId={s.usuarioId} onSelect={s.seleccionarUsuario} buscar={s.buscarUsuario} onBuscar={s.setBuscarUsuario} />

        {!s.usuario ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-white text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-[#EEF1FB] text-muted-foreground">
              <Icon name="user" size={20} color="#8A90A2" />
            </span>
            <div className="text-[13.5px] font-bold text-foreground">Selecciona un usuario</div>
            <div className="text-[12px] text-muted-foreground">Elige un usuario del panel izquierdo para gestionar sus permisos</div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-[#EEF1FB] text-[12px] font-bold text-primary">
                {s.usuario.nombre
                  .split(' ')
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13.5px] font-bold text-foreground">{s.usuario.nombre}</span>
                  <span className="rounded-full bg-[#EEF4FF] px-2 py-0.5 text-[10.5px] font-semibold text-primary">{s.usuario.rol}</span>
                  <AdministracionEstadoBadge estado={s.usuario.estado} />
                </div>
                <div className="text-[11.5px] text-muted-foreground">{s.usuario.email}</div>
              </div>
            </div>

            <div className="flex flex-1 gap-4">
              <AlcancesEstructuraTree
                estructura={s.estructura}
                draft={s.draft}
                buscar={s.buscarEstructura}
                onBuscar={s.setBuscarEstructura}
                onAsignar={s.asignarNodo}
                onSetPermiso={s.setPermisoEquipos}
              />
              <AlcancesPermisosPanel
                equiposAsignados={s.equiposAsignados}
                draft={s.draft}
                totalVer={s.totalVer}
                totalEditar={s.totalEditar}
                hayCambios={s.hayCambios}
                onSetPermiso={s.setPermisoEquipos}
                onQuitar={s.quitarEquipo}
                onGuardar={s.guardarCambios}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
