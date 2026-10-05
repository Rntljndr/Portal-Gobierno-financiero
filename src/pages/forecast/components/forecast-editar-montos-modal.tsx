import { useEffect, useState } from 'react'
import { Button, Drawer, Toast } from '@/shared/ui'
import { useToast } from '@/shared/lib/use-toast'
import { monthKeys } from '@/data/reporteria'
import type { ForecastN4Linea } from '@/data/forecast-lineas'
import { pepN4Meta } from '@/data/pep-n4-meta'
import { useForecastStore } from '../lib/use-forecast-store'
import { calcN4Meses } from '../lib/forecast-edit-calc'
import { ForecastAsignacionMesesTabla } from './forecast-asignacion-meses-tabla'

interface ForecastEditarMontosModalProps {
  open: boolean
  onClose: () => void
  roundId: string
  n4: ForecastN4Linea
  cutoff: number
}

function buildDraft(n4Meses: Record<string, number>, cutoff: number): Record<string, string> {
  const draft: Record<string, string> = {}
  monthKeys.forEach((k, i) => {
    if (i >= cutoff) draft[k] = String(n4Meses[k] || 0)
  })
  return draft
}

// F: "un monto por mes y el monto total" — partes iguales entre los meses de forecast; el último
// mes absorbe el redondeo para que la suma cuadre exacto con el monto ingresado.
function repartirIgual(montoNum: number, cutoff: number, cantidadEditables: number, draft: Record<string, string>): Record<string, string> {
  const next = { ...draft }
  let acumulado = 0
  let i = 0
  monthKeys.forEach((k, idx) => {
    if (idx < cutoff) return
    i++
    const partesIguales = Math.round(montoNum / cantidadEditables)
    const valor = i === cantidadEditables ? montoNum - acumulado : partesIguales
    acumulado += valor
    next[k] = String(valor)
  })
  return next
}

/** "Asignación de monto" (F) — mismo drawer y componentes que "Asignación de monto" de Presupuesto,
 * sin el selector "Tipo de asignación" (F: "se debe eliminar"). Los meses de forecast ya traen el
 * monto vigente (F: "ya debe traer un monto") y se editan de dos formas: directo mes a mes en la
 * tabla, o escribiendo un monto total que se reparte en partes iguales entre esos mismos meses — los
 * meses en Real quedan fijos (F: "los meses que están en reales no se deben modificar"). */
export function ForecastEditarMontosModal({ open, onClose, roundId, n4, cutoff }: ForecastEditarMontosModalProps) {
  const { updateN4Monto } = useForecastStore()
  const { message, showToast } = useToast()
  const moneda = pepN4Meta[n4.n4Codigo]?.moneda ?? ''
  const cantidadEditables = monthKeys.length - cutoff

  const [draft, setDraft] = useState<Record<string, string>>(() => buildDraft(calcN4Meses(n4), cutoff))
  const [montoTotal, setMontoTotal] = useState('')

  useEffect(() => {
    if (!open) return
    const n4Meses = calcN4Meses(n4)
    setDraft(buildDraft(n4Meses, cutoff))
    setMontoTotal(String(monthKeys.reduce((s, k, i) => (i >= cutoff ? s + (n4Meses[k] || 0) : s), 0)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, n4.n4Codigo, cutoff])

  const n4MesesReales = calcN4Meses(n4)
  const setMes = (k: string, value: string) => setDraft((d) => ({ ...d, [k]: value }))

  const distribuirTotal = (value: string) => {
    setMontoTotal(value)
    const montoNum = Number(value)
    if (value.trim() === '' || Number.isNaN(montoNum) || cantidadEditables <= 0) return
    setDraft((d) => repartirIgual(montoNum, cutoff, cantidadEditables, d))
  }

  const aplicar = () => {
    monthKeys.forEach((k, i) => {
      if (i < cutoff) return
      updateN4Monto(roundId, n4.n4Codigo, k, Number(draft[k]) || 0)
    })
    showToast('Monto asignado entre los meses de forecast según la llave de distribución vigente.')
    onClose()
  }

  const valorMes = (i: number) => (i < cutoff ? n4MesesReales[monthKeys[i]] || 0 : Number(draft[monthKeys[i]]) || 0)
  const totalAsignado = monthKeys.reduce((s, _, i) => s + valorMes(i), 0)

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        headerVariant="dark"
        xwide
        title="Asignación de monto"
        footer={
          <>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" disabled={cantidadEditables <= 0} onClick={aplicar}>
              Aplicar asignación
            </Button>
          </>
        }
      >
        <div className="mb-5 max-w-[360px]">
          <label className="mb-1.5 block text-[12px] font-semibold text-cs-gris-oscuro">Monto total a asignar</label>
          <div className="flex items-center rounded-lg border border-border focus-within:border-primary">
            <span className="shrink-0 border-r border-border px-3 py-2 text-[12.5px] font-semibold text-muted-foreground">{moneda} $</span>
            <input
              type="number"
              min="0"
              value={montoTotal}
              onChange={(e) => distribuirTotal(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 text-right text-[13px] outline-none"
            />
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Se reparte en partes iguales entre los {cantidadEditables} meses de forecast. También puedes editar cada mes directo en la tabla.
          </p>
        </div>

        <ForecastAsignacionMesesTabla cutoff={cutoff} valorMes={valorMes} total={totalAsignado} draft={draft} onChangeMes={setMes} />
      </Drawer>
      <Toast message={message} />
    </>
  )
}
