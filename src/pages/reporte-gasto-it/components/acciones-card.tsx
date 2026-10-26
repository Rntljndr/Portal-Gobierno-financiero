import { forwardRef, useState } from 'react'
import { Badge, Icon } from '@/shared/ui'
import { fmtUSD, TIPO_ACCION_META, type Accion } from '../lib'

const VISIBLES = 5

/** "¿Qué debo hacer?" — acciones sugeridas ordenadas por impacto sobre el cierre del año. */
export const AccionesCard = forwardRef<HTMLElement, { acciones: Accion[] }>(function AccionesCard({ acciones }, ref) {
  const [todas, setTodas] = useState(false)
  const visibles = todas ? acciones : acciones.slice(0, VISIBLES)

  return (
    <section ref={ref} className="scroll-mt-4 rounded-xl border border-border bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-table p-[14px_18px]">
        <div>
          <div className="text-[14px] font-bold text-foreground">¿Qué debo hacer?</div>
          <div className="text-[12px] text-muted-foreground">Ordenado por impacto estimado sobre el cierre del año.</div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(TIPO_ACCION_META) as (keyof typeof TIPO_ACCION_META)[]).map((tipo) => {
            const n = acciones.filter((a) => a.tipo === tipo).length
            if (!n) return null
            return (
              <Badge key={tipo} variant={TIPO_ACCION_META[tipo].variant}>
                {TIPO_ACCION_META[tipo].label} · {n}
              </Badge>
            )
          })}
        </div>
      </div>

      {acciones.length === 0 ? (
        <div className="flex items-center gap-2 p-[18px] text-[13px] text-success">
          <Icon name="circle_check" size={15} color="currentColor" /> Todo dentro de rango: no hay acciones pendientes en este alcance.
        </div>
      ) : (
        <ol className="divide-y divide-border-table">
          {visibles.map((a, i) => {
            const meta = TIPO_ACCION_META[a.tipo]
            return (
              <li key={a.id} className="grid grid-cols-[28px_1fr] gap-x-3 gap-y-1 p-[14px_18px] md:grid-cols-[28px_1fr_auto]">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-[12px] font-bold text-primary">{i + 1}</span>
                <div className="flex min-w-0 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={meta.variant}>
                      <Icon name={meta.icon} size={10} color="currentColor" />
                      {meta.label}
                    </Badge>
                    <span className="text-[13.5px] font-semibold text-foreground">{a.titulo}</span>
                  </div>
                  <div className="text-[12.5px] text-foreground">{a.detalle}</div>
                  <div className="text-[12.5px] text-cs-gris-oscuro">
                    <b className="font-semibold">Sugerencia:</b> {a.sugerencia}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                    <Icon name="user" size={12} color="currentColor" /> {a.responsable}
                  </div>
                </div>
                <div className="col-start-2 text-left md:col-start-3 md:text-right">
                  <div className="text-[10px] font-bold tracking-[0.08em] text-muted-foreground uppercase">Impacto</div>
                  <div className="text-[15px] font-bold text-foreground tabular-nums">{fmtUSD(a.impacto)}</div>
                </div>
              </li>
            )
          })}
        </ol>
      )}

      {acciones.length > VISIBLES && (
        <div className="border-t border-border-table p-[10px_18px]">
          <button type="button" onClick={() => setTodas((v) => !v)} className="text-[13px] font-medium text-primary hover:text-cs-azul-oscuro">
            {todas ? 'Ver menos' : `Ver las ${acciones.length} acciones`}
          </button>
        </div>
      )}
    </section>
  )
})
