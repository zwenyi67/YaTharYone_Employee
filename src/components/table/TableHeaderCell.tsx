import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

const TableHeaderCell = ({children,className}: {
	children: string
	className?: string
}) => {
	const { t } = useTranslation()

	return <div className={cn("text-sm font-normal", className)}>{t(children)}</div>
}

export default TableHeaderCell
