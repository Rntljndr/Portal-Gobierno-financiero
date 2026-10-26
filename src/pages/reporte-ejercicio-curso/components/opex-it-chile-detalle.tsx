import type { OpexFiltros } from '../lib/opex-it-chile-helpers'
import { OpexRubroTable } from './opex-rubro-table'
import { OpexDivisionTable } from './opex-division-table'
import { OpexServicioTable } from './opex-servicio-table'
import { OpexResponsableTable } from './opex-responsable-table'

/** Vista "OPEX IT Chile" dentro de Reporte Ejercicio en Curso: réplica del reporte Power BI "Opex 2026
 * MD Chile" (Plan vs. Forecast por Rubro, División, Servicio/PEP y Responsable). Los filtros (`filtros`)
 * los maneja `DetalleVista` — igual que los del motor de pivote genérico — para que el botón de Filtros
 * quede en la misma posición en todas las vistas, arriba de las tabs. Sin KPI strip ni evolutivo mensual
 * propios: esos ya los cubre la Vista Ejecutiva genérica (en USD, todos los países) — mantenerlos acá
 * era una duplicidad. */
export function OpexItChileDetalle({ filtros }: { filtros: OpexFiltros }) {
  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="text-[12.5px] font-bold text-foreground">Rubro | Cuenta Contable</div>
          <OpexRubroTable rubro={filtros.rubro} />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-[12.5px] font-bold text-foreground">División | Banderas</div>
          <OpexDivisionTable division={filtros.division} rubro={filtros.rubro} responsable={filtros.responsable} />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="text-[12.5px] font-bold text-foreground">Servicios | PEP</div>
          <OpexServicioTable servicio={filtros.servicio} rubro={filtros.rubro} />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-[12.5px] font-bold text-foreground">Responsable | Cuenta Contable</div>
          <OpexResponsableTable
            responsable={filtros.responsable}
            cuentaContable={filtros.cuentaContable}
            rubro={filtros.rubro}
            division={filtros.division}
          />
        </div>
      </section>
    </div>
  )
}
