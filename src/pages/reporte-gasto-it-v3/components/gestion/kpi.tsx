import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

/** Diferencia de gasto: rojo si sube, verde si baja, gris si no cambia. */
export function Dif({ n, children }: { n: number; children: ReactNode }) {
  return <span className={cn(n > 0.5 ? 'text-destructive' : n < -0.5 ? 'text-success' : 'text-muted-foreground')}>{children}</span>
}
