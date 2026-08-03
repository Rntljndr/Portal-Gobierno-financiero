import { useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Icon } from './icon'
import { MultiSelectMenu } from './multi-select-menu'

interface MultiSelectProps {
  placeholder: string
  options: string[]
  values: string[]
  onChange: (values: string[]) => void
}

export function MultiSelect({ placeholder, options, values, onChange }: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const toggle = (v: string) => onChange(values.includes(v) ? values.filter((x) => x !== v) : [...values, v])
  const remove = (v: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(values.filter((x) => x !== v))
  }

  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setQuery('')
      }}
    >
      <Popover.Trigger asChild>
        <button
          type="button"
          className="flex h-[38px] w-full items-center gap-2 rounded-[10px] border-[1.5px] border-border bg-white px-3 text-left text-[12.5px] text-foreground hover:border-border-strong"
        >
          <div className="flex min-w-0 flex-1 flex-wrap gap-1 overflow-hidden">
            {values.length === 0 ? (
              <span className="font-medium text-muted-foreground">{placeholder}</span>
            ) : (
              values.map((v) => (
                <span
                  key={v}
                  className="relative inline-flex items-center gap-1 rounded-md bg-[#E8EEFB] py-[3px] pr-1.5 pl-2 text-[11px] font-semibold text-primary"
                >
                  {v}
                  <Icon name="x_close" size={10} color="#0047B0" />
                  <span className="absolute inset-y-0 right-0.5 w-4 cursor-pointer" onClick={(e) => remove(v, e)} />
                </span>
              ))
            )}
          </div>
          <Icon name="chevron_down" size={14} color="#8A90A2" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <MultiSelectMenu
          placeholder={placeholder}
          options={options}
          values={values}
          query={query}
          onQueryChange={setQuery}
          onToggle={toggle}
        />
      </Popover.Portal>
    </Popover.Root>
  )
}
