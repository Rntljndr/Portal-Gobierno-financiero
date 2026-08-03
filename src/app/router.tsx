import { createBrowserRouter } from 'react-router'
import { AppShell } from '@/shared/layout/app-shell'
import { EjerciciosPage } from '@/pages/ejercicios/ejercicios-page'
import { ForecastPage } from '@/pages/forecast/forecast-page'
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
import { ConfiguracionesPage } from '@/pages/configuraciones/configuraciones-page'

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
      { path: '/ejercicios/mis-servicios/:id', element: <ServicioDetallePage /> },
      { path: '/reporteria', element: <ReporteriaPage /> },
      { path: '/reales', element: <RealesPage /> },
      { path: '/forecast', element: <ForecastPage /> },
      { path: '/notificaciones', element: <NotificacionesPage /> },
      { path: '/reportes', element: <ReportesPage /> },
    ],
  },
])
