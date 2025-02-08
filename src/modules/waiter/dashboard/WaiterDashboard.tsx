import api from "@/api";
import { Button } from "@/components/ui/button";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Utensils, XCircle } from "lucide-react";
import { GetTablesType } from "@/api/waiter/order/types";



const WaiterDashboard = () => {

  const { data, isFetching, refetch } = api.waiterOrder.currentTableList.useQuery();

  const navigate = useNavigate();

  const onTableClick = (item: GetTablesType) => {
    navigate(`/waiter/orders/tables/${item.id}/menus`, {
      state: { existingOrders: item.orders },
    });
  }

  return (
    <section className="m-4">
      {/* Header */}
      <div className="border px-4 py-3 bg-secondary rounded-t-lg text-white font-semibold flex justify-between items-center">
        <div>{t("title.waiter-dashboard")}</div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col lg:flex-row md:flex-row justify-between mb-6">
          {/* Filter Buttons */}
          <div className="gap-3 my-4 lg:flex">
            <div>
              <div className="font-semibold text-2xl">Currently Serving</div>
            </div>
          </div>

          {/* Refresh Button */}
          <Button variant="secondary" className="flex items-center gap-2 my-4" onClick={() => refetch()}>
            <RefreshCw className="size-4" />
            {t("common.refresh")}
          </Button>
        </div>
        <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-3 gap-6">
          {!isFetching ? (
            data?.map((item) => {
              return (
                <button
                  key={item.id}
                  className={`p-6 rounded-2xl shadow-lg border bg-gradient-to-br from-red-700 to-red-500 flex flex-col items-center transition transform hover:scale-105 hover:shadow-xl active:scale-95`}
                  onClick={() => onTableClick(item)}
                >
                  <Utensils className="text-white size-8 mb-2" />
                  <div className="text-2xl font-bold text-white mb-2">{item.table_no}</div>
                  <div className="text-white text-sm">Capacity: {item.capacity} seats</div>
                  <div className={`font-medium text-white flex items-center gap-2 mt-2`}>
                    <XCircle className="text-white size-6" />
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="flex justify-center items-center">
              Fetching Table ...
            </div>
          )}
        </div>
      </div>


    </section>
  );
};


export default WaiterDashboard;
