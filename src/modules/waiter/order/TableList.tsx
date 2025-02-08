import api from "@/api";
import { GetTablesType } from "@/api/waiter/order/types";
import { t } from "i18next";
import { AlertTriangle, CheckCircle, ShieldX, Utensils, XCircle, RefreshCw, Filter } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Button } from "@/components/ui/button"; // Adjust based on your button component
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const TableList = () => {
	const { data, isFetching, refetch } = api.waiterOrder.getTables.useQuery();
	const [filter, setFilter] = useState<string | null>(null);

	const navigate = useNavigate();

	const getStatusStyles = (status: string) => {
		switch (status) {
			case "available":
				return { bg: "bg-gradient-to-br from-green-700 to-green-500", text: "text-white", icon: <CheckCircle className="text-white size-6" /> };
			case "occupied":
				return { bg: "bg-gradient-to-br from-red-700 to-red-500", text: "text-white", icon: <XCircle className="text-white size-6" /> };
			case "reservation":
				return { bg: "bg-gradient-to-br from-orange-700 to-orange-500", text: "text-white", icon: <AlertTriangle className="text-white size-6" /> };
			case "outofservice":
				return { bg: "bg-gradient-to-br from-gray-700 to-gray-500", text: "text-white", icon: <ShieldX className="text-white size-6" /> };
			default:
				return { bg: "bg-gradient-to-br from-gray-200 to-gray-400", text: "text-gray-800", icon: null };
		}
	};

	const onTableClick = (item: GetTablesType) => {
		if (item.status === "outofservice") {
			toast({
				title: "Table you selected is Out of Service",
				variant: "destructive",
			});
			return;
		}
	
		// Check if table has existing active (occupied) orders
		if (item.status === "occupied" && item.orders) {
			// Navigate to menu page with existing order data
			navigate(`/waiter/orders/tables/${item.id}/menus`, {
				state: { existingOrders: item.orders }, // Pass orders via state
			});
		} else {
			// For Available / Reserved tables, start a new order
			navigate(`/waiter/orders/tables/${item.id}/menus`, {
				state: { existingOrders: [] }, // Empty orders for new order
			});
		}
	};
	

	// Filter tables based on status
	const filteredData = filter ? data?.filter(item => item.status === filter) : data;

	return (
		<section className="m-4">
			{/* Header */}
			<div className="border px-4 py-3 bg-secondary rounded-t-lg text-white font-semibold flex justify-between items-center">
				<div>{t("title.orders")} - {t("title.tables-list")}</div>
				<Button
                    variant="secondary"
                    className="flex items-center gap-2"
                    onClick={() => refetch()}
                >
                    <RefreshCw className="h-4 w-4" />
                    {t("common.refresh")}
                </Button>
			</div>

			{/* Table Grid */}
			<div className="p-6 bg-white rounded-lg shadow-lg">
				<div className="flex flex-col lg:flex-row md:flex-row justify-between mb-6">
					{/* Filter Buttons */}
					<div className="gap-3 my-4 lg:flex hidden sm:hidden md:hidden">
						<Button
							variant={filter === null ? "secondary" : "outline"}
							className="flex items-center gap-2"
							onClick={() => setFilter(null)}
						>
							<Filter className="size-4" />
							All
						</Button>
						{["available", "occupied", "reservation", "outofservice"].map(status => (
							<Button
								key={status}
								variant={filter === status ? "secondary" : "outline"}
								className="flex items-center gap-2"
								onClick={() => setFilter(filter === status ? null : status)}
							>
								{status.charAt(0).toUpperCase() + status.slice(1)}
							</Button>
						))}
					</div>
					<div className="my-4 lg:hidden block sm:block">
						<Select onValueChange={(value) => setFilter(value === "all" ? null : value)}>
							<SelectTrigger className="w-[200px]">
								<SelectValue placeholder="Filter Tables" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All</SelectItem>
								<SelectItem value="available">Available</SelectItem>
								<SelectItem value="occupied">Occupied</SelectItem>
								<SelectItem value="reservation">Reservation</SelectItem>
								<SelectItem value="outofservice">Out of Service</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-3 gap-6">
					{!isFetching ? (
						filteredData?.map((item) => {
							const { bg, text, icon } = getStatusStyles(item.status);
							return (
								<button
									key={item.id}
									className={`p-6 rounded-2xl shadow-lg border ${bg} flex flex-col items-center transition transform hover:scale-105 hover:shadow-xl active:scale-95`}
									onClick={() => onTableClick(item)}
								>
									<Utensils className="text-white size-8 mb-2" />
									<div className="text-2xl font-bold text-white mb-2">{item.table_no}</div>
									<div className="text-white text-sm">Capacity: {item.capacity} seats</div>
									<div className={`font-medium ${text} flex items-center gap-2 mt-2`}>
										{icon}
										{item.status.charAt(0).toUpperCase() + item.status.slice(1)}
									</div>
								</button>
							);
						})
					) : (
						<div className="flex justify-center items-center">
							Fetching Table ...
						</div>
					)}
				</div>
			</div>
		</section>
	);
};

export default TableList;
