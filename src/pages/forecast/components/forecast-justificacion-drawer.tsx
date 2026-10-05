import { Drawer } from '@/shared/ui'
import { monthKeys, monthLabels } from '@/data/reporteria'
import type { ForecastN7Linea } from '@/data/forecast-lineas'

interface ForecastJustificacionDrawerProps {
  n7: ForecastN7Linea | undefined
  onClose: () => void
}

/** "Justificación de Desvío" (F): se abre al seleccionar el "Sí" de la columna Justificación — detalla,
 * mes a mes, la justificación y el comentario ingresados al editar este PEP N7 (M5: el texto del motivo
 * no se muestra en la tabla, solo acá). */
export function ForecastJustificacionDrawer({ n7, onClose }: ForecastJustificacionDrawerProps) {
  const entradas = n7
    ? monthKeys.map((k, i) => ({ mes: monthLabels[i], nota: n7.notas[k] })).filter((e): e is { mes: string; nota: NonNullable<(typeof e)['nota']> } => !!e.nota?.justificacion)
    : []

  return (
    <Drawer open={!!n7} onClose={onClose} title="Justificación de Desvío" subtitle={n7 ? `${n7.n7Codigo} · ${n7.n7Nombre}` : undefined}>
      <div className="flex flex-col gap-4">
        {entradas.map(({ mes, nota }) => (
          <div key={mes} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
            <div className="text-[12px] font-bold text-foreground">{mes}</div>
            <div className="mt-1 text-[12.5px] text-cs-gris-oscuro">{nota.justificacion}</div>
            {nota.comentario && <div className="mt-1.5 rounded-md bg-[#F8F9FD] p-[8px_10px] text-[12px] text-cs-gris-oscuro italic">"{nota.comentario}"</div>}
          </div>
        ))}
      </div>
    </Drawer>
  )
}
