import { useEffect, useState } from 'react'
import { Modal } from './modal'
import { Button } from './button'
import { Icon } from './icon'

interface SummaryRow {
  label: string
  value: string
}

interface EnviarCdGModalProps {
  open: boolean
  onClose: () => void
  rows: SummaryRow[]
  onConfirmed: () => void
}

type Phase = 'confirm' | 'loading'

export function EnviarCdGModal({ open, onClose, rows, onConfirmed }: EnviarCdGModalProps) {
  const [phase, setPhase] = useState<Phase>('confirm')

  useEffect(() => {
    if (open) setPhase('confirm')
  }, [open])

  const handleConfirm = () => {
    setPhase('loading')
    setTimeout(() => {
      onClose()
      onConfirmed()
    }, 1200)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Enviar a Control de Gestión"
      width={480}
      closeDisabled={phase === 'loading'}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={phase === 'loading'} className="disabled:opacity-50">
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirm} disabled={phase === 'loading'} className="disabled:opacity-50">
            Sí, enviar
          </Button>
        </>
      }
    >
      {phase === 'confirm' ? (
        <>
          <div className="mb-4 text-[15px] font-bold text-primary">¿Estás seguro que deseas enviar a Control de Gestión?</div>
          <div className="divide-y divide-border border-y border-border">
            {rows.map((r) => (
              <div key={r.label} className="flex items-baseline justify-between py-2">
                <span className="text-[13px] text-cs-gris-oscuro">{r.label}</span>
                <span className="text-[13.5px] font-bold text-foreground">{r.value}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3.5 p-[24px_0]">
          <div className="size-8 animate-spin rounded-full border-[3px] border-border-strong border-t-primary" />
          <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Icon name="send" size={13} color="#0047B0" /> Enviando información...
          </div>
        </div>
      )}
    </Modal>
  )
}
