import * as SelectPrimitive from '@radix-ui/react-select'
import { Icon } from './icon'
import { cn } from '@/shared/lib/utils'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: (string | SelectOption)[]
  placeholder?: string
  disabled?: boolean
  className?: string
}

function toOption(o: string | SelectOption): SelectOption {
  return typeof o === 'string' ? { value: o, label: o } : o
}

export function Select({ value, onChange, options, placeholder = 'Seleccionar...', disabled, className }: SelectProps) {
  const normalized = options.map(toOption)

  return (
    <SelectPrimitive.Root value={value} onValueChange={onChange} disabled={disabled}>
      <SelectPrimitive.Trigger
        className={cn(
          'flex h-[38px] w-full items-center justify-between gap-2 rounded-[10px] border-[1.5px] border-border bg-white px-3 text-left text-[12.5px] text-foreground outline-none hover:border-border-strong data-[placeholder]:text-muted-foreground data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60',
          className,
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>
          <Icon name="chevron_down" size={14} color="#8A90A2" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={4}
          className="z-[9100] w-(--radix-select-trigger-width) overflow-hidden rounded-[10px] border border-border bg-white shadow-[0_8px_24px_rgba(6,20,148,0.12)]"
        >
          <SelectPrimitive.Viewport className="max-h-[280px] p-1">
            {normalized.map((opt) => (
              <SelectPrimitive.Item
                key={opt.value}
                value={opt.value}
                className="flex cursor-pointer items-center justify-between gap-2 rounded-[7px] px-2.5 py-2 text-[12.5px] text-foreground outline-none data-[highlighted]:bg-[#F1F4FA] data-[state=checked]:bg-primary/10 data-[state=checked]:font-semibold data-[state=checked]:text-primary"
              >
                <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator>
                  <Icon name="check" size={12} color="currentColor" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}
