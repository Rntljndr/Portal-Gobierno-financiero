import { useState } from 'react'
import { Breadcrumb, Button, EmptyState, PageHeader } from '@/shared/ui'
import { notifications } from '@/data/notifications'
import { CategoryFilter } from './components/category-filter'
import { NotificationRow } from './components/notification-row'

export function NotificacionesPage() {
  const [filter, setFilter] = useState('Todas')
  const list = notifications.filter((n) => filter === 'Todas' || n.category === filter)

  return (
    <div className="flex h-full flex-col">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Notificaciones' }]} />
      <PageHeader
        title="Centro de notificaciones"
        subtitle="Alertas y actualizaciones del sistema"
        action={
          <Button variant="ghost" size="sm">
            Marcar todo como leído
          </Button>
        }
      />

      <CategoryFilter active={filter} onChange={setFilter} />

      {list.length > 0 ? (
        <div className="mx-8 mb-6 overflow-hidden rounded-[14px] border border-border bg-white">
          {list.map((notification) => (
            <NotificationRow key={notification.id} notification={notification} />
          ))}
        </div>
      ) : (
        <div className="mx-8 mb-6">
          <EmptyState icon="bell" title="Sin notificaciones" text="No hay alertas en esta categoría." />
        </div>
      )}
    </div>
  )
}
