import { useEffect, useMemo, useRef, useState } from 'react'
import { Icon } from '@/shared/ui'
import type { AnalysisGroup, MetricMode } from '@/data/reporteria'
import { AnalysisTableHeader } from './analysis-table-header'
import { GroupRow, ChildRow, TotalRow } from './analysis-rows'
import { buildHierTree } from '../lib/hier-tree'
import type { ScrollTarget } from '../lib/scroll-target'

interface AnalysisHierCardProps {
  title: string
  groups: AnalysisGroup[]
  isDolar?: boolean
  metricMode?: MetricMode
  highlightTarget?: ScrollTarget | null
}

export function AnalysisHierCard({ title, groups, isDolar = false, metricMode = 'ipc', highlightTarget }: AnalysisHierCardProps) {
  const [open, setOpen] = useState(true)
  const [expandedL1, setExpandedL1] = useState<Record<number, boolean>>({})
  const [expandedL2, setExpandedL2] = useState<Record<string, boolean>>({})
  const [expandedL3, setExpandedL3] = useState<Record<string, boolean>>({})
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({})

  const tree = useMemo(() => buildHierTree(groups, isDolar), [groups, isDolar])
  const totals = tree.reduce(
    (acc, g) => ({
      nombre: 'Total',
      plan: acc.plan + g.plan,
      fBase: acc.fBase + g.fBase,
      fIPC: acc.fIPC + g.fIPC,
      hcPlan: acc.hcPlan + g.hcPlan,
      hcFBase: acc.hcFBase + g.hcFBase,
      children: [],
    }),
    { nombre: 'Total', plan: 0, fBase: 0, fIPC: 0, hcPlan: 0, hcFBase: 0, children: [] as never[] },
  )

  useEffect(() => {
    if (!highlightTarget) return
    const gi = tree.findIndex((g) => g.children.some((c) => c.nombre === highlightTarget.nombre))
    if (gi === -1) return
    setOpen(true)
    setExpandedL1((prev) => ({ ...prev, [gi]: true }))
    const timer = setTimeout(() => {
      const el = rowRefs.current[highlightTarget.nombre]
      if (!el) return
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.style.transition = 'background 0.1s'
      el.style.background = '#DBEAFE'
      setTimeout(() => {
        el.style.transition = 'background 2.5s ease'
        el.style.background = ''
      }, 2500)
    }, 220)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightTarget])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between border-b border-border p-[12px_16px] text-left">
        <span className="text-[13px] font-bold text-primary">{title}</span>
        <Icon name={open ? 'chevron_left' : 'chevron_right'} size={13} color="#0047B0" />
      </button>
      {open && (
        <table className="w-full table-fixed border-collapse text-xs">
          <AnalysisTableHeader metricMode={metricMode} />
          <tbody>
            {tree.map((g, gi) => (
              <GroupBlock
                key={g.nombre}
                group={g}
                gi={gi}
                metricMode={metricMode}
                openL1={!!expandedL1[gi]}
                onToggleL1={() => setExpandedL1((prev) => ({ ...prev, [gi]: !prev[gi] }))}
                expandedL2={expandedL2}
                onToggleL2={(key) => setExpandedL2((prev) => ({ ...prev, [key]: !prev[key] }))}
                expandedL3={expandedL3}
                onToggleL3={(key) => setExpandedL3((prev) => ({ ...prev, [key]: !prev[key] }))}
                rowRefs={rowRefs}
              />
            ))}
            <TotalRow totals={totals} />
          </tbody>
        </table>
      )}
    </div>
  )
}

interface GroupBlockProps {
  group: ReturnType<typeof buildHierTree>[number]
  gi: number
  metricMode: MetricMode
  openL1: boolean
  onToggleL1: () => void
  expandedL2: Record<string, boolean>
  onToggleL2: (key: string) => void
  expandedL3: Record<string, boolean>
  onToggleL3: (key: string) => void
  rowRefs: React.MutableRefObject<Record<string, HTMLTableRowElement | null>>
}

function GroupBlock({ group, gi, metricMode, openL1, onToggleL1, expandedL2, onToggleL2, expandedL3, onToggleL3, rowRefs }: GroupBlockProps) {
  return (
    <>
      <GroupRow group={group} metricMode={metricMode} open={openL1} onToggle={onToggleL1} />
      {openL1 &&
        group.children.map((c, ci) => {
          const l2key = `${gi}_${ci}`
          return (
            <ChildRow
              key={l2key}
              child={c}
              metricMode={metricMode}
              open={!!expandedL2[l2key]}
              onToggle={() => onToggleL2(l2key)}
              expandedN4={Object.fromEntries(
                Object.entries(expandedL3)
                  .filter(([k]) => k.startsWith(`${l2key}_`))
                  .map(([k, v]) => [Number(k.slice(l2key.length + 1)), v]),
              )}
              onToggleN4={(i) => onToggleL3(`${l2key}_${i}`)}
              rowRef={(el) => {
                rowRefs.current[c.nombre] = el
              }}
            />
          )
        })}
    </>
  )
}
