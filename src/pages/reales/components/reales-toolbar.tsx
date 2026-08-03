import { Button, Icon } from '@/shared/ui'
import { currencyOptions } from '@/data/reales'

interface RealesToolbarProps {
  search: string
  onSearchChange: (v: string) => void
  currency: string
  onCurrencyChange: (v: string) => void
}

export function RealesToolbar({ search, onSearchChange, currency, onCurrencyChange }: RealesToolbarProps) {
  return (
    <div className="mx-8 mb-4 flex flex-wrap items-center gap-2.5 rounded-2xl border border-border bg-white p-3.5">
      <div className="flex h-9 min-w-[280px] flex-1 items-center gap-2 rounded-lg border border-border bg-white px-3">
        <Icon name="search" size={14} color="#8A90A2" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por PEP, proveedor o documento..."
          className="h-full flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
        />
      </div>
      <Button variant="outline" size="sm">
        <Icon name="filter" size={12} color="#0047B0" /> Filtros
      </Button>
      <div className="flex h-9 items-center gap-1.5 rounded-lg border-[1.5px] border-border bg-white px-3">
        <Icon name="dollar" size={13} color="#455B85" />
        <span className="text-[12.5px] text-muted-foreground">Moneda:</span>
        <select
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value)}
          className="bg-transparent text-[12.5px] font-semibold text-foreground outline-none"
        >
          {currencyOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <Button variant="outline" size="sm">
        <Icon name="download" size={12} color="#0047B0" /> Excel
      </Button>
    </div>
  )
}
