import { Icon } from './icon'

interface SearchToolbarProps {
  value: string
  onChange: (v: string) => void
  placeholder: string
  resultCount: number
}

export function SearchToolbar({ value, onChange, placeholder, resultCount }: SearchToolbarProps) {
  return (
    <div className="mx-8 mb-4 flex items-center gap-3">
      <div className="flex h-9 w-72 items-center gap-2 rounded-lg border border-border bg-white px-3">
        <Icon name="search" size={14} color="#8A90A2" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-full flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
        />
      </div>
      <span className="text-[12.5px] text-muted-foreground">
        {resultCount} {resultCount === 1 ? 'resultado' : 'resultados'}
      </span>
    </div>
  )
}
