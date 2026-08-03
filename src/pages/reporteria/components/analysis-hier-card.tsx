import { useState } from 'react'
import { Icon } from '@/shared/ui'
import type { AnalysisChild, AnalysisGroup } from '@/data/reporteria'
import { AnalysisTableHeader } from './analysis-table-header'
import { ChildRow, GroupRow, TotalRow } from './analysis-rows'

function sumGroup(group: AnalysisGroup): AnalysisChild {
  return group.children.reduce(
    (acc, c) => ({ nombre: group.nombre, plan: acc.plan + c.plan, fBase: acc.fBase + c.fBase, fIPC: acc.fIPC + c.fIPC }),
    { nombre: group.nombre, plan: 0, fBase: 0, fIPC: 0 },
  )
}

export function AnalysisHierCard({ title, groups }: { title: string; groups: AnalysisGroup[] }) {
  const [open, setOpen] = useState(true)
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})

  const totals = groups.reduce(
    (acc, g) => {
      const t = sumGroup(g)
      return { plan: acc.plan + t.plan, fBase: acc.fBase + t.fBase, fIPC: acc.fIPC + t.fIPC }
    },
    { plan: 0, fBase: 0, fIPC: 0 },
  )

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between border-b border-border p-[12px_16px] text-left"
      >
        <span className="text-[13px] font-bold text-primary">{title}</span>
        <Icon name={open ? 'chevron_left' : 'chevron_right'} size={13} color="#0047B0" />
      </button>
      {open && (
        <table className="w-full table-fixed border-collapse text-xs">
          <AnalysisTableHeader />
          <tbody>
            {groups.map((g, gi) => {
              const isOpen = !!expanded[gi]
              const groupTotals = sumGroup(g)
              return (
                <GroupRowGroup
                  key={g.nombre}
                  group={g}
                  totals={groupTotals}
                  open={isOpen}
                  onToggle={() => setExpanded((prev) => ({ ...prev, [gi]: !prev[gi] }))}
                />
              )
            })}
            <TotalRow totals={{ nombre: 'Total', ...totals }} />
          </tbody>
        </table>
      )}
    </div>
  )
}

function GroupRowGroup({ group, totals, open, onToggle }: { group: AnalysisGroup; totals: AnalysisChild; open: boolean; onToggle: () => void }) {
  return (
    <>
      <GroupRow nombre={group.nombre} totals={totals} open={open} onToggle={onToggle} />
      {open && group.children.map((c) => <ChildRow key={c.nombre} child={c} />)}
    </>
  )
}
