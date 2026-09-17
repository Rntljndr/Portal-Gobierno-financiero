import { paisMoneda as paisMonedaMap, type Pais } from '@/data/services'
import type { CurrencyView } from '@/data/reporteria'
import { Select } from '@/shared/ui'

const PAISES: Pais[] = ['Argentina', 'Brasil', 'Chile', 'Colombia', 'Estados Unidos', 'Perú', 'Uruguay']

interface PaisMonedaSelectorProps {
  vista: CurrencyView
  value: Pais | null
  onChange: (v: Pais | null) => void
}

/** Selector obligatorio de país cuando la vista es Origen ML o Destino ML: sin él no hay una moneda
 * común para totalizar (a diferencia de Destino USD, que sí consolida varios países a la vez).
 * Compartido entre Consolidado y Reporte de dirección — de ahí que viva en `features/`. */
export function PaisMonedaSelector({ vista, value, onChange }: PaisMonedaSelectorProps) {
  const label = vista === 'origen' ? 'País origen' : 'País destino'
  const options = PAISES.map((p) => ({ value: p, label: `${p} · ${paisMonedaMap[p]}` }))

  return (
    <div className="flex items-center gap-3">
      <div className="text-[13px] font-semibold whitespace-nowrap text-muted-foreground">{label}</div>
      <Select
        value={value ?? ''}
        onChange={(v) => onChange((v as Pais) || null)}
        options={options}
        placeholder="Seleccionar un país"
        className="min-w-[190px]"
      />
    </div>
  )
}
