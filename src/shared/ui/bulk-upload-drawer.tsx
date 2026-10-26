import { useState } from 'react'
import { Drawer } from './drawer'
import { Button } from './button'
import { Icon } from './icon'
import { Alert } from './alert'
import { BulkUploadDropzone } from './bulk-upload-dropzone'

type Status = 'idle' | 'uploading' | 'success'

interface BulkUploadDrawerProps {
  open: boolean
  onClose: () => void
  onApplied: (count: number) => void
  title: string
  applyLabel: string
  /** Texto bajo el título, p.ej. "Sube un archivo .xlsx con los PEP N7 a crear." */
  subtitle?: string
  /** Callout informativo opcional sobre la mecánica de la carga (p.ej. en qué ejercicios se crea cada fila). */
  infoNote?: string
  /** Si se pasa, muestra el link "Descargar template" bajo el dropzone. */
  onDownloadTemplate?: () => void
  accept?: string
  hint?: string
}

const FAKE_ERRORS = [
  { line: 3, msg: 'Falta el campo "Cuenta contable".' },
  { line: 7, msg: 'El valor de "País" no es válido.' },
]

export function BulkUploadDrawer({ open, onClose, onApplied, title, applyLabel, subtitle, infoNote, onDownloadTemplate, accept, hint }: BulkUploadDrawerProps) {
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
    <Drawer
      open={open}
      onClose={() => {
        reset()
        onClose()
      }}
      title={title}
      subtitle={subtitle}
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
      {infoNote && (
        <Alert variant="info" className="mb-4" title={infoNote} />
      )}

      <BulkUploadDropzone fileName={fileName} disabled={status === 'uploading'} onFile={handleFile} accept={accept} hint={hint} />

      {onDownloadTemplate && (
        <button
          type="button"
          onClick={onDownloadTemplate}
          className="mt-3 flex items-center gap-1.5 text-[12.5px] font-semibold text-primary hover:underline"
        >
          <Icon name="download" size={12} color="#0047B0" /> Descargar template
        </button>
      )}

      {status === 'uploading' && (
        <div className="mt-4 flex items-center gap-2.5 text-[13px] text-cs-gris-oscuro">
          <div className="size-4 animate-spin rounded-full border-2 border-border-strong border-t-primary" />
          Procesando archivo...
        </div>
      )}

      {status === 'success' && (
        <Alert variant="success" icon="check" className="mt-4" title={<strong className="font-bold">8 filas procesadas correctamente</strong>}>
          {FAKE_ERRORS.map((e) => (
            <div key={e.line} className="text-warning">
              Línea {e.line}: {e.msg}
            </div>
          ))}
        </Alert>
      )}
    </Drawer>
  )
}
