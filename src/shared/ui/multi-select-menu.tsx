import * as Popover from '@radix-ui/react-popover'
import { Icon } from './icon'

interface MultiSelectMenuProps {
  placeholder: string
  options: string[]
  values: string[]
  query: string
  onQueryChange: (q: string) => void
  onToggle: (v: string) => void
}

export function MultiSelectMenu({ placeholder, options, values, query, onQueryChange, onToggle }: MultiSelectMenuProps) {
  const visible = options.filter((o) => !query || o.toLowerCase().includes(query.toLowerCase()))

  return (
    <Popover.Content
      align="start"
      sideOffset={4}
      className="z-130 w-(--radix-popover-trigger-width) rounded-[10px] border border-border bg-white p-1 shadow-[0_8px_24px_rgba(6,20,148,0.12)]"
    >
      <div className="p-1.5">
        <div className="flex h-8 items-center gap-2 rounded-lg border border-border bg-[#F8FAFD] px-2.5">
          <Icon name="search" size={13} color="#8A90A2" />
          <input
            autoFocus
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={`Buscar en ${placeholder.toLowerCase()}...`}
            className="h-full flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="max-h-[280px] overflow-y-auto p-1">
        {visible.length === 0 ? (
          <div className="p-2.5 text-center text-[12.5px] text-muted-foreground">Sin resultados</div>
        ) : (
          visible.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-2 rounded-[7px] px-2.5 py-2 text-[12.5px] text-foreground hover:bg-[#F1F4FA]"
            >
              <input
                type="checkbox"
                className="size-3.5 cursor-pointer"
                checked={values.includes(option)}
                onChange={() => onToggle(option)}
              />
              <span>{option}</span>
            </label>
          ))
        )}
      </div>
    </Popover.Content>
  )
}
