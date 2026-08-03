import { useState } from 'react'
import { Breadcrumb, Button, Icon, PageHeader, SearchToolbar } from '@/shared/ui'
import { centrosCosto } from '@/data/centros-costo'
import { CentrosCostoKpis } from './components/centros-costo-kpis'
import { CentrosCostoTable } from './components/centros-costo-table'

export function CentrosCostoPage() {
  const [query, setQuery] = useState('')
  const filtered = centrosCosto.filter((r) => r.codigo.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="flex h-full flex-col">
      <Breadcrumb
        items={[
          { label: 'SIP', to: '/' },
          { label: 'Presupuesto', to: '/ejercicios' },
          { label: 'Ejercicios', to: '/ejercicios' },
          { label: 'Mis Servicios', to: '/ejercicios/mis-servicios' },
          { label: 'Centros de costo' },
        ]}
      />
      <PageHeader
        title="Centros de costo"
        subtitle="Catálogo de centros de costo. Cada centro Central asigna un driver por rubro contable"
        action={
          <>
            <Button variant="primary" disabled className="opacity-50">
              Nuevo centro de costo
            </Button>
            <Button variant="outline" disabled className="opacity-50">
              <Icon name="download" size={14} color="#0047B0" /> Descargar
            </Button>
          </>
        }
      />
      <CentrosCostoKpis rows={centrosCosto} />
      <SearchToolbar value={query} onChange={setQuery} placeholder="Buscar código..." resultCount={filtered.length} />
      <CentrosCostoTable rows={filtered} />
    </div>
  )
}
