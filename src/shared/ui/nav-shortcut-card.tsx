import type { ReactNode } from 'react'
import { Icon } from './icon'
import { Button } from './button'

const cardClasses =
  'relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-2xl border border-[#A8D2B7] bg-[linear-gradient(95deg,#DDF0E4_0%,#CFE8D8_55%,#BFE0CB_140%)] p-[14px_18px] text-[#143E29] shadow-[0_4px_14px_rgba(31,111,71,0.14)]'

interface NavShortcutCardProps {
  icon: ReactNode
  label: string
  title: string
  description: string
  buttonLabel: string
  onNavigate: () => void
}

/** Card de acceso directo verde — usada en "Próximo ejercicio" (Ejercicios) y en el módulo Reportes. */
export function NavShortcutCard({ icon, label, title, description, buttonLabel, onNavigate }: NavShortcutCardProps) {
  return (
    <div className={cardClasses} onClick={onNavigate}>
      <div className="relative z-1 flex min-w-0 items-center gap-3">
        <div className="relative z-1 flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#A8D2B7] bg-white text-[#1F6F47]">
          {icon}
        </div>
        <div className="relative z-1 min-w-0">
          <div className="mb-0.5 inline-flex items-center gap-1.5 text-[9.5px] font-bold tracking-[0.14em] text-[#1F6F47] uppercase before:size-1.5 before:rounded-full before:bg-[#2A8C5C] before:shadow-[0_0_0_3px_rgba(42,140,92,0.25)]">
            {label}
          </div>
          <div className="truncate text-[15px] leading-tight font-bold tracking-tight text-[#0F3621]">{title}</div>
          <div className="mt-0.5 truncate text-[11.5px] text-[#355C46]">{description}</div>
        </div>
      </div>
      <Button
        variant="onGreenCard"
        size="sm"
        className="relative z-1 ml-auto"
        onClick={(e) => {
          e.stopPropagation()
          onNavigate()
        }}
      >
        {buttonLabel} <Icon name="chevron_right" size={11} color="#1F6F47" />
      </Button>
    </div>
  )
}
