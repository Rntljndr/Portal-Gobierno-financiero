import { useEffect, useState } from 'react'
import { Alert } from '@/shared/ui'

function daysLeft(deadline: number) {
  return Math.max(0, Math.ceil((deadline - Date.now()) / 86400000))
}

interface ForecastPeriodoBannerProps {
  /** Fecha de término del forecast (round.fechaTermino, "YYYY-MM-DD"). */
  fechaTermino: string
  /** A3: hora (HH:mm) de cierre — antes hardcodeada a 23:59:59. */
  horaTermino: string
  onDismiss: () => void
}

/** Aviso de periodo de edición (M1) del forecast activo: verde mientras queda plazo y rojo cuando venció
 * (M7: el forecast no se cierra solo, pero deja de sonar como si quedara tiempo). Es la referencia de
 * estructura del Alert del portal. */
export function ForecastPeriodoBanner({ fechaTermino, horaTermino, onDismiss }: ForecastPeriodoBannerProps) {
  const deadline = new Date(`${fechaTermino}T${horaTermino}:00`).getTime()
  const [days, setDays] = useState(() => daysLeft(deadline))
  const vencido = Date.now() > deadline

  useEffect(() => {
    const id = setInterval(() => setDays(daysLeft(deadline)), 60000)
    return () => clearInterval(id)
  }, [deadline])

  const fechaFmt = `${new Date(deadline).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}, ${horaTermino} hrs`

  return vencido ? (
    <Alert
      variant="error"
      className="mx-8 mb-3.5"
      onDismiss={onDismiss}
      title={
        <>
          El periodo de edición venció el <strong className="font-bold">{fechaFmt}</strong>
        </>
      }
    >
      Cierra el forecast desde "Cerrar Forecast" para dejar las líneas validadas.
    </Alert>
  ) : (
    <Alert
      variant="success"
      className="mx-8 mb-3.5"
      onDismiss={onDismiss}
      title={
        <>
          Quedan <strong className={days <= 3 ? 'font-bold text-destructive' : 'font-bold text-primary'}>{days}</strong> días para que termine el periodo de edición
        </>
      }
    >
      Vence el <strong className="font-bold text-foreground">{fechaFmt}</strong>. Después de esa fecha, el forecast se cierra para edición.
    </Alert>
  )
}
