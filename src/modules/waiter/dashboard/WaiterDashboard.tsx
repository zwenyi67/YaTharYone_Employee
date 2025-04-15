import api from "@/api";
import { Button } from "@/components/ui/button";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Utensils, XCircle } from "lucide-react";
import { useState } from "react";
import { GetTablesType, ServeOrderPayloadType } from "@/api/waiter/order/types";
import { toast } from "@/hooks/use-toast";

const WaiterDashboard = () => {
  const { data, isFetching, refetch } = api.waiterOrder.currentTableList.useQuery();
  const { data: readyOrders = [], refetch: readyOrderRefetch } = api.waiterOrder.readyOrderList.useQuery();

  const [statusFilter, setStatusFilter] = useState("ready");

  const allOrderItems = readyOrders
    .flatMap(order =>
      order.order_details.map(item => ({
        ...item,
        order_number: order.order_number,
        order_created: order.created_at,
      }))
    )
    .sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());

  const filteredOrders = allOrderItems.filter(item => item.status === statusFilter);

  const navigate = useNavigate();

  const refresh = () => {
    readyOrderRefetch();
    refetch();
  }

  const onTableClick = (item: GetTablesType) => {
    navigate(`/waiter/orders/tables/${item.id}/menus`, {
      state: { existingOrders: item.orders },
    });
  };

  const { mutate: serveOrder } =
    api.waiterOrder.serveOrder.useMutation({
      // onMutate: () => {
      //     dispatch(openLoader());
      // },
      onSuccess: () => {
        // toast({
        //   title: "Marked as Ready",
        //   variant: "success",
        // });
        refresh();
      },
      onError: (error) => {
        toast({
          title: error.message,
          variant: "destructive",
        });
      },
      // onSettled: () => {
      //     dispatch(hideLoader());
      // },
    });

  const serveOrderToggle = (item: any) => {
    const payload: ServeOrderPayloadType = {
      order_id: item.order_id,
      orderDetail_id: item.id,
      quantity: item.quantity,
      status: item.status
    }
    serveOrder(payload);
  };

  return (
    <section className="m-4">
      {/* Header */}
      <div className="border px-4 py-3 bg-secondary rounded-t-lg text-white font-semibold flex justify-between items-center">
        <div>{t("title.waiter-dashboard")}</div>
        <Button variant="secondary" className="flex items-center gap-2" onClick={() => refresh()}>
          <RefreshCw className="size-4" />
          {t("common.refresh")}
        </Button>
      </div>

      {/* Main Content */}
      <div className="p-6 bg-white rounded-2xl shadow-xl grid gap-8 grid-cols-1 md:grid-cols-2">
        {/* Current Orders Section */}
        <div className="overflow-y-auto max-h-[500px] p-4 border rounded-2xl shadow-inner bg-gradient-to-br from-gray-50 to-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">{t("title.ready-orders")}</h2>
            <div className="flex gap-2">
              {["ready", "preparing", "pending"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "secondary" : "outline"}
                  onClick={() => setStatusFilter(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl border shadow hover:shadow-lg transition-shadow bg-white"
                >
                  <div className="text-lg font-semibold text-gray-900 mb-1">
                    {item.quantity}x {item.menu.name}
                  </div>
                  <div className="text-sm text-gray-500">{item.table_no}</div>
                  <div className="text-xs text-gray-400 mb-2">
                    {new Date(item.order_created).toLocaleTimeString()}
                  </div>
                  {item.status === "ready" ? (
                    <Button
                      onClick={() => serveOrderToggle(item)}
                      variant="secondary"
                      className="w-full mt-2"
                    >
                      Serve
                    </Button>
                  ) : (
                    <div className="text-sm font-medium text-blue-600">
                      Status: {item.status}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-gray-500 col-span-2 text-center py-6">
                No orders in current
              </div>
            )}
          </div>
        </div>

        {/* Current Tables Section */}
        <div className="overflow-y-auto max-h-[500px] p-4 border rounded-2xl shadow-inner bg-gradient-to-br from-gray-50 to-white">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">{t("title.current-tables")}</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {!isFetching ? (
              data!.length > 0 ? (
                data!.map((item) => (
                  <button
                    key={item.id}
                    className="p-4 rounded-2xl shadow-md border border-red-300 bg-gradient-to-br from-red-600 to-red-500 flex flex-col items-center text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
                    onClick={() => onTableClick(item)}
                  >
                    <Utensils className="size-8 mb-2" />
                    <div className="text-lg font-bold mb-1">Table {item.table_no}</div>
                    <div className="text-sm">Capacity: {item.capacity}</div>
                    <div className="flex items-center gap-1 mt-2 font-medium">
                      <XCircle className="size-5" />
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-gray-500 col-span-3 text-center py-6">
                  No tables in current
                </div>
              )
            ) : (
              <div className="text-gray-500 col-span-3 text-center py-6">
                Fetching Tables ...
              </div>
            )}
          </div>
        </div>
      </div>

    </section>
  );
};

export default WaiterDashboard;
