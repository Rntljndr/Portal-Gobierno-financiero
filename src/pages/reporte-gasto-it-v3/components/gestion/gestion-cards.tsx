import { forecastRoundsIniciales } from '@/data/forecast'
import { V3_MES_EN_CURSO, V3_MESES_LARGOS, type V3Linea } from '@/data/gasto-it-v3'
import { compararForecast, compararPreliminar, fmtMonto, fmtPct, type Moneda } from '../../lib'
import { Dif } from './kpi'
import { FilaDato, TarjetaSeleccion } from '../base/tarjeta-seleccion'

export type Sub = 'forecast' | 'preliminares'

const MES = V3_MESES_LARGOS[V3_MES_EN_CURSO]
const fechaCorta = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })

/** Elección de qué revisar antes del cierre (forecast en edición o preliminares del mes), con el resumen de
 * cada uno a la vista: el usuario elige viendo las cifras y todo lo de abajo cambia con su selección. */
export function GestionCards({ sub, onChange, lineas, moneda }: { sub: Sub; onChange: (s: Sub) => void; lineas: V3Linea[]; moneda: Moneda }) {
  const f = compararForecast(lineas)
  const p = compararPreliminar(lineas)
  const fcst = forecastRoundsIniciales.find((r) => r.estado === 'Abierto')

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2" role="radiogroup" aria-label="Qué revisar antes del cierre">
        <TarjetaSeleccion
          activo={sub === 'forecast'}
          onClick={() => onChange('forecast')}
          titulo="Forecast en edición"
          detalle={fcst ? `${fcst.titulo} · edición hasta el ${fechaCorta(fcst.fechaTermino)}` : 'Proyección anual en edición'}
          valor={fmtMonto(f.actual, moneda)}
        >
          <FilaDato label="Forecast anterior · diferencia">
            {fmtMonto(f.anterior, moneda)}
            <Dif n={f.dif}>{fmtPct(f.difPct, true)}</Dif>
          </FilaDato>
          <FilaDato label="Líneas modificadas">
            {f.modificadas} de {f.total}
          </FilaDato>
        </TarjetaSeleccion>
        <TarjetaSeleccion
          activo={sub === 'preliminares'}
          onClick={() => onChange('preliminares')}
          titulo={`Preliminares de ${MES}`}
          detalle="Mes abierto · se confirman como real al cierre"
          valor={fmtMonto(p.preliminar, moneda)}
        >
          <FilaDato label="Forecast del mes · avance">
            {fmtMonto(p.forecastMes, moneda)}
            <span className="text-cs-gris-oscuro">{fmtPct(p.avancePct)}</span>
          </FilaDato>
          <FilaDato label="Por cargar · líneas sobre su forecast">
            {fmtMonto(Math.max(-p.dif, 0), moneda)}
            <Dif n={p.sobreForecast}>{p.sobreForecast}</Dif>
          </FilaDato>
        </TarjetaSeleccion>
      </div>
      <div className="text-xs text-muted-foreground">Elige qué revisar: todo lo que está abajo cambia con tu selección.</div>
    </div>
  )
}
