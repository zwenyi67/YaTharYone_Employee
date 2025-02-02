import api from "@/api"
import TableUI from "@/components/table/TableUI"
import { t } from "i18next"
import { columns } from "./columns"

const ItemCategoryView = () => {

	const { data, isFetching } = api.itemCategory.getItemCategories.useQuery()

	return (
		<section className="m-4">
			<div className="border px-4 py-3 bg-secondary rounded-t-lg text-white font-semibold">
				{t("title.item-category-management")}
			</div>
			<div className="p-6 bg-white rounded-b-lg">
				<TableUI
					data={data}
					columns={columns}
					loading={isFetching}
					header={t("title.item-category-management")}
					columnVisibility={{ created_at: false }}
					filterColumns={["name"]}
					sortColumn="created_at"
					newCreate="/inventory-management/item-categories/create"
				>
				</TableUI>


			</div>
		</section>
	)
}

export default ItemCategoryView
