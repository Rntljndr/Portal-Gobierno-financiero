import { Button, Toast } from '@/shared/ui'
import type { useForecastEditarN7Detalle } from '../lib/use-forecast-editar-n7-detalle'
import { ForecastDescartarCambiosModal } from './forecast-descartar-cambios-modal'

interface ForecastN7DetalleFooterProps {
  s: ReturnType<typeof useForecastEditarN7Detalle>
  readOnly: boolean
  onVolver: () => void
  onGuardarYVolver: () => void
  confirmVolverOpen: boolean
  onOpenConfirmVolver: () => void
  onCloseConfirmVolver: () => void
}

/** Barra de acciones (Volver/Guardar) + modal de descarte + toast — en un forecast anterior (F: "sin
 * ninguna acción de edición") solo queda "Volver", sin confirmación (no hay nada editable,
 * `hasChanges` siempre es false). Extraído aparte para mantener ForecastN7DetallePage bajo el límite
 * de líneas del linter. */
export function ForecastN7DetalleFooter({
  s,
  readOnly,
  onVolver,
  onGuardarYVolver,
  confirmVolverOpen,
  onOpenConfirmVolver,
  onCloseConfirmVolver,
}: ForecastN7DetalleFooterProps) {
  const pedirVolver = () => (s.hasChanges ? onOpenConfirmVolver() : onVolver())

  return (
    <>
      <div className="flex justify-end gap-2 border-t border-border bg-white p-[14px_32px]">
        <Button variant="outline" onClick={readOnly ? onVolver : pedirVolver}>
          Volver
        </Button>
        {!readOnly && (
          <Button variant="primary" onClick={onGuardarYVolver}>
            Guardar
          </Button>
        )}
      </div>

      {!readOnly && <ForecastDescartarCambiosModal open={confirmVolverOpen} onCancel={onCloseConfirmVolver} onConfirm={onVolver} />}

      <Toast message={s.message} />
    </>
  )
}
