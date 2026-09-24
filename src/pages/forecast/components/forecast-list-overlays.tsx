import { Toast } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import type { useForecastEditarN4 } from '../lib/use-forecast-editar-n4'
import type { useForecastCargaMasiva } from '../lib/use-forecast-carga-masiva'
import { ForecastEditDrawer } from './forecast-edit-drawer'
import { ForecastCargaMasivaDrawer } from './forecast-carga-masiva-drawer'
import { downloadForecastImportTemplate } from '../lib/forecast-import'

interface ForecastListOverlaysProps {
  activo: ForecastRound
  tabla: ReturnType<typeof useForecastEditarN4>
  cm: ReturnType<typeof useForecastCargaMasiva>
}

/** Agrupa el drawer de edición de celda, el drawer de carga masiva y el toast de confirmación — solo
 * se montan cuando hay un forecast Activo. Extraído aparte para mantener ForecastListPage bajo el
 * límite de líneas del linter. */
export function ForecastListOverlays({ activo, tabla, cm }: ForecastListOverlaysProps) {
  return (
    <>
      <ForecastEditDrawer
        open={tabla.editTarget !== null}
        onClose={tabla.closeEdit}
        level="n4"
        codigo={tabla.editTarget?.n4.n4Codigo ?? ''}
        nombre={tabla.editTarget?.n4.n4Nombre ?? ''}
        monthLabel={tabla.editTarget?.monthLabel ?? ''}
        currentValue={tabla.editTarget?.currentValue ?? 0}
        llave={tabla.llave}
        onSubmit={tabla.submitEdit}
      />
      <ForecastCargaMasivaDrawer cm={cm} onDownloadTemplate={() => downloadForecastImportTemplate(activo)} />
      <Toast message={tabla.message} />
    </>
  )
}
