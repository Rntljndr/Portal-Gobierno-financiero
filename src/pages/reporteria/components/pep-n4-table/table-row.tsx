import { ipcFactorByMonth, monthKeys, type PepN4Row } from '@/data/reporteria'
import { rowTotal, rowTotalFIPC, rowTotalPlan } from '../../lib/pep-n4-table-helpers'
import { RowIdentityCells } from './row-identity-cells'
import { MonthCells } from './month-cells'
import { RowTotals } from './row-totals'

interface TableRowProps {
  row: PepN4Row
  isExpanded: boolean
  onToggle: () => void
}

export function TableRow({ row, isExpanded, onToggle }: TableRowProps) {
  const totProy = rowTotal(row.meses)
  const totPlan = rowTotalPlan(row.meses, row.planFactor)
  const totFIPC = rowTotalFIPC(row.meses)

  return (
    <>
      <tr className="cursor-pointer bg-white hover:bg-[#FAFBFF]" onClick={onToggle}>
        <RowIdentityCells codigo={row.codigo} nombre={row.nombre} pais={row.pais} paisDestino={row.paisDestino} equipo={row.equipo} bg="#fff" isExpanded={isExpanded} onToggle={onToggle} />
        {monthKeys.map((k) => {
          const proy = row.meses[k] || 0
          const plan = Math.round(proy * row.planFactor)
          const fIPC = Math.round(proy * (ipcFactorByMonth[k] || 1))
          return <MonthCells key={k} proy={proy} plan={plan} fIPC={fIPC} bg="#fff" bold isTotal={false} />
        })}
        <RowTotals totProy={totProy} totPlan={totPlan} totFIPC={totFIPC} />
      </tr>
      {isExpanded && row.children.map((child) => (
        <tr key={child.codigo} className="bg-[#F8FAFD]">
          <RowIdentityCells codigo={child.codigo} nombre={child.nombre} pais={child.pais} paisDestino={child.paisDestino} equipo={child.equipo} bg="#F8FAFD" isChild />
          {monthKeys.map((k) => {
            const proy = child.meses[k] || 0
            const plan = Math.round(proy * child.planFactor)
            const fIPC = Math.round(proy * (ipcFactorByMonth[k] || 1))
            return <MonthCells key={k} proy={proy} plan={plan} fIPC={fIPC} bg="#F8FAFD" isTotal={false} />
          })}
          <RowTotals
            totProy={rowTotal(child.meses)}
            totPlan={rowTotalPlan(child.meses, child.planFactor)}
            totFIPC={rowTotalFIPC(child.meses)}
          />
        </tr>
      ))}
    </>
  )
}
