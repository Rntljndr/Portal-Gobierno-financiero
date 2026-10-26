import { createBrowserRouter, createHashRouter, Navigate } from 'react-router'
import { AppShell } from '@/shared/layout/app-shell'
import { EjerciciosPage } from '@/pages/ejercicios/ejercicios-page'
import { ForecastListPage } from '@/pages/forecast/forecast-list-page'
import { ForecastCreatePage } from '@/pages/forecast/forecast-create-page'
import { ForecastDetailPage } from '@/pages/forecast/forecast-detail-page'
import { ForecastEditarN4Page } from '@/pages/forecast/forecast-editar-n4-page'
import { ForecastEditarN7Page } from '@/pages/forecast/forecast-editar-n7-page'
import { ForecastN7DetallePage } from '@/pages/forecast/forecast-n7-detalle-page'
import { ForecastConfiguracionesPage } from '@/pages/forecast/forecast-configuraciones-page'
import { ForecastSubPepPage } from '@/pages/forecast/forecast-subpep-page'
import { NotificacionesPage } from '@/pages/notificaciones/notificaciones-page'
import { ReportesPage } from '@/pages/reportes/reportes-page'
import { MisServiciosPage } from '@/pages/mis-servicios/mis-servicios-page'
import { ReporteriaConsolidadaPage } from '@/pages/reporteria-consolidada/reporteria-consolidada-page'
import { ReportePlanPage } from '@/pages/reporte-plan/reporte-plan-page'
import { EjercicioEnCursoPage } from '@/pages/ejercicio-en-curso/ejercicio-en-curso-page'
import { ReporteGastoItV3Page } from '@/pages/reporte-gasto-it-v3/reporte-gasto-it-v3-page'
import { ServicioDetallePage } from '@/pages/servicio-detalle/servicio-detalle-page'
import { DriversPage } from '@/pages/drivers/drivers-page'
import { CentrosCostoPage } from '@/pages/centros-costo/centros-costo-page'
import { BanderasPage } from '@/pages/banderas/banderas-page'
import { InicioPage } from '@/pages/inicio/inicio-page'
import { RealesPage } from '@/pages/reales/reales-page'
import { RealesN7Page } from '@/pages/reales/reales-n7-page'
import { RealesSubPepPage } from '@/pages/reales/reales-subpep-page'
import { ConfiguracionesPage } from '@/pages/configuraciones/configuraciones-page'
import { PepsPage } from '@/pages/peps/peps-page'
import { IngresosPage } from '@/pages/ingresos/ingresos-page'
import { EditarPepN4Page } from '@/pages/peps/editar-pep-n4-page'
import { AdminInicioPage } from '@/pages/administracion/inicio-page'
import { GerenciasEquiposPage } from '@/pages/administracion/gerencias-equipos-page'
import { AlcancesPermisosPage } from '@/pages/administracion/alcances-permisos-page'
import { PaisesPage } from '@/pages/administracion/paises-page'
import { AreasPage } from '@/pages/administracion/areas-page'
import { DivisionesPage } from '@/pages/administracion/divisiones-page'
import { CuentasContablesPage } from '@/pages/administracion/cuentas-contables-page'
import { DestinosPage } from '@/pages/administracion/destinos-page'
import { CentrosCostoAdminPage } from '@/pages/administracion/centros-costo-page'
import { TiposSolicitudPage } from '@/pages/administracion/tipos-solicitud-page'
import { JustificacionDesvioPage } from '@/pages/administracion/justificacion-desvio-page'
import { TasasHyperionPage } from '@/pages/administracion/tasas-hyperion-page'
import { FechasCierreSapPage } from '@/pages/administracion/fechas-cierre-sap-page'
import { UsuariosPage } from '@/pages/administracion/usuarios-page'
import { ProyectosPage } from '@/pages/proyectos/proyectos-page'
import { SolicitudesPage } from '@/pages/solicitudes/solicitudes-page'
import { PreliminaresLayout } from '@/pages/preliminares/preliminares-layout'
import { PreliminaresPage } from '@/pages/preliminares/preliminares-page'
import { PreliminaresN7Page } from '@/pages/preliminares/preliminares-n7-page'
import { PreliminaresSubPepPage } from '@/pages/preliminares/preliminares-subpep-page'

const createRouter = import.meta.env.VITE_STANDALONE_EXPORT ? createHashRouter : createBrowserRouter

