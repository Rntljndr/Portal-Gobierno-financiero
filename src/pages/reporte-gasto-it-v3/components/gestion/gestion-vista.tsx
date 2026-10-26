import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { useReporte } from '../../lib/contexto'
import { GestionCards, type Sub } from './gestion-cards'
import { ForecastEdicion } from './forecast-edicion'
import { PreliminaresMes } from './preliminares-mes'

/** Gestión del gasto: lo que aún no es reportería (forecast en edición y preliminares), en moneda destino,
 * para quienes gestionan el forecast y los reales. Se entra desde aquí o desde Forecast y Preliminares. */
export function GestionVista() {
  const { lineas, moneda } = useReporte()
  const [params] = useSearchParams()
  const [sub, setSub] = useState<Sub>(params.get('sub') === 'preliminares' ? 'preliminares' : 'forecast')

  return (
    <section className="flex flex-col gap-4">
      <GestionCards sub={sub} onChange={setSub} lineas={lineas} moneda={moneda} />
      {sub === 'forecast' ? <ForecastEdicion lineas={lineas} moneda={moneda} /> : <PreliminaresMes lineas={lineas} moneda={moneda} />}
    </section>
  )
}
