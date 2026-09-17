import type { Servicio } from '@/data/services'
import type { CurrencyView } from '@/data/reporteria'
import { origenServicioOptions } from '@/data/services'
import { buildDimensionTree } from '../lib/build-dimension-tree'

interface OrigenServicioBarsProps {
  servicios: Servicio[]
  vista: CurrencyView
}

/** Una sola serie ordenada por magnitud (peso % del Plan): un solo tono, sin paleta categórica —
 * la identidad ya está en la etiqueta de cada barra, no hace falta color por categoría (ver skill dataviz,
 * "color por el trabajo que hace": esto es magnitud, no identidad). Orden alfabético, igual al real. */
export function OrigenServicioBars({ servicios, vista }: OrigenServicioBarsProps) {
  const tree = buildDimensionTree(servicios, 'origenServicio', vista)
  const total = tree.reduce((a, n) => a + n.plan, 0) || 1
  const bars = [...origenServicioOptions]
    .map((nombre) => {
      const node = tree.find((n) => n.nombre === nombre)
      return { nombre, pct: node ? (node.plan / total) * 100 : 0 }
    })
    .filter((b) => tree.some((n) => n.nombre === b.nombre))
  const maxPct = Math.max(...bars.map((b) => b.pct), 1)

  return (
    <div className="rounded-2xl border border-border bg-white p-[14px_16px]">
      <div className="mb-3">
        <div className="text-[13px] font-bold text-foreground">📊 Distribución por Origen del Servicio</div>
        <div className="text-xs text-muted-foreground">% de peso del Plan por categoría — orden alfabético</div>
      </div>
      <div className="flex flex-col gap-3">
        {bars.map((b) => (
          <div key={b.nombre} className="flex items-center gap-3">
            <div className="w-[150px] shrink-0 truncate text-[12px] font-semibold text-foreground">{b.nombre}</div>
            <div className="h-[10px] flex-1 overflow-hidden rounded-full bg-[#EEF1FB]">
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(1, (b.pct / maxPct) * 100)}%` }} />
            </div>
            <div className="w-[52px] shrink-0 text-right text-[12px] font-bold text-foreground">{b.pct.toFixed(1).replace('.', ',')}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}
