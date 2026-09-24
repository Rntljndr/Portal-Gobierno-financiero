import { useEffect, useState } from 'react'
import { Button, Drawer } from '@/shared/ui'
import { monthKeys, monthLabels } from '@/data/reporteria'
import { formatForecastAmount } from '../lib/format-forecast-amount'

interface ForecastDistribuirMontosDrawerProps {
  open: boolean
  onClose: () => void
  nombre: string
  meses: Record<string, number>
  cutoff: number
  onAplicar: (meses: Record<string, number>) => void
}

/** "Distribuir Montos" (F, antes "Mes Conjunto"): seleccionar varios meses aún no cerrados y
 * asignarles un monto cada uno, con un total que ya considera los meses en Real. Vive al pie de la
 * tabla de Forecast (N4 o N7); "Aplicar distribución" guarda solo los meses tildados, "Cancelar"
 * descarta. "Seleccionar todo" tilda (o destilda, si ya estaban todos) los meses restantes de una vez. */
export function ForecastDistribuirMontosDrawer({ open, onClose, nombre, meses, cutoff, onAplicar }: ForecastDistribuirMontosDrawerProps) {
  const editables = monthKeys.map((k, i) => ({ k, i, label: monthLabels[i] })).filter((m) => m.i >= cutoff)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [montos, setMontos] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open) return
    setSelected(new Set())
    setMontos(Object.fromEntries(editables.map((m) => [m.k, String(meses[m.k] || 0)])))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al abrir, no en cada cambio de `meses`
  }, [open])

  const toggle = (k: string) => setSelected((s) => (s.has(k) ? new Set([...s].filter((x) => x !== k)) : new Set([...s, k])))
  const setMonto = (k: string, v: string) => setMontos((m) => ({ ...m, [k]: v }))
  const todoSeleccionado = editables.length > 0 && editables.every((m) => selected.has(m.k))
  const toggleTodo = () => setSelected(todoSeleccionado ? new Set() : new Set(editables.map((m) => m.k)))

  const realTotal = monthKeys.slice(0, cutoff).reduce((s, k) => s + (meses[k] || 0), 0)
  const forecastTotal = editables.reduce((s, m) => s + (selected.has(m.k) ? Number(montos[m.k]) || 0 : meses[m.k] || 0), 0)
  const total = realTotal + forecastTotal

  const aplicar = () => {
    const mesesOut = Object.fromEntries([...selected].map((k) => [k, Number(montos[k]) || 0]))
    onAplicar(mesesOut)
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      eyebrow="Distribuir Montos"
      title={nombre}
      subtitle="Seleccioná los meses a distribuir y asigná un monto a cada uno"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" disabled={selected.size === 0} onClick={aplicar}>
            Aplicar distribución
          </Button>
        </>
      }
    >
      <div className="mb-3 flex justify-end">
        <Button variant="outline" size="sm" onClick={toggleTodo}>
          {todoSeleccionado ? 'Deseleccionar todo' : 'Seleccionar todo'}
        </Button>
      </div>

      <div className="flex flex-col gap-2.5">
        {editables.map((m) => (
          <label key={m.k} className="flex items-center gap-3 rounded-lg border border-border p-2.5 has-[:checked]:border-primary/40 has-[:checked]:bg-[#F8FAFF]">
            <input type="checkbox" checked={selected.has(m.k)} onChange={() => toggle(m.k)} className="size-4 accent-primary" />
            <span className="w-10 text-[13px] font-semibold text-foreground">{m.label}</span>
            <input
              type="number"
              step="0.01"
              disabled={!selected.has(m.k)}
              value={montos[m.k] ?? ''}
              onChange={(e) => setMonto(m.k, e.target.value)}
              className="ml-auto w-[140px] rounded-lg border border-border px-3 py-1.5 text-right text-[13px] outline-none focus:border-primary disabled:bg-muted disabled:text-muted-foreground"
            />
          </label>
        ))}
      </div>

      <div className="mt-5 rounded-lg border border-border bg-[#F8F9FD] p-3.5">
        <div className="flex justify-between text-[12px] text-muted-foreground">
          <span>Real (meses cerrados)</span>
          <span className="tabular-nums">{formatForecastAmount(realTotal)}</span>
        </div>
        <div className="mt-1 flex justify-between text-[12px] text-muted-foreground">
          <span>Forecast (meses restantes)</span>
          <span className="tabular-nums">{formatForecastAmount(forecastTotal)}</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-border pt-2 text-[13px] font-bold text-foreground">
          <span>Total</span>
          <span className="tabular-nums">{formatForecastAmount(total)}</span>
        </div>
      </div>
    </Drawer>
  )
}
