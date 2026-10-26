import { resumenPorRubroUSD } from '../../lib/recoe-data'
import { EjecutivoComoVamosCard } from './ejecutivo-como-vamos-card'
import { EjecutivoComoProyectamosCard } from './ejecutivo-como-proyectamos-card'
import { EjecutivoGastoIngresosCard } from './ejecutivo-gasto-ingresos-card'
import { EjecutivoRubroCard } from './ejecutivo-rubro-card'
import { EjecutivoPorRubroTable } from './ejecutivo-por-rubro-table'
import { EjecutivoEvolutivoChart } from './ejecutivo-evolutivo-chart'
import { EjecutivoRankingPaises } from './ejecutivo-ranking-paises'

/** Vista ejecutiva: fija arriba, igual para todos los usuarios, siempre en USD y nunca afectada por los
 * filtros del detalle configurable (ver `detalle-vista.tsx`). */
export function EjecutivoVista() {
  const rubros = resumenPorRubroUSD()
  const capex = rubros.find((r) => r.rubro === 'CAPEX')
  const opex = rubros.find((r) => r.rubro === 'OPEX')

  return (
    <section className="flex flex-col gap-4">
      <div className="text-[13px] font-bold tracking-[0.04em] text-primary uppercase">Vista ejecutiva</div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <EjecutivoComoVamosCard />
        <EjecutivoComoProyectamosCard />
      </div>

      <EjecutivoGastoIngresosCard />

      {(capex || opex) && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {capex && <EjecutivoRubroCard item={capex} />}
          {opex && <EjecutivoRubroCard item={opex} />}
        </div>
      )}
      <EjecutivoPorRubroTable />

      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EjecutivoEvolutivoChart />
        </div>
        <EjecutivoRankingPaises />
      </div>
    </section>
  )
}
