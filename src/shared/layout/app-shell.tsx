import { Outlet } from 'react-router'
import { AiAssistantButton } from '@/shared/ui'
import { Sidebar } from './sidebar'
import { Topbar } from './topbar'

export function AppShell() {
  return (
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
  )
}
