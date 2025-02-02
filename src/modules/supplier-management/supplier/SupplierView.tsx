import api from "@/api"
import TableUI from "@/components/table/TableUI"
import { t } from "i18next"
import { columns } from "./columns"

const SupplierView = () => {

	const { data, isFetching } = api.supplier.getSuppliers.useQuery()

	return (
		<section className="m-4">
			<div className="border px-4 py-3 bg-secondary rounded-t-lg text-white font-semibold">
				{t("title.supplier-management")}
			</div>
			<div className="p-6 bg-white rounded-b-lg">
				<TableUI
					data={data}
					columns={columns}
					loading={isFetching}
					header={t("title.supplier-management")}
					columnVisibility={{ created_at: false }}
					filterColumns={["name"]}
					sortColumn="created_at"
					newCreate="/supplier-management/suppliers/create"
				>
				</TableUI>


			</div>
		</section>
	)
}

export default SupplierView
