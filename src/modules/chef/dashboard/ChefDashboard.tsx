import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, Utensils, RotateCw } from "lucide-react";
import api from "@/api";

const getStatusGradient = (status: string) => {
  switch (status) {
    case "pending": return "bg-gradient-to-r from-red-100 to-red-300";
    case "preparing": return "bg-gradient-to-r from-yellow-100 to-yellow-300";
    case "ready": return "bg-gradient-to-r from-green-100 to-green-300";
    default: return "bg-gray-100";
  }
};

const ChefSupervisorDashboard = () => {
  const { data: orders = [], isFetching, refetch } = api.chefOrder.currentOrderList.useQuery();
  
  // Flatten all order items for the queue
  const allOrderItems = orders
    .flatMap(order=> 
      order.order_details.map(item => ({
        ...item,
        order_number: order.order_number,
        table_no: order.table.table_no,
        order_updated: order.updated_at
      }))
    )
    // .sort(a => new Date(a.updated_at).getTime());
    .sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Side - Orders List */}
      <div className="w-1/2 border-r-2 border-gray-200 p-4">
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
        <div className="overflow-y-auto h-[calc(100vh-150px)] pr-4 space-y-4">
          {orders.map((order) => (
            <div 
              key={order.id}
              className={`p-4 rounded-xl shadow-lg ${getStatusGradient(order.status)}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-base">{order.order_number}</span>
                  <span className="text-gray-800">Table {order.table.table_no}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(order.updated_at).toLocaleTimeString()}
                </span>
              </div>
              <div className="space-y-2">
                {order.order_details.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-white/50 rounded-md">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold w-6 text-center">{item.quantity}x</span>
                      <span>{item.menu.name}</span>
                      {item.note && (
                        <span className="text-sm text-gray-500">({item.note})</span>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      item.status === 'pending' ? 'bg-red-100 text-red-600' :
                      item.status === 'preparing' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Order Queue */}
      <div className="w-1/2 p-4">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Clock className="h-8 w-8 text-blue-600" />
          Preparation Queue
        </h2>
        <div className="overflow-y-auto h-[calc(100vh-150px)] pr-4 space-y-3">
          {allOrderItems.map((item) => (
            <div 
              key={item.id}
              className="p-4 bg-white rounded-xl shadow-md border-l-4 border-blue-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-blue-600">{item.quantity}x</span>
                  <h3 className="font-semibold text-lg">{item.menu.name}</h3>
                  {item.note && (
                    <span className="text-sm text-gray-500">({item.note})</span>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(item.updated_at).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <span>Order {item.order_number} </span>
                  <span>(Table {item.table_no})</span>
                </div>
                <div className="flex gap-2">
                  {item.status === 'pending' && (
                    <Button 
                      // Add your status update logic here
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                      Start Preparing
                    </Button>
                  )}
                  {item.status === 'preparing' && (
                    <Button 
                      // Add your status update logic here
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