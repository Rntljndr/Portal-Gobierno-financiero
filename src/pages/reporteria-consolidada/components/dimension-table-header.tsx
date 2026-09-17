const th = 'p-[9px_10px] text-right text-[12px] font-medium tracking-[0.02em] text-cs-gris-oscuro uppercase whitespace-nowrap bg-[#F8FAFC] border-b-2 border-border-table-strong'

export function DimensionTableHeader({ unit }: { unit: string }) {
  return (
    <thead>
      <tr>
        <th className={`${th} min-w-[220px] text-left`}>Agrupador / Línea</th>
        <th className={`${th} text-left`}>Nivel</th>
        <th className={`${th} border-l border-border-table`}>Moneda</th>
        <th className={th}>Nuevo Plan{unit}</th>
        <th className={th}>% Peso Plan</th>
        <th className={`${th} border-l border-border-table`}>Forecast + IPC{unit}</th>
        <th className={th}>Var. Monto{unit}</th>
        <th className={th}>Var. %</th>
      </tr>
    </thead>
  )
}
