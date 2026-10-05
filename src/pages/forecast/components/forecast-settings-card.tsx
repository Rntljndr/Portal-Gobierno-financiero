import type { ReactNode } from 'react'
import { Icon, type IconName } from '@/shared/ui'

interface ForecastSettingsCardProps {
  icon: IconName
  title: string
  children: ReactNode
}

/** Card de la pantalla de Configuraciones del Forecast — mismo patrón visual que SettingsCard de
 * Presupuesto (pages/configuraciones/components/settings-card.tsx), reimplementado acá porque
 * pages/<A> nunca importa de pages/<B>. */
export function ForecastSettingsCard({ icon, title, children }: ForecastSettingsCardProps) {
  return (
    <div className="rounded-xl border border-border bg-white p-[20px_24px]">
      <div className="mb-4.5 flex items-center gap-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#EBF0FF]">
          <Icon name={icon} size={16} color="#0047B0" />
        </div>
        <span className="text-sm font-bold text-foreground">{title}</span>
      </div>
      {children}
    </div>
  )
}
