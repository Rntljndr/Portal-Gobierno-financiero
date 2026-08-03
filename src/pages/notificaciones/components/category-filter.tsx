import { cn } from '@/shared/lib/utils'
import { notificationCategories } from '@/data/notifications'

interface CategoryFilterProps {
  active: string
  onChange: (category: string) => void
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 px-8 pb-3.5">
      {notificationCategories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          className={cn(
            'rounded-full border-[1.5px] border-border bg-white px-3.5 py-[7px] font-sans text-[12.5px] font-semibold text-cs-gris-oscuro transition-all hover:border-border-strong',
            active === category && 'border-cs-azul-oscuro bg-cs-azul-oscuro text-white',
          )}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
