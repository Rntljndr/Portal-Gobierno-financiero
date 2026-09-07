import { Outlet } from 'react-router'
import { AiAssistantButton } from '@/shared/ui'
import { RoleProvider } from '@/shared/context/role-provider'
import { MesCierreProvider } from '@/shared/context/mes-cierre-provider'
import { ForecastProvider } from '@/pages/forecast/lib/forecast-store'
import { RealesComparisonsProvider } from '@/pages/reales/lib/reales-comparisons-provider'
import { Sidebar } from './sidebar'
import { Topbar } from './topbar'

export function AppShell() {
  return (
    <RoleProvider>
      <ForecastProvider>
        <MesCierreProvider>
          <RealesComparisonsProvider>
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <Topbar />
                <div className="flex-1 overflow-y-auto bg-background">
                  <Outlet />
                </div>
              </div>
              <AiAssistantButton />
            </div>
          </RealesComparisonsProvider>
        </MesCierreProvider>
      </ForecastProvider>
    </RoleProvider>
  )
}
