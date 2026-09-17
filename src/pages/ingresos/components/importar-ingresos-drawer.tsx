import { useState } from 'react'
import { Button, BulkUploadDropzone, Drawer, Icon } from '@/shared/ui'
import { parseImportFile, type ImportResult } from '../lib/parse-import'
import { exportPlantillaImportacionXlsx } from '../lib/export-ingresos'

type Status = 'idle' | 'procesando' | 'listo' | 'error-archivo'

function ImportResultSummary({ result }: { result: ImportResult }) {
  return (
    <div className="mt-4 space-y-2.5">
      <div className="flex items-center gap-1.5 rounded-lg border border-success-line bg-success-surface p-3 text-[13px] font-bold text-success">
        <Icon name="check" size={14} color="#067647" /> {result.validCount} filas válidas
        {result.errorCount > 0 && ` · ${result.errorCount} con error`}
      </div>
      {result.errorCount > 0 && (
        <div className="max-h-[320px] space-y-1.5 overflow-y-auto rounded-lg border border-destructive-line bg-destructive-surface p-3">
          {result.rows
            .filter((r) => !r.ok)
            .map((r) => (
              <div key={r.fila} className="text-xs text-destructive">
                <span className="font-bold">Fila {r.fila}:</span> {r.error}
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

interface ImportarIngresosDrawerProps {
  open: boolean
  onClose: () => void
  ejercicio: number
  onAplicar: (items: { bandera: string; meses: Record<string, number> }[]) => void
}

export function ImportarIngresosDrawer({ open, onClose, ejercicio, onAplicar }: ImportarIngresosDrawerProps) {
  const [fileName, setFileName] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<ImportResult | null>(null)

  const reset = () => {
    setFileName('')
    setStatus('idle')
    setResult(null)
  }

  const handleFile = async (file: File) => {
    setFileName(file.name)
    setStatus('procesando')
    try {
      const parsed = await parseImportFile(file)
      setResult(parsed)
      setStatus('listo')
    } catch {
      setStatus('error-archivo')
    }
  }

  const handleAplicar = () => {
    if (!result) return
    const items = result.rows.filter((r) => r.ok && r.meses).map((r) => ({ bandera: r.bandera, meses: r.meses! }))
    onAplicar(items)
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
      title="Importar ingresos"
      subtitle={`Ejercicio ${ejercicio} — identifica cada bandera por su nombre exacto`}
      wide
      closeDisabled={status === 'procesando'}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={status === 'procesando'} className="disabled:opacity-50">
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAplicar} disabled={status !== 'listo' || result?.validCount === 0} className="disabled:opacity-50">
            Aplicar carga masiva
          </Button>
        </>
      }
    >
      <BulkUploadDropzone
        fileName={fileName}
        disabled={status === 'procesando'}
        onFile={handleFile}
        accept=".xlsx,.xls,.csv"
        hint="Formato aceptado: .xlsx, .xls o .csv — columna 1 Bandera, columnas 2 a 13 Ene a Dic"
      />

      <button
        type="button"
        onClick={exportPlantillaImportacionXlsx}
        className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-primary hover:underline"
      >
        <Icon name="download" size={13} color="#0047B0" /> Descargar plantilla
      </button>

      {status === 'procesando' && (
        <div className="mt-4 flex items-center gap-2.5 text-[13px] text-cs-gris-oscuro">
          <div className="size-4 animate-spin rounded-full border-2 border-border-strong border-t-primary" />
          Procesando archivo...
        </div>
      )}

      {status === 'error-archivo' && (
        <div className="mt-4 rounded-lg border border-destructive-line bg-destructive-surface p-3.5 text-[13px] text-destructive">
          No se pudo leer el archivo. Verificá que sea un Excel (.xlsx/.xls) o CSV válido.
        </div>
      )}

      {status === 'listo' && result && <ImportResultSummary result={result} />}
    </Drawer>
  )
}
