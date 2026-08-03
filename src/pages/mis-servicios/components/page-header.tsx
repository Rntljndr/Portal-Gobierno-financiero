import { Link } from 'react-router'
import { Breadcrumb, Icon } from '@/shared/ui'

export function MisServiciosHeader() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: 'SIP', to: '/' },
          { label: 'Presupuesto', to: '/ejercicios' },
          { label: 'Ejercicios', to: '/ejercicios' },
          { label: 'Mis Servicios' },
        ]}
      />
      <div className="flex items-center justify-between p-[10px_32px_20px]">
        <div>
          <div className="text-[26px] leading-tight font-bold tracking-tight text-primary">
            Mis líneas presupuestarias · 2027
          </div>
          <div className="mt-1 text-[13px] text-muted-foreground">
            Revisá y ajustá los servicios bajo tu responsabilidad antes de enviar a Control de Gestión
          </div>
        </div>
        <Link
          to="/ejercicios/mis-servicios/configuraciones"
          className="inline-flex items-center gap-2 rounded-[10px] border border-border bg-white px-3.5 py-2 text-[12.5px] font-semibold text-cs-gris-oscuro hover:border-border-strong"
        >
          <Icon name="config" size={14} color="currentColor" /> Configuraciones
        </Link>
      </div>
    </>
  )
}
