import { estadoProcesoLabel, type EstadoProceso } from '@/data/drivers'

const STYLE: Record<EstadoProceso, string> = {
  preliminar: 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]',
  borrador: 'bg-[#FFF7ED] text-[#B54708] border-[#FED7AA]',
  enviado: 'bg-[#ECFDF3] text-[#067647] border-[#BBF7D0]',
  rechazado: 'bg-[#FEF2F2] text-[#B42318] border-[#FECACA]',
}

export function EstadoPill({ estado }: { estado: EstadoProceso }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-wide ${STYLE[estado]}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {estadoProcesoLabel[estado]}
    </span>
  )
}
