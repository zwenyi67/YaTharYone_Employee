import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ClipboardPlus } from "lucide-react"
import { GetMenusType } from "@/api/menu/types"


const AddonsColumn = ({ data }: { data: GetMenusType }) => {

	return (
		<div className="flex items-center justify-center">
			<Button variant={"columnIcon"} size={"icon"}>
				<Link to={`/menu-management/menus/${data.id}/addonItems`} state={{ data }}>
					<ClipboardPlus color="blue" />
				</Link>
			</Button>
		</div>
	)
}

export default AddonsColumn
