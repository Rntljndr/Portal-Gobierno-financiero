import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium leading-none whitespace-nowrap cursor-pointer transition-colors active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'bg-cs-azul text-white hover:bg-[#003685]',
        outline: 'border border-[#B6CCF7] bg-white text-primary hover:bg-surface-hover',
        onBlue: 'border border-white/28 bg-white/14 text-white hover:bg-white/22',
        onGreenCard: 'border border-success-line bg-white text-success hover:border-success',
        ghost: 'bg-transparent text-primary hover:bg-transparent hover:text-cs-azul-oscuro',
      },
      size: {
        default: 'h-[41px] px-3',
        sm: 'h-8 px-2.5 text-xs',
        lg: 'h-11 px-5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
