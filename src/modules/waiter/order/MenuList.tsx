import api from "@/api";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp, CircleChevronLeft, Eye, MinusCircle, PlusCircle, RefreshCw, ShoppingCart, Trash2Icon } from "lucide-react";
import { t } from "i18next";
import { GetMenusType, GetOrdersType, Order, ProceedOrderPayloadType, RequestBillPayloadType } from "@/api/waiter/order/types";
import { Input } from "@/components/ui/input";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useDispatch } from "react-redux";
import { toast } from "@/hooks/use-toast";
import { hideLoader, openLoader } from "@/store/features/loaderSlice";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const MenuList = () => {

    const { id: tableId } = useParams();

    const { data: menus, refetch: menuRefetch } = api.waiterOrder.getMenus.useQuery();
    const { data: categories, refetch: cateRefetch } = api.waiterOrder.getMenuCategories.useQuery();
    const [filter, setFilter] = useState<string | null>(null);
    const [showOrderList, setShowOrderList] = useState(false);

    const location = useLocation();
    const existingOrders: Order[] = location.state?.existingOrders || [];
    const [orders, setOrders] = useState<GetOrdersType[]>([]);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const refresh = () => {
        menuRefetch();
        cateRefetch();
        fetchPreviousOrder();
    }

    const AddToOrder = (menu: GetMenusType) => {
        setOrders(prevOrders => {
            // Check if the item already exists in the order
            const existingOrderIndex = prevOrders.findIndex(order => order.id === menu.id);

            if (existingOrderIndex !== -1) {
                // If exists, increase quantity
                return prevOrders.map((order, index) =>
                    index === existingOrderIndex ? { ...order, quantity: order.quantity + 1 } : order
                );
            } else {
                // Otherwise, add as a new order
                return [...prevOrders, {
                    id: menu.id,
                    name: menu.name,
                    price: menu.price,
                    note: "",
                    quantity: 1
                }];
            }
        });
    };

    // Increase quantity
    const increaseQuantity = (id: number) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === id ? { ...order, quantity: order.quantity + 1 } : order
            )
        );
    };

    // Decrease quantity (remove item if quantity reaches 1)
    const decreaseQuantity = (id: number) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === id ? { ...order, quantity: Math.max(order.quantity - 1, 1) } : order
            )
        );
    };

    // Remove item from order list
    const removeOrder = (id: number) => {
        setOrders(prevOrders => prevOrders.filter(order => order.id !== id));
    };

    const [expandedNotes, setExpandedNotes] = useState<number[]>([]); // Track which notes are expanded

    const toggleNote = (id: number) => {
        setExpandedNotes(prev =>
            prev.includes(id) ? prev.filter(orderId => orderId !== id) : [...prev, id]
        );
    };

    const updateNote = (id: number, note: string) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === id ? { ...order, note } : order
            )
        );
    };

    const { mutate: proceedOrder } =
        api.waiterOrder.proceedOrder.useMutation({
            onMutate: () => {
                dispatch(openLoader());
            },
            onSuccess: () => {
                toast({
                    title: "Proceed Order successfully",
                    variant: "success",
                });
                navigate("/waiter/dashboard");
            },
            onError: (error) => {
                toast({
                    title: error.message,
                    variant: "destructive",
                });
            },
            onSettled: () => {
                dispatch(hideLoader());
            },
        });

    const resetOrder = () => {
        setOrders([]);
    }

    const proceedToOrder = () => {
        const order_id = existingOrders.length > 0 ? existingOrders[0].id : "null"
        const payload: ProceedOrderPayloadType = {
            order_list: orders,
            table_id: Number(tableId),
            waiter_id: 1,
            status: "pending",
            order_id: order_id
        }
        proceedOrder(payload);
    }

    const [previousOrderDialog, setPreviousOrderDialog] = useState(false);
    const [selectedOrderId] = useState<number | null>(
        existingOrders?.[0]?.id ?? null
    );

    const {
        data: previousOrderData,
        refetch: fetchPreviousOrder,
    } = api.waiterOrder.getOrderById.useQuery(selectedOrderId);

    useEffect(() => {
        if (previousOrderData && previousOrderData.length > 0) {
            const order = previousOrderData[0];
    
            if (order.status === "completed") {
                navigate("/waiter/orders/tables");
            }
        }
    }, [previousOrderData, navigate]);

    const handlePreviousOrder = () => {
        if (selectedOrderId) {
            fetchPreviousOrder();
            setPreviousOrderDialog(true);
        }
    };

    const [selectedMenu, setSelectedMenu] = useState<GetMenusType | null>(null);


    const openMenuDetailDialog = (menu: GetMenusType) => {
        setSelectedMenu(menu);
    }

    const [paymentDialog, setPaymentDialog] = useState(false);


    const filteredMenus = filter ? menus?.filter(menu => menu.category_id === parseInt(filter)) : menus;

    const { mutate: requestBill } =
        api.waiterOrder.requestBill.useMutation({
            // onMutate: () => {
            //     dispatch(openLoader());
            // },
            onSuccess: () => {
                toast({
                    title: "Requested the bill",
                    variant: "success",
                });
                refresh();
            },
            onError: (error) => {
                toast({
                    title: error.message,
                    variant: "destructive",
                });
            },
            //   onSettled: () => {
            //       dispatch(hideLoader());
            //   },
        });

    const requestBillToggle = (order_id: number) => {
        const payload: RequestBillPayloadType = {
            order_id: order_id,
        }
        requestBill(payload);
    }

    return (
        <section className="m-4">
            {/* Header */}
            <div className="border px-4 py-3 bg-secondary rounded-t-lg text-white font-semibold flex justify-between items-center">
                <div>{t("title.orders")} - {t("title.menus-list")}</div>
                <Button
                    variant="secondary"
                    className="flex items-center gap-2"
                    onClick={refresh}
                >
                    <RefreshCw className="h-4 w-4" />
                    {t("common.refresh")}
                </Button>
            </div>

            {/* Menu Grid */}
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <div className="flex justify-between">
                    <div className="my-4 pt-1">
                        <Link to={'/waiter/orders/tables'} className=""><CircleChevronLeft className='w-8 h-8 text-secondary hover:text-blue-500' />
                        </Link>
                    </div>
                    <div className="flex gap-2 my-4">
                        {existingOrders.length > 0 && (
                            <div className="flex gap-2">
                                <Button onClick={handlePreviousOrder}
                                    variant="secondary">
                                    Previous Orders
                                </Button>
                                <Button onClick={() => setPaymentDialog(true)}
                                    variant="secondary">
                                    Payment
                                </Button>
                            </div>
                        )}
                        <Button
                            variant="secondary"
                            className="relative flex items-center gap-2"
                            onClick={() => setShowOrderList(true)}
                        >
                            <ShoppingCart className="size-5" />
                            Orders
                            {orders.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    {orders.reduce((total, order) => total + order.quantity, 0)}
                                </span>
                            )}
                        </Button>

                    </div>
                </div>
                <div className="flex justify-between mb-6">
                    <div className="gap-3 my-4 lg:flex hidden sm:hidden md:hidden">
                        <Button
                            variant={filter === null ? "secondary" : "outline"}
                            className="flex items-center gap-2"
                            onClick={() => setFilter(null)}
                        >
                            All
                        </Button>
                        {categories?.map(cate => (
                            <Button
                                key={cate.id}
                                variant={filter === cate.id.toString() ? "secondary" : "outline"}
                                className="flex items-center gap-2"
                                onClick={() => setFilter(filter === cate.id.toString() ? null : cate.id.toString())}
                            >
                                {cate.name}
                            </Button>
                        ))}
                    </div>
                    <div className="my-4 lg:hidden block sm:block">
                        <Select onValueChange={(value) => setFilter(value === "all" ? null : value)}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filter by Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                {categories?.map(category => (
                                    <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredMenus?.map((menu) => (
                        <div key={menu.id} className="relative border rounded-xl p-4 sm:p-6 bg-white shadow-lg hover:shadow-xl transition-all duration-300">

                            {/* Detail Icon at Top-Right */}
                            <button
                                className="absolute top-3 right-3 bg-gray-100 p-2 rounded-full shadow hover:bg-gray-200 transition"
                                onClick={() => openMenuDetailDialog(menu)}
                            >
                                <Eye className="w-5 h-5 text-gray-600" />
                            </button>

                            <div className="flex justify-center mb-4">
                                <img
                                    src={menu.profile === null ? "http://127.0.0.1:8000/storage/uploads/menu.jpeg" : `http://127.0.0.1:8000${menu.profile}`}
                                    alt={menu.name}
                                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full border-4 border-secondary shadow-md"
                                />
                            </div>
                            <div className="text-center">
                                <div className="text-lg sm:text-base font-semibold text-gray-800">{menu.name}</div>
                                <div className="text-sm sm:text-sm text-gray-500">{menu.category.name}</div>
                                <div className="text-lg sm:text-base font-bold text-secondary mt-2">${menu.price}</div>
                            </div>
                            <Button
                                onClick={() => AddToOrder(menu)}
                                className="mt-4 w-full py-2 px-4 bg-secondary text-white font-semibold rounded-lg hover:bg-blue-500 transition-all duration-200"
                            >
                                Add to Order
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {paymentDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 backdrop-blur-sm transition-all duration-300">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg md:max-w-2xl h-auto max-h-[80vh] overflow-y-auto shadow-xl transition-all duration-300">
                        {/* Header Section */}
                        <div className="flex justify-between items-center border-b pb-3">
                            <h2 className="text-xl font-semibold text-gray-800">Payment</h2>
                            <Button
                                variant="ghost"
                                onClick={() => setPaymentDialog(false)}
                                className="hover:bg-gray-200 rounded-full p-2"
                            >
                                <Cross1Icon className="h-5 w-5 text-gray-600" />
                            </Button>
                        </div>

                        {/* Order Details */}
                        <div className="mt-4 space-y-2">
                            <div className="text-lg font-medium">Order #{previousOrderData![0].order_number}</div>
                            <div className="text-sm text-gray-600">Table: {previousOrderData![0].table.table_no}</div>

                            {/* Order Items Table */}
                            <div className="border rounded-lg p-4 bg-gray-50 mt-3">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-gray-600 text-sm border-b">
                                            <th className="py-2">Item</th>
                                            <th className="py-2 text-center">Qty</th>
                                            <th className="py-2 text-right">Price</th>
                                            <th className="py-2 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previousOrderData![0].order_details.map((item) => (
                                            <tr key={item.menu.id} className="border-b text-sm">
                                                <td className="py-2">{item.menu.name}</td>
                                                <td className="py-2 text-center">{item.quantity}</td>
                                                <td className="py-2 text-right">${item.menu.price}</td>
                                                <td className="py-2 text-right">${(item.quantity * item.menu.price).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Total Amount */}
                            <div className="flex justify-between items-center mt-3 text-lg font-semibold text-gray-800">
                                <span>Total Amount:</span>
                                <span>${previousOrderData![0].order_details.reduce((sum, item) => sum + item.quantity * item.menu.price, 0).toFixed(2)}</span>
                            </div>

                            {/* Payment Status */}
                            {previousOrderData![0].payment === null ?
                                (<div>
                                    <div className="mt-4 text-center">
                                        <span className="text-red-600 text-sm font-medium">Customer has not paid yet.</span>
                                    </div>


                                    <div className="mt-5 flex justify-end">
                                        <Button onClick={() => requestBillToggle(previousOrderData![0].id)}
                                            variant="secondary" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                                            Request the Bill
                                        </Button>
                                    </div>
                                </div>) : (
                                    <div>
                                        <div className="mt-4 text-center">
                                        <span className="text-red-600 text-sm font-medium">Payment is processing.</span>
                                    </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            )}


            {/* Dialog for Menu Details */}
            {selectedMenu && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg md:max-w-2xl h-auto max-h-[80vh] overflow-y-auto shadow-xl transition-all duration-300">

                        {/* Header */}
                        <div className="flex justify-between items-center border-b pb-2">
                            <h4 className="text-xl font-semibold text-gray-800">Menu Details</h4>
                            <Button variant="ghost" onClick={() => setSelectedMenu(null)}>
                                <Cross1Icon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
                            </Button>
                        </div>

                        {/* Menu Image */}
                        <div className="flex justify-center my-4">
                            <img
                                src={selectedMenu.profile === null
                                    ? "http://127.0.0.1:8000/storage/uploads/menu.jpeg"
                                    : `http://127.0.0.1:8000${selectedMenu.profile}`}
                                alt={selectedMenu.name}
                                className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-lg border-4 border-secondary shadow-md"
                            />
                        </div>

                        {/* Menu Info */}
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-900">{selectedMenu.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{selectedMenu.category.name}</p>
                            <p className="text-lg font-semibold text-secondary mt-2">${selectedMenu.price}</p>
                            <p className="text-sm text-gray-500 mt-3">{selectedMenu.description || "No description available."}</p>
                        </div>

                        {/* Ingredients Section */}
                        <div className="mt-5">
                            <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Ingredients</h4>
                            <ul className="mt-3 space-y-2">
                                {selectedMenu.inventory_items.length > 0 ? (
                                    selectedMenu.inventory_items.map((item) => (
                                        <li key={item.id} className="flex justify-between items-center text-sm text-gray-700 bg-gray-100 p-2 rounded-lg shadow">
                                            <span className="font-medium">{item.name}</span>
                                            <span className="text-gray-500">{item.quantity} {item.unit_of_measure}</span>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm">No ingredients listed.</p>
                                )}
                            </ul>
                        </div>

                        {/* Close Button */}
                        <div className="mt-6 text-center">
                            <Button onClick={() => setSelectedMenu(null)} className="w-full py-2 px-4 bg-secondary text-white font-semibold rounded-lg hover:bg-blue-500 transition">
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}


            {/* Offcanvas Order List */}
            {showOrderList && (
                <div className="fixed top-16 right-0 w-[500px] h-[90%] bg-white shadow-xl flex flex-col">
                    {/* Close Button */}
                    <Button
                        variant="ghost"
                        onClick={() => setShowOrderList(false)}
                        className="absolute top-2 right-4"
                    >
                        <Cross1Icon className="h-6 w-6 text-black" />
                    </Button>

                    {/* Title */}
                    <h2 className="text-xl font-semibold p-3 px-5">Order List ({orders.length > 0 && orders.reduce((total, order) => total + order.quantity, 0)} items)</h2>
                    <hr />

                    {/* Order Items - Ensure Scrollbar on Right Side */}
                    <div className="flex-1 overflow-y-auto pr-3">
                        <div className="pr-3 pl-5">
                            {orders.length > 0 ? (
                                orders.map((order, index) => (
                                    <div key={index} className="border-b py-4">
                                        <div className="flex justify-between items-center">
                                            {/* Item Info */}
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => toggleNote(order.id)}>
                                                    {expandedNotes.includes(order.id) ? <ChevronUp className="h-5 w-5 text-gray-700" /> : <ChevronDown className="h-5 w-5 text-gray-700" />}
                                                </button>

                                                <div className="font-semibold text-sm">{order.name}</div>
                                            </div>

                                            {/* Quantity & Price */}
                                            <div className="flex items-center gap-3">
                                                <span className="font-medium text-gray-800 text-sm">${order.price}</span>
                                                <div className="flex items-center gap-2 rounded-md px-2 py-1">
                                                    <button onClick={() => decreaseQuantity(order.id)}><MinusCircle className="h-5 w-5 text-gray-700" /></button>
                                                    <span className="text-sm">{order.quantity}</span>
                                                    <button onClick={() => increaseQuantity(order.id)}><PlusCircle className="h-5 w-5 text-gray-700" /></button>
                                                </div>
                                            </div>

                                            {/* Total*/}
                                            <div className="flex items-center gap-5">
                                                <span className="text-sm">${(order.price * order.quantity).toFixed(2)}</span>
                                                <button className="text-red-500">
                                                    <Trash2Icon onClick={() => removeOrder(order.id)} className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Note Input (Dropdown) */}
                                        {expandedNotes.includes(order.id) && (
                                            <div className="mt-2">
                                                <Input
                                                    className="w-full text-sm"
                                                    placeholder="Add a note..."
                                                    value={order.note}
                                                    onChange={(e) => updateNote(order.id, e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center mt-10">No items in the order.</p>
                            )}
                        </div>
                    </div>


                    {/* Fixed Bottom Total & Payment */}
                    <div className="bg-gray-100 p-4 rounded-t-lg shadow-lg">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-lg font-semibold">Total:</span>
                            <span className="text-xl font-bold text-secondary">${orders.reduce((acc, order) => acc + order.price * order.quantity, 0).toFixed(2)}</span>
                        </div>
                        <div className="flex flex-row gap-3">
                            <Button onClick={resetOrder} className="w-full text-lg py-3">Reset the Orders </Button>
                            <Button onClick={proceedToOrder} variant={'secondary'} className="w-full text-lg py-3">Proceed to Order</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Previous Orders Dialog */}
            {previousOrderDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 backdrop-blur-sm transition-all duration-300">
                    <div className="bg-white rounded-lg p-6 w-full max-w-3xl h-[70%] overflow-y-auto shadow-xl transition-transform transform scale-100">
                        {/* Header Section */}
                        <div className="flex justify-between items-center border-b pb-3">
                            <h2 className="text-xl font-semibold text-gray-800">Previous Orders</h2>
                            <Button
                                variant="ghost"
                                onClick={() => setPreviousOrderDialog(false)}
                                className="hover:bg-gray-200 rounded-full p-2"
                            >
                                <Cross1Icon className="h-5 w-5 text-gray-600" />
                            </Button>
                        </div>

                        {/* Table Section */}
                        <div className="mt-4 overflow-x-auto">
                            <Table className="w-full border-collapse">
                                <TableHeader className="bg-gray-100">
                                    <TableRow className="text-gray-700 text-sm font-semibold">
                                        <TableHead className="py-2 px-4">Item Name</TableHead>
                                        <TableHead className="py-2 px-4">Quantity</TableHead>
                                        <TableHead className="py-2 px-4">Price Per Item</TableHead>
                                        <TableHead className="py-2 px-4">Total</TableHead>
                                        <TableHead className="py-2 px-4">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {previousOrderData?.[0]?.order_details.map((item) => (
                                        <TableRow key={item.id} className="border-b hover:bg-gray-50">
                                            <TableCell className="py-3 px-4 text-gray-800">{item.menu.name}</TableCell>
                                            <TableCell className="py-3 px-4 text-center">{item.quantity}</TableCell>
                                            <TableCell className="py-3 px-4 text-gray-700">${item.menu.price}</TableCell>
                                            <TableCell className="py-3 px-4 font-semibold text-gray-900">
                                                ${(item.menu.price * item.quantity).toFixed(2)}
                                            </TableCell>
                                            <TableCell className="py-3 px-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === "pending"
                                                        ? "bg-red-100 text-red-600"
                                                        : item.status === "preparing"
                                                            ? "bg-yellow-100 text-yellow-600"
                                                            : "bg-green-100 text-green-600"
                                                        }`}
                                                >
                                                    {item.status}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            )}

        </section>
    );
};

export default MenuList;
