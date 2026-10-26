import { cn } from '@/shared/lib/utils'
import { useReporte } from '../../lib/contexto'
import { claseSigno, fmtMonto, fmtPct, medir, pesoVenta, PERIODOS, type Periodo } from '../../lib'
import { EstadoChip } from '../base/estado-chip'
import { FilaDato, TarjetaSeleccion } from '../base/tarjeta-seleccion'

function PeriodoCard({ p, activo, onClick }: { p: (typeof PERIODOS)[number]; activo: boolean; onClick: () => void }) {
  const { lineas, moneda } = useReporte()
  const m = medir(lineas, p.value)
  const venta = pesoVenta(lineas, p.value)
  const ventaVsPlan = venta.plan > 0 ? ((venta.real - venta.plan) / venta.plan) * 100 : 0

  return (
    <TarjetaSeleccion activo={activo} onClick={onClick} titulo={p.label} detalle={p.detalle} valor={fmtMonto(m.valor, moneda)}>
      <FilaDato label="Plan · desvío">
        {fmtMonto(m.plan, moneda)}
        <EstadoChip pct={m.desvPct} />
      </FilaDato>
      <FilaDato label="Año anterior · variación">
        {fmtMonto(m.ant, moneda)}
        <span className={cn('w-14 text-right', claseSigno(m.varPct))}>{fmtPct(m.varPct, true)}</span>
      </FilaDato>
      <FilaDato label="% sobre la venta">
        {fmtPct(venta.real, false, 2)}
        <span className={cn('w-14 text-right', claseSigno(ventaVsPlan))}>{fmtPct(ventaVsPlan, true)}</span>
      </FilaDato>
    </TarjetaSeleccion>
  )
}

/** Real del mes, real acumulado y proyectado anual. Cada tarjeta muestra el real contra el plan (desvío),
 * contra el año anterior (variación) y su peso sobre la venta; al elegir una, todo lo de abajo se recalcula
 * para ese período. Por defecto, acumulado. */
export function PeriodoCards() {
  const { periodo, setPeriodo } = useReporte()
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3" role="radiogroup" aria-label="Período del reporte">
        {PERIODOS.map((p) => (
          <PeriodoCard key={p.value} p={p} activo={periodo === p.value} onClick={() => setPeriodo(p.value as Periodo)} />
        ))}
      </div>
      <div className="text-xs text-muted-foreground">
        Elige un período: todo lo que está abajo se recalcula con él. Desvío = contra el plan · Variación = contra el año anterior.
      </div>
    </div>
  )
}
