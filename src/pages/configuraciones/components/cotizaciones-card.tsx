import { Button, Icon } from '@/shared/ui'
import { meses, paisesCotizacion, type CotizacionesPorPais } from '@/data/configuraciones'
import { CotizacionesRow } from './cotizaciones-row'

const th = 'p-[10px_6px] text-right text-[11px] font-bold tracking-[0.04em] text-muted-foreground uppercase min-w-[56px]'

interface CotizacionesCardProps {
  cotizaciones: CotizacionesPorPais
  onSaveRow: (pais: string, values: Record<string, string>) => void
  onImportar: () => void
}

export function CotizacionesCard({ cotizaciones, onSaveRow, onImportar }: CotizacionesCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <div className="flex items-center justify-between border-b border-border p-[16px_20px]">
        <div>
          <div className="text-[15px] font-bold text-primary">Cotizaciones</div>
          <div className="mt-0.5 text-xs text-muted-foreground">Tasas de cambio mensuales</div>
        </div>
        <div className="flex gap-1">
          <button type="button" onClick={onImportar} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12.5px] font-semibold text-primary hover:bg-primary/6">
            <Icon name="upload" size={13} color="#0047B0" /> Importar
          </button>
          <Button variant="outline" size="sm">
            <Icon name="download" size={12} color="#0047B0" /> Descargar
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-[#F8FAFC]">
              <th className="p-[10px_16px] text-left text-[11px] font-bold tracking-[0.04em] text-muted-foreground uppercase whitespace-nowrap">País</th>
              <th className="p-[10px_8px] text-left text-[11px] font-bold tracking-[0.04em] text-muted-foreground uppercase">Moneda</th>
              {meses.map((m) => (
                <th key={m} className={th}>
                  {m}
                </th>
              ))}
              <th className="w-[70px] p-[10px_16px]" />
            </tr>
          </thead>
          <tbody>
            {paisesCotizacion.map((p) => (
              <CotizacionesRow key={p.name} pais={p} values={cotizaciones[p.name]} onSave={onSaveRow} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
