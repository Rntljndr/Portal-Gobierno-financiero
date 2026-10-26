import { V3_EJERCICIO, V3_MES_EN_CURSO, V3_MESES_LARGOS, type V3Linea } from '@/data/gasto-it-v3'
import { compararPreliminar, fmtMonto, fmtPct, type Moneda } from '../../lib'
import { ComparativoTabla, type Columna } from './comparativo-tabla'
import { Dif } from './kpi'

const MES = V3_MESES_LARGOS[V3_MES_EN_CURSO]
const MES_CAP = MES.charAt(0).toUpperCase() + MES.slice(1)

/** Preliminares del mes en curso, en destino, contra el forecast de ese mes: cuánto se ha cargado y dónde
 * ya se supera lo proyectado. No es real hasta el cierre. */
export function PreliminaresMes({ lineas, moneda }: { lineas: V3Linea[]; moneda: Moneda }) {
  const columnas: Columna[] = [
    { label: `Forecast ${MES}`, celda: (ls) => fmtMonto(compararPreliminar(ls).forecastMes, moneda) },
    { label: 'Preliminar', celda: (ls) => fmtMonto(compararPreliminar(ls).preliminar, moneda) },
    {
      label: 'Avance',
      celda: (ls) => {
        const x = compararPreliminar(ls)
        return x.avancePct > 100 ? <Dif n={1}>{fmtPct(x.avancePct)}</Dif> : fmtPct(x.avancePct)
      },
    },
    { label: 'Por cargar', celda: (ls) => fmtMonto(Math.max(-compararPreliminar(ls).dif, 0), moneda) },
    { label: `${MES_CAP} ${V3_EJERCICIO - 1}`, celda: (ls) => fmtMonto(compararPreliminar(ls).anioAnterior, moneda) },
  ]

  return (
    <div className="flex flex-col gap-4">
      <ComparativoTabla
        titulo={`Preliminares de ${MES} por dimensión`}
        subtitulo="Ordenado por la mayor diferencia contra el forecast del mes. Abre una fila para ver sus servicios."
        lineas={lineas}
        columnas={columnas}
        dif={(ls) => compararPreliminar(ls).dif}
        barra="← Bajo · Sobre forecast →"
      />
    </div>
  )
}
