import { Icon } from '@/shared/ui'

interface SidebarFooterProps {
  collapsed: boolean
}

export function SidebarFooter({ collapsed }: SidebarFooterProps) {
  return (
    <div className="flex items-center gap-2.5 border-t border-sidebar-border p-3.5">
      <div className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-cs-azul-claro text-[11px] font-bold text-white">
        AM
      </div>
      {!collapsed && (
        <>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12.5px] font-semibold text-white">Andrea Morales</div>
            <div className="truncate text-[10.5px] text-white/55">a.morales@cencosud.cl</div>
          </div>
          <Icon name="logout" size={14} color="rgba(255,255,255,0.5)" />
        </>
      )}
    </div>
  )
}
