import { Button } from "@/components/ui/button"
import { Info, Trash2Icon } from "lucide-react"
import { useState } from "react"
import api from '@/api';
import { toast } from "@/hooks/use-toast"
import { useQueryClient } from "@tanstack/react-query"
import { GetPurchaseType } from "@/api/purchase-item/types"

const ManageColumn = ({ data }: { data: GetPurchaseType }) => {
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
					<div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-[650px] duration-300 scale-100">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-xl font-bold text-gray-800">
								Purchase Item Details
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
								<span className="font-medium">Supplier :</span>
								<span>{data.supplier.name}</span>
							</div>
							<div className="flex items-center space-x-2">
								<span className="font-medium">Purchase Note :</span>
								<span>{data.purchase_note}</span>
							</div>
							<div className="flex items-center space-x-2">
								<span className="font-medium">Purchase Date: </span>
								<span>{data.purchase_date}</span>
							</div>
							<div className="flex items-center space-x-2">
								<span className="font-medium">Total Amount :</span>
								<span>${data.total_amount}</span>
							</div>
						</div>
						<div className="w-full mt-8">
							<table className="table-auto w-full border-collapse border border-gray-300 shadow-lg">
								<thead className="bg-gray-200 text-gray-700">
									<tr>
										<th className="px-4 py-2 border border-gray-300">No</th>
										<th className="px-4 py-2 border border-gray-300">Item Name</th>
										<th className="px-4 py-2 border border-gray-300">Quantity</th>
										<th className="px-4 py-2 border border-gray-300">Total</th>
									</tr>
								</thead>
								<tbody className="text-gray-800">
									{data.purchase_details.map((item, index) => (
										<tr className="hover:bg-gray-100">
											<td className="px-4 py-2 text-center border border-gray-300">{index + 1}</td>
											<td className="px-4 py-2 text-center border border-gray-300">{item.item.name}</td>
											<td className="px-4 py-2 text-center border border-gray-300">{item.quantity} {item.item.unit_of_measure}</td>
											<td className="px-4 py-2 text-center border border-gray-300">${item.total_cost}</td>
										</tr>
									))}
								</tbody>
							</table>
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
