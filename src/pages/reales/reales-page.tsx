import { useState } from 'react'
import { movimientosReales } from '@/data/reales'
import { RealesHeader } from './components/reales-header'
import { RealesToolbar } from './components/reales-toolbar'
import { RealesTable } from './components/reales-table'

export function RealesPage() {
  const [currency, setCurrency] = useState('USD')
  const [syncing, setSyncing] = useState(false)
  const [search, setSearch] = useState('')

  const handleSync = () => {
    setSyncing(true)
    setTimeout(() => setSyncing(false), 1600)
  }

  const filtered = movimientosReales.filter((r) => {
    const q = search.toLowerCase()
    return !q || r.pep.toLowerCase().includes(q) || r.vendor.toLowerCase().includes(q) || r.doc.toLowerCase().includes(q)
  })

  return (
    <div className="h-full overflow-y-auto">
      <RealesHeader syncing={syncing} onSync={handleSync} />
      <RealesToolbar search={search} onSearchChange={setSearch} currency={currency} onCurrencyChange={setCurrency} />
      <RealesTable rows={filtered} />
    </div>
  )
}
