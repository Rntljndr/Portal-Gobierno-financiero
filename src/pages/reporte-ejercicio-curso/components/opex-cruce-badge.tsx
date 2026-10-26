import { Icon } from '@/shared/ui'

/** Aviso de que esta tabla está siendo cruzada por la selección de otro filtro — hace visible la
 * interacción real entre tablas (verificada contra Power BI) en vez de que el cambio de cifras pase
 * desapercibido. */
export function OpexCruceBadge({ etiqueta, valores }: { etiqueta: string; valores: string[] }) {
  if (valores.length === 0) return null
  return (
    <div className="mb-2 flex animate-[fadeIn_0.2s_ease-out] items-center gap-1.5 rounded-md bg-primary/8 px-2.5 py-1.5 text-[11px] font-medium text-primary">
      <Icon name="filter" size={11} color="#0047B0" />
      Cruzado por {etiqueta}: {valores.join(', ')}
    </div>
  )
}
