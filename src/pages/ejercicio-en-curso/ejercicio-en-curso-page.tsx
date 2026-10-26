import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Alert, Button, Icon, Pagination } from '@/shared/ui'
import { currentExercise } from '@/data/exercises'
import { forecastRoundsIniciales } from '@/data/forecast'
import { PRELIM_MES_OPEN_LABEL } from '@/data/preliminares'
import { REALES_LAST_CLOSED, REALES_ULTIMO_REAL_LABEL } from '@/data/reales'
import { MisServiciosHeader } from '@/pages/mis-servicios/components/page-header'
import { EditElementsTabs, type ElementItem } from '@/pages/mis-servicios/components/edit-elements-tabs'
import { FilterBar } from '@/pages/mis-servicios/components/filter-bar'
import { CountryBudgetPanel } from '@/pages/mis-servicios/components/country-budget-panel'
import { StatusTabs } from '@/pages/mis-servicios/components/status-tabs'
import { ViewModeToggle, type ViewMode } from '@/pages/mis-servicios/components/view-mode-toggle'
import { useMisServicios } from '@/pages/mis-servicios/lib/use-mis-servicios'
import { cumple, ejecucionPorDestino, ejecucionPorOrigen, ESTADOS_LINEA, type EstadoLinea } from './lib/ejecucion'
import { EjecucionTabla } from './components/ejecucion-tabla'
import { EjecucionCards } from './components/ejecucion-cards'

const PAGE = 9
const fcst = forecastRoundsIniciales.find((r) => r.estado === 'Abierto')
const diasHasta = (iso: string) => Math.max(0, Math.ceil((new Date(`${iso}T18:00:00`).getTime() - Date.now()) / 86400000))
const fechaLarga = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })

const ELEMENTOS: ElementItem[] = [
  { to: '/forecast', icon: 'trendup', title: 'Forecast', meta: fcst ? `${fcst.titulo} · abierto` : 'Sin forecast abierto' },
  { to: '/reales', icon: 'check', title: 'Reales', meta: `Al día a ${REALES_ULTIMO_REAL_LABEL.toLowerCase()}` },
  { to: '/preliminares', icon: 'calendar', title: 'Preliminares', meta: `Mes abierto: ${PRELIM_MES_OPEN_LABEL.toLowerCase()}` },
  { to: '/reporte-ejercicio-curso', icon: 'chart', title: 'Reporte ejercicio en curso', meta: 'Gasto real, forecast y desvíos' },
]

/** Ejercicio en curso: mismas piezas que el ejercicio en planificación (Mis líneas 2027), con la ejecución del
 * año: aviso del forecast en edición, accesos a forecast / reales / preliminares, filtros, ejecución por país
 * y líneas con plan, real acumulado, forecast anual y desvío. */
export function EjercicioEnCursoPage() {
  const navigate = useNavigate()
  const state = useMisServicios()
  const [estado, setEstado] = useState<EstadoLinea>('todos')
  const [page, setPage] = useState(1)
  const [verAviso, setVerAviso] = useState(true)
  const [vista, setVista] = useState<ViewMode>('cards')
  const lineas = state.filteredAll

  const counts = useMemo(() => Object.fromEntries(ESTADOS_LINEA.map((t) => [t.key, lineas.filter((s) => cumple(s, t.key)).length])) as Record<EstadoLinea, number>, [lineas])
  const filtradas = lineas.filter((s) => cumple(s, estado))
  const totalPages = Math.max(1, Math.ceil(filtradas.length / PAGE))
  const pagina = filtradas.slice((page - 1) * PAGE, page * PAGE)

  return (
    <div className="h-full overflow-y-auto">
      <MisServiciosHeader
        breadcrumb={[{ label: 'SIP', to: '/' }, { label: 'Ejercicios', to: '/ejercicios' }, { label: `Ejercicio en curso ${currentExercise.year}` }]}
        titulo={`Mis líneas en ejecución · ${currentExercise.year}`}
        subtitulo={`Sigue el real, los preliminares y el forecast de tus líneas · ${REALES_LAST_CLOSED} de 12 meses cerrados`}
        accion={
          <Button variant="outline" size="sm" onClick={() => navigate('/reporte-ejercicio-curso')}>
            <Icon name="chart" size={14} color="currentColor" /> Reporte ejercicio en curso
          </Button>
        }
      />
      {verAviso && fcst && (
        <Alert
          variant="success"
          className="mx-8 mb-3.5"
          onDismiss={() => setVerAviso(false)}
          title={
            <>
              Quedan <strong className="font-bold text-primary">{diasHasta(fcst.fechaTermino)}</strong> días para actualizar el {fcst.titulo}
            </>
          }
        >
          Vence el <strong className="font-bold text-foreground">{fechaLarga(fcst.fechaTermino)}, {fcst.horaTermino} hrs</strong>. {counts.pendiente} de tus líneas aún
          no actualizan su forecast.
        </Alert>
      )}
      <EditElementsTabs titulo="Gestionar el ejercicio" items={ELEMENTOS} />
      <FilterBar filters={state.filters} onChange={state.onChangeFilter} onClear={state.clearFilters} />
      <CountryBudgetPanel titulo={`Ejecución ${currentExercise.year} por país`} rows={(v) => (v === 'destino' ? ejecucionPorDestino(lineas) : ejecucionPorOrigen(lineas))} />

      <div className="mx-8 mb-3">
        <span className="block text-[17px] leading-tight font-extrabold tracking-tight text-primary">PEP N4</span>
        <span className="mt-0.5 block text-[12.5px] text-muted-foreground">Ejecución de las líneas bajo tu responsabilidad</span>
      </div>
      <div className="mx-8 mb-3 flex items-end gap-4">
        <StatusTabs<EstadoLinea>
          active={estado}
          onChange={(e) => {
            setEstado(e)
            setPage(1)
          }}
          counts={counts}
          tabs={ESTADOS_LINEA}
        />
        <ViewModeToggle value={vista} onChange={setVista} />
      </div>
      {vista === 'tabla' ? <EjecucionTabla items={pagina} /> : <EjecucionCards items={pagina} />}
      <Pagination page={page} totalPages={totalPages} totalItems={filtradas.length} pageSize={PAGE} onPageChange={setPage} itemLabel="servicios" />
      <div className="h-6" />
    </div>
  )
}
