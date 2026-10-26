import type { DetalleFiltros } from '../../lib/detalle/filtros'

const ETIQUETAS: Record<keyof DetalleFiltros, string> = {
  pais: 'País',
  gerencia: 'Gerencia',
  bandera: 'División/Bandera',
  cuentaContable: 'Cuenta Contable',
  rubro: 'Rubro',
}

/** Chip-resumen de los filtros activos — no existe un componente genérico de "filtros activos" en el
 * resto del portal (solo el badge numérico sobre el botón), así que se construye uno propio acá,
 * compacto, para que quede claro bajo qué recorte se está mirando la tabla. Sin chip de moneda (se quitó
 * a pedido del usuario). */
export function DetalleChipContexto({ filtros }: { filtros: DetalleFiltros }) {
  const activos = (Object.keys(filtros) as (keyof DetalleFiltros)[]).filter((k) => filtros[k].length > 0)
  if (activos.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {activos.map((k) => (
        <span key={String(k)} className="inline-flex items-center gap-1 rounded-full bg-[#EFF4FF] px-2.5 py-1 text-[11px] font-semibold text-primary">
          {ETIQUETAS[k]}: {filtros[k].length > 2 ? `${filtros[k].length} seleccionados` : filtros[k].join(', ')}
        </span>
      ))}
    </div>
  )
}
