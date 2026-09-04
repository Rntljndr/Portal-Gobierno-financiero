import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Breadcrumb, BulkUploadDrawer, Button, PageHeader, Toast } from '@/shared/ui'
import { useToast } from '@/shared/lib/use-toast'
import { PeriodoCard, ForecastCard } from './components/periodo-forecast-cards'
import { IpcCard } from './components/ipc-card'
import { CotizacionesCard } from './components/cotizaciones-card'
import { useConfiguraciones } from './lib/use-configuraciones'

export function ConfiguracionesPage() {
  const navigate = useNavigate()
  const state = useConfiguraciones()
  const [showImportar, setShowImportar] = useState(false)
  const { message, showToast } = useToast()

  return (
    <div className="h-full overflow-y-auto">
      <Breadcrumb
        items={[
          { label: 'SIP', to: '/' },
          { label: 'Presupuesto', to: '/ejercicios' },
          { label: 'Ejercicios', to: '/ejercicios' },
          { label: 'Mis Servicios', to: '/ejercicios/mis-servicios' },
          { label: 'Configuraciones' },
        ]}
      />
      <PageHeader title="Configuraciones" subtitle="Edita y actualiza la información de Fecha del ejercicio, IPC, Forecast y Cotizaciones." />

      <div className="grid grid-cols-2 gap-4 p-[0_32px_16px]">
        <PeriodoCard fechaInicio={state.fechaInicio} fechaFin={state.fechaFin} onFechaInicio={state.setFechaInicio} onFechaFin={state.setFechaFin} />
        <ForecastCard />
      </div>

      <div className="p-[0_32px_16px]">
        <IpcCard ipc={state.ipc} onChange={state.onIpcChange} />
      </div>

      <div className="p-[0_32px_16px]">
        <CotizacionesCard cotizaciones={state.cotizaciones} onSaveRow={state.onCotizacionSave} onImportar={() => setShowImportar(true)} />
      </div>

      <div className="flex justify-end gap-2 border-t border-border bg-white p-[16px_32px_28px]">
        <Button variant="outline" onClick={() => navigate('/ejercicios/mis-servicios')}>
          Volver
        </Button>
        <Button
          variant="primary"
          disabled={!state.hasChanges || state.saving}
          className="disabled:opacity-50"
          onClick={() => state.save(() => showToast('Configuración actualizada correctamente'))}
        >
          {state.saving ? 'Guardando...' : 'Actualizar →'}
        </Button>
      </div>

      <BulkUploadDrawer
        open={showImportar}
        onClose={() => setShowImportar(false)}
        title="Importar cotizaciones"
        applyLabel="Aplicar importación"
        onApplied={() => {
          setShowImportar(false)
          showToast('Cotizaciones importadas correctamente.')
        }}
      />
      <Toast message={message} />
    </div>
  )
}
