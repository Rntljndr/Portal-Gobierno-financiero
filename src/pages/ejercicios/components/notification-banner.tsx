import { Alert, Button, Icon } from '@/shared/ui'
import { pendingLineasCount } from '@/data/exercises'

interface NotificationBannerProps {
  onOpen: () => void
  onDismiss: () => void
}

/** Aviso de apertura del presupuesto, con acceso directo a las líneas pendientes. */
export function NotificationBanner({ onOpen, onDismiss }: NotificationBannerProps) {
  return (
    <Alert
      variant="info"
      icon="bell"
      className="mx-8 mb-[18px]"
      onDismiss={onDismiss}
      title={
        <>
          Apertura de Presupuesto 2027: tienes <strong className="font-bold text-primary">{pendingLineasCount} líneas presupuestarias</strong> pendientes de revisión y envío
        </>
      }
      action={
        <Button variant="primary" size="sm" onClick={onOpen}>
          Ver mis líneas <Icon name="chevron_right" size={12} color="currentColor" />
        </Button>
      }
    >
      Revisa tus servicios, ajusta los montos si corresponde y envía a Control de Gestión antes del plazo.
    </Alert>
  )
}
