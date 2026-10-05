import { useState } from 'react'
import { Button, Drawer, Toast } from '@/shared/ui'
import { useForecastEditarN7Detalle } from '../lib/use-forecast-editar-n7-detalle'
import { ForecastN7EditarContent } from './forecast-n7-editar-content'
import { ForecastDescartarCambiosModal } from './forecast-descartar-cambios-modal'
import { ForecastEstadoHistorialTag } from './forecast-estado-historial-tag'
import { ForecastHistorialDrawer } from './forecast-historial-drawer'

interface ForecastN7EditarDrawerProps {
  roundId: string | undefined
  n4Codigo: string | undefined
  n7Codigo: string | null
  onClose: () => void
}

/** Edición completa de un PEP N7 en un drawer (A5) — se abre al hacer clic en el nombre del servicio o
 * en una celda editable de la tabla de PEPs N7, sin navegar a otra pantalla. Mismo contenido y
 * comportamiento que ForecastN7DetallePage (ver ForecastN7EditarContent, compartido): los meses con
 * reales quedan bloqueados, la llave de distribución se recalcula al guardar (useForecastStore vía el
 * mismo hook), y la justificación es por PEP, no por mes. */
export function ForecastN7EditarDrawer({ roundId, n4Codigo, n7Codigo, onClose }: ForecastN7EditarDrawerProps) {
  const s = useForecastEditarN7Detalle(roundId, n4Codigo, n7Codigo ?? undefined)
  const [confirmCerrarOpen, setConfirmCerrarOpen] = useState(false)
  const [historialOpen, setHistorialOpen] = useState(false)

  const pedirCerrar = () => (s.hasChanges ? setConfirmCerrarOpen(true) : onClose())
  const guardarYCerrar = () => {
    s.guardar()
    onClose()
  }

  return (
    <>
      <Drawer
        open={n7Codigo !== null}
        onClose={pedirCerrar}
        xwide
        eyebrow="Forecast Nivel 7"
        title={s.n7?.n7Nombre ?? ''}
        titleExtra={s.n7 && <ForecastEstadoHistorialTag n7={s.n7} onClick={() => setHistorialOpen(true)} />}
        subtitle={s.n7?.n7Codigo}
        footer={
          <>
            <Button variant="outline" onClick={pedirCerrar}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={guardarYCerrar}>
              Guardar
            </Button>
          </>
        }
      >
        {s.round && s.n4 && s.n7 && s.identidad && <ForecastN7EditarContent s={s} readOnly={false} />}
      </Drawer>

      <ForecastDescartarCambiosModal open={confirmCerrarOpen} onCancel={() => setConfirmCerrarOpen(false)} onConfirm={onClose} />
      <ForecastHistorialDrawer round={s.round} n7={historialOpen ? s.n7 : undefined} onClose={() => setHistorialOpen(false)} />
      <Toast message={s.message} />
    </>
  )
}
