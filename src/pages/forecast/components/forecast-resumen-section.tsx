import { useState } from 'react'
import type { ForecastRound } from '@/data/forecast'
import { ForecastActivoCard } from './forecast-activo-card'
import { ForecastPeriodoBanner } from './forecast-periodo-banner'

interface ForecastResumenSectionProps {
  /** El forecast activo, o el último cerrado si no hay ninguno abierto (A4) — solo el primer caso
   * muestra la franja de periodo de edición (M1: "desaparece cuando el forecast está cerrado"). */
  activo: ForecastRound | undefined
  anterioresCount: number
  detalleOpen: boolean
  onToggleDetalle: () => void
  onVerTasas: () => void
  onOpenAnteriores: () => void
  onOpenConfiguraciones: () => void
  onCerrar: () => void
  /** F: viendo un forecast anterior puntual (ForecastDetailPage) — la card no debe insinuar "no hay
   * ningún forecast abierto", puede haber uno activo en otro lado. */
  historico?: boolean
  ocultarConfigCerrar?: boolean
}

/** Barra del Forecast Activo, de ancho completo (F), con la franja de periodo de edición arriba (M1)
 * mientras el forecast esté Abierto. El detalle se despliega dentro del mismo recuadro (F), no en uno
 * aparte. Extraído aparte para mantener ForecastListPage bajo el límite de líneas del linter. */
export function ForecastResumenSection({ activo, anterioresCount, detalleOpen, onToggleDetalle, onVerTasas, onOpenAnteriores, onOpenConfiguraciones, onCerrar, historico, ocultarConfigCerrar }: ForecastResumenSectionProps) {
  const [bannerVisible, setBannerVisible] = useState(true)
  const esActivo = activo?.estado === 'Abierto'

  return (
    <>
      {esActivo && bannerVisible && <ForecastPeriodoBanner fechaTermino={activo.fechaTermino} horaTermino={activo.horaTermino} onDismiss={() => setBannerVisible(false)} />}
      <div className="mx-8 mb-5">
        <ForecastActivoCard
          round={activo}
          anterioresCount={anterioresCount}
          detalleOpen={detalleOpen}
          onToggleDetalle={onToggleDetalle}
          onVerTasas={onVerTasas}
          onOpenAnteriores={onOpenAnteriores}
          onOpenConfiguraciones={onOpenConfiguraciones}
          onCerrar={onCerrar}
          historico={historico}
          ocultarConfigCerrar={ocultarConfigCerrar}
        />
      </div>
    </>
  )
}
