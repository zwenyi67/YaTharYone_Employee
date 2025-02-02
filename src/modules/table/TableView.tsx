import api from "@/api"
import TableUI from "@/components/table/TableUI"
import { t } from "i18next"
import { columns } from "./columns"

const TableView = () => {

	const { data, isFetching } = api.table.getTables.useQuery()

	return (
		<section className="m-4">
			<div className="border px-4 py-3 bg-secondary rounded-t-lg text-white font-semibold">
				{t("title.table-management")}
			</div>
			<div className="p-6 bg-white rounded-lg">

				<TableUI
					data={data}
					columns={columns}
					loading={isFetching}
					header={t("title.table-management")}
					columnVisibility={{ createdAt: false }}
					filterColumns={["firstName"]}
					sortColumn="createdAt"
					newCreate="/table-management/create"

				>
				</TableUI>


			</div>
		</section>
	)
}

export default TableView
