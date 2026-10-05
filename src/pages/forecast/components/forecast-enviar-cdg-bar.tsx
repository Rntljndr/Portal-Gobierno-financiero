import { useState } from 'react'
import { Button, Icon, Modal } from '@/shared/ui'
import type { ForecastEnvioTransicion } from '../lib/forecast-envio'

const TRANSICION_LABEL: Record<ForecastEnvioTransicion, string> = {
  enviar: 'Enviar a Control de Gestión',
  aprobar: 'Aprobar',
  rechazar: 'Rechazar',
}

interface ForecastEnviarCdgBarProps {
  count: number
  onAplicar: (transicion: ForecastEnvioTransicion) => void
}

/** Barra "Enviar a Control de Gestión" (M7) — misma ubicación que en el ejercicio en curso de
 * Presupuesto (mis-servicios/components/send-bar.tsx): extremo inferior derecho, bajo la tabla, con
 * Aprobar/Rechazar a la izquierda de Enviar. "Seleccionar todo" ya no vive acá — se movió al header de
 * la tabla, al lado de "Comparar" (ver ForecastTablaHeader). Las tres acciones se habilitan recién con
 * 1+ líneas seleccionadas; cada transición ignora en silencio las que no estén en un estado de origen
 * válido (ver aplicarTransicionCdGBulk), así que la confirmación no promete un resultado exacto por
 * línea, solo la acción sobre la selección. */
export function ForecastEnviarCdgBar({ count, onAplicar }: ForecastEnviarCdgBarProps) {
  const [confirmando, setConfirmando] = useState<ForecastEnvioTransicion | null>(null)
  const disabled = count === 0

  return (
    <div className="mx-8 mb-6 flex flex-wrap items-center justify-end gap-2 border-t border-border bg-white p-[14px_4px]">
      <span className="mr-auto text-[12px] font-semibold text-muted-foreground">{count} seleccionadas</span>
      <Button variant="outline" size="sm" disabled={disabled} onClick={() => setConfirmando('aprobar')}>
        Aprobar
      </Button>
      <Button variant="outline" size="sm" disabled={disabled} className="text-[#B42318]" onClick={() => setConfirmando('rechazar')}>
        Rechazar
      </Button>
      <Button variant="primary" size="sm" disabled={disabled} className="disabled:opacity-50" onClick={() => setConfirmando('enviar')}>
        <Icon name="send" size={13} color="#fff" /> Enviar a Control de Gestión{count > 0 ? ` (${count})` : ''}
      </Button>

      <Modal
        open={confirmando !== null}
        onClose={() => setConfirmando(null)}
        title={confirmando ? `${TRANSICION_LABEL[confirmando]} (${count})` : ''}
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmando(null)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (confirmando) onAplicar(confirmando)
                setConfirmando(null)
              }}
            >
              Confirmar
            </Button>
          </>
        }
      >
        <p className="text-[13px] leading-relaxed text-cs-gris-oscuro">
          Se aplicará <strong className="text-foreground">{confirmando ? TRANSICION_LABEL[confirmando] : ''}</strong> a las {count} líneas seleccionadas que estén en un estado válido para esta
          acción.
        </p>
      </Modal>
    </div>
  )
}
