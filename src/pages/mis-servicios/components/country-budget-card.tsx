import { Icon } from '@/shared/ui'
import { paisFlag } from '@/data/services'
import type { CardTone, CountryCardData } from '../lib/budget-by-country'

function MetricRow({ label, value, tone }: { label: string; value: React.ReactNode; tone?: CardTone }) {
  // Bug corregido: "up" significa que Forecast+IPC subió respecto a Forecast base (gasto al alza) — debe
  // verse en rojo, no en verde. Estaba invertido (mismo bug que service-card-metrics.tsx).
  const toneClass =
    tone === 'up' ? 'text-[#DC2626]' : tone === 'down' ? 'text-[#067647]' : tone === 'ipc' ? 'text-[#E0A500]' : tone === 'hl' ? 'text-primary' : tone === 'muted' ? 'text-[#8A90A2]' : 'text-foreground'
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[8.5px] font-semibold tracking-wide text-muted-foreground uppercase">{label}</span>
      <b className={`text-[11.5px] font-extrabold tabular-nums ${toneClass}`}>{value}</b>
    </div>
  )
}

const EmptyValue = () => <span className="inline-block h-0 w-[22px] border-b-2 border-[#C2C8D4] align-middle" />

/** Tarjeta de país del panel "por país": encabezado con país y moneda y las métricas que arma cada vista. */
export function CountryBudgetCard({ c, onViewFx }: { c: CountryCardData; onViewFx: () => void }) {
  return (
    <div className="rounded-2xl bg-white p-[11px_10px] shadow-[0_1px_2px_rgba(6,20,60,0.05),0_5px_14px_-6px_rgba(6,20,60,0.14)]">
      <div className="mb-1.5 flex items-center justify-between border-b border-primary/12 pb-1.5">
        <span className="text-[10.5px] font-extrabold tracking-wide text-primary">{c.label}</span>
        <span className="text-[9px] font-bold tracking-wide text-[#8A90A2]">{c.moneda}</span>
      </div>
      <div className="flex flex-col gap-1">
        {c.metricas.map((m, i) =>
          m === 'sep' ? (
            <div key={i} className="my-px h-px bg-border" />
          ) : (
            <MetricRow key={m.label} label={m.label} value={c.empty ? <EmptyValue /> : m.value} tone={c.empty ? undefined : m.tone} />
          ),
        )}
      </div>
      {c.empty ? (
        <div className="mt-2.5 border-t border-dashed border-border pt-2 text-center text-[10px] font-semibold tracking-wide text-[#98A0AE] uppercase">
          Sin presupuesto cargado
        </div>
      ) : (
        <button
          type="button"
          onClick={onViewFx}
          className="mt-2.5 flex w-full items-center justify-between gap-1.5 rounded-lg bg-primary/7 px-2 py-[7px] hover:bg-primary/14"
        >
          <span className="flex items-center text-[10.5px] font-bold whitespace-nowrap text-primary">
            <span className="mr-1.5 text-[11px]">{paisFlag[c.pais]}</span>
            Conversión
          </span>
          <Icon name="chevron_right" size={13} color="#0047B0" />
        </button>
      )}
    </div>
  )
}
