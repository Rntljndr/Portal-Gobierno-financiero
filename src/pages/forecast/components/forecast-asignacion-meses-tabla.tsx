import { monthKeys, monthLabels } from '@/data/reporteria'
import { formatForecastAmount } from '../lib/format-forecast-amount'

const thLeft = 'p-[8px_10px] text-left text-[10.5px] font-bold tracking-[0.04em] text-muted-foreground uppercase bg-[#F4F6FB] border-b border-border'
const thRight = 'p-[8px_10px] text-right text-[10.5px] font-bold tracking-[0.04em] text-muted-foreground uppercase bg-[#F4F6FB] border-b border-border'
const tdLeft = 'p-[7px_10px] text-[12.5px] font-medium text-foreground border-b border-[#F0F4FA]'
const tdRight = 'p-[7px_10px] text-right text-[12.5px] tabular-nums text-foreground border-b border-[#F0F4FA]'

interface ForecastAsignacionMesesTablaProps {
  cutoff: number
  /** Valor a mostrar para cada mes (índice 0-11) — ya resuelto por el caller (real fijo si está
   * cerrado, o el draft editable si es forecast), usado para el total del pie. */
  valorMes: (i: number) => number
  total: number
  /** Monto editable de cada mes de forecast, por monthKey — los meses en Real no tienen entrada aquí. */
  draft: Record<string, string>
  onChangeMes: (monthKey: string, value: string) => void
}

function Mitad({
  desde,
  cutoff,
  valorMes,
  draft,
  onChangeMes,
}: {
  desde: number
  cutoff: number
  valorMes: (i: number) => number
  draft: Record<string, string>
  onChangeMes: (monthKey: string, value: string) => void
}) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className={thLeft}>Mes</th>
          <th className={thRight}>Monto asignado</th>
        </tr>
      </thead>
      <tbody>
        {monthKeys.slice(desde, desde + 6).map((k, j) => {
          const i = desde + j
          const esReal = i < cutoff
          return (
            <tr key={k}>
              <td className={tdLeft}>
                {monthLabels[i]}
                {esReal && <span className="ml-1.5 text-[10px] font-semibold text-muted-foreground">Real</span>}
              </td>
              <td className={tdRight}>
                {esReal ? (
                  formatForecastAmount(valorMes(i))
                ) : (
                  <input
                    type="number"
                    min="0"
                    value={draft[k] ?? ''}
                    onChange={(e) => onChangeMes(k, e.target.value)}
                    className="w-full rounded-md border border-border px-2 py-1 text-right text-[12.5px] tabular-nums text-foreground outline-none focus:border-primary"
                  />
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

/** Tabla de 12 meses en dos mitades (Ene-Jun | Jul-Dic) con total al pie — mismo componente que
 * "Asignación de monto" de Presupuesto (ver captura de referencia), con los meses de forecast
 * editables directo en la celda (F: "se puede editar de forma mensual"). Extraída de
 * ForecastEditarMontosModal para mantenerlo bajo el límite de líneas del linter. */
export function ForecastAsignacionMesesTabla({ cutoff, valorMes, total, draft, onChangeMes }: ForecastAsignacionMesesTablaProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="grid grid-cols-2">
        <Mitad desde={0} cutoff={cutoff} valorMes={valorMes} draft={draft} onChangeMes={onChangeMes} />
        <div className="border-l border-border">
          <Mitad desde={6} cutoff={cutoff} valorMes={valorMes} draft={draft} onChangeMes={onChangeMes} />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border bg-[#EEF4FF] p-[10px_14px]">
        <span className="text-[12.5px] font-bold text-primary">Total asignado</span>
        <span className="text-[13px] font-bold tabular-nums text-primary">{formatForecastAmount(total)}</span>
      </div>
    </div>
  )
}
