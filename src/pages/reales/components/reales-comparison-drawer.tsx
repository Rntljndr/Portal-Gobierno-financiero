import { Button, Drawer, Select } from '@/shared/ui'
import { EMPTY_COMPARISONS, type Comparisons } from '../lib/comparisons'

interface RealesComparisonDrawerProps {
  open: boolean
  onClose: () => void
  comparisons: Comparisons
  onChange: (next: Comparisons) => void
}

export function RealesComparisonDrawer({ open, onClose, comparisons, onChange }: RealesComparisonDrawerProps) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Comparar con"
      footer={
        <>
          <Button variant="outline" onClick={() => onChange(EMPTY_COMPARISONS)}>
            Limpiar
          </Button>
          <Button variant="primary" onClick={onClose}>
            Aplicar
          </Button>
        </>
      }
    >
      <label className="flex cursor-pointer items-center gap-3 border-b border-[#F1F4FB] py-3">
        <input
          type="checkbox"
          checked={comparisons.presupuesto}
          onChange={(e) => onChange({ ...comparisons, presupuesto: e.target.checked })}
          className="size-4 accent-primary"
        />
        <div>
          <div className="text-[13px] font-semibold text-foreground">Presupuesto</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">Plan aprobado 2026</div>
        </div>
      </label>

      <div className="border-b border-[#F1F4FB] py-3.5">
        <div className="mb-2 text-[13px] font-semibold text-foreground">Forecast</div>
        <Select
          value={comparisons.forecastSel || 'none'}
          onChange={(v) => onChange({ ...comparisons, forecastSel: (v === 'none' ? '' : v) as Comparisons['forecastSel'] })}
          options={[
            { value: 'none', label: 'Sin comparación' },
            { value: 'forecastActual', label: 'Forecast actual (Ago 2026)' },
            { value: 'forecastAnterior', label: 'Forecast anterior (Jul 2026)' },
          ]}
        />
      </div>

      <label className="flex cursor-pointer items-center gap-3 py-3">
        <input
          type="checkbox"
          checked={comparisons.anioAnterior}
          onChange={(e) => onChange({ ...comparisons, anioAnterior: e.target.checked })}
          className="size-4 accent-[#22976B]"
        />
        <div>
          <div className="text-[13px] font-semibold text-foreground">Año anterior</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">Comparar con 2025</div>
        </div>
      </label>
    </Drawer>
  )
}
