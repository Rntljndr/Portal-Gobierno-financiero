import { BulkUploadDrawer, EnviarCdGModal } from '@/shared/ui'
import type { Servicio } from '@/data/services'
import { CrearServicioModal } from './crear-servicio-modal'
import { DownloadModal } from './download-modal'

export type OpenModal = null | 'crear' | 'cargaMasiva' | 'edicionMasiva' | 'descargar' | 'enviarCdG'

interface MisServiciosModalsProps {
  openModal: OpenModal
  onClose: () => void
  seleccionados: Servicio[]
  onCreated: (s: Servicio) => void
  onBulkApplied: (count: number) => void
  onDownloaded: () => void
  onSendConfirmed: () => void
}

export function MisServiciosModals({
  openModal, onClose, seleccionados, onCreated, onBulkApplied, onDownloaded, onSendConfirmed,
}: MisServiciosModalsProps) {
  return (
    <>
      <CrearServicioModal open={openModal === 'crear'} onClose={onClose} onCreated={onCreated} />
      <BulkUploadDrawer
        open={openModal === 'cargaMasiva' || openModal === 'edicionMasiva'}
        title={openModal === 'edicionMasiva' ? 'Edición masiva' : 'Crear PEP N4 masivamente'}
        applyLabel={openModal === 'edicionMasiva' ? 'Aplicar edición masiva' : 'Aplicar carga masiva'}
        onClose={onClose}
        onApplied={onBulkApplied}
      />
      <DownloadModal open={openModal === 'descargar'} onClose={onClose} onDownloaded={onDownloaded} />
      <EnviarCdGModal
        open={openModal === 'enviarCdG'}
        onClose={onClose}
        rows={[
          { label: 'Servicios seleccionados', value: String(seleccionados.length) },
          { label: 'PEPs', value: String(seleccionados.length) },
        ]}
        onConfirmed={onSendConfirmed}
      />
    </>
  )
}
