import { BulkUploadModal, Button, Modal } from '@/shared/ui'
import type { PepN4Row, PepN7Row } from '@/data/peps'
import { CuentaContableDrawer } from './cuenta-contable-drawer'
import { CrearEditarPepN7Drawer } from './crear-editar-pep-n7-drawer'

interface PepN7ModalsProps {
  pep: PepN4Row
  cuentaOpen: boolean
  onCuentaClose: () => void
  onCuentaCreated: (cuenta: string) => void
  n7DrawerOpen: boolean
  onN7DrawerClose: () => void
  n7Editing: PepN7Row | null
  onN7Submit: (form: { bandera: string; destino: string; ceco: string }) => void
  masivoOpen: boolean
  onMasivoClose: () => void
  onMasivoApplied: (count: number) => void
  deleteRow: PepN7Row | null
  onDeleteCancel: () => void
  onDeleteConfirm: () => void
  lastRowModal: boolean
  onLastRowClose: () => void
}

export function PepN7Modals({
  pep,
  cuentaOpen, onCuentaClose, onCuentaCreated,
  n7DrawerOpen, onN7DrawerClose, n7Editing, onN7Submit,
  masivoOpen, onMasivoClose, onMasivoApplied,
  deleteRow, onDeleteCancel, onDeleteConfirm,
  lastRowModal, onLastRowClose,
}: PepN7ModalsProps) {
  return (
    <>
      <CuentaContableDrawer open={cuentaOpen} onClose={onCuentaClose} pep={pep} onCreated={onCuentaCreated} />

      <CrearEditarPepN7Drawer open={n7DrawerOpen} onClose={onN7DrawerClose} editing={n7Editing} pepCodigo={pep.pep} onSubmit={onN7Submit} />

      <BulkUploadModal open={masivoOpen} onClose={onMasivoClose} title="Crear PEP N7 masivamente" applyLabel="Aplicar carga masiva" onApplied={onMasivoApplied} />

      <Modal
        open={deleteRow !== null}
        onClose={onDeleteCancel}
        title="¿Eliminar PEP N7?"
        footer={
          <>
            <Button variant="outline" onClick={onDeleteCancel}>
              Cancelar
            </Button>
            <Button variant="primary" className="bg-[#dc3545] hover:bg-[#c82333]" onClick={onDeleteConfirm}>
              Sí, eliminar
            </Button>
          </>
        }
      >
        <p className="text-[14px] leading-relaxed text-cs-gris-oscuro">
          Estás a punto de eliminar <strong className="text-foreground">"{deleteRow?.servicio}"</strong>. ¿Estás seguro de realizar esta acción?
        </p>
      </Modal>

      <Modal
        open={lastRowModal}
        onClose={onLastRowClose}
        title="Acción no permitida"
        footer={
          <Button variant="primary" onClick={onLastRowClose}>
            Volver
          </Button>
        }
      >
        <p className="text-[14px] leading-relaxed text-cs-gris-oscuro">
          No es posible generar esta acción desde este nivel. Para eliminar el PEP N7, elimina el servicio completo PEP N4.
        </p>
      </Modal>
    </>
  )
}
