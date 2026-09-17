import { useRef, useState } from 'react'
import { Icon } from './icon'
import { cn } from '@/shared/lib/utils'

interface BulkUploadDropzoneProps {
  fileName: string
  disabled: boolean
  onFile: (file: File) => void
  /** Extensiones aceptadas por el input y el drop — por defecto solo `.csv`, como usan el resto de los ABMs. */
  accept?: string
  /** Texto de ayuda bajo el nombre de formato — por defecto "Formato aceptado: .csv". */
  hint?: string
}

export function BulkUploadDropzone({ fileName, disabled, onFile, accept = '.csv', hint = 'Formato aceptado: .csv' }: BulkUploadDropzoneProps) {
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        if (!disabled) setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragOver(false)
        if (!disabled && e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0])
      }}
      className={cn(
        'flex flex-col items-center gap-2.5 rounded-xl border-2 border-dashed p-8 text-center transition-colors',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        dragOver ? 'border-primary bg-primary/5' : 'border-border-strong bg-[#F8FAFC]',
      )}
    >
      <Icon name="upload" size={22} color="#0047B0" />
      <div className="text-[13px] font-semibold text-foreground">
        {fileName || 'Arrastrá tu archivo CSV aquí, o hacé clic para elegirlo'}
      </div>
      <div className="text-xs text-muted-foreground">{hint}</div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) onFile(e.target.files[0])
          e.target.value = ''
        }}
      />
    </div>
  )
}
