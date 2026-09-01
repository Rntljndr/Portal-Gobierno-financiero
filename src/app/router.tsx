import { createBrowserRouter } from 'react-router'
import { AppShell } from '@/shared/layout/app-shell'
import { EjerciciosPage } from '@/pages/ejercicios/ejercicios-page'
import { ForecastLayout } from '@/pages/forecast/forecast-layout'
import { ForecastListPage } from '@/pages/forecast/forecast-list-page'
import { ForecastCreatePage } from '@/pages/forecast/forecast-create-page'
import { ForecastDetailPage } from '@/pages/forecast/forecast-detail-page'
import { NotificacionesPage } from '@/pages/notificaciones/notificaciones-page'
import { ReportesPage } from '@/pages/reportes/reportes-page'
import { MisServiciosPage } from '@/pages/mis-servicios/mis-servicios-page'
import { ReporteriaPage } from '@/pages/reporteria/reporteria-page'
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
import { EditarPepN4Page } from '@/pages/peps/editar-pep-n4-page'
import { PreliminaresPage } from '@/pages/preliminares/preliminares-page'
import { PreliminaresN7Page } from '@/pages/preliminares/preliminares-n7-page'

export const router = createBrowserRouter([
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
      { path: '/ejercicios/mis-servicios/peps', element: <PepsPage /> },
      { path: '/ejercicios/mis-servicios/peps/:pep', element: <EditarPepN4Page /> },
      { path: '/ejercicios/mis-servicios/:id', element: <ServicioDetallePage /> },
      { path: '/reporteria', element: <ReporteriaPage /> },
      { path: '/reales', element: <RealesPage /> },
      { path: '/reales/:codigo', element: <RealesN7Page /> },
      { path: '/reales/:codigo/:n7codigo', element: <RealesSubPepPage /> },
      { path: '/preliminares', element: <PreliminaresPage /> },
      { path: '/preliminares/:codigo', element: <PreliminaresN7Page /> },
      {
        path: '/forecast',
        element: <ForecastLayout />,
        children: [
          { index: true, element: <ForecastListPage /> },
          { path: 'nuevo', element: <ForecastCreatePage /> },
          { path: ':id', element: <ForecastDetailPage /> },
        ],
      },
      { path: '/notificaciones', element: <NotificacionesPage /> },
      { path: '/reportes', element: <ReportesPage /> },
    ],
  },
])
