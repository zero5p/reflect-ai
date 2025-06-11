import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:translate-y-[-1px] active:translate-y-[0px]",
        secondary:
          "bg-white border border-violet-100 text-violet-700 shadow-sm hover:bg-violet-50 hover:shadow-md hover:translate-y-[-1px] active:translate-y-[0px]",
        outline: "border border-violet-200 bg-white text-violet-700 hover:bg-violet-50 hover:text-violet-800",
        ghost: "text-violet-700 hover:bg-violet-50 hover:text-violet-800",
        link: "text-violet-700 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-5 py-3",
        sm: "h-9 rounded-lg px-3",
        lg: "h-14 rounded-xl px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
