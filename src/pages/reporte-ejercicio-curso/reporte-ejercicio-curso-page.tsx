import { useState } from 'react'
import { Breadcrumb, PageHeader } from '@/shared/ui'
import type { CurrencyView } from '@/data/reporteria'
import type { Pais } from '@/data/services'
import { resumenPorPais, aplicarVistaMoneda } from './lib/recoe-data'
import { EjecutivoVista } from './components/ejecutivo/ejecutivo-vista'
import { RecoeCountrySummaryPanel } from './components/recoe-country-summary-panel'
import { DetalleVista } from './components/detalle/detalle-vista'

/** Reporte Ejercicio en Curso: un solo reporte genérico — arriba la Vista Ejecutiva (fija, en USD,
 * nunca afectada por filtros), al medio el Resumen por país (con selector de moneda, mismo
 * comportamiento que el módulo de Presupuesto), abajo el Detalle configurable (vistas predefinidas +
 * guardadas, filtros propios en un drawer, tabla dinámica con aperturas y columnas elegibles). */
export function ReporteEjercicioCursoPage() {
  const [vistaMoneda, setVistaMoneda] = useState<CurrencyView>('origen')
  const [paisMoneda, setPaisMoneda] = useState<Pais | null>(null)
  const resumen = aplicarVistaMoneda(resumenPorPais(), vistaMoneda, paisMoneda)

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Reporte ejercicio en curso' }]} />
      <PageHeader
        title="Reporte Ejercicio en Curso"
        subtitle="Vista ejecutiva fija (USD) y detalle configurable por país, división, gerencia, rubro, cuenta contable, servicio o responsable."
      />

      <div className="mx-8 mb-10 flex flex-col gap-8">
        <EjecutivoVista />

        <RecoeCountrySummaryPanel
          resumen={resumen}
          vista={vistaMoneda}
          onChangeVista={(v) => {
            setVistaMoneda(v)
            setPaisMoneda(null)
          }}
          paisMoneda={paisMoneda}
          onChangePaisMoneda={setPaisMoneda}
        />

        <DetalleVista vistaMoneda={vistaMoneda} paisMoneda={paisMoneda} />
      </div>
    </div>
  )
}
