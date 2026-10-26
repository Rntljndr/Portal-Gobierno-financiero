import { SegmentedTabs } from '@/shared/ui'
import type { V3Pais } from '@/data/gasto-it-v3'
import { monedaLocalDisponible, VISTAS_MONEDA, type VistaMoneda } from '../../lib'

interface MonedaSelectorProps {
  value: VistaMoneda
  pais: V3Pais | 'todos'
  /** La Visión Negocio no usa Origen ML (solo Destino USD o Destino ML). */
  conOrigen: boolean
  onChange: (v: VistaMoneda) => void
}

/** Mismo componente que el Reporte Negocio ("Ver montos por" + SegmentedTabs). Origen ML y Destino ML
 * siempre se muestran, pero solo se pueden elegir con un país seleccionado: sin una moneda común no se
 * puede totalizar. */
export function MonedaSelector({ value, pais, conOrigen, onChange }: MonedaSelectorProps) {
  const local = monedaLocalDisponible(pais)
  // Las opciones de moneda local siempre se ven; con "Todos los países" quedan deshabilitadas.
  const opciones = VISTAS_MONEDA.filter((o) => conOrigen || o.value !== 'origen').map((o) => ({
    ...o,
    disabled: !local && o.value !== 'usd',
    title: !local && o.value !== 'usd' ? 'Elige un país: sin una moneda común no se puede totalizar' : undefined,
  }))
  return (
    <div className="relative flex items-center gap-3">
      {/* Nota posicionada sobre el selector, fuera del flujo: no cambia su alto ni lo desplaza. */}
      {!local && <span className="pointer-events-none absolute right-0 bottom-full mb-1 text-xs whitespace-nowrap text-muted-foreground">Elige un país para ver moneda local</span>}
      <div className="text-xs font-bold text-primary">Ver montos por</div>
      <SegmentedTabs<VistaMoneda> value={value} onChange={onChange} options={opciones} />
    </div>
  )
}
