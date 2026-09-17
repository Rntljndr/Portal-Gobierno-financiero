import type { CurrencyView } from '@/data/reporteria'

const th = 'p-[9px_10px] text-right text-[12px] font-medium tracking-[0.02em] text-cs-gris-oscuro uppercase whitespace-nowrap bg-[#F8FAFC] border-b-2 border-border-table-strong'

export function DireccionTableHeader({ vista }: { vista: CurrencyView }) {
  const unit = vista === 'dolar' ? ' (US$)' : ' (ML)'
  return (
    <thead>
      <tr>
        <th className={`${th} min-w-[240px] text-left`}>País</th>
        <th className={`${th} border-l border-border-table`}>Total Real{unit}</th>
        <th className={th}>S/Ingresos</th>
        <th className={`${th} border-l border-border-table`}>Total Plan{unit}</th>
        <th className={th}>S/ingresos</th>
        <th className={`${th} border-l border-border-table`}>Var. vs Plan{unit}</th>
        <th className={th}>Var. %</th>
        <th className={`${th} border-l border-border-table`}>Año Anterior{unit}</th>
        <th className={th}>S/Ingresos</th>
        <th className={`${th} border-l border-border-table`}>Var. Vs A/A{unit}</th>
        <th className={th}>Var. A/A %</th>
      </tr>
    </thead>
  )
}
