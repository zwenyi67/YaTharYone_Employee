import { cn } from "@/lib/utils"
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons"
import React, { useState } from "react"
import { Button } from "../ui/button"

interface CopyButtonProps {
	text: string
	className?: string
}

const CopyButton: React.FC<CopyButtonProps> = ({ text, className }) => {
	const [timeout, setTimeoutValue] = useState(0)

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(text)
			setTimeoutValue(2)

			const countdown = setInterval(() => {
				setTimeoutValue((prev) => {
					if (prev === 1) {
						clearInterval(countdown)
					}
					return prev - 1
				})
			}, 1000)
		} catch (err) {
			console.error("Failed to copy:", err)
		}
	}

	return (
		<Button
			type="button"
			variant="ghost"
			size="icon"
			onClick={copyToClipboard}
			disabled={timeout > 0}
			className={cn('disabled:opacity-100', className)}
		>
			{timeout > 0 ? (
				<CheckIcon className="text-success" />
			) : (
				<CopyIcon />
			)}
		</Button>
	)
}

export default CopyButton
