import { useState } from 'react'
import { Button, Icon, Modal } from '@/shared/ui'
import { downloadReporteriaXlsx, type DownloadOptions } from '../lib/download-xlsx'

const OPTS: { key: keyof DownloadOptions; label: string }[] = [
  { key: 'plan', label: 'Plan' },
  { key: 'forecastBase', label: 'Forecast base' },
  { key: 'forecastIpc', label: 'Forecast base + IPC' },
]

interface DescargarModalProps {
  open: boolean
  onClose: () => void
}

export function DescargarModal({ open, onClose }: DescargarModalProps) {
  const [options, setOptions] = useState<DownloadOptions>({ plan: true, forecastBase: false, forecastIpc: false })
  const anyChecked = options.plan || options.forecastBase || options.forecastIpc

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Seleccionar tipo de descarga"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            disabled={!anyChecked}
            className="disabled:opacity-50"
            onClick={() => {
              downloadReporteriaXlsx(options)
              onClose()
            }}
          >
            <Icon name="download" size={13} color="#fff" /> Descargar Excel
          </Button>
        </>
      }
    >
      <div className="flex flex-col">
        {OPTS.map((opt) => {
          const checked = options[opt.key]
          return (
            <label key={opt.key} className="flex cursor-pointer items-center gap-3 border-b border-border py-3 last:border-b-0">
              <input type="checkbox" checked={checked} onChange={() => setOptions((prev) => ({ ...prev, [opt.key]: !prev[opt.key] }))} className="size-4 accent-primary" />
              <span className={checked ? 'text-[13.5px] font-semibold text-foreground' : 'text-[13.5px] text-cs-gris-oscuro'}>{opt.label}</span>
            </label>
          )
        })}
      </div>
    </Modal>
  )
}
