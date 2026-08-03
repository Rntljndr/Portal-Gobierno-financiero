import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Toast } from '@/shared/ui'
import { useToast } from '@/shared/lib/use-toast'
import { MisServiciosHeader } from './components/page-header'
import { DeadlineBanner } from './components/deadline-banner'
import { EditElementsTabs } from './components/edit-elements-tabs'
import { FilterBar } from './components/filter-bar'
import { CountryBudgetPanel } from './components/country-budget-panel'
import { ServicesSection } from './components/services-section'
import { SendBar } from './components/send-bar'
import { MisServiciosModals, type OpenModal } from './components/mis-servicios-modals'
import { useMisServicios } from './lib/use-mis-servicios'

export function MisServiciosPage() {
  const navigate = useNavigate()
  const [showDeadline, setShowDeadline] = useState(true)
  const deadline = useMemo(() => Date.now() + 10 * 86400000 + 12 * 3600000, [])
  const state = useMisServicios()
  const [openModal, setOpenModal] = useState<OpenModal>(null)
  const { message, showToast } = useToast()

  const serviciosSeleccionados = state.filteredAll.filter((s) => state.selectedIds.has(s.id))

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <MisServiciosHeader />
        {showDeadline && <DeadlineBanner deadline={deadline} onDismiss={() => setShowDeadline(false)} />}
        <EditElementsTabs />
        <FilterBar filters={state.filters} onChange={state.onChangeFilter} onClear={state.clearFilters} />
        <CountryBudgetPanel services={state.filteredAll} />
        <ServicesSection
          state={state}
          onOpenModal={setOpenModal}
          onOpenServicio={(s) => navigate(`/ejercicios/mis-servicios/${s.id}`)}
        />
      </div>
      <SendBar selectedCount={state.selectedIds.size} onSend={() => setOpenModal('enviarCdG')} />

      <MisServiciosModals
        openModal={openModal}
        onClose={() => setOpenModal(null)}
        seleccionados={serviciosSeleccionados}
        onCreated={(s) => {
          state.addServicios([s])
          showToast('PEP creado exitosamente.')
        }}
        onBulkApplied={(count) => showToast(`${count} filas aplicadas correctamente.`)}
        onDownloaded={() => showToast('Descarga completada.')}
        onSendConfirmed={() => {
          state.sendSelected()
          showToast('Información enviada exitosamente.')
        }}
      />
      <Toast message={message} />
    </div>
  )
}
