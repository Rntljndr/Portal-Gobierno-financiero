import { Alert, Button, BulkUploadDropzone, Drawer, Icon } from '@/shared/ui'
import { formatForecastAmount } from '../lib/format-forecast-amount'
import type { useForecastCargaMasiva } from '../lib/use-forecast-carga-masiva'

interface ForecastCargaMasivaDrawerProps {
  cm: ReturnType<typeof useForecastCargaMasiva>
  onDownloadTemplate: () => void
}

export function ForecastCargaMasivaDrawer({ cm, onDownloadTemplate }: ForecastCargaMasivaDrawerProps) {
  return (
    <Drawer open={cm.open} onClose={cm.closeDrawer} wide eyebrow="Forecast" title="Carga masiva">
      <div className="mb-5 flex items-center justify-between rounded-lg border border-border bg-[#F8F9FD] p-3">
        <div className="text-[12.5px] text-cs-gris-oscuro">1. Descargá el template con las líneas de este forecast.</div>
        <Button variant="outline" size="sm" onClick={onDownloadTemplate}>
          <Icon name="download" size={12} color="#0047B0" /> Descargar template
        </Button>
      </div>

      {(cm.step === 'idle' || cm.step === 'parsing') && (
        <>
          <div className="mb-2 text-[12.5px] font-semibold text-cs-gris-oscuro">2. Completalo y volvé a subirlo</div>
          <BulkUploadDropzone
            fileName={cm.fileName || 'Arrastrá tu archivo .xlsx aquí, o hacé clic para elegirlo'}
            disabled={cm.step === 'parsing'}
            onFile={cm.onFile}
            accept=".xlsx"
            hint="Formato aceptado: .xlsx (mismo template descargado arriba)"
          />
        </>
      )}

      {cm.step === 'result' && cm.result && <ResultView result={cm.result} />}

      {cm.step === 'done' && (
        <Alert variant="success" icon="check" title="Carga masiva aplicada correctamente." />
      )}

      <div className="mt-6 flex justify-end gap-2.5">
        {cm.step === 'result' && cm.result && cm.result.errorCount > 0 && (
          <Button variant="outline" onClick={cm.reintentar}>
            <Icon name="upload" size={12} color="#0047B0" /> Subir otro archivo
          </Button>
        )}
        {cm.step === 'result' && cm.result?.errorCount === 0 && (
          <Button variant="primary" onClick={cm.confirmar}>
            Confirmar carga ({cm.result.validCount} líneas)
          </Button>
        )}
        {(cm.step === 'result' || cm.step === 'done') && <Button variant="outline" onClick={cm.closeDrawer}>{cm.step === 'done' ? 'Cerrar' : 'Cancelar'}</Button>}
      </div>
    </Drawer>
  )
}

function ResultView({ result }: { result: NonNullable<ReturnType<typeof useForecastCargaMasiva>['result']> }) {
  if (result.errorCount > 0) {
    return (
      <div>
        <Alert
          variant="error"
          className="mb-2"
          title={
            <>
              <strong className="font-bold">
                {result.errorCount} fila{result.errorCount === 1 ? '' : 's'} con errores
              </strong>{' '}
              — no se aplicó ningún cambio
            </>
          }
        >
          Corrige el archivo y vuelve a subirlo.
        </Alert>
        <div className="max-h-[320px] overflow-y-auto rounded-lg border border-border">
          {result.rows
            .filter((r) => !r.ok)
            .map((r) => (
              <div key={`${r.fila}-${r.n4Codigo}-${r.n7Codigo}`} className="border-b border-border p-[8px_10px] text-[12px] last:border-0">
                <span className="font-semibold text-foreground">Fila {r.fila}</span> <span className="text-muted-foreground">({r.n4Codigo || '—'} / {r.n7Codigo || '—'})</span>
                <div className="text-destructive">{r.error}</div>
              </div>
            ))}
        </div>
      </div>
    )
  }

  const preview = result.preview
  if (!preview) return null
  const delta = preview.totalDespues - preview.totalAntes

  return (
    <div>
      <div className="mb-3 grid grid-cols-3 gap-3">
        <SummaryBox label="Total antes" value={formatForecastAmount(preview.totalAntes)} />
        <SummaryBox label="Total después" value={formatForecastAmount(preview.totalDespues)} />
        <SummaryBox label="Diferencia" value={`${delta >= 0 ? '+' : ''}${formatForecastAmount(delta)}`} accent={delta !== 0} />
      </div>
      <div className="mb-2 text-[11px] font-bold tracking-[0.04em] text-muted-foreground uppercase">{preview.lineas.length} líneas afectadas</div>
      <div className="max-h-[280px] overflow-y-auto rounded-lg border border-border">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-[#F4F6FB] text-left text-[10.5px] font-bold text-muted-foreground uppercase">
              <th className="p-[8px_10px]">Línea</th>
              <th className="p-[8px_10px] text-right">Antes</th>
              <th className="p-[8px_10px] text-right">Después</th>
            </tr>
          </thead>
          <tbody>
            {preview.lineas.map((l, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-[8px_10px] text-foreground">
                  {l.n4Nombre} <span className="text-muted-foreground">· {l.n7Nombre}</span>
                </td>
                <td className="p-[8px_10px] text-right tabular-nums text-muted-foreground">{formatForecastAmount(l.totalAntes)}</td>
                <td className="p-[8px_10px] text-right font-semibold tabular-nums text-foreground">{formatForecastAmount(l.totalDespues)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SummaryBox({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-[#F8F9FD] p-3">
      <div className="mb-1 text-[10px] font-bold tracking-[0.04em] text-muted-foreground uppercase">{label}</div>
      <div className={`text-[14px] font-bold ${accent ? 'text-primary' : 'text-foreground'}`}>{value}</div>
    </div>
  )
}
