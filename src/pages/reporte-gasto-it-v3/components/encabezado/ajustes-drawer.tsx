import { Alert, Button, ConfigRow, Drawer, ViewToggle } from '@/shared/ui'
import type { Ajustes } from '../../lib/contexto'
import { TOLERANCIAS } from '../../lib'

interface AjustesDrawerProps {
  open: boolean
  onClose: () => void
  ajustes: Ajustes
  onChange: (a: Ajustes) => void
}

/** Parámetros del reporte (Drawer + Drw-config-row). Incluye los "puntos abiertos" sin resolverlos. */
export function AjustesDrawer({ open, onClose, ajustes, onChange }: AjustesDrawerProps) {
  return (
    <Drawer open={open} onClose={onClose} eyebrow="Reporte ejercicio en curso" title="Ajustes del reporte" footer={<Button onClick={onClose}>Listo</Button>}>
      <div className="flex flex-col gap-4">
        <ConfigRow title="Umbral de tolerancia" description="Dentro del rango el desvío es neutro (●). Sobre él es negativo (▲ rojo) y bajo él positivo (▼ verde).">
          <ViewToggle
            value={String(ajustes.tolerancia)}
            onChange={(v) => onChange({ ...ajustes, tolerancia: Number(v) })}
            options={TOLERANCIAS.map((t) => ({ value: String(t), label: `±${t} %` }))}
          />
        </ConfigRow>
        <ConfigRow title="Orden del ranking" description="Punto abierto. En monto destaca lo que más pesa; en % compara negocios de distinto tamaño.">
          <ViewToggle
            value={ajustes.rankingOrden}
            onChange={(v) => onChange({ ...ajustes, rankingOrden: v })}
            options={[
              { value: 'pct', label: 'Desvío %' },
              { value: 'monto', label: 'Desvío en monto' },
            ]}
          />
        </ConfigRow>
        <Alert variant="info" title="Otros puntos abiertos">
          Qué rubros son prioritarios para cada audiencia, y si el gestor de gasto necesitará un reporte propio.
        </Alert>
      </div>
    </Drawer>
  )
}
