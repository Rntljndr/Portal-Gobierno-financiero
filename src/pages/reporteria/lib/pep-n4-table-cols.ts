export interface StickyColDef {
  key: string
  label: string
  width: number
  toggleable: boolean
  sticky: boolean
}

export const ALL_STICKY_COLS: StickyColDef[] = [
  { key: 'spacer', label: '', width: 36, toggleable: false, sticky: true },
  { key: 'nombre', label: 'Nombre', width: 200, toggleable: true, sticky: true },
  { key: 'pep', label: 'PEP', width: 110, toggleable: true, sticky: false },
  { key: 'paisOrigen', label: 'P. Origen', width: 80, toggleable: true, sticky: false },
  { key: 'paisDestino', label: 'P. Destino', width: 80, toggleable: true, sticky: false },
  { key: 'equipo', label: 'Equipo', width: 100, toggleable: true, sticky: false },
] as const

export const TOGGLEABLE_COL_KEYS = ALL_STICKY_COLS.filter((c) => c.toggleable).map((c) => c.key)

export const SUB_HEADERS = ['Plan', 'F.Base', 'Var %', 'Var $', 'F+IPC', 'Var %', 'Var $'] as const

export interface StickyLayout {
  cols: StickyColDef[]
  left: number[]
  lastStickyIndex: number
  width: number
}

export function buildStickyLayout(visibleKeys: string[]): StickyLayout {
  const cols = ALL_STICKY_COLS.filter((c) => !c.toggleable || visibleKeys.includes(c.key))
  let stickyCum = 0
  let lastStickyIndex = -1
  const left = cols.map((c, i) => {
    if (!c.sticky) return -1
    const l = stickyCum
    stickyCum += c.width
    lastStickyIndex = i
    return l
  })
  const width = cols.reduce((sum, c) => sum + c.width, 0)
  return { cols, left, lastStickyIndex, width }
}
