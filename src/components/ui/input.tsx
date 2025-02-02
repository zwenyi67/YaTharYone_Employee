import * as React from "react"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const inputVariants = cva(
	"flex h-9 w-full rounded-md bg-accent px-3 py-1 file:rounded border text-sm transition-colors file:bg-transparent file:hover:bg-gray-300 file:h-full file:text-xs file:cursor-pointer placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary disabled:cursor-not-allowed disabled:opacity-50 auto",
	{
		variants: {
			variant: {
				default:
					"flex h-9 w-full rounded-md bg-accent px-3 py-1 file:rounded border text-sm transition-colors file:bg-transparent file:hover:bg-gray-300 file:h-full file:text-xs file:cursor-pointer placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary disabled:cursor-not-allowed disabled:opacity-50",
				auth: "flex h-9 w-full rounded-md bg-accent px-3 py-1 text-sm transition-colors file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
				outline:
					"flex h-9 w-full rounded-md bg-accent px-3 py-1 text-sm transition-colors border border-secondary file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-none disabled:cursor-not-allowed disabled:opacity-50",
			},
		},
	}
)

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement>,
		VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, variant, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(inputVariants({ variant, className }))}
				ref={ref}
				{...props}
			/>
		)
	}
)
Input.displayName = "Input"

export { Input }

