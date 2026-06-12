import { cn } from '@/utilities/ui'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  'button',
  {
    variants: {
      variant: {
        default: 'button-primary',
        destructive: 'button-primary',
        outline: 'button-secondary',
        secondary: 'button-secondary',
        ghost: 'button-secondary',
        link: 'quiet-link quiet-link--action button-link-reset',
      },
      size: {
        clear: '',
        default: '',
        sm: 'button-sm',
        lg: 'button-lg',
        icon: 'button-icon',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button: React.FC<ButtonProps> = ({ asChild = false, className, size, variant, ...props }) => {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
