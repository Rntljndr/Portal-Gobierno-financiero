import { useState } from 'react'
import { Breadcrumb, Button, PageHeader, SearchToolbar } from '@/shared/ui'
import { drivers as driversFixture } from '@/data/drivers'
import { DriversTable } from './components/drivers-table'

export function DriversPage() {
  const [rows, setRows] = useState(driversFixture)
  const [query, setQuery] = useState('')

  const filtered = rows.filter((r) => r.nombre.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="flex h-full flex-col">
      <Breadcrumb
        items={[
          { label: 'SIP', to: '/' },
          { label: 'Presupuesto', to: '/ejercicios' },
          { label: 'Ejercicios', to: '/ejercicios' },
          { label: 'Mis Servicios', to: '/ejercicios/mis-servicios' },
          { label: 'Drivers' },
        ]}
      />
      <PageHeader
        title="Drivers"
        subtitle="Definición y mantenimiento de drivers presupuestarios por equipo"
        action={
          <Button variant="primary" disabled className="opacity-50">
            Nuevo driver
          </Button>
        }
      />
      <SearchToolbar value={query} onChange={setQuery} placeholder="Buscar nombre..." resultCount={filtered.length} />
      <DriversTable rows={filtered} onDelete={(id) => setRows((prev) => prev.filter((r) => r.id !== id))} />
    </div>
  )
}
