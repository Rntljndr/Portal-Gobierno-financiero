import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/utils'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export function Textarea({ className, rows = 3, ...props }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      className={cn(
        'w-full resize-none rounded-lg border border-border bg-white px-3 py-2 text-[12.5px] text-foreground outline-none hover:border-border-strong focus:border-primary placeholder:text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}
