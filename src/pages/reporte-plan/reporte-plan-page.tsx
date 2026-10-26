import { useSearchParams } from 'react-router'
import { OptionCards } from '@/shared/ui'
import { ReporteriaPage } from '@/pages/reporteria/reporteria-page'
import { ReporteDireccionPage } from '@/pages/reporte-direccion/reporte-direccion-page'
import { ConsolidadoPage } from '@/pages/consolidado/consolidado-page'

type ReportePlan = 'reporteria' | 'negocio' | 'tecnologia'

const REPORTES: { value: ReportePlan; label: string; descripcion: string }[] = [
  { value: 'reporteria', label: 'Reportería planificación', descripcion: 'Presupuesto 2027 por país, PEP y mes' },
  { value: 'negocio', label: 'Reporte Negocio', descripcion: 'Consolidado ejecutivo por país, división y bandera' },
  { value: 'tecnologia', label: 'Reporte Tecnología', descripcion: 'Propuesta de plan por país, gerencia y rubro' },
]

/** Reporte de plan — reúne la Reportería y los reportes de Negocio y de Tecnología; se elige cuál ver con tarjetas, como las
 * visiones del Reporte ejercicio en curso. La selección queda en la URL (?reporte=). */
export function ReportePlanPage() {
  const [params, setParams] = useSearchParams()
  const reporte = REPORTES.find((r) => r.value === params.get('reporte'))?.value ?? 'reporteria'
  const selector = (
    <OptionCards value={reporte} onChange={(r) => setParams({ reporte: r }, { replace: true })} options={REPORTES} aria-label="Reporte" />
  )
  if (reporte === 'reporteria') return <ReporteriaPage key="r" selector={selector} />
  return reporte === 'negocio' ? <ReporteDireccionPage key="n" selector={selector} /> : <ConsolidadoPage key="t" selector={selector} />
}
