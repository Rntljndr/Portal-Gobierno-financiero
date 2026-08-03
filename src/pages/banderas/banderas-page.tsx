import { useState } from 'react'
import { Breadcrumb, Button, Icon, PageHeader, SearchToolbar } from '@/shared/ui'
import { banderas as banderasFixture } from '@/data/banderas'
import { BanderasKpis } from './components/banderas-kpis'
import { BanderasTable } from './components/banderas-table'

export function BanderasPage() {
  const [rows, setRows] = useState(banderasFixture)
  const [query, setQuery] = useState('')

  const filtered = rows.filter((r) => r.desc.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="flex h-full flex-col">
      <Breadcrumb
        items={[
          { label: 'SIP', to: '/' },
          { label: 'Presupuesto', to: '/ejercicios' },
          { label: 'Ejercicios', to: '/ejercicios' },
          { label: 'Mis Servicios', to: '/ejercicios/mis-servicios' },
          { label: 'Banderas' },
        ]}
      />
      <PageHeader
        title="Banderas"
        subtitle="Catálogo de banderas (supermercados / tiendas) por país"
        action={
          <>
            <Button variant="primary" disabled className="opacity-50">
              Nueva bandera
            </Button>
            <Button variant="outline" disabled className="opacity-50">
              <Icon name="download" size={14} color="#0047B0" /> Descargar
            </Button>
          </>
        }
      />
      <BanderasKpis rows={rows} />
      <SearchToolbar value={query} onChange={setQuery} placeholder="Buscar nombre..." resultCount={filtered.length} />
      <BanderasTable
        rows={filtered}
        onToggleVisible={(id) => setRows((prev) => prev.map((r) => (r.id === id ? { ...r, visible: !r.visible } : r)))}
        onDelete={(id) => setRows((prev) => prev.filter((r) => r.id !== id))}
      />
    </div>
  )
}
