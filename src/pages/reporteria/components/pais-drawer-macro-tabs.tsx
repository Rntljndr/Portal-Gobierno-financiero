import type { PaisMacroData } from '@/data/reporteria'
import { monthLabelsShort } from '@/data/reporteria'

function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-3.5">
      <div className="mb-[3px] text-[10px] font-bold tracking-[0.06em] text-muted-foreground uppercase">{title}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </div>
  )
}

function MonthTable({ colLabel, values, format, color }: { colLabel: string; values: number[]; format: (v: number) => string; color?: (v: number) => string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      <table className="w-full table-fixed border-collapse text-xs">
        <thead>
          <tr>
            <th className="w-[140px] bg-[#F8FAFC] p-[9px_14px] text-left text-[10px] font-bold tracking-[0.06em] text-muted-foreground uppercase">Mes</th>
            <th className="border-l border-[#E2E8F0] bg-[#F8FAFC] p-[9px_14px] text-right text-[10px] font-bold tracking-[0.06em] text-muted-foreground uppercase">{colLabel}</th>
          </tr>
        </thead>
        <tbody>
          {monthLabelsShort.map((mes, i) => (
            <tr key={mes} className={`${i === 0 ? 'border-t border-border' : 'border-t border-[#EEF2F7]'} ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'}`}>
              <td className="p-[10px_14px] text-left font-medium">{mes}</td>
              <td className="border-l border-[#E2E8F0] p-[10px_14px] text-right font-semibold" style={{ color: color ? color(values[i]) : 'var(--fg-primary)' }}>
                {format(values[i])}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function PaisDrawerTasaTab({ macro }: { macro: PaisMacroData }) {
  return (
    <div>
      <SectionHeader title="Tasa de Cambio utilizada en presupuesto 2027" sub={`${macro.monedaLocal} / USD · Valores mensuales`} />
      <MonthTable colLabel={`${macro.monedaLocal} / USD`} values={macro.tasaCambio.map((r) => r.tasa)} format={(v) => v.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} />
    </div>
  )
}

export function PaisDrawerIpcTab({ macro }: { macro: PaisMacroData }) {
  return (
    <div>
      <SectionHeader title="IPC utilizado en presupuesto 2027" sub="Variación mensual · Valores en %" />
      <MonthTable
        colLabel="IPC (%)"
        values={macro.ipc.map((r) => r.valor)}
        format={(v) => `${v.toFixed(2).replace('.', ',')}%`}
        color={(v) => (v >= 3 ? '#DC2626' : v >= 1 ? '#B45309' : '#067647')}
      />
    </div>
  )
}
