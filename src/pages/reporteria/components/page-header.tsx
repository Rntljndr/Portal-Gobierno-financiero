import { Badge, Breadcrumb, Icon } from '@/shared/ui'
import { forecastVersions } from '../lib/filter-catalog'
import { useSavedConfigs } from '../lib/use-saved-configs'
import { ConfiguracionesButton } from './configuraciones-button'

interface ReporteriaHeaderProps {
  forecastVersion: string
  savedConfigsState: ReturnType<typeof useSavedConfigs>
}

export function ReporteriaHeader({ forecastVersion, savedConfigsState }: ReporteriaHeaderProps) {
  const forecastLabel = forecastVersions.find((f) => f.value === forecastVersion)?.label ?? forecastVersion

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'SIP', to: '/' },
          { label: 'Presupuesto', to: '/ejercicios' },
          { label: 'Ejercicios', to: '/ejercicios' },
          { label: 'Reportería 2027' },
        ]}
      />
      <div className="flex items-start justify-between p-[10px_32px_20px]">
        <div>
          <div className="text-[26px] leading-tight font-bold tracking-tight text-primary">Reportería próximo ejercicio 2027</div>
          <div className="mt-1 text-[13px] text-muted-foreground">Análisis en tiempo real del ejercicio presupuestario en curso</div>
        </div>
        <div className="flex items-center gap-2.5">
          <Badge variant="primary">
            <Icon name="calendar" size={14} color="currentColor" />
            {forecastLabel}
          </Badge>
          <ConfiguracionesButton
            savedConfigs={savedConfigsState.savedConfigs}
            onLoad={savedConfigsState.onLoad}
            onSave={savedConfigsState.onSave}
            onDelete={savedConfigsState.onDelete}
          />
        </div>
      </div>
    </>
  )
}
