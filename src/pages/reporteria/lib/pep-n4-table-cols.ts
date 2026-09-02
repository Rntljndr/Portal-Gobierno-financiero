export interface StickyColDef {
  key: string
  label: string
  width: number
  toggleable: boolean
}

export const ALL_STICKY_COLS: StickyColDef[] = [
  { key: 'spacer', label: '', width: 36, toggleable: false },
  { key: 'pep', label: 'PEP', width: 110, toggleable: true },
  { key: 'nombre', label: 'Nombre', width: 200, toggleable: true },
  { key: 'paisOrigen', label: 'P. Origen', width: 80, toggleable: true },
  { key: 'paisDestino', label: 'P. Destino', width: 80, toggleable: true },
  { key: 'equipo', label: 'Equipo', width: 100, toggleable: true },
] as const

export const TOGGLEABLE_COL_KEYS = ALL_STICKY_COLS.filter((c) => c.toggleable).map((c) => c.key)

export const SUB_HEADERS = ['Plan', 'F.Base', 'Var %', 'Var $', 'F+IPC', 'Var %', 'Var $'] as const

export interface StickyLayout {
  cols: StickyColDef[]
  left: number[]
  width: number
}

export function buildStickyLayout(visibleKeys: string[]): StickyLayout {
  const cols = ALL_STICKY_COLS.filter((c) => !c.toggleable || visibleKeys.includes(c.key))
  let cum = 0
  const left = cols.map((c) => {
    const l = cum
    cum += c.width
    return l
  })
  return { cols, left, width: cum }
}
