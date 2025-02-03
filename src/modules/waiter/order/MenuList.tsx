import api from "@/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CircleChevronLeft, RefreshCw, ShoppingCart } from "lucide-react";
import { t } from "i18next";
import { Cross1Icon } from "@radix-ui/react-icons";
// import { GetMenusType } from "@/api/waiter/order/types";

const MenuList = () => {
    const { data: menus, refetch: menuRefetch } = api.order.getMenus.useQuery();
    const { data: categories, refetch: cateRefetch } = api.order.getMenuCategories.useQuery();
    const [filter, setFilter] = useState<string | null>(null);
    const [showOrderList, setShowOrderList] = useState(false);

    // const [orders, setOrders] = useState<GetMenusType[]>([]);



    // const navigate = useNavigate();

    const refresh = () => {
        menuRefetch();
        cateRefetch();
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
                        <Button variant="secondary" className="flex items-center gap-2" onClick={() => setShowOrderList(true)}>
                            <ShoppingCart className="size-5" /> Orders
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
                                    src={`http://127.0.0.1:8000${menu.profile}`}
                                    alt={menu.name}
                                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full border-4 border-indigo-600 shadow-md"
                                />
                            </div>
                            <div className="text-center">
                                <div className="text-lg sm:text-xl font-semibold text-gray-800">{menu.name}</div>
                                <div className="text-sm sm:text-base text-gray-500">{menu.category.name}</div>
                                <div className="text-lg sm:text-xl font-bold text-indigo-600 mt-2">${menu.price}</div>
                            </div>
                            <Button className="mt-4 w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-200">
                                Add to Order
                            </Button>
                        </div>
                    ))}
                </div>

            </div>

            {/* Offcanvas Order List */}
            {showOrderList && (
                <div className="fixed top-16 right-0 w-[500px] h-full bg-white shadow-lg p-6 overflow-y-auto">
                    <Button variant="ghost" onClick={() => setShowOrderList(false)} className="absolute top-4 right-4"><Cross1Icon></Cross1Icon></Button>
                    <h2 className="text-xl font-semibold mb-4">Order List</h2>
                    {/* Order items should be displayed here */}
                </div>
            )}
        </section>
    );
};

export default MenuList;
