import { useState } from 'react'
import { Modal } from './modal'
import { Button } from './button'
import { Icon } from './icon'
import { BulkUploadDropzone } from './bulk-upload-dropzone'

type Status = 'idle' | 'uploading' | 'success'

interface BulkUploadModalProps {
  open: boolean
  onClose: () => void
  onApplied: (count: number) => void
  title: string
  applyLabel: string
}

const FAKE_ERRORS = [
  { line: 3, msg: 'Falta el campo "Cuenta contable".' },
  { line: 7, msg: 'El valor de "País" no es válido.' },
]

export function BulkUploadModal({ open, onClose, onApplied, title, applyLabel }: BulkUploadModalProps) {
  const [fileName, setFileName] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const reset = () => {
    setFileName('')
    setStatus('idle')
  }

  const handleFile = (file: File) => {
    setFileName(file.name)
    setStatus('uploading')
    setTimeout(() => setStatus('success'), 900)
  }

  const handleApply = () => {
    onApplied(8)
    reset()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        reset()
        onClose()
      }}
      title={title}
      width={520}
      closeDisabled={status === 'uploading'}
      footer={
        <>
          <Button variant="outline" onClick={() => { reset(); onClose() }} disabled={status === 'uploading'} className="disabled:opacity-50">
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleApply} disabled={status !== 'success'} className="disabled:opacity-50">
            {applyLabel}
          </Button>
        </>
      }
    >
      <BulkUploadDropzone fileName={fileName} disabled={status === 'uploading'} onFile={handleFile} />

      {status === 'uploading' && (
        <div className="mt-4 flex items-center gap-2.5 text-[13px] text-cs-gris-oscuro">
          <div className="size-4 animate-spin rounded-full border-2 border-border-strong border-t-primary" />
          Procesando archivo...
        </div>
      )}

      {status === 'success' && (
        <div className="mt-4 rounded-lg border border-success-line bg-success-surface p-3.5">
          <div className="flex items-center gap-1.5 text-[13px] font-bold text-success">
            <Icon name="check" size={14} color="#067647" /> 8 filas procesadas correctamente
          </div>
          <div className="mt-2 space-y-1 border-t border-success-line pt-2">
            {FAKE_ERRORS.map((e) => (
              <div key={e.line} className="text-xs text-warning">
                Línea {e.line}: {e.msg}
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  )
}
