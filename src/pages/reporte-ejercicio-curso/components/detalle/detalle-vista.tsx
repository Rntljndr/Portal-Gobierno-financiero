import { useState } from 'react'
import type { CurrencyView } from '@/data/reporteria'
import type { Pais } from '@/data/services'
import { convertirFilaAMoneda } from '../../lib/recoe-data'
import { listarVistas, guardarVista, type VistaGuardada } from '../../lib/detalle/saved-views'
import { aperturaLabel } from '../../lib/detalle/dimensiones'
import { DETALLE_FILTROS_VACIOS, contarFiltrosActivos, filtrarRows, type DetalleFiltros } from '../../lib/detalle/filtros'
import { DetalleFilterToggle, DetalleFiltrosPanel } from './detalle-filtros-panel'
import { DetalleConfigDrawer } from './detalle-config-drawer'
import { DetalleTabla } from './detalle-tabla'
import { DetalleChipContexto } from './detalle-chip-contexto'
import { DetalleGuardarVista } from './detalle-guardar-vista'
import { DetalleHeader } from './detalle-header'
import { OpexItChileDetalle } from '../opex-it-chile-detalle'
import { OPEX_FILTROS_VACIOS, type OpexFiltros } from '../../lib/opex-it-chile-helpers'
import { OpexFilterToggle, OpexFiltrosBar } from '../opex-filtros'

interface DetalleVistaProps {
  vistaMoneda: CurrencyView
  paisMoneda: Pais | null
}

const OPEX_VISTA = '__opex_it_chile__'

function resolverDestino(vistaMoneda: CurrencyView, paisMoneda: Pais | null, filtroPais: string[]): Pais {
  if (vistaMoneda === 'dolar') return 'Estados Unidos'
  if (vistaMoneda === 'destino' && paisMoneda) return paisMoneda
  if (filtroPais.length === 1) return filtroPais[0] as Pais
  return 'Estados Unidos'
}

/** Detalle configurable: 3 vistas predefinidas (Gerencia/Negocio/Cuenta contable) + vistas guardadas por
 * el usuario + "OPEX IT Chile" (su propio modelo de datos, no pasa por el motor de pivote genérico).
 * Comparte la moneda de "Resumen por país" (misma decisión que el módulo de Presupuesto: la moneda es
 * un estado de página, no por sección). Los filtros de acá nunca afectan a la Vista Ejecutiva. El botón
 * de Filtros (genérico u OPEX, según la vista activa) va siempre en la misma posición, arriba de las
 * tabs de vista — por eso el estado de los filtros de OPEX vive acá y no en `OpexItChileDetalle`. */
export function DetalleVista({ vistaMoneda, paisMoneda }: DetalleVistaProps) {
  const [vistas, setVistas] = useState<VistaGuardada[]>(listarVistas())
  const [nombreActiva, setNombreActiva] = useState(vistas[0].nombre)
  const [aperturas, setAperturas] = useState<string[]>(vistas[0].aperturas)
  const [metricas, setMetricas] = useState<string[]>(vistas[0].metricas)
  const [filtros, setFiltros] = useState<DetalleFiltros>(DETALLE_FILTROS_VACIOS)
  const [opexFiltros, setOpexFiltros] = useState<OpexFiltros>(OPEX_FILTROS_VACIOS)
  const [openFiltros, setOpenFiltros] = useState(false)
  const [openConfig, setOpenConfig] = useState(false)
  const esOpex = nombreActiva === OPEX_VISTA
  const activeCount = contarFiltrosActivos(filtros)

  const cambiarVistaActiva = (nombre: string) => {
    setNombreActiva(nombre)
    const v = vistas.find((x) => x.nombre === nombre)
    if (v) {
      setAperturas(v.aperturas)
      setMetricas(v.metricas)
    }
  }

  const onGuardarVista = (nombre: string) => {
    guardarVista({ nombre, aperturas, metricas })
    setVistas(listarVistas())
    setNombreActiva(nombre)
  }

  const destino = resolverDestino(vistaMoneda, paisMoneda, filtros.pais)
  const rowsConvertidas = filtrarRows(filtros).map((r) => convertirFilaAMoneda(r, destino))
  const primeraEtiqueta = aperturas.length ? aperturaLabel(aperturas[0]) : 'Apertura'

  return (
    <section className="flex flex-col gap-4">
      <div className="text-[13px] font-bold tracking-[0.04em] text-primary uppercase">Detalle configurable</div>

      <div>
        {esOpex ? (
          <OpexFilterToggle open={openFiltros} onToggle={() => setOpenFiltros((v) => !v)} filtros={opexFiltros} />
        ) : (
          <DetalleFilterToggle open={openFiltros} onToggle={() => setOpenFiltros((v) => !v)} activeCount={activeCount} />
        )}
      </div>
      {esOpex ? (
        <OpexFiltrosBar open={openFiltros} filtros={opexFiltros} onChange={setOpexFiltros} />
      ) : (
        <DetalleFiltrosPanel open={openFiltros} filtros={filtros} onChange={setFiltros} activeCount={activeCount} />
      )}

      <DetalleHeader
        vistas={vistas}
        nombreActiva={nombreActiva}
        onCambiarVista={cambiarVistaActiva}
        opexValue={OPEX_VISTA}
        onOpenConfig={() => setOpenConfig(true)}
      />

      {esOpex ? (
        <OpexItChileDetalle filtros={opexFiltros} />
      ) : (
        <>
          <DetalleChipContexto filtros={filtros} />
          <DetalleTabla rows={rowsConvertidas} aperturas={aperturas} metricas={metricas} monedaSimbolo="$" primeraColumnaLabel={primeraEtiqueta} />
          <DetalleGuardarVista onGuardar={onGuardarVista} />
        </>
      )}

      <DetalleConfigDrawer
        open={openConfig}
        onClose={() => setOpenConfig(false)}
        aperturas={aperturas}
        onChangeAperturas={setAperturas}
        metricas={metricas}
        onChangeMetricas={setMetricas}
      />
    </section>
  )
}
