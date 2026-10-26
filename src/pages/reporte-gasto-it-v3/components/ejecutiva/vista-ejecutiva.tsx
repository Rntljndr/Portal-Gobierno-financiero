import { V3_RUBRO_META, type V3Linea } from '@/data/gasto-it-v3'
import { useReporte } from '../../lib/contexto'
import { ROL_CONFIG, type BloqueId } from '../../lib'
import { PeriodoCards } from './periodo-cards'
import { RubroTiles } from './rubro-tiles'
import { PaisesVista } from './paises-vista'
import { EvolutivoCard } from './evolutivo-card'
import { DesvioTabla } from './desvio-tabla'
import { MapaCalor } from './mapa-calor'

const linea = (l: V3Linea) => ({ key: l.id, titulo: l.servicio, sub: `${l.negocio} ${l.pais} · ${l.responsable}` })

/** Vista ejecutiva: período (mes / acumulado / proyectado) → resumen por rubro → cómo vamos por país →
 * evolutivo → desvíos por negocio, gerencia y cuenta contable (+ mapa de calor en la Visión Negocio). Fija dentro de
 * la selección; los filtros del detalle no la afectan. */
export function VistaEjecutiva() {
  const { rol } = useReporte()
  const cfg = ROL_CONFIG[rol]
  const abierto = (id: BloqueId) => cfg.abiertos.includes(id)
  const rubroKey = (l: V3Linea) => (cfg.rubrosNegocio ? V3_RUBRO_META[l.rubro].labelNegocio : l.rubro)

  return (
    <section className="flex flex-col gap-4">
      <PeriodoCards />
      <RubroTiles defaultOpen={abierto('rubros')} />
      <PaisesVista defaultOpen={abierto('paises')} />
      <EvolutivoCard defaultOpen={abierto('evolutivo')} />
      <DesvioTabla
        dimension="Negocio"
        plural="Negocios"
        nivel1={(l) => `${l.negocio} ${l.pais}`}
        nivel2={(l) => ({ key: l.rubro, titulo: rubroKey(l) })}
        conVenta
        defaultOpen={abierto('tablas')}
      />
      {rol === 'corporativo' && (
        <DesvioTabla dimension="Gerencia" plural="Gerencias" nivel1={(l) => l.gerencia} nivel2={(l) => ({ key: l.equipo, titulo: l.equipo })} defaultOpen={abierto('tablas')} />
      )}
      {/* Por cuenta contable (no por rubro): el rubro ya es la agrupación del resumen de arriba. */}
      <DesvioTabla dimension="Cuenta contable" plural="Cuentas contables" nivel1={(l) => l.cuentaContable} nivel2={linea} conHc={false} defaultOpen={abierto('tablas')} />
      {rol === 'negocio' && <MapaCalor defaultOpen={abierto('mapa')} />}
    </section>
  )
}
