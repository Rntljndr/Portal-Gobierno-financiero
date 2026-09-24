import { FORECAST_IDENTITY_N4_LABELS, FORECAST_IDENTITY_N7_LABELS } from '../lib/forecast-identity-cols'

const th = 'p-[9px_8px] text-left text-[10.5px] font-bold tracking-[0.04em] text-muted-foreground uppercase whitespace-nowrap border-b-2 border-border bg-[#F4F6FB]'

interface ForecastIdentityHeaderCellsProps {
  variant: 'n4' | 'n7'
}

/** Columnas de identidad copiadas de ForecastN4Historico/ForecastN7Historico (F) — van entre el
 * nombre del servicio (ya existente, ordenable) y los meses. No son ordenables: son muchas y de
 * distinto tipo (texto/código/porcentaje), agregar orden acá sumaría ruido sin pedirlo (F). */
export function ForecastIdentityHeaderCells({ variant }: ForecastIdentityHeaderCellsProps) {
  const labels = variant === 'n4' ? FORECAST_IDENTITY_N4_LABELS : FORECAST_IDENTITY_N7_LABELS
  return (
    <>
      {labels.map((label) => (
        <th key={label} className={th}>
          {label}
        </th>
      ))}
    </>
  )
}
