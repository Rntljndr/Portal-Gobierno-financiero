import { useEffect, useState } from 'react'
import { cn } from '@/shared/lib/utils'
import { SidebarHeader } from './sidebar-header'
import { SidebarNav } from './sidebar-nav'
import { SidebarFooter } from './sidebar-footer'

const STORAGE_KEY = 'sidebar-collapsed'

function loadCollapsed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(loadCollapsed)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed))
    } catch {
      // localStorage no disponible — la preferencia simplemente no persiste
    }
  }, [collapsed])

  return (
    <aside
      className={cn(
        'flex shrink-0 flex-col text-sidebar-foreground transition-[width,min-width] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]',
        collapsed ? 'w-14 min-w-14' : 'w-60 min-w-60',
      )}
      style={{ background: 'linear-gradient(180deg, var(--color-sidebar-bg) 0%, var(--color-sidebar-bg-2) 100%)' }}
    >
      <SidebarHeader collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <SidebarNav collapsed={collapsed} />
      <SidebarFooter collapsed={collapsed} />
    </aside>
  )
}
