import { Breadcrumb, PageHeader } from '@/shared/ui'
import { ForecastListHeaderActions } from './forecast-list-header-actions'

interface ForecastListPageHeaderProps {
  tab: 'n4' | 'n7'
  onTabChange: (tab: 'n4' | 'n7') => void
  hasActivo: boolean
  onOpenConfiguraciones: () => void
  onCerrar: () => void
}

/** Breadcrumb + PageHeader de ForecastListPage — extraído aparte para mantener la página bajo el
 * límite de líneas del linter. */
export function ForecastListPageHeader({ tab, onTabChange, hasActivo, onOpenConfiguraciones, onCerrar }: ForecastListPageHeaderProps) {
  return (
    <>
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Forecast' }]} />
      <PageHeader
        title="Forecast"
        subtitle="Gestión de ejercicios de proyección presupuestaria"
        action={<ForecastListHeaderActions tab={tab} onTabChange={onTabChange} hasActivo={hasActivo} onOpenConfiguraciones={onOpenConfiguraciones} onCerrar={onCerrar} />}
      />
    </>
  )
}