export const router = createRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <InicioPage /> },
      { path: '/ejercicios', element: <EjerciciosPage /> },
      { path: '/ejercicios/mis-servicios', element: <MisServiciosPage /> },
      { path: '/ejercicios/en-curso', element: <EjercicioEnCursoPage /> },
      { path: '/ejercicios/mis-servicios/drivers', element: <DriversPage /> },
      { path: '/ejercicios/mis-servicios/cecos', element: <CentrosCostoPage /> },
      { path: '/ejercicios/mis-servicios/banderas', element: <BanderasPage /> },
      { path: '/ejercicios/mis-servicios/configuraciones', element: <ConfiguracionesPage /> },
      { path: '/ejercicios/mis-servicios/:id', element: <ServicioDetallePage /> },
      { path: '/administracion', element: <AdminInicioPage /> },
      { path: '/administracion/paises', element: <PaisesPage /> },
      { path: '/administracion/areas', element: <AreasPage /> },
      { path: '/administracion/divisiones', element: <DivisionesPage /> },
      { path: '/administracion/cuentas-contables', element: <CuentasContablesPage /> },
      { path: '/administracion/centros-costo', element: <CentrosCostoAdminPage /> },
      { path: '/administracion/destinos', element: <DestinosPage /> },
      { path: '/administracion/gerencias-equipos', element: <GerenciasEquiposPage /> },
      { path: '/administracion/tipos-solicitud', element: <TiposSolicitudPage /> },
      { path: '/administracion/justificacion-desvio', element: <JustificacionDesvioPage /> },
      { path: '/administracion/tasas-hyperion', element: <TasasHyperionPage /> },
      { path: '/administracion/fechas-cierre-sap', element: <FechasCierreSapPage /> },
      { path: '/administracion/peps', element: <PepsPage /> },
      { path: '/administracion/peps/:pep', element: <EditarPepN4Page /> },
      { path: '/administracion/ingresos', element: <IngresosPage /> },
      { path: '/administracion/usuarios', element: <UsuariosPage /> },
      { path: '/administracion/alcances-permisos', element: <AlcancesPermisosPage /> },
      { path: '/reporteria', element: <Navigate to="/reporte-plan?reporte=reporteria" replace /> },
      { path: '/reporte-plan', element: <ReportePlanPage /> },
      { path: '/reporte-direccion', element: <Navigate to="/reporte-plan?reporte=negocio" replace /> },
      { path: '/reporteria-consolidada', element: <ReporteriaConsolidadaPage /> },
      { path: '/reporte-consolidado', element: <Navigate to="/reporte-plan?reporte=tecnologia" replace /> },
      { path: '/reporte-ejercicio-curso', element: <ReporteGastoItV3Page /> },
      // Rutas de las versiones de diseño anteriores: redirigen al reporte vigente.
      { path: '/reporte-gasto-it', element: <Navigate to="/reporte-ejercicio-curso" replace /> },
      { path: '/reporte-gasto-it-v3', element: <Navigate to="/reporte-ejercicio-curso" replace /> },
      { path: '/reales', element: <RealesPage /> },
      { path: '/reales/:codigo', element: <RealesN7Page /> },
      { path: '/reales/:codigo/:n7codigo', element: <RealesSubPepPage /> },
      {
        path: '/preliminares',
        element: <PreliminaresLayout />,
        children: [
          { index: true, element: <PreliminaresPage /> },
          { path: ':codigo', element: <PreliminaresN7Page /> },
          { path: ':codigo/:n7codigo', element: <PreliminaresSubPepPage /> },
        ],
      },
      { path: '/forecast', element: <ForecastListPage /> },
      { path: '/forecast/nuevo', element: <ForecastCreatePage /> },
      { path: '/forecast/:id', element: <ForecastDetailPage /> },
      { path: '/forecast/:id/configuraciones', element: <ForecastConfiguracionesPage /> },
      { path: '/forecast/:id/editar', element: <ForecastEditarN4Page /> },
      { path: '/forecast/:id/editar/:n4codigo', element: <ForecastEditarN7Page /> },
      { path: '/forecast/:id/editar/:n4codigo/:n7codigo', element: <ForecastN7DetallePage /> },
      { path: '/forecast/:id/subpep/:n4Codigo/:n7Codigo', element: <ForecastSubPepPage /> },
      { path: '/notificaciones', element: <NotificacionesPage /> },
      { path: '/reportes', element: <ReportesPage /> },
      { path: '/proyectos', element: <ProyectosPage /> },
      { path: '/solicitudes', element: <SolicitudesPage /> },
    ],
  },
])
