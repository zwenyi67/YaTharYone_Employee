import api from "@/api"
import TableUI from "@/components/table/TableUI"
import { t } from "i18next"
import { columns } from "./columns"

const EmployeeView = () => {

	const { data, isFetching } = api.employee.getEmployees.useQuery()

	return (
		<section className="m-4">
			<div className="border px-4 py-3 bg-secondary rounded-t-lg text-white font-semibold">
				{t("title.employee-management")}
			</div>
			<div className="p-6 bg-white rounded-lg">
				<TableUI
					data={data}
					columns={columns}
					loading={isFetching}
					header={t("title.employee-management")}
					columnVisibility={{ created_at: false }}
					filterColumns={["firstName"]}
					sortColumn="created_at"
					newCreate="/employee-management/create"
				>
				</TableUI>
			</div>
		</section>
	)
}

export default EmployeeView
