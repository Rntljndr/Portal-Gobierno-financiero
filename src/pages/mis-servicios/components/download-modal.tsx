import { useState } from 'react'
import { Modal, Button } from '@/shared/ui'

const OPTIONS = [
  { value: 'n4', label: 'PEP N4' },
  { value: 'n7', label: 'PEP N7' },
  { value: 'sub', label: 'Sub PEP' },
]

interface DownloadModalProps {
  open: boolean
  onClose: () => void
  onDownloaded: () => void
}

export function DownloadModal({ open, onClose, onDownloaded }: DownloadModalProps) {
  const [choice, setChoice] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDownload = () => {
    if (!choice) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setChoice('')
      onClose()
      onDownloaded()
    }, 800)
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        setChoice('')
        onClose()
      }}
      title="Selecciona el tipo de descarga"
      closeDisabled={loading}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading} className="disabled:opacity-50">
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleDownload} disabled={!choice || loading} className="disabled:opacity-50">
            {loading ? 'Descargando...' : 'Descargar'}
          </Button>
        </>
      }
    >
      <div className="mb-4 text-[13.5px] leading-relaxed text-foreground">
        Podés realizar una descarga de documentos. Seleccioná el tipo de información que deseás descargar.
      </div>
      <select
        value={choice}
        onChange={(e) => setChoice(e.target.value)}
        disabled={loading}
        className="h-10 w-full rounded-lg border border-border bg-white px-3 text-[13px] outline-none focus:border-primary"
      >
        <option value="" disabled>
          Selecciona el tipo de descarga
        </option>
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Modal>
  )
}
