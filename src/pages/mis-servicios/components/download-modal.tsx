import { useState } from 'react'
import { Modal, Button, Select } from '@/shared/ui'

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
      <Select value={choice} onChange={setChoice} options={OPTIONS} disabled={loading} placeholder="Selecciona el tipo de descarga" />
    </Modal>
  )
}
