import { Badge, Icon } from '@/shared/ui'
import { GIT_CORTE_LABEL, GIT_EJERCICIO } from '@/data/gasto-it-v2'
import { estadoDe, ESTADO_META, fmtPct, fmtUSD, type Accion, type Totales } from '../lib'

interface VeredictoBannerProps {
  alcanceLabel: string
  t: Totales
  acciones: Accion[]
  onVerAcciones: () => void
}

/** Responde en una frase "¿cómo vamos y qué debo hacer?" — lo primero que lee cualquier audiencia. */
export function VeredictoBanner({ alcanceLabel, t, acciones, onVerAcciones }: VeredictoBannerProps) {
  const estado = estadoDe(t.desvProyPct)
  const meta = ESTADO_META[estado]
  // Acciones ya vienen ordenadas por impacto: las primeras de cada tipo son los desvíos que se compensan.
  const sobre = acciones.filter((a) => a.tipo === 'contener')
  const sub = acciones.filter((a) => a.tipo === 'reasignar')
  const compensa = estado === 'linea' && sobre.length > 0 && sub.length > 0
  const cumplimiento = t.planAcum > 0 ? (t.realAcum / t.planAcum) * 100 : 0
  const impacto = acciones.reduce((s, a) => s + a.impacto, 0)

  const direccion = t.desvProy >= 0 ? 'sobre' : 'bajo'

  return (
    <section className="rounded-xl border border-border bg-white p-5 shadow-[0_2px_15px_-3px_rgba(6,20,148,0.08)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="text-[10px] font-bold tracking-[0.08em] text-muted-foreground uppercase">¿Cómo vamos? · {alcanceLabel}</div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Corte {GIT_CORTE_LABEL} · cifras en US$</span>
          <Badge variant={meta.variant}>{meta.label}</Badge>
        </div>
      </div>

      <p className="mt-2 max-w-[880px] text-[19px] leading-snug font-semibold text-foreground">
        Proyectamos cerrar el {GIT_EJERCICIO} en <span className="text-primary">{fmtUSD(t.proyeccion)}</span>,{' '}
        <span className={estado === 'sobre' ? 'text-destructive' : estado === 'sub' ? 'text-warning' : 'text-success'}>
          {fmtPct(Math.abs(t.desvProyPct))} {direccion} el plan
        </span>{' '}
        de {fmtUSD(t.planAnual)}.
      </p>

      <div className="mt-2 flex flex-col gap-1 text-[13px] text-muted-foreground">
        <span>
          A la fecha llevamos <b className="text-foreground">{fmtUSD(t.realAcum)}</b> ejecutados, el{' '}
          <b className="text-foreground">{fmtPct(cumplimiento)}</b> del plan acumulado, y {fmtPct(Math.abs(t.yoyPct))}{' '}
          {t.yoyPct >= 0 ? 'más' : 'menos'} que el mismo período del año anterior.
        </span>
        {compensa && (
          <span className="flex items-start gap-1.5 text-warning">
            <span className="mt-0.5 shrink-0">
              <Icon name="info" size={14} color="currentColor" />
            </span>
            <span>
              El total está en línea porque los desvíos se compensan: {sobre.length} líneas van sobre plan (la mayor, {sobre[0]?.titulo}) y{' '}
              {sub.length} bajo plan (la mayor, {sub[0]?.titulo}).
            </span>
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border-table pt-3">
        {acciones.length > 0 ? (
          <>
            <Icon name="sparkles" size={15} color="var(--color-primary)" />
            <span className="text-[13px] text-foreground">
              <b>{acciones.length} {acciones.length === 1 ? 'acción sugerida' : 'acciones sugeridas'}</b> con un impacto estimado de{' '}
              <b>{fmtUSD(impacto)}</b> sobre el cierre.
            </span>
            <button type="button" onClick={onVerAcciones} className="ml-auto text-[13px] font-medium text-primary hover:text-cs-azul-oscuro">
              Ver qué hacer ↓
            </button>
          </>
        ) : (
          <span className="flex items-center gap-2 text-[13px] text-success">
            <Icon name="circle_check" size={15} color="currentColor" /> Sin desvíos que requieran acción en este alcance.
          </span>
        )}
      </div>
    </section>
  )
}
