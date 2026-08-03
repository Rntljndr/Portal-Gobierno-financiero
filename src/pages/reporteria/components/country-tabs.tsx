import { cn } from '@/shared/lib/utils'
import { Icon, Button } from '@/shared/ui'
import { countryTabs } from '@/data/reporteria'

interface CountryTabsProps {
  active: string
  onChange: (tab: string) => void
  showConsolidado?: boolean
}

export function CountryTabs({ active, onChange, showConsolidado }: CountryTabsProps) {
  const tabs = [...(showConsolidado ? ['Consolidado'] : []), ...countryTabs, 'Tablón']
  return (
    <div className="mx-8 mb-4 flex flex-wrap items-end justify-between gap-3 border-b-2 border-border">
      <div className="flex flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={cn(
              '-mb-0.5 px-6 py-2.5 text-[13.5px] font-medium text-muted-foreground',
              active === tab && 'border-b-2 border-primary font-bold text-primary',
            )}
          >
            {tab}
          </button>
        ))}
      </div>
      <Button variant="outline" size="sm" disabled className="mb-2 opacity-50">
        <Icon name="download" size={14} color="#0047B0" /> Descargar
      </Button>
    </div>
  )
}
