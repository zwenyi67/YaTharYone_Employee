import { Button } from "@/components/ui/button"
import { Pencil2Icon } from "@radix-ui/react-icons"
import { Link } from "react-router-dom"
import { Info, Trash2Icon } from "lucide-react"
import { useState } from "react"
import api from '@/api';
import { toast } from "@/hooks/use-toast"
import { useQueryClient } from "@tanstack/react-query"
import { GetMenusType } from "@/api/menu/types"

const ManageColumn = ({ data }: { data: GetMenusType }) => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const queryClient = useQueryClient();


	const { mutate: deleteMenu } = api.menu.deleteMenu.useMutation({
		onSuccess: () => {
			toast({
				title: "Menu Deleted successfully",
				variant: "success",
			});

			queryClient.invalidateQueries({
				queryKey: ["getmenus"],
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
		deleteMenu(id);
		setIsDialogOpen(false);
	};

	return (
		<div className="flex items-center justify-center">
			<Button variant={"columnIcon"} size={"icon"} onClick={() => setIsDetailOpen(true)}>
				<Info color="blue" />
			</Button>
			<Button variant={"columnIcon"} size={"icon"}>
				<Link to={`/menu-management/menus/${data.id}/edit`} state={{ data }}>
					<Pencil2Icon color="green" />
				</Link>
			</Button>
			<Button variant={"columnIcon"} size={"icon"} onClick={() => setIsDialogOpen(true)}>
				<Trash2Icon color="red" />
			</Button>
			{/* Dialog Box */}
			{isDialogOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-md shadow-md">
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
								Menu Details
							</h2>
							<button
								onClick={() => setIsDetailOpen(false)}
								className="text-gray-500 hover:text-red-500 transition-colors duration-200"
							>
								✕
							</button>
						</div>
						<div className="space-y-3 text-gray-700">
							<div>
								<img className="w-40 h-40" src={`http://127.0.0.1:8000${data.profile}`} alt="" />
							</div>
							<div className="flex items-center space-x-2">
								<span className="font-medium">Menu :</span>
								<span>{data.name}</span>
							</div>
							<div className="flex items-center space-x-2">
								<span className="font-medium">Category :</span>
								<span>{data.category.name}</span>
							</div>
							<div className="flex items-center space-x-2">
								<span className="font-medium">Price :</span>
								<span>{data.price}</span>
							</div>
							<div className="flex items-center space-x-2">
								<span className="font-medium">Status :</span>
								<span className="text-blue-600 underline">{data.status}</span>
							</div>
							<div className="flex items-center space-x-2">
								<span className="font-medium">Description :</span>
								<span>{data.description}</span>
							</div>
						</div>
						<div className="w-full mt-8">
							<div className="text-secondary font-semibold mb-3">
								Ingredients
							</div>
							<table className="table-auto w-full border-collapse border border-gray-300 shadow-lg">
								<thead className="bg-gray-200 text-gray-700">
									<tr>
										<th className="px-4 py-2 border border-gray-300">No</th>
										<th className="px-4 py-2 border border-gray-300">Item Name</th>
										<th className="px-4 py-2 border border-gray-300">Quantity</th>
									</tr>
								</thead>
								<tbody className="text-gray-800">
									{data.inventory_items.map((item, index) => (
										<tr key={item.id} className="hover:bg-gray-100">
											<td className="px-4 py-2 text-center border border-gray-300">{index + 1}</td>
											<td className="px-4 py-2 text-center border border-gray-300">{item.name}</td>
											<td className="px-4 py-2 text-center border border-gray-300">{item.quantity} {item.unit_of_measure}</td>
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
