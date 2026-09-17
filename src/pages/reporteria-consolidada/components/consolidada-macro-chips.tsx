import { paises, paisIpc, paisMoneda, paisTasaCambioPromedio } from '@/data/services'

const chip = 'rounded-full bg-white px-2.5 py-1 text-[11.5px] font-semibold text-foreground shadow-[0_1px_2px_rgba(6,20,60,0.06)]'

/** Los mismos supuestos macro que muestra el tablero real arriba de los filtros — IPC 2027 y tipo de
 * cambio promedio por país, para que quien lee la propuesta de plan entienda los supuestos detrás. */
export function ConsolidadaMacroChips() {
  return (
    <div className="mx-8 mb-4 flex flex-col gap-1.5 rounded-xl bg-[#EEF1FB] p-[10px_14px] text-[11.5px]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-bold text-primary">📊 IPC 2027 (supuesto) por país</span>
        {paises.map((p) => (
          <span key={p} className={chip}>
            {p} <span className="text-muted-foreground">+{paisIpc[p].toFixed(1).replace('.', ',')}%</span>
          </span>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-bold text-primary">💱 Tipo de cambio promedio 2027 (moneda local por US$ 1)</span>
        {paises
          .filter((p) => p !== 'Estados Unidos')
          .map((p) => (
            <span key={p} className={chip}>
              {p} <span className="text-muted-foreground">{paisMoneda[p]} {(paisTasaCambioPromedio[p] ?? 1).toLocaleString('es-CL', { maximumFractionDigits: 2 })}</span>
            </span>
          ))}
      </div>
    </div>
  )
}
