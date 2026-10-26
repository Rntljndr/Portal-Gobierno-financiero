import { opexDivision } from '@/data/opex-it-chile'
import { cn } from '@/shared/lib/utils'
import { montoDivisionPorResponsable, montoPorRubro, type OpexFiltros } from '../lib/opex-it-chile-helpers'
import { RowChevron, VarCells, th, thRight } from './opex-var-cells'
import { OpexCruceBadge } from './opex-cruce-badge'

interface OpexDivisionTableProps {
  division: string[]
  rubro: OpexFiltros['rubro']
  responsable: string[]
}

/** División | Banderas — respeta el filtro propio de División y los dos filtros globales verificados
 * contra el reporte real: Responsable (cruce real División × Responsable) tiene prioridad, y si no hay
 * responsable seleccionado se usa el split real por Rubro. */
export function OpexDivisionTable({ division, rubro, responsable }: OpexDivisionTableProps) {
  const base = division.length ? opexDivision.filter((d) => division.includes(d.nombre)) : opexDivision
  const cruzando = responsable.length > 0
  const filas = base.map((d) => ({
    nombre: d.nombre,
    ...(cruzando ? montoDivisionPorResponsable(d.nombre, d, responsable) : montoPorRubro(d.porRubro, d, rubro)),
  }))
  const totalProy = filas.reduce((acc, d) => acc + d.proy, 0)
  const totalPlan = filas.reduce((acc, d) => acc + d.plan, 0)

  return (
    <div className="flex flex-col">
      <OpexCruceBadge etiqueta="Responsable" valores={cruzando ? responsable : []} />
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#FAFBFE]">
              <th className={th}>División</th>
              <th className={thRight}>FC</th>
              <th className={thRight}>Plan</th>
              <th className={thRight}>Var.</th>
              <th className={thRight}>% Var.</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((d) => (
              <tr
                key={d.nombre}
                className={cn('border-t border-[#F1F3F8]', d.proy === 0 && d.plan === 0 && 'text-muted-foreground')}
              >
                <td className="p-[8px_10px] text-[13px] text-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <RowChevron open={false} />
                    {d.nombre}
                  </span>
                </td>
                <VarCells proy={d.proy} plan={d.plan} />
              </tr>
            ))}
            <tr className="border-t-2 border-[#455B85]">
              <td className="p-[8px_10px] text-[13px] font-bold text-foreground">Total</td>
              <VarCells proy={totalProy} plan={totalPlan} bold />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
