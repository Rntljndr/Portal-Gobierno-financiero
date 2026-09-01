import { useEffect, useState } from 'react'
import { Button, Modal } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'

interface EliminarForecastModalProps {
  round: ForecastRound | null
  onClose: () => void
  onConfirm: () => void
}

export function EliminarForecastModal({ round, onClose, onConfirm }: EliminarForecastModalProps) {
  const [confirmText, setConfirmText] = useState('')

  useEffect(() => {
    if (!round) setConfirmText('')
  }, [round])

  const canDelete = confirmText === 'ELIMINAR'

  return (
    <Modal
      open={round !== null}
      onClose={onClose}
      title="Eliminar Forecast"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" disabled={!canDelete} className="bg-[#B42318] hover:bg-[#961d14] disabled:opacity-40" onClick={onConfirm}>
            Eliminar definitivamente
          </Button>
        </>
      }
    >
      <div className="mb-4 rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-[10px_14px] text-[12px] leading-relaxed text-[#B42318]">
        Eliminar este forecast es irreversible y puede afectar comparaciones históricas en reportería.
      </div>
      <p className="mb-3 text-[13px] text-cs-gris-oscuro">
        Escribe <strong className="text-foreground">ELIMINAR</strong> para confirmar:
      </p>
      <input
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        placeholder="ELIMINAR"
        className="h-10 w-full rounded-lg border border-border bg-white px-3 text-[13px] outline-none focus:border-primary"
      />
    </Modal>
  )
}
