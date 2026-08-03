import { Icon } from '@/shared/ui'
import type { MovimientoReal } from '@/data/reales'

const th = 'p-[12px_16px] text-left text-[10.5px] font-bold tracking-[0.06em] text-muted-foreground uppercase whitespace-nowrap'
const td = 'p-[13px_16px] align-middle'
const mono = 'font-mono text-xs text-foreground'

export function RealesTable({ rows }: { rows: MovimientoReal[] }) {
  return (
    <div className="mx-8 mb-8 overflow-hidden rounded-2xl border border-border bg-white">
      <table className="w-full border-collapse text-[13px]">
        <thead className="border-b border-border bg-[#FAFBFE]">
          <tr>
            <th className={th}>PEP</th>
            <th className={th}>N° Documento</th>
            <th className={th}>Proveedor / Acreedor</th>
            <th className={`${th} text-right`}>Monto Original</th>
            <th className={`${th} text-center`}>Moneda</th>
            <th className={`${th} text-center`}>Fecha Contab.</th>
            <th className={`${th} text-center`}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.doc} className="border-b border-[#F1F4FA] last:border-b-0 hover:bg-[#FAFBFE]">
              <td className={`${td} ${mono}`}>{r.pep}</td>
              <td className={`${td} ${mono} text-muted-foreground`}>{r.doc}</td>
              <td className={`${td} text-foreground`}>{r.vendor}</td>
              <td className={`${td} ${mono} text-right`}>{r.amount.toLocaleString('es-CL', { minimumFractionDigits: 2 })}</td>
              <td className={`${td} ${mono} text-center text-[11px] text-cs-gris-oscuro`}>{r.currency}</td>
              <td className={`${td} ${mono} text-center text-[11px]`}>{r.date}</td>
              <td className={`${td} text-center`}>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-bold ${
                    r.status === 'Posted' ? 'border-[#B6EDD3] bg-[#E1FBEF] text-[#067647]' : 'border-[#FDBA74] bg-[#FFF4E0] text-[#B45309]'
                  }`}
                >
                  <Icon name={r.status === 'Posted' ? 'check' : 'alert'} size={10} color={r.status === 'Posted' ? '#067647' : '#B45309'} />
                  {r.status === 'Posted' ? 'Contabilizado' : 'Pendiente'}
                </span>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={7} className="p-10 text-center text-sm text-muted-foreground">
                No hay resultados para los filtros aplicados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
