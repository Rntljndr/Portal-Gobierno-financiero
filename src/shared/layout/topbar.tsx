import { Icon } from '@/shared/ui'
import { RoleSwitcher } from './role-switcher'

interface TopbarProps {
  pais?: string
  notifCount?: number
}

export function Topbar({ pais = 'Chile', notifCount = 3 }: TopbarProps) {
  return (
    <div className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-white px-6">
      <div className="ml-auto flex items-center gap-5">
        <div className="flex cursor-pointer items-center gap-2 rounded-full bg-cs-celeste px-3 py-1.5 text-[12.5px] font-semibold text-cs-azul-oscuro">
          <Icon name="flagCL" size={16} />
          {pais}
          <Icon name="chevron_down" size={12} color="#061494" />
        </div>
        <div className="relative cursor-pointer p-1.5">
          <Icon name="bell" size={18} color="#455B85" />
          {notifCount > 0 && (
            <div className="absolute top-0.5 right-0.5 size-2.5 rounded-full border-2 border-white bg-cs-naranja" />
          )}
        </div>
        <RoleSwitcher />
      </div>
    </div>
  )
}
