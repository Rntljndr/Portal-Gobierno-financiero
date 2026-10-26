import { Fragment, useEffect } from 'react'
import { cn } from '@/shared/lib/utils'
import { opexResponsable, type OpexResponsableItem } from '@/data/opex-it-chile'
import { RowChevron, TABLE_SCROLL_HEIGHT, VarCells, th, thRight } from './opex-var-cells'
import { useOpexExpand } from '../lib/use-opex-expand'
import { montoPorRubro, montoResponsablePorDivision, type OpexFiltros } from '../lib/opex-it-chile-helpers'
import { OpexCruceBadge } from './opex-cruce-badge'

type Fila = Omit<OpexResponsableItem, 'children'> & { proy: number; plan: number; children?: OpexResponsableItem['children'] }

function ResponsableFila({ r, isOpen, toggle }: { r: Fila; isOpen: (k: string) => boolean; toggle: (k: string) => void }) {
  return (
    <Fragment>
      <tr className={cn('border-t border-[#F1F3F8]', r.proy === 0 && r.plan === 0 && 'text-muted-foreground')}>
        <td className="p-[8px_10px] text-[13px] font-semibold text-foreground">
          <span className="inline-flex items-center gap-1.5">
            <RowChevron open={Boolean(r.children) && isOpen(r.nombre)} onClick={r.children ? () => toggle(r.nombre) : undefined} />
            {r.nombre}
          </span>
        </td>
        <VarCells proy={r.proy} plan={r.plan} bold />
      </tr>
      {r.children &&
        isOpen(r.nombre) &&
        r.children.map((c) => (
          <tr key={c.cuentaContable} className="border-t border-[#F1F3F8] bg-[#FAFBFE]">
            <td className="p-[8px_10px_8px_34px] text-[12.5px] text-muted-foreground">{c.cuentaContable}</td>
            <VarCells proy={c.proy} plan={c.plan} muted />
          </tr>
        ))}
    </Fragment>
  )
}

interface OpexResponsableTableProps {
  responsable: string[]
  cuentaContable: string[]
  rubro: OpexFiltros['rubro']
  division: string[]
}

const EXPANDIDO_POR_DEFECTO = ['Christian Rivera', 'Alejandro Castillo']

/** Tabla "Responsable | Cuenta Contable" — la única de las 4 que concilia exactamente con el total
 * general cuando no hay otros filtros activos (igual que en el reporte original). Igual que en Power
 * BI: TODOS los responsables muestran el ícono de jerarquía, pero solo Christian Rivera y Alejandro
 * Castillo tienen hijos reales, desplegados por defecto (así se ven al abrir el reporte original, sin
 * necesidad de click). División tiene prioridad y usa el cruce real Responsable × División verificado
 * contra Power BI (en ese modo se oculta el desglose por Cuenta Contable, porque no existe un cruce de 3
 * dimensiones verificado); si no hay División seleccionada, el filtro de Rubro usa el split real
 * Director IT Servicios/Nómina. */
export function OpexResponsableTable({ responsable, cuentaContable, rubro, division }: OpexResponsableTableProps) {
  const { isOpen, toggle } = useOpexExpand(EXPANDIDO_POR_DEFECTO)
  const cruzandoDivision = division.length > 0

  const base: Fila[] = cruzandoDivision
    ? opexResponsable.map((r) => ({ ...r, children: undefined, ...montoResponsablePorDivision(r.nombre, r, division) }))
    : opexResponsable
        .map((r) => ({ ...r, ...montoPorRubro(r.porRubro, r, rubro) }))
        .filter((r) => !(rubro.length > 0 && !r.porRubro && !rubro.includes('Servicios')))

  let filas = responsable.length ? base.filter((r) => responsable.includes(r.nombre)) : base
  if (cuentaContable.length && !cruzandoDivision) {
    filas = filas
      .filter((r) => r.children?.some((c) => cuentaContable.includes(c.cuentaContable)))
      .map((r) => ({ ...r, children: r.children?.filter((c) => cuentaContable.includes(c.cuentaContable)) }))
  }

  const totalProy = filas.reduce((acc, r) => acc + r.proy, 0)
  const totalPlan = filas.reduce((acc, r) => acc + r.plan, 0)
  const autoExpand = (responsable.length > 0 || cuentaContable.length > 0) && !cruzandoDivision

  useEffect(() => {
    if (!autoExpand) return
    filas.forEach((r) => {
      if (r.children && !isOpen(r.nombre)) toggle(r.nombre)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responsable, cuentaContable, rubro, division])

  return (
    <div className="flex flex-col">
      <OpexCruceBadge etiqueta="División" valores={cruzandoDivision ? division : []} />
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="overflow-y-auto" style={{ maxHeight: TABLE_SCROLL_HEIGHT }}>
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#FAFBFE]">
                <th className={th}>Responsable / Cuenta Contable</th>
                <th className={thRight}>FC</th>
                <th className={thRight}>Plan</th>
                <th className={thRight}>Var.</th>
                <th className={thRight}>% Var.</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((r) => (
                <ResponsableFila key={r.nombre} r={r} isOpen={isOpen} toggle={toggle} />
              ))}
              {filas.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-[13px] text-muted-foreground">
                    Ningún responsable calza con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
            {filas.length > 0 && (
              <tfoot className="sticky bottom-0 z-10">
                <tr className="border-t-2 border-[#455B85] bg-white">
                  <td className="p-[8px_10px] text-[13px] font-bold text-foreground">Total</td>
                  <VarCells proy={totalProy} plan={totalPlan} bold />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  )
}
