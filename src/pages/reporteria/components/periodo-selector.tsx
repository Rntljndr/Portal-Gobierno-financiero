import { useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { cn } from '@/shared/lib/utils'
import { Icon } from '@/shared/ui'
import { MONTHS_BY_QUARTER, MONTH_KEYS, periodoLabel, quarterState, type Quarter, type SelMonths } from '../lib/periodo'

function TriStateCheck({ state }: { state: 'all' | 'none' | 'partial' }) {
  return (
    <span
      className={cn(
        'flex size-3.5 shrink-0 items-center justify-center rounded-sm border text-[10px] text-white',
        state === 'all' ? 'border-primary bg-primary' : state === 'partial' ? 'border-primary bg-primary' : 'border-border-strong bg-white',
      )}
    >
      {state === 'all' ? '✓' : state === 'partial' ? '—' : ''}
    </span>
  )
}

interface PeriodoSelectorProps {
  value: SelMonths
  onChange: (next: SelMonths) => void
}

export function PeriodoSelector({ value, onChange }: PeriodoSelectorProps) {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<Record<Quarter, boolean>>({ Q1: false, Q2: false, Q3: false, Q4: false })

  const allSelected = MONTH_KEYS.every((k) => value[k])

  const toggleAll = () => {
    const anyOff = MONTH_KEYS.some((k) => !value[k])
    onChange(Object.fromEntries(MONTH_KEYS.map((k) => [k, anyOff])))
  }
  const toggleQuarter = (q: Quarter) => {
    const state = quarterState(value, q)
    const keys = MONTHS_BY_QUARTER[q].map((m) => m.key)
    const next = { ...value }
    keys.forEach((k) => (next[k] = state !== 'all'))
    onChange(next)
  }
  const toggleMonth = (key: string) => onChange({ ...value, [key]: !value[key] })

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="flex h-9 min-w-[220px] items-center justify-between gap-2 rounded-lg border border-primary bg-[#EFF4FF] px-2.5 text-[12.5px] font-medium text-foreground"
        >
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">{periodoLabel(value)}</span>
          <Icon name="chevron_down" size={12} color="#0073FF" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="start" sideOffset={4} className="z-[9100] min-w-[240px] max-h-[300px] overflow-y-auto rounded-lg border border-border bg-white shadow-[0_2px_15px_-3px_#0006]">
          <div className="flex cursor-pointer items-center gap-2 border-b border-border p-[8px_12px]" onClick={toggleAll}>
            <TriStateCheck state={allSelected ? 'all' : 'none'} />
            <span className="text-[12.5px] font-semibold text-foreground select-none">Seleccionar todo</span>
          </div>
          {(Object.keys(MONTHS_BY_QUARTER) as Quarter[]).map((q) => {
            const state = quarterState(value, q)
            const isExpanded = expanded[q]
            return (
              <div key={q}>
                <div className="flex items-center gap-1.5 border-b border-border bg-[#F8FAFC] p-[7px_12px]">
                  <span className="flex flex-1 cursor-pointer items-center gap-1.5" onClick={() => toggleQuarter(q)}>
                    <TriStateCheck state={state} />
                    <span className="text-[12.5px] font-semibold text-foreground select-none">{q}</span>
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpanded((prev) => ({ ...prev, [q]: !prev[q] }))
                    }}
                    className="inline-flex items-center p-0.5 text-muted-foreground"
                  >
                    <Icon name={isExpanded ? 'chevron_up' : 'chevron_down'} size={11} color="#8A90A2" />
                  </button>
                </div>
                {isExpanded &&
                  MONTHS_BY_QUARTER[q].map((m) => (
                    <div key={m.key} className="flex cursor-pointer items-center gap-2 border-b border-border p-[5px_12px_5px_32px]" onClick={() => toggleMonth(m.key)}>
                      <TriStateCheck state={value[m.key] ? 'all' : 'none'} />
                      <span className="text-xs text-foreground select-none">{m.label}</span>
                    </div>
                  ))}
              </div>
            )
          })}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
