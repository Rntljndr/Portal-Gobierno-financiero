import type { EstadoServicio, TipoOrigen } from '@/data/services'

const ESTADO_STYLE: Record<EstadoServicio, string> = {
  Borrador: 'bg-[#F1F4FA] text-cs-gris-oscuro',
  'Requiere revisión': 'bg-[#FFF4E0] text-[#B45309]',
  Enviado: 'bg-[#E0EAFB] text-cs-azul',
  Aprobado: 'bg-[#E1FBEF] text-[#067647]',
}

export function ServiceCardBadges({ estado, tipoOrigen }: { estado: EstadoServicio; tipoOrigen: TipoOrigen }) {
  return (
    <div className="mb-3 flex flex-wrap gap-1.5 self-start">
      <span className={`inline-flex items-center rounded-md px-2.5 py-[3px] text-[10.5px] font-bold tracking-wide ${ESTADO_STYLE[estado]}`}>
        {estado}
      </span>
      <span
        className={`inline-flex items-center rounded-md px-2.5 py-[3px] text-[10.5px] font-bold tracking-wide ${
          tipoOrigen === 'Nuevo' ? 'bg-[#E1FBEF] text-[#067647]' : 'bg-[#E0EAFB] text-cs-azul'
        }`}
      >
        {tipoOrigen}
      </span>
    </div>
  )
}
