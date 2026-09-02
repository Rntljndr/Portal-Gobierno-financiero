import { useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Icon } from '@/shared/ui'
import { useRole } from '@/shared/context/use-role'
import { ROLE_LABELS, type UserRole } from '@/shared/context/role-context'

const ROLES: UserRole[] = ['cdg', 'responsable']

export function RoleSwitcher() {
  const { role, setRole } = useRole()
  const [open, setOpen] = useState(false)

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button type="button" className="flex cursor-pointer items-center gap-2.5 rounded-lg p-1.5 hover:bg-[#F1F4FA]">
          <div className="text-right leading-tight">
            <div className="text-[13px] font-semibold text-foreground">Andrea Morales</div>
            <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
              {ROLE_LABELS[role]}
              <Icon name="chevron_down" size={11} color="#8A90A2" />
            </div>
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-muted text-cs-gris-oscuro">
            <Icon name="user" size={18} color="#455B85" />
          </div>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="end" sideOffset={8} className="z-[9100] w-[240px] overflow-hidden rounded-[10px] border border-border bg-white shadow-[0_4px_20px_rgba(0,60,150,0.12)]">
          <div className="border-b border-border p-[10px_14px] text-[10.5px] font-bold tracking-[0.06em] text-muted-foreground uppercase">Vista según rol</div>
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setRole(r)
                setOpen(false)
              }}
              className="flex w-full items-center justify-between p-[10px_14px] text-left text-[13px] text-foreground hover:bg-[#F4F7FE]"
            >
              {ROLE_LABELS[r]}
              {role === r && <Icon name="check" size={13} color="#0047B0" />}
            </button>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
