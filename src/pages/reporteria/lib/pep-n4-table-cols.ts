export const STICKY_COLS = [
  { label: '', width: 36 },
  { label: 'PEP', width: 110 },
  { label: 'Nombre', width: 200 },
  { label: 'P. Origen', width: 80 },
  { label: 'P. Destino', width: 80 },
  { label: 'Equipo', width: 100 },
] as const

export const STICKY_LEFT: number[] = (() => {
  let cum = 0
  return STICKY_COLS.map((c) => {
    const left = cum
    cum += c.width
    return left
  })
})()

export const STICKY_WIDTH = STICKY_COLS.reduce((a, c) => a + c.width, 0)

export const SUB_HEADERS = ['Plan', 'F.Base', 'Var %', 'Var $', 'F+IPC', 'Var %', 'Var $'] as const
