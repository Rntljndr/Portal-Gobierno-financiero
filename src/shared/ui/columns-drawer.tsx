import { useEffect, useState } from 'react'
import { Button } from './button'
import { Drawer } from './drawer'

export interface ColumnsDrawerColDef {
  key: string
  label: string
}

interface ColumnsDrawerProps {
  open: boolean
  cols: ColumnsDrawerColDef[]
  visibleCols: string[]
  onApply: (cols: string[]) => void
  onClose: () => void
}

export function ColumnsDrawer({ open, cols, visibleCols, onApply, onClose }: ColumnsDrawerProps) {
  const [draft, setDraft] = useState(visibleCols)
  const [minError, setMinError] = useState(false)

  useEffect(() => {
    if (open) { setDraft(visibleCols); setMinError(false) }
  }, [open, visibleCols])

  if (!open) return null

  const allSelected = cols.every((c) => draft.includes(c.key))

  const toggle = (key: string) => {
    if (draft.includes(key)) {
      if (draft.length <= 1) { setMinError(true); return }
      setDraft(draft.filter((k) => k !== key))
    } else {
      setDraft([...draft, key])
    }
    setMinError(false)
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Visualizar columnas"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button
            variant="primary"
            onClick={() => {
              if (draft.length === 0) { setMinError(true); return }
              onApply(draft)
              onClose()
            }}
          >
            Aplicar
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        {cols.map((c) => (
          <label key={c.key} className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
            <input type="checkbox" checked={draft.includes(c.key)} onChange={() => toggle(c.key)} className="size-4 accent-primary" />
            {c.label}
          </label>
        ))}
      </div>
      {minError && <div className="mt-2.5 text-xs text-destructive">Debe haber al menos una columna seleccionada.</div>}
      <Button
        variant="outline"
        size="sm"
        className="mt-4"
        onClick={() => {
          setDraft(allSelected ? [cols[0].key] : cols.map((c) => c.key))
          setMinError(false)
        }}
      >
        {allSelected ? 'Deseleccionar todo' : 'Seleccionar todo'}
      </Button>
    </Drawer>
  )
}
