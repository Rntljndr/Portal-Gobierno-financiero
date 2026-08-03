import { useState } from 'react'
import { cn } from '@/shared/lib/utils'
import { SidebarHeader } from './sidebar-header'
import { SidebarNav } from './sidebar-nav'
import { SidebarFooter } from './sidebar-footer'

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'flex flex-col text-sidebar-foreground transition-[width] duration-200',
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
