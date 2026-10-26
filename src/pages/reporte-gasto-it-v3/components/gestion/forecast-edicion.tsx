import { V3_MESES_LARGOS, type V3Linea } from '@/data/gasto-it-v3'
import { compararForecast, fcstPorMes, fmtMonto, fmtPct, type Moneda } from '../../lib'
import { Seccion } from '../base/seccion'
import { TD, TD_NUM, TH, TR, TR_HEAD } from '../base/tabla'
import { ComparativoTabla, type Columna } from './comparativo-tabla'
import { Dif } from './kpi'

const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** Forecast en edición vs forecast anterior, en destino: cuánto cambia el año, en qué meses y qué lo movió. */
export function ForecastEdicion({ lineas, moneda }: { lineas: V3Linea[]; moneda: Moneda }) {
  const meses = fcstPorMes(lineas)
  const columnas: Columna[] = [
    { label: 'Forecast anterior', celda: (ls) => fmtMonto(compararForecast(ls).anterior, moneda) },
    { label: 'En edición', celda: (ls) => fmtMonto(compararForecast(ls).actual, moneda) },
    {
      label: 'Diferencia',
      celda: (ls) => {
        const x = compararForecast(ls)
        return <Dif n={x.dif}>{fmtMonto(x.dif, moneda, true)}</Dif>
      },
    },
    {
      label: 'Dif. %',
      celda: (ls) => {
        const x = compararForecast(ls)
        return <Dif n={x.dif}>{fmtPct(x.difPct, true)}</Dif>
      },
    },
    { label: 'Líneas modificadas', celda: (ls) => `${compararForecast(ls).modificadas} de ${ls.length}` },
  ]

  return (
    <div className="flex flex-col gap-4">
      <Seccion titulo="Qué cambió mes a mes" subtitulo="Meses abiertos: forecast anterior contra el que se está editando.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className={TR_HEAD}>
                <th className={`${TH} text-left`}>Mes</th>
                <th className={`${TH} text-right`}>Forecast anterior</th>
                <th className={`${TH} text-right`}>En edición</th>
                <th className={`${TH} text-right`}>Diferencia</th>
              </tr>
            </thead>
            <tbody>
              {meses.map((m) => (
                <tr key={m.mes} className={TR}>
                  <td className={`${TD} font-bold`}>{capital(V3_MESES_LARGOS[m.mes])}</td>
                  <td className={TD_NUM}>{fmtMonto(m.anterior, moneda)}</td>
                  <td className={TD_NUM}>{fmtMonto(m.actual, moneda)}</td>
                  <td className={TD_NUM}>
                    <Dif n={m.actual - m.anterior}>{fmtMonto(m.actual - m.anterior, moneda, true)}</Dif>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Seccion>

      <ComparativoTabla
        titulo="Qué movió el forecast"
        subtitulo="Ordenado por el mayor cambio. Abre una fila para ver sus servicios."
        lineas={lineas}
        columnas={columnas}
        dif={(ls) => compararForecast(ls).dif}
        barra="← Baja · Sube →"
      />
    </div>
  )
}
