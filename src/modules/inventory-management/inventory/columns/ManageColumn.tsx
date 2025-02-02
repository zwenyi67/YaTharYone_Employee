import { Button } from "@/components/ui/button"
import { Pencil2Icon } from "@radix-ui/react-icons"
import { Link } from "react-router-dom"
import { Info, Trash2Icon } from "lucide-react"
import { useState } from "react"
import api from '@/api';
import { toast } from "@/hooks/use-toast"
import { useQueryClient } from "@tanstack/react-query"
import { GetInventoriesType } from "@/api/inventory/types"

const ManageColumn = ({ data }: { data: GetInventoriesType }) => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const queryClient = useQueryClient();


	const { mutate: deleteInventory } = api.inventory.deleteInventory.useMutation({
		onSuccess: () => {
			toast({
				title: "Inventory Deleted successfully",
				variant: "success",
			});

			queryClient.invalidateQueries({
				queryKey: ["getInventories"],
			});
		},
		onError: (error) => {

			toast({
				title: error.message,
				variant: "destructive",
			});
		},
	});

	const handleDelete = (id: number) => {
		deleteInventory(id);
		setIsDialogOpen(false);
	};

	return (
		<div className="flex items-center justify-center">
			<Button variant={"columnIcon"} size={"icon"} onClick={() => setIsDetailOpen(true)}>
				<Info color="blue" />
			</Button>
			<Button variant={"columnIcon"} size={"icon"}>
				<Link to={`/inventory-management/inventories/${data.id}/edit`} state={{ data }}>
					<Pencil2Icon color="green" />
				</Link>
			</Button>
			<Button variant={"columnIcon"} size={"icon"} onClick={() => setIsDialogOpen(true)}>
				<Trash2Icon color="red" />
			</Button>
			{/* Dialog Box */}
			{isDialogOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-md shadow-md transform transition-all duration-300 scale-100 hover:scale-105">
						<h2 className="text-lg font-semibold mb-4">
							Are you sure you want to delete this item?
						</h2>
						<div className="flex justify-center space-x-4">
							<Button
								variant="secondary"
								onClick={() => setIsDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button variant="destructive" onClick={() => handleDelete(data.id)}>
								Confirm
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* Detail Dialog Box */}
			{isDetailOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-xl font-bold text-gray-800">
								Inventory Details
							</h2>
							<button
								onClick={() => setIsDetailOpen(false)}
								className="text-gray-500 hover:text-red-500 transition-colors duration-200"
							>
								✕
							</button>
						</div>
						<div className="space-y-3 text-gray-700">
							<div className="flex items-center space-x-2">
								<span className="font-medium">Item Name :</span>
								<span>{data.name}</span>
							</div>
							<div className="flex items-center space-x-2">
								<span className="font-medium">Item Category :</span>
								<span>{data.inventory_item_category.name}</span>
							</div>
							<div className="flex items-center space-x-2">
								<span className="font-medium">Current Stock :</span>
								<span>{data.current_stock} {data.unit_of_measure}</span>
							</div>
							<div className="flex items-center space-x-2">
								<span className="font-medium">Min Stock Level :</span>
								<span>{data.min_stock_level} {data.unit_of_measure}</span>
							</div>
							<div className="flex items-center space-x-2">
								<span className="font-medium">Reorder Level :</span>
								<span>{data.reorder_level} {data.unit_of_measure}</span>
							</div>
							<div className="flex items-center space-x-2">
								<span className="font-medium">Expiry Date (days):</span>
								<span>{data.expiry_period_inDay}</span>
							</div>
						</div>
						<div className="mt-6 flex justify-center space-x-4">
							<Button
								variant="secondary"
								className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-200"
								onClick={() => setIsDetailOpen(false)}
							>
								Close
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default ManageColumn
