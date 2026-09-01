import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Breadcrumb, Button, Icon, PageHeader, Pagination, Toast } from '@/shared/ui'
import { useToast } from '@/shared/lib/use-toast'
import type { PepN4Row } from '@/data/peps'
import { PepsFilters } from './components/peps-filters'
import { PepsTable } from './components/peps-table'
import { CrearPepN4Drawer } from './components/crear-pep-n4-drawer'
import { PepsModals, type OpenPepModal } from './components/peps-modals'
import { usePeps } from './lib/use-peps'

export function PepsPage() {
  const navigate = useNavigate()
  const state = usePeps()
  const [openModal, setOpenModal] = useState<OpenPepModal>(null)
  const [showCrear, setShowCrear] = useState(false)
  const { message, showToast } = useToast()

  const goEditar = (row: PepN4Row) => navigate(`/ejercicios/mis-servicios/peps/${encodeURIComponent(row.pep)}`)

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <Breadcrumb
        items={[
          { label: 'SIP', to: '/' },
          { label: 'Presupuesto', to: '/ejercicios' },
          { label: 'Ejercicios', to: '/ejercicios' },
          { label: 'Mis Servicios', to: '/ejercicios/mis-servicios' },
          { label: 'ABM PEPS – Nivel 4' },
        ]}
      />
      <PageHeader title="ABM PEPS – Nivel 4" subtitle="Gestión de PEPs presupuestarios de Nivel 4" />

      <div className="mx-8 mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-[12.5px] text-muted-foreground">{state.totalFiltered} PEPs encontrados</span>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" disabled className="opacity-50">
            <Icon name="download" size={12} color="#0047B0" /> Descargar
          </Button>
          <Button variant="outline" size="sm" onClick={() => setOpenModal('crearN4Masivo')}>
            <Icon name="upload" size={12} color="#0047B0" /> Crear PEP N4 masivamente
          </Button>
          <Button variant="outline" size="sm" onClick={() => setOpenModal('crearN7Masivo')}>
            <Icon name="upload" size={12} color="#0047B0" /> Crear PEP N7 masivamente
          </Button>
          <Button variant="primary" size="sm" onClick={() => setOpenModal('editarEquipo')}>
            <Icon name="edit" size={12} color="#fff" /> Editar equipo
          </Button>
          <Button variant="primary" size="sm" onClick={() => setOpenModal('asignarCecos')}>
            <Icon name="edit" size={12} color="#fff" /> Asignar CeCos
          </Button>
          <Button
            size="sm"
            variant="onGreenCard"
            className="border-[#1F8A5B] bg-[#22976B] text-white hover:bg-[#1F8A5B]"
            onClick={() => setShowCrear(true)}
          >
            <Icon name="plus" size={13} color="#fff" /> Crear PEP N4
          </Button>
        </div>
      </div>

      <PepsFilters filters={state.filters} onChange={state.onChangeFilter} onClear={state.clearFilters} activeCount={state.activeFilterCount} />

      <PepsTable rows={state.paged} sortCol={state.sortCol} sortDir={state.sortDir} onSort={state.onSort} onEdit={goEditar} />

      <Pagination
        page={state.page}
        totalPages={state.totalPages}
        totalItems={state.totalFiltered}
        pageSize={state.pageSize}
        onPageChange={state.setPage}
        itemLabel="PEPs"
      />

      <CrearPepN4Drawer
        open={showCrear}
        onClose={() => setShowCrear(false)}
        onCreated={(row) => {
          state.addPep(row)
          showToast('PEP N4 creado exitosamente.')
        }}
      />
      <PepsModals
        openModal={openModal}
        onClose={() => setOpenModal(null)}
        onApplied={(count) => {
          setOpenModal(null)
          showToast(`${count} filas aplicadas correctamente.`)
        }}
      />
      <Toast message={message} />
    </div>
  )
}
