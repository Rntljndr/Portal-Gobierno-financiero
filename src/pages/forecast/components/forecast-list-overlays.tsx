import type { ForecastRound } from '@/data/forecast'
import type { useForecastCargaMasiva } from '../lib/use-forecast-carga-masiva'
import { ForecastCargaMasivaDrawer } from './forecast-carga-masiva-drawer'
import { downloadForecastImportTemplate } from '../lib/forecast-import'

interface ForecastListOverlaysProps {
  activo: ForecastRound
  cm: ReturnType<typeof useForecastCargaMasiva>
}

/** Drawer de carga masiva — solo se monta cuando hay un forecast Activo. Extraído aparte para mantener
 * ForecastListPage bajo el límite de líneas del linter. */
export function ForecastListOverlays({ activo, cm }: ForecastListOverlaysProps) {
  return <ForecastCargaMasivaDrawer cm={cm} onDownloadTemplate={() => downloadForecastImportTemplate(activo)} />
}
