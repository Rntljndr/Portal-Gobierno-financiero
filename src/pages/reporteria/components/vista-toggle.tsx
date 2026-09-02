import { cn } from '@/shared/lib/utils'
import { currencyViews, type CurrencyView, type MetricMode } from '@/data/reporteria'

interface VistaToggleProps {
  vistaMoneda: CurrencyView
  onVistaMonedaChange: (v: CurrencyView) => void
  metricMode: MetricMode
  onMetricModeChange: (m: MetricMode) => void
}

export function VistaToggle({ vistaMoneda, onVistaMonedaChange, metricMode, onMetricModeChange }: VistaToggleProps) {
  const targetEnabled = vistaMoneda !== 'origen'

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SegmentedGroup label="Ver montos por">
        {currencyViews.map((opt) => (
          <SegmentButton key={opt.id} active={vistaMoneda === opt.id} onClick={() => onVistaMonedaChange(opt.id)}>
            {opt.label}
          </SegmentButton>
        ))}
      </SegmentedGroup>
      <SegmentedGroup label="Comparar con">
        <SegmentButton active={metricMode === 'ipc'} onClick={() => onMetricModeChange('ipc')}>
          IPC
        </SegmentButton>
        <SegmentButton
          active={metricMode === 'target'}
          disabled={!targetEnabled}
          onClick={() => onMetricModeChange('target')}
          title={targetEnabled ? undefined : 'Target solo disponible en Vista Destino'}
        >
          Target
        </SegmentButton>
      </SegmentedGroup>
    </div>
  )
}

function SegmentedGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <span className="text-[10.5px] font-semibold whitespace-nowrap text-white/70">{label}</span>
      <div className="flex items-center gap-0.5 rounded-lg bg-white/12 p-[3px]">{children}</div>
    </div>
  )
}

function SegmentButton({
  active,
  disabled,
  onClick,
  title,
  children,
}: {
  active: boolean
  disabled?: boolean
  onClick: () => void
  title?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      title={title}
      className={cn(
        'rounded-md px-2.5 py-[5px] text-xs whitespace-nowrap text-white/80 disabled:cursor-not-allowed disabled:opacity-40',
        active && 'bg-white font-bold text-primary shadow-[0_1px_4px_rgba(0,20,60,0.25)]',
      )}
    >
      {children}
    </button>
  )
}
