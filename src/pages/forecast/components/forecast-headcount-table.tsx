import { useState } from 'react'
import { Button } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { monthKeys, monthLabelsShort } from '@/data/reporteria'
import { headcountTotalPorMes, type ForecastHeadcountRow } from '../lib/forecast-headcount'

const th = 'p-[9px_8px] text-left text-[10.5px] font-bold tracking-[0.04em] text-muted-foreground uppercase whitespace-nowrap border-b-2 border-border bg-[#F4F6FB]'
const td = 'p-[10px_8px] text-[12px] whitespace-nowrap text-cs-gris-oscuro text-right'

interface ForecastHeadcountTableProps {
  rows: ForecastHeadcountRow[]
  onChange: (n7Codigo: string, monthKey: string, valor: number) => void
  readOnly?: boolean
}

/** Tabla de Headcount (M4, ejemplo de servicio de rubro nómina) — mismo layout que la de Presupuesto
 * (PEP + Ene-Dic + Total, botón "Editar" habilita los inputs de mes y lo reemplaza por
 * Guardar/Cancelar), va bajo la tabla de PEP N7 en la vista del servicio. Reimplementada acá porque
 * pages/<A> nunca importa de pages/<B> — no hay drafts pendientes: cada cambio de mes ya queda
 * aplicado, "Cancelar" solo cierra el modo edición. */
export function ForecastHeadcountTable({ rows, onChange, readOnly = false }: ForecastHeadcountTableProps) {
  const [editando, setEditando] = useState(false)
  const totalPorMes = headcountTotalPorMes(rows)
  const totalGeneral = monthKeys.reduce((s, k) => s + totalPorMes[k], 0)

  return (
    <div className="mx-8 mb-6 overflow-x-auto rounded-xl border border-border shadow-[0_1px_4px_rgba(0,20,60,0.06)]">
      <div className="flex items-center justify-between p-[14px_16px]">
        <div className="text-[13px] font-bold text-foreground">Headcount</div>
        {!readOnly && (
          <Button variant="outline" size="sm" onClick={() => setEditando((v) => !v)}>
            {editando ? 'Listo' : 'Editar'}
          </Button>
        )}
      </div>
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className={th}>PEP</th>
            {monthLabelsShort.map((m) => (
              <th key={m} className={cn(th, 'text-right')}>
                {m}
              </th>
            ))}
            <th className={cn(th, 'text-right')}>Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const total = monthKeys.reduce((s, k) => s + (row.meses[k] || 0), 0)
            return (
              <tr key={row.n7Codigo} className="border-t border-border">
                <td className="p-[10px_8px] text-[12px] font-semibold whitespace-nowrap text-foreground">{row.n7Nombre}</td>
                {monthKeys.map((k) => (
                  <td key={k} className={td}>
                    {editando ? (
                      <input
                        type="number"
                        value={row.meses[k] ?? 0}
                        onChange={(e) => onChange(row.n7Codigo, k, Number(e.target.value) || 0)}
                        className="w-[56px] rounded-md border border-border px-1.5 py-1 text-right text-xs outline-none focus:border-primary"
                      />
                    ) : (
                      row.meses[k] ?? 0
                    )}
                  </td>
                ))}
                <td className={cn(td, 'font-semibold text-primary')}>{total}</td>
              </tr>
            )
          })}
          <tr className="border-t-2 border-border bg-[#FAFBFE] font-bold">
            <td className="p-[10px_8px] text-[12px] whitespace-nowrap text-cs-gris-oscuro">Total</td>
            {monthKeys.map((k) => (
              <td key={k} className={td}>
                {totalPorMes[k]}
              </td>
            ))}
            <td className={cn(td, 'text-primary')}>{totalGeneral}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
