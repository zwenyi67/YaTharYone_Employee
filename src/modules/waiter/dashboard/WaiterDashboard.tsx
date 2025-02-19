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

  const serveOrderToggle = (item:any) => {
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
      <div className="p-6 bg-white rounded-lg shadow-lg grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Ready Orders Section */}
        <div className="overflow-y-auto max-h-[400px] p-2 border rounded-lg">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">{t("title.ready-orders")}</h2>
            <div className="flex gap-2">
              <Button variant={statusFilter === "ready" ? "secondary" : "outline"} onClick={() => setStatusFilter("ready")}>
                Ready
              </Button>
              <Button variant={statusFilter === "preparing" ? "secondary" : "outline"} onClick={() => setStatusFilter("preparing")}>
                Preparing
              </Button>
              <Button variant={statusFilter === "pending" ? "secondary" : "outline"} onClick={() => setStatusFilter("pending")}>
                Pending
              </Button>


            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg shadow-md bg-gray-50">
                  <div className="text-sm font-medium">{item.quantity}x {item.menu.name}</div>
                  <div className="text-xs text-gray-500">Table1</div>
                  <div className="text-xs text-gray-500">{new Date(item.order_created).toLocaleTimeString()}</div>
                  {item.status === 'ready' ? (
                    <div><Button onClick={() => serveOrderToggle(item)} variant={"secondary"}>Serve</Button></div>
                  ) :
                    (<div className="text-sm font-semibold text-blue-600">Status: {item.status}</div>)
                  }
                </div>
              ))
            ) : (
              <div className="text-gray-500 col-span-3 text-center">No orders available</div>
            )}
          </div>
        </div>

        {/* Current Tables Section */}
        <div className="overflow-y-auto max-h-[400px] p-2 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">{t("title.current-tables")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {!isFetching ? (
              data?.map((item) => (
                <button
                  key={item.id}
                  className="p-4 rounded-xl shadow-md border bg-gradient-to-br from-red-700 to-red-500 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-xl active:scale-95"
                  onClick={() => onTableClick(item)}
                >
                  <Utensils className="text-white size-8 mb-2" />
                  <div className="text-xl font-bold text-white mb-1">Table {item.table_no}</div>
                  <div className="text-white text-sm">Capacity: {item.capacity} seats</div>
                  <div className="font-medium text-white flex items-center gap-2 mt-2">
                    <XCircle className="text-white size-6" />
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </div>
                </button>
              ))
            ) : (
              <div className="flex justify-center items-center col-span-2">Fetching Tables...</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaiterDashboard;
