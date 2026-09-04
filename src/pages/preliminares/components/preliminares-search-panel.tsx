import { Icon } from '@/shared/ui'

interface PreliminaresSearchPanelProps {
  label: string
  search: string
  onSearchChange: (v: string) => void
}

export function PreliminaresSearchPanel({ label, search, onSearchChange }: PreliminaresSearchPanelProps) {
  return (
    <div className="mx-8 mb-4 rounded-xl border border-border bg-white p-4.5 shadow-[0_4px_16px_rgba(6,20,60,0.06)]">
      <label className="mb-1 block text-[11px] font-bold tracking-[0.04em] text-muted-foreground uppercase">{label}</label>
      <div className="flex h-9 w-full max-w-sm items-center gap-2 rounded-lg border border-border bg-white px-3">
        <Icon name="search" size={14} color="#8A90A2" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar..."
          className="h-full flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
        />
      </div>
    </div>
  )
}
