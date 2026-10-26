import { useNavigate } from 'react-router'
import { Card, Icon, Tag } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { diasHasta, fechaLarga } from '../lib/accesos'
import type { Tarea } from '../lib/tareas'

function Plazo({ vence }: { vence?: string }) {
  if (!vence) return <span className="text-xs text-muted-foreground">Sin plazo</span>
  const d = diasHasta(vence)
  return (
    <Tag color={d <= 3 ? 'red' : d <= 10 ? 'yellow' : 'gray'} size="sm">
      {d === 0 ? 'Vence hoy' : `${d} días`} · {fechaLarga(vence)}
    </Tag>
  )
}

/** "Para esta semana": tareas priorizadas por plazo, cada una con su acción. */
export function Tareas({ tareas }: { tareas: Tarea[] }) {
  const navigate = useNavigate()
  return (
    <Card padding="md" className="flex h-full flex-col">
      <div className="mb-1 flex items-baseline justify-between px-2">
        <h2 className="text-lg font-bold text-primary">Para esta semana</h2>
        <span className="text-xs text-muted-foreground">{tareas.length} pendientes</span>
      </div>
      <ul className="flex flex-col">
        {tareas.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              onClick={() => navigate(t.to)}
              className="group flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left hover:bg-surface-hover"
            >
              <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg', t.tono === 'alerta' ? 'bg-warning-surface text-warning' : 'bg-info-surface text-primary')}>
                <Icon name={t.icono} size={16} color="currentColor" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-foreground">{t.titulo}</span>
                <span className="block truncate text-xs text-muted-foreground">{t.detalle}</span>
              </span>
              <span className="hidden shrink-0 sm:block">
                <Plazo vence={t.vence} />
              </span>
              <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary">
                {t.cta} <Icon name="chevron_right" size={14} color="currentColor" />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Card>
  )
}
