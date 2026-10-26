import { useState } from 'react'
import { Alert, Button, BulkUploadDropzone, Drawer, Icon } from '@/shared/ui'
import { parseImportFile, type ImportResult } from '../lib/parse-import'
import { exportPlantillaImportacionXlsx } from '../lib/export-ingresos'

type Status = 'idle' | 'procesando' | 'listo' | 'error-archivo'

function ImportResultSummary({ result }: { result: ImportResult }) {
  return (
    <div className="mt-4 space-y-2.5">
      <Alert variant="success" icon="check" title={<strong className="font-bold">{result.validCount} filas válidas</strong>} />
      {result.errorCount > 0 && (
        <Alert variant="error" title={<strong className="font-bold">{result.errorCount} filas con error</strong>}>
          <div className="max-h-[280px] space-y-1 overflow-y-auto">
            {result.rows
              .filter((r) => !r.ok)
              .map((r) => (
                <div key={r.fila}>
                  <span className="font-bold">Fila {r.fila}:</span> {r.error}
                </div>
              ))}
          </div>
        </Alert>
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
        <Alert variant="error" className="mt-4" title="No se pudo leer el archivo">
          Verifica que sea un Excel (.xlsx/.xls) o CSV válido.
        </Alert>
      )}

      {status === 'listo' && result && <ImportResultSummary result={result} />}
    </Drawer>
  )
}
