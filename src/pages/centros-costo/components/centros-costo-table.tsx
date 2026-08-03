import { EmptyState } from '@/shared/ui'
import type { CentroCostoRow } from '@/data/centros-costo'

const th = 'p-[10px_14px] text-left text-[10.5px] font-bold tracking-[0.06em] text-muted-foreground uppercase whitespace-nowrap'
const td = 'p-[10px_14px] text-[12.5px] text-foreground'

function DriverCell({ value }: { value: string }) {
  return value ? <span>{value}</span> : <span className="text-muted-foreground">—</span>
}

export function CentrosCostoTable({ rows }: { rows: CentroCostoRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="mx-8 mb-8">
        <EmptyState icon="search" title="Sin resultados" text="Probá ajustar la búsqueda o crear un nuevo centro de costo." />
      </div>
    )
  }

  return (
    <div className="mx-8 mb-8 overflow-hidden rounded-xl border border-border bg-white">
      <table className="w-full border-collapse">
        <thead className="bg-[#F8FAFC]">
          <tr>
            <th className={th}>Código</th>
            <th className={th}>Tipo</th>
            <th className={th}>Driver Nómina</th>
            <th className={th}>Driver Servicio</th>
            <th className={th}>Driver Amortización</th>
            <th className={th}>País</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-border hover:bg-[#FBFCFE]">
              <td className={`${td} font-mono text-xs font-semibold`}>{r.codigo}</td>
              <td className={td}>
                <span
                  className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                    r.tipo === 'Central' ? 'bg-[#E0EAFB] text-cs-azul' : 'bg-[#F1F4FA] text-cs-gris-oscuro'
                  }`}
                >
                  {r.tipo}
                </span>
              </td>
              <td className={td}>
                <DriverCell value={r.driverNomina} />
              </td>
              <td className={td}>
                <DriverCell value={r.driverServicio} />
              </td>
              <td className={td}>
                <DriverCell value={r.driverAmortizacion} />
              </td>
              <td className={`${td} text-cs-gris-oscuro`}>{r.pais}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
