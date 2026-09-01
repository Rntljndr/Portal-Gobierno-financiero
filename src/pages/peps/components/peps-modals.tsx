import { BulkUploadModal } from '@/shared/ui'

export type OpenPepModal = null | 'crearN4Masivo' | 'crearN7Masivo' | 'editarEquipo' | 'asignarCecos'

interface PepsModalsProps {
  openModal: OpenPepModal
  onClose: () => void
  onApplied: (count: number) => void
}

const CONFIG: Record<NonNullable<OpenPepModal>, { title: string; applyLabel: string }> = {
  crearN4Masivo: { title: 'Crear PEP N4 masivamente', applyLabel: 'Aplicar carga masiva' },
  crearN7Masivo: { title: 'Crear PEP N7 masivamente', applyLabel: 'Aplicar carga masiva' },
  editarEquipo: { title: 'Editar equipo masivamente', applyLabel: 'Aplicar cambios' },
  asignarCecos: { title: 'Asignar centros de costo', applyLabel: 'Aplicar asignación' },
}

export function PepsModals({ openModal, onClose, onApplied }: PepsModalsProps) {
  const config = openModal ? CONFIG[openModal] : null

  return (
    <BulkUploadModal
      open={openModal !== null}
      onClose={onClose}
      title={config?.title ?? ''}
      applyLabel={config?.applyLabel ?? ''}
      onApplied={onApplied}
    />
  )
}
