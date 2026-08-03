import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center gap-2 rounded-[10px] text-[13px] font-semibold leading-none whitespace-nowrap cursor-pointer transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'rounded-[14px] bg-cs-azul text-white hover:bg-[#003685]',
        outline: 'border-[1.5px] border-border-strong bg-white text-primary hover:bg-[#F3F5FC] hover:border-cs-azul',
        onBlue: 'border border-white/28 bg-white/14 text-white hover:bg-white/22',
        onGreenCard: 'border border-[#A8D2B7] bg-white text-[#1F6F47] hover:bg-[#F4FAF6] hover:border-[#1F6F47]',
        ghost: 'bg-transparent px-3 py-2 text-primary hover:bg-primary/6',
      },
      size: {
        default: 'px-[18px] py-2.5',
        sm: 'px-3 py-[7px] text-xs',
        lg: 'px-[22px] py-3 text-sm',
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
