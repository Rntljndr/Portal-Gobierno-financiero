import { Fragment, useState } from 'react'
import { Button, Icon } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { useReporte } from '../../lib/contexto'
import { CAUSA_META, fmtMonto, focosPriorizados, mesLargo, type Foco } from '../../lib'
import { EstadoChip } from '../base/estado-chip'
import { Seccion } from '../base/seccion'
import { TD, TD_MUTED, TH, TR, TR_HEAD } from '../base/tabla'

const VISIBLES = 3

/** Sugerencias de acción: recomendaciones inferidas por reglas (no son datos), por eso van en formato
 * secundario — tabla compacta, colores neutros y la acción solo al abrir la fila. */
export function FocosCard({ defaultOpen }: { defaultOpen: boolean }) {
  const { lineasAbajo: lineas, ajustes } = useReporte()
  const focos = focosPriorizados(lineas, ajustes.tolerancia)
  const [todas, setTodas] = useState(false)
  const [abierta, setAbierta] = useState<string | null>(null)
  const visibles = todas ? focos : focos.slice(0, VISIBLES)

  return (
    <Seccion
      titulo="Sugerencias de acción"
      subtitulo="Recomendaciones automáticas a partir de los desvíos, ordenadas por impacto al cierre. Valídalas con el dueño del gasto."
      defaultOpen={defaultOpen}
    >
      {focos.length === 0 ? (
        <div className="text-xs text-muted-foreground">No hay desvíos fuera de tolerancia que sugieran una acción.</div>
      ) : (
        <>
          <table className="w-full">
            <thead>
              <tr className={TR_HEAD}>
                <th className={`${TH} text-left`}>Dónde mirar</th>
                <th className={`${TH} text-left`}>Desvío a la fecha</th>
                <th className={`${TH} text-left`}>Desde</th>
                <th className={`${TH} text-left`}>Causa probable</th>
                <th className={`${TH} text-right`}>Impacto al cierre</th>
                <th className={`${TH} w-10`} />
              </tr>
            </thead>
            <tbody>
              {visibles.map((f) => (
                <Sugerencia key={f.id} f={f} abierta={abierta === f.id} onToggle={() => setAbierta(abierta === f.id ? null : f.id)} />
              ))}
            </tbody>
          </table>
          {focos.length > VISIBLES && (
            <Button variant="ghost" className="mt-2 px-0" onClick={() => setTodas((v) => !v)}>
              {todas ? 'Ver menos' : `Ver las ${focos.length} sugerencias`}
            </Button>
          )}
        </>
      )}
    </Seccion>
  )
}

function Sugerencia({ f, abierta, onToggle }: { f: Foco; abierta: boolean; onToggle: () => void }) {
  const { moneda, profundizar } = useReporte()
  const causa = CAUSA_META[f.causa]
  const ruta = { rubro: f.rubro, ...(f.negocio ? { negocio: `${f.negocio} ${f.pais}` } : { pais: f.pais }), ...(f.que !== f.rubro ? { servicio: f.que } : {}) }

  return (
    <Fragment>
      <tr onClick={onToggle} className={cn(TR, 'cursor-pointer', abierta && 'border-b-0 bg-surface-subtle')} aria-expanded={abierta}>
        <td className={TD}>
          <span className="font-bold">{f.que}</span> <span className="text-muted-foreground">· {f.donde}</span>
        </td>
        <td className="px-3 py-3">
          <span className="flex items-center gap-2 text-xs font-bold text-foreground tabular-nums">
            <EstadoChip pct={f.t.desvAcumPct} /> {fmtMonto(f.t.desvAcum, moneda, true)}
          </span>
        </td>
        <td className={`${TD} text-muted-foreground`}>{f.desdeMes !== null ? mesLargo(f.desdeMes) : '—'}</td>
        <td className={`${TD} text-cs-gris-oscuro`}>{causa.label}</td>
        <td className={TD_MUTED}>{fmtMonto(Math.abs(f.impacto), moneda)}</td>
        <td className="px-3 py-3 text-right text-primary">
          <Icon name={abierta ? 'chevron_up' : 'chevron_down'} size={16} color="currentColor" />
        </td>
      </tr>
      {abierta && (
        <tr className="border-b border-border-table bg-surface-subtle">
          <td colSpan={6} className="px-3 pb-4">
            <div className="flex flex-wrap items-end justify-between gap-4 text-xs">
              <div className="flex max-w-[720px] flex-col gap-1">
                <span className="text-muted-foreground">{f.detalleCausa}</span>
                <span className="text-foreground">
                  <b className="font-bold">Acción sugerida:</b> {causa.accion}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Icon name="user" size={12} color="currentColor" /> {f.responsables.join(', ')}
                </span>
              </div>
              <Button variant="ghost" className="px-0" onClick={() => profundizar(ruta)}>
                Ver detalle <Icon name="arrow_right" size={16} color="currentColor" />
              </Button>
            </div>
          </td>
        </tr>
      )}
    </Fragment>
  )
}
