import { useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Icon } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { MONTHS_BY_QUARTER, periodoLabel, quarterState, type Quarter, type SelMonths } from '@/shared/lib/periodo'

function TriStateCheck({ state }: { state: 'all' | 'none' | 'partial' }) {
  return (
    <span
      className={cn(
        'flex size-3.5 shrink-0 items-center justify-center rounded-sm border text-[10px] text-white',
        state === 'none' ? 'border-border-strong bg-white' : 'border-primary bg-primary',
      )}
    >
      {state === 'all' ? '✓' : state === 'partial' ? '—' : ''}
    </span>
  )
}

/** Igual al filtro "Mes" real: Q1-Q4 con checkbox tri-estado expandible a meses, sin selector de año
 * (el tablero real trabaja siempre sobre un único año). No acota resultados (ver filter-servicios.ts). */
export function ConsolidadaMesSelector({ value, onChange }: { value: SelMonths; onChange: (v: SelMonths) => void }) {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<Record<Quarter, boolean>>({ Q1: false, Q2: false, Q3: false, Q4: false })

  const toggleQuarter = (q: Quarter) => {
    const state = quarterState(value, q)
    const keys = MONTHS_BY_QUARTER[q].map((m) => m.key)
    const next = { ...value }
    keys.forEach((k) => (next[k] = state !== 'all'))
    onChange(next)
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button type="button" className="flex h-[38px] w-full items-center justify-between gap-2 rounded-lg border border-border bg-white px-3 text-left text-[12.5px] text-foreground hover:border-border-strong">
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">{periodoLabel(value)}</span>
          <Icon name="chevron_down" size={14} color="#8A90A2" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content sideOffset={4} align="start" className="z-[9100] max-h-[300px] w-[220px] overflow-y-auto rounded-lg border border-border bg-white shadow-[0_2px_15px_-3px_#0006]">
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
                  <button type="button" onClick={(e) => { e.stopPropagation(); setExpanded((prev) => ({ ...prev, [q]: !prev[q] })) }} className="inline-flex items-center p-0.5 text-muted-foreground">
                    <Icon name={isExpanded ? 'chevron_up' : 'chevron_down'} size={11} color="#8A90A2" />
                  </button>
                </div>
                {isExpanded &&
                  MONTHS_BY_QUARTER[q].map((m) => (
                    <div key={m.key} className="flex cursor-pointer items-center gap-2 border-b border-border p-[5px_12px_5px_32px]" onClick={() => onChange({ ...value, [m.key]: !value[m.key] })}>
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
