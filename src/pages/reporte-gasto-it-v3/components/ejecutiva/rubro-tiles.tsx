import { cn } from '@/shared/lib/utils'
import { useReporte } from '../../lib/contexto'
import { enGrupo, fmtMonto, fmtPct, GRUPOS_RUBRO, medir, PERIODOS } from '../../lib'
import { EstadoChip } from '../base/estado-chip'
import { Seccion } from '../base/seccion'
import { V3_FLAG } from '@/data/gasto-it-v3'

/** Resumen por rubro (como el del Reporte Tecnología, sin el total que ya está arriba): Servicios, Nómina
 * y Amortización. Clic en una tarjeta = filtra todo lo que está abajo por ese rubro; clic de nuevo, lo quita. */
export function RubroTiles({ defaultOpen }: { defaultOpen: boolean }) {
  const { lineas, moneda, periodo, grupoRubro, setGrupoRubro, alcance } = useReporte()
  const total = medir(lineas, periodo).valor
  const per = PERIODOS.find((p) => p.value === periodo)!

  return (
    <Seccion
      titulo={alcance.pais === 'todos' ? 'Resumen por rubro · Todos los países' : `Resumen por rubro · ${V3_FLAG[alcance.pais]} ${alcance.pais}`}
      subtitulo={`${per.label} · haz clic en un rubro para ver solo ese rubro en todo lo de abajo.`}
      defaultOpen={defaultOpen}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {GRUPOS_RUBRO.map((g) => {
          const ls = lineas.filter((l) => enGrupo(g.id, l))
          const m = medir(ls, periodo)
          const activo = grupoRubro === g.id
          return (
            <button
              key={g.id}
              type="button"
              aria-pressed={activo}
              onClick={() => setGrupoRubro(activo ? null : g.id)}
              className={cn(
                'flex flex-col gap-2 rounded-xl border p-4 text-left transition-colors',
                activo ? 'border-primary bg-surface-hover' : 'border-border-table bg-white hover:border-border-strong',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xxs font-bold tracking-wider text-muted-foreground uppercase">{g.label}</span>
                <span className="text-xs text-muted-foreground">{ls.length} líneas</span>
              </div>
              <div className="text-2xl font-bold tracking-tight text-foreground tabular-nums">{fmtMonto(m.valor, moneda)}</div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <EstadoChip pct={m.desvPct} />
                <span>vs plan {fmtMonto(m.plan, moneda)}</span>
                <span>· {fmtPct(total > 0 ? (m.valor / total) * 100 : 0)} del total</span>
              </div>
            </button>
          )
        })}
      </div>
    </Seccion>
  )
}
