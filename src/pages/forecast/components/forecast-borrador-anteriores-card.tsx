import { Icon } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'

interface ForecastBorradorAnterioresCardProps {
  borrador: ForecastRound | undefined
  anterioresCount: number
  onClick: () => void
}

/** Card única que reemplaza a las anteriores ForecastBorradorCard + ForecastAnterioresCard (F: "debe
 * ser una y en un solo botón") — al hacer clic abre un único drawer con el forecast en Borrador
 * arriba y el buscador de forecasts anteriores debajo. */
export function ForecastBorradorAnterioresCard({ borrador, anterioresCount, onClick }: ForecastBorradorAnterioresCardProps) {
  const disabled = !borrador && anterioresCount === 0

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex-1 rounded-xl border border-border bg-white p-5 text-left transition-colors hover:border-primary/40 hover:bg-[#F8FAFF] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-border disabled:hover:bg-white"
    >
      <div className="mb-1.5 flex items-center justify-between">
        <div className="text-[11px] font-bold tracking-[0.07em] text-muted-foreground uppercase">Borrador y Anteriores</div>
        <Icon name="chevron_right" size={14} color="#8A90A2" />
      </div>
      <div className="mb-4 flex flex-col gap-1 text-[12.5px] text-muted-foreground">
        <span>{borrador ? <span className="font-semibold text-foreground">{borrador.titulo}</span> : 'Sin forecast en borrador'}</span>
        <span>
          {anterioresCount} forecast{anterioresCount === 1 ? '' : 's'} cerrado{anterioresCount === 1 ? '' : 's'}
        </span>
      </div>
      <div className="text-[12px] font-semibold text-primary">{disabled ? 'Todavía no hay nada para ver acá' : 'Ver borrador y listado de anteriores →'}</div>
    </button>
  )
}
