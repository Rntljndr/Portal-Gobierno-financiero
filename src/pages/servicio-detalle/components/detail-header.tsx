import { Breadcrumb } from '@/shared/ui'
import type { Servicio } from '@/data/services'

const ESTADO_STYLE: Record<string, string> = {
  Borrador: 'bg-[#F1F4FA] text-cs-gris-oscuro',
  'Requiere revisión': 'bg-[#FFF4E0] text-[#B45309]',
  Enviado: 'bg-[#E0EAFB] text-cs-azul',
  Aprobado: 'bg-[#E1FBEF] text-[#067647]',
}

export function DetailHeader({ s }: { s: Servicio }) {
  return (
    <>
      <Breadcrumb
        items={[
          { label: 'SIP', to: '/' },
          { label: 'Presupuesto', to: '/ejercicios' },
          { label: 'Ejercicios', to: '/ejercicios' },
          { label: 'Mis Servicios', to: '/ejercicios/mis-servicios' },
          { label: s.nombre },
        ]}
      />
      <div className="flex items-center gap-3 p-[10px_32px_20px]">
        <div className="text-[22px] leading-tight font-bold tracking-tight text-primary">{s.nombre}</div>
        <span className={`inline-flex items-center rounded-md px-2.5 py-[3px] text-[10.5px] font-bold tracking-wide ${ESTADO_STYLE[s.estado]}`}>
          {s.estado}
        </span>
      </div>
    </>
  )
}
