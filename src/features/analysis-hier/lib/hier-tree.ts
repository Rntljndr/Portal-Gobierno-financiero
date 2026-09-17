import type { AnalysisChild, AnalysisGroup, MetricMode } from '@/data/reporteria'

export function applyMetricMode(fIPC: number, metricMode: MetricMode): number {
  return metricMode === 'target' ? Math.round(fIPC * 0.975) : fIPC
}

export interface HierLeaf {
  nombre: string
  plan: number
  fBase: number
  fIPC: number
  hcPlan: number
  hcFBase: number
}

export interface HierN4 extends HierLeaf {
  pepN7: HierLeaf[]
}

export interface HierChild extends HierLeaf {
  pepN4: HierN4[]
}

export interface HierGroup extends HierLeaf {
  children: HierChild[]
}

const HC_PLAN_RATIO = 0.0144
const HC_FBASE_RATIO = 0.0149
const N4_SPLITS = [0.38, 0.35, 0.27]
const N7_SPLITS = [0.62, 0.38]

function hc(value: number, ratio: number): number {
  return Math.max(1, Math.round(value * ratio))
}

function genPepN4(nombre: string, fBase: number, plan: number, fIPC: number): HierN4[] {
  return N4_SPLITS.map((split, i) => {
    const fb = Math.round(fBase * split)
    const pl = Math.round(plan * split)
    const fi = Math.round(fIPC * split)
    const label = `PEP-N4-${String(i + 1).padStart(2, '0')} · ${nombre.slice(0, 18)}`
    const pepN7 = N7_SPLITS.map((s7, j) => ({
      nombre: `PEP-N7-${String(j + 1).padStart(2, '0')} · ${nombre.slice(0, 14)}`,
      plan: Math.round(pl * s7),
      fBase: Math.round(fb * s7),
      fIPC: Math.round(fi * s7),
      hcPlan: hc(Math.round(pl * s7), HC_PLAN_RATIO),
      hcFBase: hc(Math.round(fb * s7), HC_FBASE_RATIO),
    }))
    return { nombre: label, plan: pl, fBase: fb, fIPC: fi, hcPlan: hc(pl, HC_PLAN_RATIO), hcFBase: hc(fb, HC_FBASE_RATIO), pepN7 }
  })
}

function conv(v: number, isDolar: boolean): number {
  return isDolar ? Math.round(v / 950) : v
}

function buildChild(c: AnalysisChild, isDolar: boolean): HierChild {
  const fb = conv(c.fBase, isDolar)
  const pl = conv(c.plan, isDolar)
  const fi = conv(c.fIPC || Math.round(c.fBase * 1.04), isDolar)
  return {
    nombre: c.nombre,
    plan: pl,
    fBase: fb,
    fIPC: fi,
    hcPlan: hc(pl, HC_PLAN_RATIO),
    hcFBase: hc(fb, HC_FBASE_RATIO),
    pepN4: genPepN4(c.nombre, fb, pl, fi),
  }
}

function sumChildren(children: HierChild[]): Omit<HierGroup, 'nombre' | 'children'> {
  return children.reduce(
    (acc, c) => ({
      plan: acc.plan + c.plan,
      fBase: acc.fBase + c.fBase,
      fIPC: acc.fIPC + c.fIPC,
      hcPlan: acc.hcPlan + c.hcPlan,
      hcFBase: acc.hcFBase + c.hcFBase,
    }),
    { plan: 0, fBase: 0, fIPC: 0, hcPlan: 0, hcFBase: 0 },
  )
}

export function buildHierTree(groups: AnalysisGroup[], isDolar: boolean): HierGroup[] {
  return groups.map((g) => {
    const children = g.children.map((c) => buildChild(c, isDolar))
    return { nombre: g.nombre, children, ...sumChildren(children) }
  })
}
