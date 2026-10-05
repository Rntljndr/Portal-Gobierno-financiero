import type { useForecastEditarN7Detalle } from '../lib/use-forecast-editar-n7-detalle'
import { useForecastStore } from '../lib/use-forecast-store'
import { findN7EnRound } from '../lib/forecast-comparativa'
import { calcN7Totals } from '../lib/forecast-edit-calc'
import { ForecastN7DetalleDatosCard } from './forecast-n7-detalle-datos-card'
import { ForecastN7DetalleTabla } from './forecast-n7-detalle-tabla'
import { ForecastChartSection } from './forecast-chart-section'
import { ForecastN7DetalleDesvio } from './forecast-n7-detalle-desvio'

interface ForecastN7EditarContentProps {
  s: ReturnType<typeof useForecastEditarN7Detalle>
  readOnly: boolean
}

/** Cuerpo de "edición completa de todos los meses editables del PEP" (A5): ficha de datos + tabla de
 * meses + gráfico y justificación lado a lado — sin el "chrome" (breadcrumb, header, footer) para que
 * lo puedan usar tanto ForecastN7DetallePage (pantalla completa, forecast anterior/solo lectura) como
 * ForecastN7EditarDrawer (drawer, forecast activo — A5: ya no se navega a otra pantalla para editar).
 * La comparativa (Plan/Forecast anterior) es la misma del botón "Comparar" de las tablas, no una propia
 * de acá: la selección vive en el store para que se sume al gráfico apenas se elige en cualquier otra
 * vista (F: "debe permanecer en todas las vistas... se tiene que agregar esa variable y sumar"). */
export function ForecastN7EditarContent({ s, readOnly }: ForecastN7EditarContentProps) {
  const { rounds, comparativa } = useForecastStore()

  if (!s.round || !s.n4 || !s.n7 || !s.identidad) return null
  const { round, n4, n7 } = s

  const anteriorRound = comparativa.forecastRoundId ? rounds.find((r) => r.id === comparativa.forecastRoundId) : undefined
  const anteriorN7 = anteriorRound ? findN7EnRound(anteriorRound, n4.n4Codigo, n7.n7Codigo) : undefined

  return (
    <>
      <ForecastN7DetalleDatosCard round={round} n4={n4} n7={n7} identidad={s.identidad} />
      <ForecastN7DetalleTabla n7={n7} plan={s.plan} cutoff={s.cutoff} draft={s.draft} onChangeMes={s.setMes} onAplicarMontoTotal={s.aplicarMontoTotal} readOnly={readOnly} />
      <div className="mx-8 mb-8 grid grid-cols-2 gap-5">
        <ForecastChartSection meses={n7.meses} cutoff={s.cutoff} plan={s.plan} anterior={anteriorN7?.meses} totals={calcN7Totals(n4.n4Codigo, n7, s.cutoff)} />
        <ForecastN7DetalleDesvio
          justificacion={s.justificacion}
          onChangeJustificacion={s.setJustificacion}
          comentario={s.comentario}
          onChangeComentario={s.setComentario}
          readOnly={readOnly}
        />
      </div>
    </>
  )
}
