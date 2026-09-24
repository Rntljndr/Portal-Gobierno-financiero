import { createBrowserRouter, createHashRouter } from 'react-router'
import { AppShell } from '@/shared/layout/app-shell'
import { EjerciciosPage } from '@/pages/ejercicios/ejercicios-page'
import { ForecastListPage } from '@/pages/forecast/forecast-list-page'
import { ForecastCreatePage } from '@/pages/forecast/forecast-create-page'
import { ForecastDetailPage } from '@/pages/forecast/forecast-detail-page'
import { ForecastEditarN4Page } from '@/pages/forecast/forecast-editar-n4-page'
import { ForecastN4DetallePage } from '@/pages/forecast/forecast-n4-detalle-page'
import { ForecastEditarN7Page } from '@/pages/forecast/forecast-editar-n7-page'
import { ForecastN7DetallePage } from '@/pages/forecast/forecast-n7-detalle-page'
import { NotificacionesPage } from '@/pages/notificaciones/notificaciones-page'
import { ReportesPage } from '@/pages/reportes/reportes-page'
import { MisServiciosPage } from '@/pages/mis-servicios/mis-servicios-page'
import { ReporteriaPage } from '@/pages/reporteria/reporteria-page'
import { ReporteDireccionPage } from '@/pages/reporte-direccion/reporte-direccion-page'
import { ReporteriaConsolidadaPage } from '@/pages/reporteria-consolidada/reporteria-consolidada-page'
import { ConsolidadoPage } from '@/pages/consolidado/consolidado-page'
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
import { AdministracionPlaceholderPage } from '@/pages/administracion/administracion-placeholder-page'
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
      { path: '/ejercicios/mis-servicios/drivers', element: <DriversPage /> },
      { path: '/ejercicios/mis-servicios/cecos', element: <CentrosCostoPage /> },
      { path: '/ejercicios/mis-servicios/banderas', element: <BanderasPage /> },
      { path: '/ejercicios/mis-servicios/configuraciones', element: <ConfiguracionesPage /> },
      { path: '/ejercicios/mis-servicios/:id', element: <ServicioDetallePage /> },
      { path: '/administracion/paises', element: <AdministracionPlaceholderPage title="Países" /> },
      { path: '/administracion/areas', element: <AdministracionPlaceholderPage title="Áreas" /> },
      { path: '/administracion/divisiones', element: <AdministracionPlaceholderPage title="Divisiones" /> },
      { path: '/administracion/cuentas-contables', element: <AdministracionPlaceholderPage title="Cuentas Contables" /> },
      { path: '/administracion/destinos', element: <AdministracionPlaceholderPage title="Destinos" /> },
      { path: '/administracion/gerencias-equipos', element: <AdministracionPlaceholderPage title="Gerencias y Equipos" /> },
      { path: '/administracion/tipos-solicitud', element: <AdministracionPlaceholderPage title="Tipos de Solicitud" /> },
      { path: '/administracion/peps', element: <PepsPage /> },
      { path: '/administracion/peps/:pep', element: <EditarPepN4Page /> },
      { path: '/administracion/ingresos', element: <IngresosPage /> },
      { path: '/reporteria', element: <ReporteriaPage /> },
      { path: '/reporte-direccion', element: <ReporteDireccionPage /> },
      { path: '/reporteria-consolidada', element: <ReporteriaConsolidadaPage /> },
      { path: '/reporte-consolidado', element: <ConsolidadoPage /> },
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
      { path: '/forecast/:id/editar', element: <ForecastEditarN4Page /> },
      { path: '/forecast/:id/editar/:n4codigo', element: <ForecastN4DetallePage /> },
      { path: '/forecast/:id/editar/:n4codigo/n7', element: <ForecastEditarN7Page /> },
      { path: '/forecast/:id/editar/:n4codigo/:n7codigo', element: <ForecastN7DetallePage /> },
      { path: '/notificaciones', element: <NotificacionesPage /> },
      { path: '/reportes', element: <ReportesPage /> },
      { path: '/proyectos', element: <ProyectosPage /> },
      { path: '/solicitudes', element: <SolicitudesPage /> },
    ],
  },
])
