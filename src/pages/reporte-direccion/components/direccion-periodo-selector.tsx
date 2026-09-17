import { useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Icon } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { MONTH_KEYS, MONTHS_BY_QUARTER, quarterState, type Quarter, type SelMonths } from '@/shared/lib/periodo'
import { PERIODO_ANIOS, periodoLabel } from '../lib/use-direccion-filters'

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

interface QuarterGroupProps {
  q: Quarter
  meses: SelMonths
  isExpanded: boolean
  onToggleExpand: () => void
  onToggleQuarter: () => void
  onToggleMonth: (key: string) => void
}

function QuarterGroup({ q, meses, isExpanded, onToggleExpand, onToggleQuarter, onToggleMonth }: QuarterGroupProps) {
  const state = quarterState(meses, q)
  return (
    <div>
      <div className="flex items-center gap-1.5 border-b border-border bg-[#F8FAFC] p-[7px_12px]">
        <span className="flex flex-1 cursor-pointer items-center gap-1.5" onClick={onToggleQuarter}>
          <TriStateCheck state={state} />
          <span className="text-[12.5px] font-semibold text-foreground select-none">{q}</span>
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleExpand()
          }}
          className="inline-flex items-center p-0.5 text-muted-foreground"
        >
          <Icon name={isExpanded ? 'chevron_up' : 'chevron_down'} size={11} color="#8A90A2" />
        </button>
      </div>
      {isExpanded &&
        MONTHS_BY_QUARTER[q].map((m) => (
          <div key={m.key} className="flex cursor-pointer items-center gap-2 border-b border-border p-[5px_12px_5px_32px]" onClick={() => onToggleMonth(m.key)}>
            <TriStateCheck state={meses[m.key] ? 'all' : 'none'} />
            <span className="text-xs text-foreground select-none">{m.label}</span>
          </div>
        ))}
    </div>
  )
}

function YearTabs({ anio, onChangeAnio }: { anio: number; onChangeAnio: (anio: number) => void }) {
  return (
    <div className="flex items-center gap-1 border-b border-border p-[8px_10px]">
      {PERIODO_ANIOS.map((a) => (
        <button
          key={a}
          type="button"
          onClick={() => onChangeAnio(a)}
          className={cn(
            'flex-1 rounded-md p-[5px_0] text-center text-[12px] font-semibold text-muted-foreground hover:bg-surface-hover',
            a === anio && 'bg-primary text-white hover:bg-primary',
          )}
        >
          {a}
        </button>
      ))}
    </div>
  )
}

interface DireccionPeriodoSelectorProps {
  anio: number
  meses: SelMonths
  onChangeAnio: (anio: number) => void
  onChangeMeses: (meses: SelMonths) => void
}

export function DireccionPeriodoSelector({ anio, meses, onChangeAnio, onChangeMeses }: DireccionPeriodoSelectorProps) {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<Record<Quarter, boolean>>({ Q1: false, Q2: false, Q3: false, Q4: false })

  const allSelected = MONTH_KEYS.every((k) => meses[k])

  const toggleAll = () => {
    const anyOff = MONTH_KEYS.some((k) => !meses[k])
    onChangeMeses(Object.fromEntries(MONTH_KEYS.map((k) => [k, anyOff])))
  }
  const toggleQuarter = (q: Quarter) => {
    const state = quarterState(meses, q)
    const keys = MONTHS_BY_QUARTER[q].map((m) => m.key)
    const next = { ...meses }
    keys.forEach((k) => (next[k] = state !== 'all'))
    onChangeMeses(next)
  }
  const toggleMonth = (key: string) => onChangeMeses({ ...meses, [key]: !meses[key] })

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="flex h-[38px] w-full items-center justify-between gap-2 rounded-lg border border-border bg-white px-3 text-left text-[12.5px] text-foreground outline-none hover:border-border-strong"
        >
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">{periodoLabel(anio, meses)}</span>
          <Icon name="chevron_down" size={14} color="#8A90A2" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={4}
          align="start"
          className="z-[9100] max-h-[340px] w-[240px] overflow-y-auto rounded-lg border border-border bg-white shadow-[0_2px_15px_-3px_#0006]"
        >
          <YearTabs anio={anio} onChangeAnio={onChangeAnio} />

          <div className="flex cursor-pointer items-center gap-2 border-b border-border p-[8px_12px]" onClick={toggleAll}>
            <TriStateCheck state={allSelected ? 'all' : 'none'} />
            <span className="text-[12.5px] font-semibold text-foreground select-none">Seleccionar todo</span>
          </div>
          {(Object.keys(MONTHS_BY_QUARTER) as Quarter[]).map((q) => (
            <QuarterGroup
              key={q}
              q={q}
              meses={meses}
              isExpanded={expanded[q]}
              onToggleExpand={() => setExpanded((prev) => ({ ...prev, [q]: !prev[q] }))}
              onToggleQuarter={() => toggleQuarter(q)}
              onToggleMonth={toggleMonth}
            />
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
