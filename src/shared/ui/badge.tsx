import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/lib/utils'

const badgeVariants = cva('inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap', {
  variants: {
    variant: {
      neutral: 'bg-muted text-muted-foreground',
      primary: 'border border-border-strong bg-primary/10 text-primary',
      success: 'border border-success/30 bg-success-surface text-success',
      warning: 'border border-warning-line bg-warning-surface text-warning',
      destructive: 'border border-destructive-line bg-destructive-surface text-destructive',
    },
    shape: {
      pill: 'rounded-full',
      chip: 'rounded-md border-0',
    },
  },
  defaultVariants: { variant: 'neutral', shape: 'pill' },
})

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, shape, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, shape, className }))} {...props} />
}
