import api from "@/api"
import TableUI from "@/components/table/TableUI"
import { t } from "i18next"
import { columns } from "./columns"

const PurchasesView = () => {

	const { data, isFetching } = api.purchaseItem.getPurchases.useQuery()

	return (
		<section className="m-4">
			<div className="border px-4 py-3 bg-secondary rounded-t-lg text-white font-semibold">
				{t("title.purchasing-transactions")}
			</div>
			<div className="p-6 bg-white rounded-b-lg">
				<TableUI
					data={data}
					columns={columns}
					loading={isFetching}
					header={t("title.purchasing-transactions")}
					columnVisibility={{ created_at: false }}
					filterColumns={["firstName"]}
					sortColumn="created_at"
					newCreate="/supplier-management/purchasehistories/supplierlist"
				>
				</TableUI>


			</div>
		</section>
	)
}

export default PurchasesView
