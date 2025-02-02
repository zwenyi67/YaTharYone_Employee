import api from "@/api"
import TableUI from "@/components/table/TableUI"
import { t } from "i18next"
import { columns } from "./columns"

const CategoryView = () => {

	const { data, isFetching } = api.menuCategory.getMenuCategories.useQuery()

	return (
		<section className="m-4">
			<div className="px-4 py-3 bg-secondary rounded-t-lg text-white font-semibold">
				{t("title.menu-category-management")}
			</div>
			<div className="p-6 min-h-[540px] bg-white rounded-b-lg">
				<TableUI
					data={data}
					columns={columns}
					loading={isFetching}
					header={t("title.menu-management")}
					columnVisibility={{ created_at: false }}
					filterColumns={["name"]}
					sortColumn="created_at"
					newCreate="/menu-management/menu-categories/create"
				>
				</TableUI>
			</div>
		</section>
	)
}

export default CategoryView
