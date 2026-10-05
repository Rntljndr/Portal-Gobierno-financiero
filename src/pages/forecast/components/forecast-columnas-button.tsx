import { useState } from 'react'
import { Button, ColumnsDrawer, Icon } from '@/shared/ui'
import { FORECAST_IDENTITY_COLS } from '../lib/forecast-identity-cols'

interface ForecastColumnasButtonProps {
  variant: 'n4' | 'n7'
  visibleCols: string[]
  onChange: (cols: string[]) => void
}

/** Botón "Columnas" (mismo patrón que Reales, ver reales-toolbar.tsx + shared/ui/columns-drawer.tsx —
 * ColumnsDrawer es genérico de shared/ui, se reutiliza directo) — controla qué columnas de identidad
 * de la tabla activa (N4 o N7) se muestran. Dueño de su propio estado de apertura; `visibleCols` queda
 * controlado por el padre porque la tabla también lo necesita para las columnas y el colSpan. */
export function ForecastColumnasButton({ variant, visibleCols, onChange }: ForecastColumnasButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Icon name="eye" size={12} color="#0047B0" /> Columnas
      </Button>
      <ColumnsDrawer open={open} cols={FORECAST_IDENTITY_COLS[variant]} visibleCols={visibleCols} onApply={onChange} onClose={() => setOpen(false)} />
    </>
  )
}
