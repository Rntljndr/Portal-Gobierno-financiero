import { useNavigate } from 'react-router'
import { Breadcrumb, Button, Icon, PageHeader } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import { useForecastStore } from './lib/use-forecast-store'
import { useCrearForecast } from './lib/use-crear-forecast'
import { CrearForecastFormFields } from './components/crear-forecast-form'
import { TasasCambioTable } from './components/tasas-cambio-table'

export function ForecastCreatePage() {
  const navigate = useNavigate()
  const { addRound } = useForecastStore()
  const s = useCrearForecast()

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
      desvio: Number(s.form.desvio),
      pepsCount: s.form.tipo === 'parcial' ? s.selPeps.size : null,
      selPeps: s.form.tipo === 'parcial' ? [...s.selPeps] : [],
      notificar: s.form.notificar,
      tasasCambio: s.tasas,
    }
    addRound(round)
    navigate('/forecast')
  }

  return (
    <div className="h-full overflow-y-auto">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Forecast', to: '/forecast' }, { label: 'Nuevo Forecast' }]} />
      <PageHeader title="Nuevo Forecast" subtitle="Completá los datos para crear un nuevo ejercicio de forecast" />

      <div className="mx-8 mb-4">
        <CrearForecastFormFields form={s.form} setField={s.setField} errors={s.errors} selPeps={s.selPeps} onTogglePep={s.togglePep} />
      </div>

      <div className="mx-8 mb-6 flex justify-end gap-2.5">
        <Button variant="outline" onClick={() => navigate('/forecast')}>
          Cancelar
        </Button>
        <Button variant="primary" className={!s.isValid && s.submitted ? 'opacity-50' : ''} onClick={handleGuardar}>
          <Icon name="check" size={13} color="#fff" /> Guardar Forecast
        </Button>
      </div>

      <div className="mx-8 mb-8">
        <TasasCambioTable value={s.tasas} onChange={s.setTasaValor} />
      </div>
    </div>
  )
}
