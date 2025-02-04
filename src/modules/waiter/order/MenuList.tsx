import api from "@/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp, CircleChevronLeft, MinusCircle, PlusCircle, RefreshCw, ShoppingCart, Trash2Icon } from "lucide-react";
import { t } from "i18next";
import { GetMenusType, GetOrdersType, ProceedOrderPayloadType } from "@/api/waiter/order/types";
import { Input } from "@/components/ui/input";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useDispatch } from "react-redux";
import { toast } from "@/hooks/use-toast";
import { hideLoader, openLoader } from "@/store/features/loaderSlice";

const MenuList = () => {

    const { id: tableId } = useParams();

    const { data: menus, refetch: menuRefetch } = api.order.getMenus.useQuery();
    const { data: categories, refetch: cateRefetch } = api.order.getMenuCategories.useQuery();
    const [filter, setFilter] = useState<string | null>(null);
    const [showOrderList, setShowOrderList] = useState(false);

    const [orders, setOrders] = useState<GetOrdersType[]>([]);

    // // Load from LocalStorage on mount
    // useEffect(() => {
    //     const savedOrders = localStorage.getItem("menuOrders");
    //     if (savedOrders) {
    //         setOrders(JSON.parse(savedOrders));
    //     }
    // }, []);

    // // Save to LocalStorage when orders change
    // useEffect(() => {
    //     console.log(orders)
    // }, [orders]);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const refresh = () => {
        menuRefetch();
        cateRefetch();
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
    api.order.proceedOrder.useMutation({
      onMutate: () => {
        dispatch(openLoader());
      },
      onSuccess: () => {
        toast({
          title: "Proceed Order successfully",
          variant: "success",
        });
        navigate("/table-management");
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
        const payload: ProceedOrderPayloadType = {
            order_list: orders,
            table_id: Number(tableId),
            waiter_id: 11,
            total_price: Number(orders.reduce((acc, order) => acc + order.price * order.quantity, 0).toFixed(2)),
            status: "pending"
        }
        proceedOrder(payload);
    }

    const filteredMenus = filter ? menus?.filter(menu => menu.category_id === parseInt(filter)) : menus;

    return (
        <section className="m-4">
            {/* Header */}
            <div className="border px-4 py-3 bg-secondary rounded-t-lg text-white font-semibold flex justify-between items-center">
                <div>{t("title.orders")} - {t("title.menus-list")}</div>
            </div>

            {/* Menu Grid */}
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <div className="flex justify-between">
                    <div className="my-4 pt-1">
                        <Link to={'/waiter/orders/tables'} className=""><CircleChevronLeft className='w-8 h-8 text-secondary hover:text-blue-500' />
                        </Link>
                    </div>
                    <div className="flex gap-2 my-4">
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

                        {/* Refresh Button */}
                        <Button variant="secondary" className="flex items-center gap-2" onClick={refresh}>
                            <RefreshCw className="size-4" /> Refresh
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
                    {filteredMenus?.map(menu => (
                        <div key={menu.id} className="border rounded-xl p-4 sm:p-6 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
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
                            <Button onClick={() => AddToOrder(menu)} className="mt-4 w-full py-2 px-4 bg-secondary text-white font-semibold rounded-lg hover:bg-blue-500 transition-all duration-200">
                                Add to Order
                            </Button>
                        </div>
                    ))}
                </div>

            </div>

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

        </section>
    );
};

export default MenuList;
