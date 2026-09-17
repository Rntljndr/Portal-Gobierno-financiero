const th = 'p-[9px_10px] text-right text-[12px] font-medium tracking-[0.02em] text-cs-gris-oscuro uppercase whitespace-nowrap bg-[#F8FAFC] border-b-2 border-border-table-strong'

export function ConsolidadoTableHeader({ leafLabel, unit }: { leafLabel: string; unit: string }) {
  return (
    <thead>
      <tr>
        <th className={`${th} min-w-[240px] text-left`}>Agrupador / {leafLabel}</th>
        <th className={`${th} border-l border-border-table`}>Plan{unit}</th>
        <th className={th}>Forecast + IPC{unit}</th>
        <th className={th}>Variación{unit}</th>
        <th className={th}>Variación %</th>
        <th className={`${th} border-l border-border-table`}>% del Plan</th>
      </tr>
    </thead>
  )
}
