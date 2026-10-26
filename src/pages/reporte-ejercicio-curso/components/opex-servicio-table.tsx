import { Fragment } from 'react'
import { cn } from '@/shared/lib/utils'
import { opexServicios, type OpexServicioItem } from '@/data/opex-it-chile'
import { variacion, type OpexFiltros } from '../lib/opex-it-chile-helpers'
import { useOpexExpand } from '../lib/use-opex-expand'
import { RowChevron, TABLE_SCROLL_HEIGHT, VarCells, th, thRight } from './opex-var-cells'

function ServicioFila({ s, isOpen, toggle }: { s: OpexServicioItem; isOpen: (k: string) => boolean; toggle: (k: string) => void }) {
  const key = `${s.nombre}·${s.rubro}`
  return (
    <Fragment>
      <tr className={cn('border-t border-[#F1F3F8]', s.agregado && 'bg-[#FAFBFE]')}>
        <td className="p-[8px_10px] text-[13px] text-foreground">
          <span className="inline-flex items-center gap-1.5">
            <RowChevron open={Boolean(s.children) && isOpen(key)} onClick={s.children ? () => toggle(key) : undefined} />
            <span className={cn(s.agregado && 'text-muted-foreground italic')}>
              {s.nombre}
              {s.agregado && <span className="text-[10.5px]"> · {s.rubro}</span>}
            </span>
          </span>
        </td>
        <VarCells proy={s.proy} plan={s.plan} />
      </tr>
      {s.children &&
        isOpen(key) &&
        s.children.map((c) => (
          <tr key={c.nombre} className="border-t border-[#F1F3F8] bg-[#FAFBFE]">
            <td className="p-[8px_10px_8px_34px] text-[12.5px] text-muted-foreground">{c.nombre}</td>
            <VarCells proy={c.proy} plan={c.plan} muted />
          </tr>
        ))}
    </Fragment>
  )
}

interface OpexServicioTableProps {
  servicio: string
  rubro: OpexFiltros['rubro']
}

const EXPANDIDO_POR_DEFECTO = ['Base Plan 2026·Nómina']

/** Tabla "Servicios | PEP" ordenada por variación descendente, igual que el original — el servicio con
 * mayor sobre-costo primero. Igual que en Power BI: TODAS las filas muestran el ícono de jerarquía, pero
 * solo "Base Plan 2026" tiene hijos reales (desplegado por defecto, como en el reporte original — ahí no
 * hace falta hacer click para verlo). El buscador de texto y el filtro global de Rubro se aplican juntos. */
export function OpexServicioTable({ servicio, rubro }: OpexServicioTableProps) {
  const { isOpen, toggle } = useOpexExpand(EXPANDIDO_POR_DEFECTO)
  const query = servicio.trim().toLowerCase()
  const filas = opexServicios
    .filter((s) => (query ? s.nombre.toLowerCase().includes(query) : true))
    .filter((s) => (rubro.length ? rubro.includes(s.rubro) : true))
    .slice()
    .sort((a, b) => variacion(b.proy, b.plan) - variacion(a.proy, a.plan))

  const totalProy = filas.reduce((acc, s) => acc + s.proy, 0)
  const totalPlan = filas.reduce((acc, s) => acc + s.plan, 0)

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="overflow-y-auto" style={{ maxHeight: TABLE_SCROLL_HEIGHT }}>
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#FAFBFE]">
                <th className={th}>Servicio / PEP</th>
                <th className={thRight}>FC</th>
                <th className={thRight}>Plan</th>
                <th className={thRight}>Var.</th>
                <th className={thRight}>% Var.</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((s) => (
                <ServicioFila key={`${s.nombre}·${s.rubro}`} s={s} isOpen={isOpen} toggle={toggle} />
              ))}
              {filas.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-[13px] text-muted-foreground">
                    No se encontraron servicios para "{servicio}".
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
      <p className="text-[11px] text-muted-foreground italic">
        "Otros PEP (saldo no desglosado)" consolida el resto de líneas de servicio con ahorro frente al plan — el
        visual original de Power BI tiene scroll interno y no permite enumerarlas una por una. Se separa en
        Servicios/Nómina para que el filtro de Rubro siga calzando con el total real.
      </p>
    </div>
  )
}
