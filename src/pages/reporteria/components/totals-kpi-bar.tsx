import { countryBudgets } from '@/data/reporteria'
import { Icon } from '@/shared/ui'
import { formatTableAmountUSD } from '@/shared/lib/format'

function KpiDivider() {
  return <div className="w-px shrink-0 self-stretch bg-border" />
}

function KpiCell({ label, value, tone, flex = 1 }: { label: string; value: string; tone?: 'increase' | 'decrease' | 'neutral'; flex?: number }) {
  const color = tone === 'increase' ? '#DC2626' : tone === 'decrease' ? '#067647' : undefined
  return (
    <div className="p-[10px_14px]" style={{ flex }}>
      <div className="mb-[3px] text-[10px] font-bold tracking-wide text-muted-foreground uppercase">{label}</div>
      <div className="flex items-center gap-1 text-[13.5px] font-bold" style={{ color: color ?? 'var(--fg-primary,#0047B0)' }}>
        {tone && tone !== 'neutral' && <Icon name="trendup" size={12} color={color} />}
        {value}
      </div>
    </div>
  )
}

export function TotalsKpiBar() {
  const totalPlan = countryBudgets.reduce((a, c) => a + c.plan, 0)
  const totalFBase = countryBudgets.reduce((a, c) => a + c.fBase, 0)
  const totalFIPC = countryBudgets.reduce((a, c) => a + c.fIPC, 0)

  const variacion = totalFBase - totalPlan
  const varPct = totalPlan ? (variacion / totalPlan) * 100 : 0
  const varTone = variacion === 0 ? 'neutral' : variacion > 0 ? 'increase' : 'decrease'

  const varFIPC = totalFIPC - totalFBase
  const varFIPCPct = totalFBase ? (varFIPC / totalFBase) * 100 : 0
  const varFIPCTone = varFIPC === 0 ? 'neutral' : varFIPC > 0 ? 'increase' : 'decrease'

  return (
    <div className="mx-8 mb-4 flex items-stretch overflow-hidden rounded-xl border border-border bg-white">
      <KpiCell label="Plan" value={formatTableAmountUSD(totalPlan)} />
      <KpiDivider />
      <KpiCell label="Forecast base" value={formatTableAmountUSD(totalFBase)} />
      <KpiDivider />
      <KpiCell label="Variación %" value={`${varPct > 0 ? '+' : ''}${varPct.toFixed(1)}%`} tone={varTone} />
      <KpiDivider />
      <KpiCell label="Variación $" value={formatTableAmountUSD(Math.abs(variacion))} tone={varTone} />
      <div className="mx-1 w-[3px] shrink-0 self-stretch bg-border" />
      <KpiCell label="Forecast base + IPC" value={formatTableAmountUSD(totalFIPC)} flex={1.2} />
      <KpiDivider />
      <KpiCell label="Variación %" value={`${varFIPCPct > 0 ? '+' : ''}${varFIPCPct.toFixed(1)}%`} tone={varFIPCTone} />
      <KpiDivider />
      <KpiCell label="Variación $" value={formatTableAmountUSD(Math.abs(varFIPC))} tone={varFIPCTone} />
    </div>
  )
}
