import { Icon, DesvioChip } from '@/shared/ui'

// TODO (punto abierto del enunciado): definir si este bloque se muestra a Gerencia, a Negocio, o a
// ambas — y si cada audiencia necesita un corte de ingresos distinto. No se resuelve acá.

/** "Gasto sobre ingresos" — % de gasto sobre venta: Plan, Real a la fecha y Proyectado, cada uno en su
 * propio recuadro (mismo criterio que CAPEX/OPEX en `EjecutivoRubroCard`), comparando Real y Proyectado
 * contra Plan. No existe una fuente de ingresos/venta en el modelo de datos de Reales/Servicios (sí
 * existe, con otra forma y datos sintéticos, en Reporte de Dirección — otra taxonomía, no se reutiliza
 * acá). Valores de ejemplo hasta que exista el campo real — sin marca visible de "dato de ejemplo" (a
 * pedido del usuario), mismo diseño que el resto de la Vista Ejecutiva. */
export function EjecutivoGastoIngresosCard() {
  const ejemplo = { plan: 4.2, real: 4.6, proyectado: 4.5 }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-white p-5">
        <div className="flex items-center gap-2 text-[13px] font-bold text-foreground">
          <Icon name="dollar" size={15} color="#0047B0" /> Gasto sobre ingresos — Plan
        </div>
        <div>
          <div className="text-[9px] font-bold tracking-[0.06em] text-muted-foreground uppercase">% gasto / venta</div>
          <div className="text-[26px] font-extrabold tracking-tight text-foreground">{ejemplo.plan.toFixed(1)}%</div>
        </div>
        <div className="text-[11.5px] text-muted-foreground">Línea base contra la que se comparan Real a la fecha y Proyectado.</div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-white p-5">
        <div className="flex items-center gap-2 text-[13px] font-bold text-foreground">
          <Icon name="chart" size={15} color="#0047B0" /> Gasto sobre ingresos — Real a la fecha
        </div>
        <div>
          <div className="text-[9px] font-bold tracking-[0.06em] text-muted-foreground uppercase">% gasto / venta</div>
          <div className="text-[26px] font-extrabold tracking-tight text-foreground">{ejemplo.real.toFixed(1)}%</div>
        </div>
        <div className="text-[11.5px] text-muted-foreground">
          Plan: <b className="text-foreground">{ejemplo.plan.toFixed(1)}%</b>
        </div>
        <div className="flex items-center gap-2 border-t border-[#eef0f8] pt-2.5">
          <DesvioChip pct={ejemplo.real - ejemplo.plan} />
          <span className="text-[11.5px] text-muted-foreground">vs. Plan</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-white p-5">
        <div className="flex items-center gap-2 text-[13px] font-bold text-foreground">
          <Icon name="trendup" size={15} color="#0047B0" /> Gasto sobre ingresos — Proyectado
        </div>
        <div>
          <div className="text-[9px] font-bold tracking-[0.06em] text-muted-foreground uppercase">% gasto / venta</div>
          <div className="text-[26px] font-extrabold tracking-tight text-foreground">{ejemplo.proyectado.toFixed(1)}%</div>
        </div>
        <div className="text-[11.5px] text-muted-foreground">
          Plan: <b className="text-foreground">{ejemplo.plan.toFixed(1)}%</b>
        </div>
        <div className="flex items-center gap-2 border-t border-[#eef0f8] pt-2.5">
          <DesvioChip pct={ejemplo.proyectado - ejemplo.plan} />
          <span className="text-[11.5px] text-muted-foreground">vs. Plan</span>
        </div>
      </div>
    </div>
  )
}
