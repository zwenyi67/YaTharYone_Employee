import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import { useMemo, useState } from "react"
import { SpinnerLoader } from "../loaders"

// @ts-expect-error: Don't have types for library
import VirtualScroll from "react-dynamic-virtual-scroll"

interface DynamicDropdownProps<T, K extends keyof T> {
	items: T[]
	keyField: K
	displayField: keyof T
	isLoading: boolean
	selectedKey: T[K]
	onUpdateSelectedKey: (value: T[K]) => void
	searchFields?: Array<keyof T>
	disabled?: boolean
	placeholder?: string
	className?: string
}

const DynamicDropdown = <T, K extends keyof T>({
	items,
	keyField,
	displayField,
	isLoading,
	selectedKey,
	searchFields = [],
	disabled = false,
	placeholder = "Select an item",
	className = "",
	onUpdateSelectedKey,
}: DynamicDropdownProps<T, K>) => {
	const [isOpen, setIsOpen] = useState(false)
	const [searchValue, setSearchValue] = useState("")

	const itemsToRender = useMemo(() => {
		if (searchFields.length === 0) return items

		return items.filter((item) =>
			searchFields.some((field) => {
				const searchedVal = String(item[field])

				return searchedVal
					.toLowerCase()
					.includes(searchValue.toLowerCase())
			})
		)
	}, [items, searchFields, searchValue])

	const displayValue = useMemo(() => {
		const selectedItem = items.find(
			(item) => item[keyField] === selectedKey
		)

		return selectedItem ? String(selectedItem[displayField]) : placeholder
	}, [items, keyField, displayField, selectedKey, placeholder])

	const chooseItem = (item: T) => {
		const value = item[keyField]
		onUpdateSelectedKey(value)

		setIsOpen(false)
	}

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					type="button"
					disabled={disabled}
					className={cn(
						"flex h-9 w-full items-center justify-between whitespace-nowrap border border-accent rounded-md px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none",
						isOpen ? "border-primary" : "",
						displayValue === placeholder
							? "text-muted-foreground"
							: "text-black",
						className
					)}
					onClick={() => setIsOpen(!isOpen)}
				>
					<span className="w-4/5 text-left truncate">
						{displayValue}
					</span>
					<div className="flex justify-end w-1/5">
						<ChevronDownIcon
							className={cn(
								"w-4 h-4 transition-all",
								isOpen ? "rotate-180" : ""
							)}
						/>
					</div>
				</Button>
			</PopoverTrigger>

			<PopoverContent>
				<Input
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					placeholder={placeholder}
					className="mb-3"
				/>

				{isLoading ? (
					<div className="flex items-center justify-center w-full">
						<SpinnerLoader />
					</div>
				) : (
					<VirtualScroll
						length={10}
						minItemHeight={24}
						className="max-h-[200px] overflow-y-auto"
						totalLength={itemsToRender.length}
						renderItem={(index: number) => {
							const item = itemsToRender[index]
							const isActive = item[keyField] === selectedKey

							return (
								<div
									key={item[keyField] as string}
									className={`flex items-center p-2 text-sm rounded-lg cursor-pointer ${
										isActive
											? "shadow bg-accent"
											: "hover:bg-accent/50 active:bg-accent/50"
									}`}
									role="button"
									onClick={() => chooseItem(item)}
								>
									{String(item[displayField])}
								</div>
							)
						}}
					/>
				)}
			</PopoverContent>
		</Popover>
	)
}

export default DynamicDropdown
