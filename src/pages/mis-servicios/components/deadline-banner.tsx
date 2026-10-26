import { useEffect, useState } from 'react'
import { Alert } from '@/shared/ui'

function daysLeft(deadline: number) {
  return Math.max(0, Math.ceil((deadline - Date.now()) / 86400000))
}

/** Aviso de plazo para revisar el presupuesto: verde mientras queda plazo, rojo cuando venció. */
export function DeadlineBanner({ deadline, onDismiss }: { deadline: number; onDismiss: () => void }) {
  const [days, setDays] = useState(() => daysLeft(deadline))
  const vencido = Date.now() > deadline
  const fecha = new Date(deadline).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })

  useEffect(() => {
    const id = setInterval(() => setDays(daysLeft(deadline)), 60000)
    return () => clearInterval(id)
  }, [deadline])

  return vencido ? (
    <Alert
      variant="error"
      className="mx-8 mb-3.5"
      onDismiss={onDismiss}
      title={
        <>
          El plazo para revisar el presupuesto venció el <strong className="font-bold">{fecha}</strong>
        </>
      }
    >
      La estructura quedó cerrada para edición. Si necesitas un cambio, contacta a Control de Gestión.
    </Alert>
  ) : (
    <Alert
      variant="success"
      className="mx-8 mb-3.5"
      onDismiss={onDismiss}
      title={
        <>
          Quedan <strong className={days <= 5 ? 'font-bold text-destructive' : 'font-bold text-primary'}>{days}</strong> días para revisar y editar el presupuesto
        </>
      }
    >
      Vence el <strong className="font-bold text-foreground">{fecha}</strong>. Después de esa fecha, la estructura se cierra para edición.
    </Alert>
  )
}
