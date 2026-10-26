import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { Badge, Breadcrumb, Button, Icon, PageHeader } from '@/shared/ui'
import { forecastVersions } from '../lib/filter-catalog'
import { useSavedConfigs } from '../lib/use-saved-configs'
import { ConfiguracionesButton } from './configuraciones-button'

interface ReporteriaHeaderProps {
  forecastVersion: string
  savedConfigsState: ReturnType<typeof useSavedConfigs>
  /** Dentro del Reporte de plan: tarjetas para cambiar de reporte (el encabezado pasa a ser el del plan). */
  selector?: ReactNode
}

export function ReporteriaHeader({ forecastVersion, savedConfigsState, selector }: ReporteriaHeaderProps) {
  const navigate = useNavigate()
  const forecastLabel = forecastVersions.find((f) => f.value === forecastVersion)?.label ?? forecastVersion

  return (
    <>
      <Breadcrumb
        items={
          selector
            ? [{ label: 'SIP', to: '/' }, { label: 'Reporte de plan' }]
            : [
                { label: 'SIP', to: '/' },
                { label: 'Presupuesto', to: '/ejercicios' },
                { label: 'Ejercicios', to: '/ejercicios' },
                { label: 'Reportería 2027' },
              ]
        }
      />
      <PageHeader
        title={selector ? 'Reporte de plan' : 'Reportería próximo ejercicio 2027'}
        subtitle={selector ? undefined : 'Análisis en tiempo real del ejercicio presupuestario en curso'}
        action={
          <>
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
            <Button variant="outline" size="sm" onClick={() => navigate('/reporteria-consolidada')}>
              <Icon name="view_cards" size={14} color="currentColor" /> Reportería Consolidada
            </Button>
          </>
        }
      />
      {selector && <div className="mx-8 mb-6">{selector}</div>}
    </>
  )
}
