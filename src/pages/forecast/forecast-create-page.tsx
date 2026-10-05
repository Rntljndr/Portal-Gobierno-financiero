import { useNavigate } from 'react-router'
import { Breadcrumb, Button, EmptyState, Icon, PageHeader } from '@/shared/ui'
import { FORECAST_MES_ACTUAL } from '@/data/forecast'
import type { ForecastRound } from '@/data/forecast'
import { buildInitialLineas } from '@/data/forecast-lineas'
import { useForecastStore } from './lib/use-forecast-store'
import { useCrearForecast } from './lib/use-crear-forecast'
import { CrearForecastFormFields } from './components/crear-forecast-form'
import { TasasCambioTable } from './components/tasas-cambio-table'

export function ForecastCreatePage() {
  const navigate = useNavigate()
  const { rounds, addRound } = useForecastStore()
  const s = useCrearForecast(rounds)
  const hasActivo = rounds.some((r) => r.estado === 'Abierto')

  // A2: resguardo por si se llega acá directo por URL con el botón "Nuevo Forecast" deshabilitado —
  // solo puede haber un forecast abierto a la vez.
  if (hasActivo) {
    return (
      <div className="mx-8 my-8">
        <EmptyState icon="calendar" title="Ya hay un forecast abierto" text="Cerrá el forecast activo antes de abrir uno nuevo." />
        <div className="mt-4 flex justify-center">
          <Button variant="outline" onClick={() => navigate('/forecast')}>
            Volver al Forecast
          </Button>
        </div>
      </div>
    )
  }

  const handleGuardar = () => {
    s.setSubmitted(true)
    if (!s.isValid) return
    const round: ForecastRound = {
      id: `FC_${Date.now()}`,
      titulo: s.form.titulo,
      descripcion: s.form.descripcion,
      tipo: s.form.tipo,
      estado: 'Abierto',
      cerradoManual: false,
      fechaInicio: s.form.fechaInicio,
      fechaTermino: s.form.fechaTermino,
      horaInicio: s.form.horaInicio,
      horaTermino: s.form.horaTermino,
      desvio: Number(s.form.desvio),
      pepsCount: s.form.tipo === 'parcial' ? s.selPeps.size : null,
      selPeps: s.form.tipo === 'parcial' ? [...s.selPeps] : [],
      notificar: s.form.notificar,
      tasasCambio: s.tasas,
      lineas: buildInitialLineas(s.form.tipo === 'parcial' ? [...s.selPeps] : [], FORECAST_MES_ACTUAL),
    }
    addRound(round)
    navigate('/forecast')
  }

  return (
    <div className="h-full overflow-y-auto">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Forecast', to: '/forecast' }, { label: 'Nuevo Forecast' }]} />
      <PageHeader title="Nuevo Forecast" subtitle="Completá los datos para crear un nuevo ejercicio de forecast" />

      <div className="mx-8 mb-4">
        <CrearForecastFormFields form={s.form} setField={s.setField} errors={s.errors} selEquipos={s.selEquipos} onChangeEquipos={s.onChangeEquipos} selGerencias={s.selGerencias} onChangeGerencias={s.onChangeGerencias} />
      </div>

      <div className="mx-8 mb-6">
        <TasasCambioTable value={s.tasas} onChange={s.setTasaValor} />
      </div>

      <div className="mx-8 mb-8 flex justify-end gap-2.5">
        <Button variant="outline" onClick={() => navigate('/forecast')}>
          Cancelar
        </Button>
        <Button variant="primary" className={!s.isValid && s.submitted ? 'opacity-50' : ''} onClick={handleGuardar}>
          <Icon name="check" size={13} color="#fff" /> Crear Forecast
        </Button>
      </div>
    </div>
  )
}
