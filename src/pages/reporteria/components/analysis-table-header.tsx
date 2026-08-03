const thBase = 'bg-[#F8FAFC] p-[5px_8px] text-[10px] font-bold tracking-[0.06em] text-muted-foreground uppercase whitespace-nowrap'

export function AnalysisTableHeader() {
  return (
    <thead>
      <tr>
        <th className={`${thBase} w-6`} />
        <th className={`${thBase} min-w-[220px] text-left align-bottom`}>Nombre</th>
        <th className={`${thBase} border-l border-[#E2E8F0] text-right`}>Plan</th>
        <th className={`${thBase} text-right`}>Forecast</th>
        <th className={`${thBase} text-right`}>Var%</th>
        <th className={`${thBase} text-right`}>Var$</th>
        <th className={`${thBase} min-w-[72px] border-l border-[#E2E8F0] text-right whitespace-normal`}>Forecast + IPC</th>
        <th className={`${thBase} text-right`}>Var%</th>
        <th className={`${thBase} text-right`}>Var$</th>
      </tr>
    </thead>
  )
}
