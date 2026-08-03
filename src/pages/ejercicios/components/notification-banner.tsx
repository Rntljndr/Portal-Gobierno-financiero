import { Icon, Button } from '@/shared/ui'
import { pendingLineasCount } from '@/data/exercises'

interface NotificationBannerProps {
  onOpen: () => void
  onDismiss: () => void
}

export function NotificationBanner({ onOpen, onDismiss }: NotificationBannerProps) {
  return (
    <div className="relative mx-8 mb-[18px] flex items-start gap-4 rounded-[14px] border border-[#C6D7F5] bg-[linear-gradient(95deg,#E8F0FE_0%,#DCE7FB_100%)] p-[18px_22px]">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-cs-azul">
        <Icon name="bell" size={20} color="#fff" />
      </div>
      <div className="min-w-0 flex-1 pr-[100px]">
        <div className="text-sm font-bold text-cs-azul-oscuro">Apertura de Presupuesto 2027</div>
        <div className="mt-1 text-[12.5px] leading-normal text-[#2A4377]">
          Tenés <b>{pendingLineasCount} líneas presupuestarias</b> asignadas pendientes de revisión y envío. Revisá
          tus servicios, ajustá los montos si corresponde y enviá a CdG antes del plazo.
        </div>
      </div>
      <Button variant="primary" className="shrink-0" onClick={onOpen}>
        Ver mis líneas <Icon name="chevron_right" size={12} color="#fff" />
      </Button>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Cerrar"
        className="absolute top-3.5 right-3.5 flex size-[26px] items-center justify-center rounded-lg border border-[#C6D7F5] bg-white/60 hover:bg-white"
      >
        <Icon name="x_close" size={14} color="#0047B0" />
      </button>
    </div>
  )
}
