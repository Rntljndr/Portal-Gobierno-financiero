import { cn } from '@/shared/lib/utils'
import { Button, Icon } from '@/shared/ui'
import { forecastMeses, forecastPaisesMoneda, FORECAST_MES_ACTUAL } from '@/data/forecast'

interface TasasCambioTableProps {
  value: Record<string, string[]>
  onChange?: (moneda: string, mesIndex: number, valor: string) => void
  readOnly?: boolean
}

export function TasasCambioTable({ value, onChange, readOnly = false }: TasasCambioTableProps) {
  const th = 'p-[9px_10px] text-[11px] font-bold text-cs-gris-oscuro uppercase tracking-[0.04em] text-left border-b border-border whitespace-nowrap'

  return (
    <div className="rounded-xl border border-border bg-white p-[20px_24px]">
      <div className="mb-4 flex items-start justify-between border-b border-border pb-3.5">
        <div>
          <div className="text-[13px] font-bold text-foreground">Tasas de Cambio</div>
          <div className="mt-0.5 text-[11.5px] text-muted-foreground">
            {readOnly ? 'Tasas utilizadas al crear este forecast' : 'Los meses históricos se precargaron automáticamente y no son editables'}
          </div>
        </div>
        <div className="flex gap-2">
          {!readOnly && (
            <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong bg-white px-3 py-[7px] text-xs font-semibold text-primary hover:bg-[#F4F7FE]">
              <Icon name="upload" size={12} color="#0047B0" /> Importar
            </button>
          )}
          <Button variant="outline" size="sm">
            <Icon name="download" size={12} color="#0047B0" /> Descargar
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className={cn(th, 'sticky left-0 z-[1] bg-[#F4F6FB]')}>País</th>
              <th className={cn(th, 'bg-[#F4F6FB]')}>Moneda</th>
              {forecastMeses.map((mes, i) => {
                const isHist = i < FORECAST_MES_ACTUAL
                return (
                  <th
                    key={mes}
                    className={cn('min-w-[72px] p-[9px_10px] text-center text-[11px] font-bold whitespace-nowrap', isHist ? 'bg-[#F4F6FB] text-muted-foreground' : 'bg-primary/[0.04] text-primary', i === FORECAST_MES_ACTUAL && 'border-l-2 border-l-primary/20')}
                  >
                    {mes}
                    {i === FORECAST_MES_ACTUAL && <div className="text-[9px] font-medium text-primary normal-case">▶ Proyección</div>}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {forecastPaisesMoneda.map((p) => {
              const tasas = value[p.moneda] ?? []
              return (
                <tr key={p.pais} className="border-b border-[#F0F4FA]">
                  <td className="sticky left-0 z-[1] bg-white p-[10px_14px] text-[12.5px] font-semibold whitespace-nowrap text-foreground">{p.pais}</td>
                  <td className="p-[10px_10px] text-[12.5px] font-bold text-primary">{p.moneda}</td>
                  {forecastMeses.map((_, mi) => {
                    const isHist = mi < FORECAST_MES_ACTUAL
                    const editable = !readOnly && !isHist
                    return (
                      <td key={mi} className={cn('p-[10px_10px] text-center', isHist ? 'bg-primary/[0.03]' : 'bg-white', mi === FORECAST_MES_ACTUAL && 'border-l-2 border-l-primary/20')}>
                        {editable ? (
                          <input
                            type="number"
                            step="0.01"
                            value={tasas[mi] ?? ''}
                            placeholder="0.00"
                            onChange={(e) => onChange?.(p.moneda, mi, e.target.value)}
                            className="w-[72px] rounded-md border border-border px-1.5 py-1 text-right text-xs outline-none focus:border-primary"
                          />
                        ) : (
                          <span title={isHist ? 'Tasa real — no editable' : undefined} className="font-mono text-[12.5px] tabular-nums text-cs-gris-oscuro">
                            {tasas[mi] ?? ''}
                          </span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
