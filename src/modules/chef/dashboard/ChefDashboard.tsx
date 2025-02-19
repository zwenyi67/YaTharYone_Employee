import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, Utensils, RotateCw } from "lucide-react";
import api from "@/api";
import { MarkAsReadyPayloadType, StartPreparingPayloadType } from "@/api/chef/order/types";
import { toast } from "@/hooks/use-toast";

const getStatusGradient = (status: string) => {
  switch (status) {
    case "pending": return "bg-gradient-to-br from-red-700 to-red-500";
    case "preparing": return "bg-gradient-to-r from-yellow-100 to-yellow-300";
    case "ready": return "bg-gradient-to-r from-green-100 to-green-300";
    default: return "bg-gray-100";
  }
};

const ChefSupervisorDashboard = () => {
  const { data: orders = [], isFetching, refetch } = api.chefOrder.currentOrderList.useQuery();

  // Flatten all order items for the queue
  const allOrderItems = orders
    .flatMap(order =>
      order.order_details.map(item => ({
        ...item,
        order_number: order.order_number,
        table_no: order.table.table_no,
        order_created: order.created_at
      }))
    )
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  const { mutate: startPreparing } =
    api.chefOrder.startPreparing.useMutation({
      // onMutate: () => {
      //     dispatch(openLoader());
      // },
      onSuccess: () => {
        // toast({
        //   title: "Started Perparing Order",
        //   variant: "success",
        // });
        refetch();
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

  const { mutate: markAsReady } =
    api.chefOrder.markAsReady.useMutation({
      // onMutate: () => {
      //     dispatch(openLoader());
      // },
      onSuccess: () => {
        // toast({
        //   title: "Marked as Ready",
        //   variant: "success",
        // });
        refetch();
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

  const ToggleStartPreparing = (item: any) => {

    const payload: StartPreparingPayloadType = {
      order_id: item.order_id,
      orderDetail_id: item.id,
      quantity: item.quantity,
      status: item.status
    }
    startPreparing(payload);
  }

  const ToggleMarkAsReady = (item: any) => {

    const payload: MarkAsReadyPayloadType = {
      order_id: item.order_id,
      orderDetail_id: item.id,
      quantity: item.quantity,
      status: item.status
    }
    markAsReady(payload);
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Side - Orders List */}
      <div className="w-3/4 border-r-2 border-gray-200 p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Utensils className="h-8 w-8 text-blue-600" />
            Active Orders Monitor
          </h2>
          <Button
            onClick={() => refetch()}
            disabled={isFetching}
            variant="outline"
            className="gap-2"
          >
            <RotateCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
        <div className="overflow-y-auto h-[500px] pr-2">
          <div className="flex flex-wrap gap-2">
            {orders.map((order) => (
              <div
                key={order.id}
                className="text-sm w-auto max-w-fit" // Prevents overflow, allows wrapping
              >
                <div className={`p-3 rounded-lg shadow-md ${getStatusGradient(order.status)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-semibold">{order.order_number}</span>
                      <span className="text-xs block text-gray-700">Table {order.table.table_no}</span>
                    </div>
                    <span className="text-xs text-gray-600">
                      {new Date(order.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {order.order_details.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-1 bg-white/70 rounded">
                        <div className="flex items-center gap-3 py-[6px]">
                          <span className="font-medium w-5 text-xs text-center">{item.quantity}x</span>
                          <span className="text-xs">{item.menu.name}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium 
                  ${item.status === "pending" ? "bg-red-100 text-red-600" :
                            item.status === "preparing" ? "bg-yellow-100 text-yellow-600" :
                              "bg-green-100 text-green-600"}
                `}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Order Queue */}
      <div className="w-1/4 p-4">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Clock className="h-8 w-8 text-blue-600" />
          Preparation Queue
        </h2>
        <div className="overflow-y-auto h-[500px] pr-4 space-y-3">
          {allOrderItems
            .filter((item) => (item.status !== 'ready' && item.status !== 'served'))
            .map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white rounded-xl shadow-md border-l-4 border-blue-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-blue-600">{item.quantity}x</span>
                    <div className="font-semibold text-sm">{item.menu.name}</div>

                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {item.note && (
                      <span className="text-xs text-gray-500">({item.note})</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {item.status === 'pending' && (
                      <Button
                        onClick={() => ToggleStartPreparing(item)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white"
                      >
                        Start Preparing
                      </Button>
                    )}
                    {item.status === 'preparing' && (
                      <Button
                        onClick={() => ToggleMarkAsReady(item)}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        Mark as Ready
                      </Button>
                    )}
                    {item.status === 'ready' && (
                      <span className="flex items-center text-green-600">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ChefSupervisorDashboard;