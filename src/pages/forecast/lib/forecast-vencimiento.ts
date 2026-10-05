import type { ForecastRound } from '@/data/forecast'

/** M7 ("vencimiento automático"): un forecast Abierto queda vencido apenas pasa su fecha de término,
 * sin que nadie tenga que cerrarlo a mano para que se note. Este prototipo no tiene backend ni cron —
 * todo el store vive en memoria (forecast-store.tsx) — así que, igual que ForecastPeriodoBanner ya
 * hace para el conteo de días, se calcula en cada render contra la hora actual en vez de mutar un
 * estado guardado. No cierra el forecast solo: A3 ("Cerrar Forecast") sigue siendo la única acción que
 * lo hace, acá solo se expone el aviso. */
export function isForecastVencido(round: Pick<ForecastRound, 'estado' | 'fechaTermino'>, now: number = Date.now()): boolean {
  return round.estado === 'Abierto' && now > new Date(`${round.fechaTermino}T23:59:59`).getTime()
}
